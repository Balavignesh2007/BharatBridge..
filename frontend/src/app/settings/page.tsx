"use client";

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useWallet } from '../../hooks/useWallet';
import { TransactionService } from '../../services/transactionService';

export default function SettingsPage() {
    const wallet = useWallet();

    const [defaultCurrency, setDefaultCurrency] = useState('USD');
    const [preferredCorridor, setPreferredCorridor] = useState('USA_IND');
    const [selectedNetwork, setSelectedNetwork] = useState('westend');
    const [demoMode, setDemoMode] = useState(true);
    const [testnetMode, setTestnetMode] = useState(true);
    const [amlLimit, setAmlLimit] = useState(10000);
    const [savedNotice, setSavedNotice] = useState(false);
    const [resetNotice, setResetNotice] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    const handleResetHistory = () => {
        TransactionService.resetToSeedData();
        setResetNotice(true);
        setTimeout(() => setResetNotice(false), 3000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
            <Header wallet={wallet} />

            <main className="page-container" style={{ maxWidth: 800 }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 className="page-title">Platform Settings</h1>
                    <p className="page-subtitle">
                        Preferences, Demo Configurations, and Testnet Controls
                    </p>
                </div>

                {/* Honesty Banner */}
                <div className="demo-banner">
                    <div>
                        <strong>DISCLAIMER:</strong> Settings adjusted here only modify local demonstration behavior and testnet RPC targeting. These controls do not alter statutory financial, compliance, or regulatory requirements.
                    </div>
                </div>

                {savedNotice && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: '0.85rem' }}>
                        ✓ Preferences saved successfully in local session.
                    </div>
                )}

                {resetNotice && (
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: '0.85rem' }}>
                        ✓ Demo transaction history restored to seed state.
                    </div>
                )}

                <form onSubmit={handleSave} className="fin-card">
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 20, color: '#0f172a' }}>
                        General &amp; Regional Preferences
                    </h2>

                    <div className="grid-2">
                        <div className="input-group">
                            <label className="input-label">Default Source Currency</label>
                            <select
                                className="input-field"
                                value={defaultCurrency}
                                onChange={(e) => setDefaultCurrency(e.target.value)}
                            >
                                <option value="USD">USD — US Dollar</option>
                                <option value="INR">INR — Indian Rupee</option>
                                <option value="GBP">GBP — British Pound</option>
                                <option value="EUR">EUR — Euro</option>
                                <option value="AED">AED — UAE Dirham</option>
                                <option value="SGD">SGD — Singapore Dollar</option>
                                <option value="CAD">CAD — Canadian Dollar</option>
                                <option value="AUD">AUD — Australian Dollar</option>
                                <option value="JPY">JPY — Japanese Yen</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Preferred Remittance Corridor</label>
                            <select
                                className="input-field"
                                value={preferredCorridor}
                                onChange={(e) => setPreferredCorridor(e.target.value)}
                            >
                                <option value="USA_IND">USA ↔ India (USD / INR)</option>
                                <option value="UK_IND">UK ↔ India (GBP / INR)</option>
                                <option value="EUR_IND">Europe ↔ India (EUR / INR)</option>
                                <option value="UAE_IND">UAE ↔ India (AED / INR)</option>
                                <option value="SGP_IND">Singapore ↔ India (SGD / INR)</option>
                                <option value="CAN_IND">Canada ↔ India (CAD / INR)</option>
                                <option value="AUS_IND">Australia ↔ India (AUD / INR)</option>
                                <option value="JPN_IND">Japan ↔ India (JPY / INR)</option>
                            </select>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: 24, marginBottom: 20, color: '#0f172a' }}>
                        Blockchain &amp; Network Configuration
                    </h2>

                    <div className="input-group">
                        <label className="input-label">Settlement Network Target</label>
                        <select
                            className="input-field"
                            value={selectedNetwork}
                            onChange={(e) => {
                                setSelectedNetwork(e.target.value);
                                wallet.switchNetwork(e.target.value);
                            }}
                        >
                            <option value="westend">Westend Asset Hub (Polkadot Public Testnet - Chain 420420421)</option>
                            <option value="polkadotHub">Polkadot Asset Hub (Polkadot Production Hub - Chain 3338)</option>
                            <option value="localhost">Local Hardhat Node (Chain 31337 - 127.0.0.1:8545)</option>
                        </select>
                    </div>

                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: 24, marginBottom: 20, color: '#0f172a' }}>
                        Simulated Compliance &amp; Hackathon Demo Mode
                    </h2>

                    <div className="grid-2" style={{ marginBottom: 16 }}>
                        <div className="input-group">
                            <label className="input-label">Simulated AML Review Threshold ($ USD)</label>
                            <input
                                type="number"
                                className="input-field num-mono"
                                value={amlLimit}
                                onChange={(e) => setAmlLimit(Number(e.target.value))}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                Transfers above this cap trigger manual enhanced review in simulated engine
                            </span>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Hackathon Demo Mode</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                                <input
                                    type="checkbox"
                                    id="demoModeToggle"
                                    checked={demoMode}
                                    onChange={(e) => setDemoMode(e.target.checked)}
                                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                                />
                                <label htmlFor="demoModeToggle" style={{ fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                                    Enable 1-Click Simulated Settlement
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                        <button
                            type="button"
                            onClick={handleResetHistory}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#dc2626' }}
                        >
                            ↻ Reset Demo Transactions
                        </button>

                        <button type="submit" className="btn btn-primary">
                            Save Settings
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
