export function formatPrice(
  value: number,
  opts: { locale?: string; currency?: string, maximumFractionDigits?: number } = {},
) {
  const { locale = 'en-IN', currency = 'INR', maximumFractionDigits =2 } = opts;
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    maximumFractionDigits,
  });
  return formatter.format(value);
}
