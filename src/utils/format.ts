/**
 * Safe formatting utilities to prevent undefined .toFixed errors
 */

export function formatCurrency(value?: number | null | string): string {
  if (value === undefined || value === null) return '0,00';
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return '0,00';
  return num.toFixed(2).replace('.', ',');
}

export function formatRating(value?: number | null | string, decimals = 1): string {
  if (value === undefined || value === null) return '5.0';
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return '5.0';
  return num.toFixed(decimals);
}
