/** Scales and tick formatting shared by the chart components. */
import type { Axis, Format } from '../content/topics/types';
import { num, pow10 } from '../content/topics/series';

/** Position of a value along an axis, from 0 to 1. */
export function scale(axis: Pick<Axis, 'min' | 'max' | 'log'>, value: number): number {
  if (axis.log) {
    const a = Math.log10(axis.min);
    const b = Math.log10(axis.max);
    return (Math.log10(value) - a) / (b - a);
  }
  return (value - axis.min) / (axis.max - axis.min);
}

export function formatTick(value: number, format: Format = 'number'): string {
  switch (format) {
    case 'power':
      return pow10(Math.round(Math.log10(value)));
    case 'year':
      return String(Math.round(value));
    case 'percent':
      return `${num(value * 100, 0)}%`;
    default:
      return Math.abs(value) >= 10000 ? num(value, 0) : num(value, 2);
  }
}

export function tickLabels(axis: Axis): string[] {
  return axis.ticks.map((t, i) => axis.tickLabels?.[i] ?? formatTick(t, axis.format));
}

/** A percentage for inline styles. */
export const pct = (n: number) => `${(Math.min(1, Math.max(0, n)) * 100).toFixed(3)}%`;
