export function formatPrice(
  value: number,
  opts: { locale?: string; currency?: string } = {},
) {
  const { locale = 'en-IN', currency = 'INR' } = opts;
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}