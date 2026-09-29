"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletState } from '../hooks/useWallet';

interface HeaderProps {
    wallet: WalletState;
}

export default function Header({ wallet }: HeaderProps) {
    const {
        isConnected,
        shortAddress,
        account,
        networkName,
        isDemoWallet,
        connectWallet,
        connectDemoWallet,
        disconnectWallet,
        isConnecting,
        error,
        clearError,
    } = wallet;

    const pathname = usePathname();
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [copied, setCopied] = useState(false);

    const hasMetaMask = typeof window !== 'undefined' && Boolean(window.ethereum);

    const navItems = [
        { label: 'Overview', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Send Money', href: '/send' },
        { label: 'Transactions', href: '/transactions' },
        { label: 'Corridors', href: '/corridors' },
        { label: 'Settings', href: '/settings' },
    ];

    const copyAddress = () => {
        if (!account) return;
        navigator.clipboard.writeText(account);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="bb-header" style={{ position: 'relative', zIndex: 50 }}>
            <div className="bb-header-inner">
                <Link href="/" className="bb-brand">
                    <span className="bb-logo">
                        BharatBridge <span style={{ color: '#f97316' }}>🇮🇳</span>
                    </span>
                    <span className="bb-badge">India-First</span>
                </Link>

                <nav className="bb-nav">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`bb-nav-link ${isActive ? 'bb-nav-active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="bb-actions" style={{ position: 'relative' }}>
                    <div className="bb-demo-pill" title="Hackathon Demonstration Mode">
                        <span className="bb-demo-dot" />
                        <span>DEMO MODE</span>
                    </div>

                    {isConnected ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => setShowDropdown(!showDropdown)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    fontWeight: 700,
                                    borderColor: '#cbd5e1',
                                }}
                            >
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                <span>{shortAddress}</span>
                                <span style={{
                                    fontSize: '0.68rem',
                                    background: isDemoWallet ? '#fff7ed' : '#eff6ff',
                                    color: isDemoWallet ? '#ea580c' : '#2563eb',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    fontWeight: 800,
                                }}>
                                    {isDemoWallet ? 'DEMO' : 'EVM'}
                                </span>
                            </button>

                            {/* Connected Wallet Dropdown */}
                            {showDropdown && (
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '115%',
                                    width: 290,
                                    background: '#ffffff',
                                    borderRadius: 14,
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                                    border: '1px solid #e2e8f0',
                                    padding: 16,
                                    zIndex: 100,
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                                            Connected Wallet
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>
                                            ● {networkName}
                                        </span>
                                    </div>

                                    <div style={{
                                        background: '#f8fafc',
                                        padding: '10px 12px',
                                        borderRadius: 8,
                                        fontSize: '0.8rem',
                                        fontFamily: 'monospace',
                                        wordBreak: 'break-all',
                                        color: '#0f172a',
                                        border: '1px solid #e2e8f0',
                                        marginBottom: 12,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <span>{shortAddress}</span>
                                        <button
                                            type="button"
                                            onClick={copyAddress}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#2563eb',
                                                cursor: 'pointer',
                                                fontWeight: 700,
                                                fontSize: '0.75rem',
                                            }}
                                        >
                                            {copied ? '✓ Copied' : 'Copy'}
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 14 }}>
                                        <span style={{ color: '#64748b' }}>Simulated Balance:</span>
                                        <span style={{ fontWeight: 800, color: '#0f172a' }}>10,000.00 USDT</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            disconnectWallet();
                                            setShowDropdown(false);
                                        }}
                                        className="btn btn-secondary btn-sm"
                                        style={{ width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: '#fecaca', background: '#fef2f2' }}
                                    >
                                        Disconnect Wallet
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowModal(true)}
                            disabled={isConnecting}
                            style={{
                                background: '#0b1120',
                                color: '#ffffff',
                                fontWeight: 700,
                                boxShadow: '0 2px 8px rgba(11, 17, 32, 0.2)',
                            }}
                        >
                            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                        </button>
                    )}
                </div>
            </div>

            {/* Modal Backdrop & Wallet Selection Dialog */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: 18,
                        maxWidth: 440,
                        width: '100%',
                        padding: '28px 24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1.5px solid #e2e8f0',
                        position: 'relative',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                                    Connect Web3 Wallet
                                </h3>
                                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>
                                    Polkadot Asset Hub &amp; Westend Remittance Settlement
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    clearError();
                                }}
                                style={{
                                    border: 'none',
                                    background: '#f1f5f9',
                                    borderRadius: '50%',
                                    width: 32,
                                    height: 32,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    color: '#64748b',
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {error && (
                            <div style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#991b1b',
                                padding: '10px 14px',
                                borderRadius: 8,
                                marginBottom: 16,
                                fontSize: '0.82rem',
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* Option 1: 1-Click Demo Testnet Wallet (Always Works) */}
                            <button
                                type="button"
                                onClick={() => {
                                    connectDemoWallet();
                                    setShowModal(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px',
                                    borderRadius: 12,
                                    border: '1.5px solid #f97316',
                                    background: '#fff7ed',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>
                                        <span>⚡ Demo Testnet Wallet</span>
                                        <span style={{
                                            fontSize: '0.68rem',
                                            background: '#ea580c',
                                            color: '#ffffff',
                                            padding: '2px 8px',
                                            borderRadius: 9999,
                                            fontWeight: 800,
                                        }}>
                                            RECOMMENDED
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                                        Instant 1-click connect • Pre-funded on Polkadot / Westend Asset Hub
                                    </div>
                                </div>
                                <span style={{ fontSize: '1.2rem', color: '#ea580c' }}>→</span>
                            </button>

                            {/* Option 2: MetaMask / Browser Extension */}
                            <button
                                type="button"
                                onClick={async () => {
                                    await connectWallet();
                                    setShowModal(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px',
                                    borderRadius: 12,
                                    border: '1px solid #cbd5e1',
                                    background: '#ffffff',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>
                                        <span>🦊 MetaMask / Injected EVM</span>
                                        <span style={{
                                            fontSize: '0.68rem',
                                            background: hasMetaMask ? '#ecfdf5' : '#f1f5f9',
                                            color: hasMetaMask ? '#059669' : '#64748b',
                                            padding: '2px 8px',
                                            borderRadius: 9999,
                                            fontWeight: 700,
                                        }}>
                                            {hasMetaMask ? 'DETECTED' : 'NOT DETECTED'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                                        {hasMetaMask
                                            ? 'Connect via browser extension prompt'
                                            : 'Will auto-route to Demo Wallet if extension is absent'}
                                    </div>
                                </div>
                                <span style={{ fontSize: '1.2rem', color: '#64748b' }}>→</span>
                            </button>
                        </div>

                        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                            By connecting, you agree to the BharatBridge demo settlement protocols.
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
