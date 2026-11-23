/** Small helpers for building chart series from formulas. */

/** Evenly spaced values from a to b, inclusive. */
export function linspace(a: number, b: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
}

/** Logarithmically spaced values from a to b, inclusive. */
export function logspace(a: number, b: number, n: number): number[] {
  const la = Math.log10(a);
  const lb = Math.log10(b);
  return Array.from({ length: n }, (_, i) => 10 ** (la + ((lb - la) * i) / (n - 1)));
}

/** A number with thousands separators and at most `digits` decimals. */
export function num(value: number, digits = 2): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: digits });
}

/** A power of ten written with a superscript exponent: 10⁻¹⁹. */
export function pow10(exponent: number): string {
  const sup: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return `10${String(exponent)
    .split('')
    .map((c) => sup[c] ?? c)
    .join('')}`;
}

/** A value in scientific form when it is very large or very small: 6.3 × 10⁻²⁰. */
export function sci(value: number, digits = 1): string {
  if (value === 0) return '0';
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  if (exponent >= -2 && exponent <= 5) return num(value, Math.max(0, digits - exponent));
  const mantissa = value / 10 ** exponent;
  const m = Number(mantissa.toFixed(digits));
  return m === 1 ? pow10(exponent) : `${m} × ${pow10(exponent)}`;
}

/** Today as a fractional year, fixed at build time: 2026.87. */
export function yearNow(): number {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 1);
  const end = Date.UTC(now.getUTCFullYear() + 1, 0, 1);
  return now.getUTCFullYear() + (now.getTime() - start) / (end - start);
}
