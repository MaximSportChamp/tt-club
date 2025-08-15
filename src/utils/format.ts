// Formatting helpers for numbers and likes counters
// Use defaultLikes() to safely read .likes from objects
// and formatNumber() to display numeric values with locale separators.

export interface Likeable { likes?: number | null }

/**
 * Safely get the number of likes from an object.
 * Returns 0 if item or its likes are undefined/null.
 */
export function defaultLikes(item?: Likeable | null): number {
  return item?.likes ?? 0
}

/**
 * Format a number using Intl.NumberFormat. Defaults to Russian locale.
 */
export function formatNumber(value: number | null | undefined, locale = 'ru-RU'): string {
  const num = typeof value === 'number' ? value : Number(value ?? 0)
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Convenience helper: defaultLikes + formatNumber.
 */
export function formatLikes(item?: Likeable | null, locale = 'ru-RU'): string {
  return formatNumber(defaultLikes(item), locale)
}

