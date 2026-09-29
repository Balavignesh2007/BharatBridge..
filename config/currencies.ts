/**
 * BharatBridge Supported Currencies & Corridors Configuration
 */

export interface CurrencyConfig {
    code: string;
    name: string;
    symbol: string;
    flag: string;
    decimals: number;
    isFiat: boolean;
    isStablecoin: boolean;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
    INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', decimals: 2, isFiat: true, isStablecoin: false },
    USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', decimals: 2, isFiat: true, isStablecoin: false },
    GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', decimals: 2, isFiat: true, isStablecoin: false },
    EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', decimals: 2, isFiat: true, isStablecoin: false },
    AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', decimals: 2, isFiat: true, isStablecoin: false },
    SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', decimals: 2, isFiat: true, isStablecoin: false },
    CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', decimals: 2, isFiat: true, isStablecoin: false },
    AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', decimals: 2, isFiat: true, isStablecoin: false },
    JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', decimals: 0, isFiat: true, isStablecoin: false },
    USDT: { code: 'USDT', name: 'Tether USD', symbol: '₮', flag: '🪙', decimals: 6, isFiat: false, isStablecoin: true },
    USDC: { code: 'USDC', name: 'USD Coin', symbol: '₵', flag: '🪙', decimals: 6, isFiat: false, isStablecoin: true },
};

export const BASE_PROTOCOL_FEE_BPS = 30; // 0.30%
export const MAX_TRANSACTION_LIMIT_USD = 10000;
export const DAILY_TRANSACTION_LIMIT_USD = 25000;
export const MONTHLY_TRANSACTION_LIMIT_USD = 100000;
