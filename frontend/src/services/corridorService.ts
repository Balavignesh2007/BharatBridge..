import { Corridor } from '../types';

export const SUPPORTED_CORRIDORS: Corridor[] = [
    {
        id: 'USA_IND',
        name: 'USA ↔ India',
        sourceCurrency: 'USD',
        destCurrency: 'INR',
        country: 'United States',
        countryCode: 'US',
        flag: '🇺🇸',
        demoRate: 84.50,
        feePercent: 0.30,
        settlementMethods: ['Polkadot Asset Hub (USDT/USDC)', 'IMPS / UPI Payout'],
        speed: 'Instant (< 12s)',
        isPrimaryDemo: true,
    },
    {
        id: 'UK_IND',
        name: 'UK ↔ India',
        sourceCurrency: 'GBP',
        destCurrency: 'INR',
        country: 'United Kingdom',
        countryCode: 'GB',
        flag: '🇬🇧',
        demoRate: 107.20,
        feePercent: 0.30,
        settlementMethods: ['Polkadot XCM Parachain', 'UPI / NEFT Payout'],
        speed: 'Instant (< 15s)',
    },
    {
        id: 'EUR_IND',
        name: 'Europe ↔ India',
        sourceCurrency: 'EUR',
        destCurrency: 'INR',
        country: 'European Union',
        countryCode: 'EU',
        flag: '🇪🇺',
        demoRate: 91.80,
        feePercent: 0.30,
        settlementMethods: ['SEPA Instant / XCM Hub', 'IMPS / UPI Payout'],
        speed: 'Instant (< 15s)',
    },
    {
        id: 'UAE_IND',
        name: 'UAE ↔ India',
        sourceCurrency: 'AED',
        destCurrency: 'INR',
        country: 'United Arab Emirates',
        countryCode: 'AE',
        flag: '🇦🇪',
        demoRate: 23.01,
        feePercent: 0.30,
        settlementMethods: ['Polkadot Asset Hub', 'UPI Direct Payout'],
        speed: 'Instant (< 10s)',
    },
    {
        id: 'SGP_IND',
        name: 'Singapore ↔ India',
        sourceCurrency: 'SGD',
        destCurrency: 'INR',
        country: 'Singapore',
        countryCode: 'SG',
        flag: '🇸🇬',
        demoRate: 62.80,
        feePercent: 0.30,
        settlementMethods: ['PayNow / UPI Linkage Simulation', 'XCM Precompile'],
        speed: 'Instant (< 12s)',
    },
    {
        id: 'CAN_IND',
        name: 'Canada ↔ India',
        sourceCurrency: 'CAD',
        destCurrency: 'INR',
        country: 'Canada',
        countryCode: 'CA',
        flag: '🇨🇦',
        demoRate: 61.50,
        feePercent: 0.30,
        settlementMethods: ['Polkadot Asset Hub', 'IMPS / RTGS Payout'],
        speed: 'Instant (< 15s)',
    },
    {
        id: 'AUS_IND',
        name: 'Australia ↔ India',
        sourceCurrency: 'AUD',
        destCurrency: 'INR',
        country: 'Australia',
        countryCode: 'AU',
        flag: '🇦🇺',
        demoRate: 54.90,
        feePercent: 0.30,
        settlementMethods: ['Polkadot Asset Hub', 'UPI Payout'],
        speed: 'Instant (< 15s)',
    },
    {
        id: 'JPN_IND',
        name: 'Japan ↔ India',
        sourceCurrency: 'JPY',
        destCurrency: 'INR',
        country: 'Japan',
        countryCode: 'JP',
        flag: '🇯🇵',
        demoRate: 0.56,
        feePercent: 0.30,
        settlementMethods: ['Astar Parachain XCM (2006)', 'IMPS / UPI Payout'],
        speed: 'Instant (< 15s)',
    },
];

export class CorridorService {
    static getAllCorridors(): Corridor[] {
        return SUPPORTED_CORRIDORS;
    }

    static getCorridorById(id: string): Corridor | undefined {
        return SUPPORTED_CORRIDORS.find(c => c.id === id);
    }

    static getPrimaryDemoCorridor(): Corridor {
        return SUPPORTED_CORRIDORS.find(c => c.isPrimaryDemo) || SUPPORTED_CORRIDORS[0];
    }

    static getCorridorForCurrencies(source: string, dest: string): Corridor | undefined {
        return SUPPORTED_CORRIDORS.find(
            c => (c.sourceCurrency === source && c.destCurrency === dest) ||
                 (c.sourceCurrency === dest && c.destCurrency === source)
        );
    }
}
