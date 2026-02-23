/**
 * Stake Engine money format: integers with 6 decimal places of precision.
 * 1,000,000 = $1 | 100,000 = $0.10 | 10,000,000 = $10
 */
export const MONEY_PRECISION = 1_000_000;

/** Convert internal amount to display amount (divide by 1e6) */
export function toDisplayAmount(internal: number): number {
  return internal / MONEY_PRECISION;
}

/** Convert display amount to internal (multiply by 1e6, round) */
export function toInternalAmount(display: number): number {
  return Math.round(display * MONEY_PRECISION);
}

export type Currency =
  | 'USD'
  | 'CAD'
  | 'JPY'
  | 'EUR'
  | 'RUB'
  | 'CNY'
  | 'PHP'
  | 'INR'
  | 'IDR'
  | 'KRW'
  | 'BRL'
  | 'MXN'
  | 'DKK'
  | 'PLN'
  | 'VND'
  | 'TRY'
  | 'CLP'
  | 'ARS'
  | 'PEN'
  | 'NGN'
  | 'SAR'
  | 'ILS'
  | 'AED'
  | 'TWD'
  | 'NOK'
  | 'KWD'
  | 'JOD'
  | 'CRC'
  | 'TND'
  | 'SGD'
  | 'MYR'
  | 'OMR'
  | 'QAR'
  | 'BHD'
  | 'XGC'
  | 'XSC';

interface CurrencyMeta {
  symbol: string;
  decimals: number;
  symbolAfter?: boolean;
}

export const CURRENCY_META: Record<Currency, CurrencyMeta> = {
  USD: { symbol: '$', decimals: 2 },
  CAD: { symbol: 'CA$', decimals: 2 },
  JPY: { symbol: '¥', decimals: 0 },
  EUR: { symbol: '€', decimals: 2 },
  RUB: { symbol: '₽', decimals: 2 },
  CNY: { symbol: 'CN¥', decimals: 2 },
  PHP: { symbol: '₱', decimals: 2 },
  INR: { symbol: '₹', decimals: 2 },
  IDR: { symbol: 'Rp', decimals: 0 },
  KRW: { symbol: '₩', decimals: 0 },
  BRL: { symbol: 'R$', decimals: 2 },
  MXN: { symbol: 'MX$', decimals: 2 },
  DKK: { symbol: 'KR', decimals: 2, symbolAfter: true },
  PLN: { symbol: 'zł', decimals: 2, symbolAfter: true },
  VND: { symbol: '₫', decimals: 0, symbolAfter: true },
  TRY: { symbol: '₺', decimals: 2 },
  CLP: { symbol: 'CLP', decimals: 0, symbolAfter: true },
  ARS: { symbol: 'ARS', decimals: 2, symbolAfter: true },
  PEN: { symbol: 'S/', decimals: 2, symbolAfter: true },
  NGN: { symbol: '₦', decimals: 2 },
  SAR: { symbol: 'SAR', decimals: 2, symbolAfter: true },
  ILS: { symbol: 'ILS', decimals: 2, symbolAfter: true },
  AED: { symbol: 'AED', decimals: 2, symbolAfter: true },
  TWD: { symbol: 'NT$', decimals: 2 },
  NOK: { symbol: 'kr', decimals: 2, symbolAfter: true },
  KWD: { symbol: 'KD', decimals: 2, symbolAfter: true },
  JOD: { symbol: 'JD', decimals: 2, symbolAfter: true },
  CRC: { symbol: '₡', decimals: 2 },
  TND: { symbol: 'TND', decimals: 2, symbolAfter: true },
  SGD: { symbol: 'SG$', decimals: 2 },
  MYR: { symbol: 'RM', decimals: 2 },
  OMR: { symbol: 'OMR', decimals: 2, symbolAfter: true },
  QAR: { symbol: 'QAR', decimals: 2, symbolAfter: true },
  BHD: { symbol: 'BD', decimals: 2, symbolAfter: true },
  XGC: { symbol: 'GC', decimals: 2 },
  XSC: { symbol: 'SC', decimals: 2 },
};

export interface Balance {
  amount: number;
  currency: string;
}

/**
 * Formats an internal amount with currency symbol for display.
 * Use for balances and monetary display.
 */
export function formatDisplayBalance(balance: Balance): string {
  const meta = CURRENCY_META[balance.currency as Currency] ?? {
    symbol: balance.currency,
    decimals: 2,
    symbolAfter: false,
  };
  const displayAmount = toDisplayAmount(balance.amount);
  const formattedAmount = displayAmount.toLocaleString(undefined, {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });

  if (meta.symbolAfter) {
    return `${formattedAmount} ${meta.symbol}`;
  }
  return `${meta.symbol}${formattedAmount}`;
}

/**
 * Formats an internal amount for display (amount only, no symbol).
 * Use for inputs where symbol is shown separately.
 */
export function formatAmountForDisplay(
  internalAmount: number,
  currencyCode: string
): string {
  const meta = CURRENCY_META[currencyCode as Currency] ?? {
    symbol: currencyCode,
    decimals: 2,
  };
  const displayAmount = toDisplayAmount(internalAmount);
  return displayAmount.toLocaleString(undefined, {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });
}

/**
 * Parses user input (display amount) to internal amount.
 */
export function parseDisplayToInternal(input: string): number | null {
  const cleaned = input.replace(/,/g, '').trim();
  if (cleaned === '') return null;
  const num = parseFloat(cleaned);
  if (isNaN(num) || num < 0) return null;
  return toInternalAmount(num);
}
