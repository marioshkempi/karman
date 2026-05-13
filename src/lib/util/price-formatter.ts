export function formatPrice(amount: number | null | undefined, currencyCode: string) {
  if (amount == null) return '';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
    currencyDisplay: 'narrowSymbol',
  });
  const parts = formatter.formatToParts(amount);
  const number = parts
    .filter(p => ['integer', 'decimal', 'fraction', 'group'].includes(p.type))
    .map(p => p.value)
    .join('');
  const symbol = parts.find(p => p.type === 'currency')?.value || '';
  return `${number} ${symbol}`;
}