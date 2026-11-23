#!/bin/bash
# Check a deployment's security headers with curl, like securityheaders.com.
# Usage: scripts/check-security-headers.sh [base-url]     (default https://www.boxboxdrone.com)
# For a protected Vercel preview, export VERCEL_AUTOMATION_BYPASS_SECRET first; it is sent as the
# x-vercel-protection-bypass header and never printed.
# Exits 1 if any check fails.

base="${1:-https://www.boxboxdrone.com}"
base="${base%/}"
failures=0

curl_args=(-sS --max-time 20)
if [ -n "${VERCEL_AUTOMATION_BYPASS_SECRET:-}" ]; then
  curl_args+=(-H "x-vercel-protection-bypass: ${VERCEL_AUTOMATION_BYPASS_SECRET}")
fi

pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1"; failures=$((failures + 1)); }

# header <headers-text> <name>: prints the value of one header (case-insensitive), or nothing.
header() { printf '%s\n' "$1" | tr -d '\r' | awk -v name="$2" 'BEGIN { IGNORECASE = 1 } tolower($0) ~ "^" tolower(name) ":" { sub(/^[^:]*:[ \t]*/, ""); print; exit }'; }

check_page() {
  local path="$1" headers status value
  headers=$(curl "${curl_args[@]}" -o /dev/null -D - "$base$path")
  status=$(printf '%s\n' "$headers" | head -1 | tr -d '\r')
  echo "== $path ($status)"

  value=$(header "$headers" strict-transport-security)
  if printf '%s' "$value" | grep -Eq 'max-age=(3153[6-9][0-9]{3}|31[6-9][0-9]{5}|3[2-9][0-9]{6}|[4-9][0-9]{7}|[0-9]{9,})' &&
    printf '%s' "$value" | grep -qi 'includesubdomains' && printf '%s' "$value" | grep -qi 'preload'; then
    pass "Strict-Transport-Security: $value"
  else
    fail "Strict-Transport-Security should be at least a year, with includeSubDomains and preload (got: ${value:-none})"
  fi

  value=$(header "$headers" content-security-policy)
  local script_src
  script_src=$(printf '%s' "$value" | tr ';' '\n' | grep -E "^ *script-src " || true)
  if [ -z "$value" ]; then
    fail "Content-Security-Policy is missing"
  elif printf '%s' "$script_src" | grep -Eq "'unsafe-inline'|'unsafe-eval'|\*|https?:" ||
    ! printf '%s' "$value" | grep -q "frame-ancestors 'none'" ||
    ! printf '%s' "$value" | grep -q "object-src 'none'" ||
    ! printf '%s' "$value" | grep -q "default-src 'self'"; then
    fail "Content-Security-Policy is not strict: $value"
  else
    pass "Content-Security-Policy: script-src is 'self' plus hashes; frame-ancestors 'none'; object-src 'none'"
  fi

  value=$(header "$headers" x-content-type-options)
  [ "$value" = "nosniff" ] && pass "X-Content-Type-Options: nosniff" || fail "X-Content-Type-Options should be nosniff (got: ${value:-none})"

  value=$(header "$headers" x-frame-options)
  [ "$value" = "DENY" ] && pass "X-Frame-Options: DENY" || fail "X-Frame-Options should be DENY (got: ${value:-none})"

  value=$(header "$headers" referrer-policy)
  case "$value" in
    no-referrer | same-origin | strict-origin | strict-origin-when-cross-origin) pass "Referrer-Policy: $value" ;;
    *) fail "Referrer-Policy should be strict (got: ${value:-none})" ;;
  esac

  value=$(header "$headers" permissions-policy)
  if printf '%s' "$value" | grep -q 'camera=()' && printf '%s' "$value" | grep -q 'microphone=()' &&
    printf '%s' "$value" | grep -q 'geolocation=()' && printf '%s' "$value" | grep -q 'usb=()'; then
    pass "Permissions-Policy denies camera, microphone, geolocation, usb and more"
  else
    fail "Permissions-Policy should deny powerful features (got: ${value:-none})"
  fi

  value=$(header "$headers" cross-origin-opener-policy)
  [ "$value" = "same-origin" ] && pass "Cross-Origin-Opener-Policy: same-origin" || fail "Cross-Origin-Opener-Policy should be same-origin (got: ${value:-none})"
}

for path in / /delivery /drako /contact /favicon.svg; do check_page "$path"; done

case "$base" in
  https://*)
    echo "== http to https"
    insecure="http://${base#https://}/delivery"
    headers=$(curl "${curl_args[@]}" -o /dev/null -D - "$insecure")
    location=$(header "$headers" location)
    case "$location" in
      https://*) pass "$insecure -> $location" ;;
      *) fail "$insecure should redirect to https (got: ${location:-no redirect})" ;;
    esac
    ;;
esac

echo
if [ "$failures" -eq 0 ]; then
  echo "All checks passed for $base"
else
  echo "$failures check(s) failed for $base"
  exit 1
fi
