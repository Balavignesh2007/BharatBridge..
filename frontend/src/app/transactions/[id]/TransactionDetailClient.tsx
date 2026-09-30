"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useWallet } from '../../../hooks/useWallet';
import { TransactionService } from '../../../services/transactionService';
import { Transaction, getCurrencySymbol } from '../../../types';

interface Props {
    id: string;
}

export default function TransactionDetailClient({ id: txId }: Props) {
    const wallet = useWallet();
    const [tx, setTx] = useState<Transaction | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (txId) {
            const found = TransactionService.getTransactionById(txId);
            if (found) {
                setTx(found);
            }
        }
        setIsLoaded(true);
    }, [txId]);

    if (!isLoaded) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
                <Header wallet={wallet} />
                <main className="page-container" style={{ textAlign: 'center', padding: '64px 20px' }}>
                    <p style={{ color: '#64748b' }}>Loading transaction #{txId}...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (!tx) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
                <Header wallet={wallet} />
                <main className="page-container" style={{ textAlign: 'center', padding: '64px 20px' }}>
                    <h2>Transaction Not Found</h2>
                    <p style={{ color: '#64748b', marginTop: 8, marginBottom: 20 }}>
                        Could not locate remittance record for ID &ldquo;{txId}&rdquo;
                    </p>
                    <Link href="/transactions" className="btn btn-primary">
                        ← Back to Transactions
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
            <Header wallet={wallet} />

            <main className="page-container">
                {/* Back Nav & Header */}
                <div style={{ marginBottom: 20 }}>
                    <Link href="/transactions" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>
                        ← Back to Transaction History
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <h1 className="page-title">
                                Transaction #{tx.id}
                            </h1>
                            <p className="page-subtitle">
                                Initiated on {tx.date} • {tx.direction === 'GLOBAL_TO_INDIA' ? 'Inward Global → India' : 'Outward India → Global'}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span className="badge badge-simulated">
                                SIMULATED PAYMENT RAIL
                            </span>
                            <span className="badge badge-demo">
                                TESTNET / DEMO
                            </span>
                        </div>
                    </div>
                </div>

                {/* 9-Stage Visual Lifecycle Timeline */}
                <div className="fin-card" style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                            9-Stage Settlement Lifecycle
                        </h2>
                        <span className="badge badge-completed">
                            STATUS: {tx.status}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                        {tx.stages.map((stage, idx) => {
                            const isCompleted = stage.status === 'COMPLETED';
                            const isProcessing = stage.status === 'PROCESSING';

                            return (
                                <div
                                    key={stage.id}
                                    style={{
                                        border: '1px solid',
                                        borderColor: isCompleted ? '#bbf7d0' : isProcessing ? '#bfdbfe' : '#e2e8f0',
                                        background: isCompleted ? '#f0fdf4' : isProcessing ? '#eff6ff' : '#ffffff',
                                        borderRadius: 8,
                                        padding: '12px 14px',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>
                                            STAGE {idx + 1}
                                        </span>
                                        <span className={`badge ${isCompleted ? 'badge-low' : isProcessing ? 'badge-simulated' : 'badge-demo'}`} style={{ fontSize: '0.65rem' }}>
                                            {stage.status}
                                        </span>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                                        {stage.label}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: 4, lineHeight: 1.4 }}>
                                        {stage.description}
                                    </p>
                                    {stage.timestamp && (
                                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 6 }}>
                                            Time: {stage.timestamp}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Details Grid: Left: Financial Breakdown, Right: Verification & Blockchain */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
                    {/* Left Column: Financial & Participant Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="fin-card">
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 16, color: '#0f172a' }}>
                                Financial Breakdown
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Source Amount</span>
                                    <span className="num-mono" style={{ fontWeight: 700 }}>
                                        {getCurrencySymbol(tx.sourceCurrency)}{tx.sourceAmount.toLocaleString()} {tx.sourceCurrency}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Protocol Fee (0.30%)</span>
                                    <span className="num-mono" style={{ fontWeight: 700, color: '#dc2626' }}>
                                        -{getCurrencySymbol(tx.sourceCurrency)}{tx.fee.toFixed(2)} {tx.sourceCurrency}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Exchange Rate</span>
                                    <span className="num-mono" style={{ fontWeight: 700 }}>
                                        1 {tx.sourceCurrency} = {tx.fxRate.toFixed(4)} {tx.destCurrency}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recipient Receives</span>
                                    <span className="num-mono" style={{ fontWeight: 800, fontSize: '1.3rem', color: '#16a34a' }}>
                                        {getCurrencySymbol(tx.destCurrency)}{tx.destAmount.toLocaleString()} {tx.destCurrency}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="fin-card">
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 16, color: '#0f172a' }}>
                                Sender &amp; Beneficiary
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SENDER</span>
                                    <div style={{ fontWeight: 700 }}>{tx.sender.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{tx.sender.country}</div>
                                    {tx.sender.address && (
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
                                            Wallet: {tx.sender.address}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>BENEFICIARY</span>
                                    <div style={{ fontWeight: 700 }}>{tx.recipient.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                        Rail: {tx.recipient.payoutType} ({tx.recipient.identifier})
                                    </div>
                                    {tx.recipient.bankName && (
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
                                            Bank: {tx.recipient.bankName}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Risk & Compliance Details & Blockchain Meta */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="fin-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                                    Rule-Based Risk Result
                                </h3>
                                <span className={`badge badge-${tx.risk.level.toLowerCase()}`}>
                                    {tx.risk.level}
                                </span>
                            </div>
                            <ul style={{ paddingLeft: 18, fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>
                                {tx.risk.reasons.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="fin-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                                    Compliance Screening
                                </h3>
                                <span className="badge badge-simulated">
                                    {tx.compliance.status}
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {tx.compliance.checks.map((chk, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', background: '#f8fafc', padding: '6px 10px', borderRadius: 4 }}>
                                        <span>{chk.name}</span>
                                        <span style={{ fontWeight: 700, color: '#16a34a' }}>{chk.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="fin-card">
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>
                                Blockchain &amp; Payout Verification
                            </h3>
                            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div>
                                    <span style={{ color: '#64748b' }}>Network: </span>
                                    <strong>{tx.network}</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b' }}>Settlement: </span>
                                    <strong>{tx.settlementStatus} (Asset Hub)</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b' }}>Fiat Payout: </span>
                                    <span className="badge badge-simulated" style={{ fontSize: '0.7rem' }}>
                                        SIMULATED IMPS/UPI RAIL
                                    </span>
                                </div>
                                {tx.txHash && (
                                    <div style={{ wordBreak: 'break-all', marginTop: 4 }}>
                                        <span style={{ color: '#64748b' }}>Tx Hash: </span>
                                        <span className="num-mono" style={{ fontSize: '0.75rem', color: '#2563eb' }}>
                                            {tx.txHash}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
