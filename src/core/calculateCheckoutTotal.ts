export function calculateCheckoutTotal(lotPrices: number[], promoCode: string = ''): number {
  if (lotPrices.length === 0) return 0;

  const sum = lotPrices.reduce((acc, price) => acc + price, 0);
  const isVip = promoCode.trim().toUpperCase() === 'VIPART';
  const commissionRate = isVip ? 0 : 0.1;

  return sum + sum * commissionRate;
}
