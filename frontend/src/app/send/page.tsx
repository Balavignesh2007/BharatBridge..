"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useWallet } from '../../hooks/useWallet';
import { CorridorService } from '../../services/corridorService';
import { FXService } from '../../services/fxService';
import { TransactionService } from '../../services/transactionService';
import { Currency, Direction, Corridor, Transaction } from '../../types';

interface RemittanceReceipt {
    receiptNumber: string;
    transactionId: string;
    issuedAt: string;
    senderName: string;
    senderCountry: string;
    recipientName: string;
    recipientAccountOrUpi: string;
    bankName: string;
    payoutRail: string;
    payoutReferenceNumber: string;
    sourceAmount: number;
    sourceCurrency: string;
    feeCharged: number;
    feePercent: number;
    exchangeRate: number;
    recipientAmount: number;
    destCurrency: string;
    status: string;
    settlementNetwork: string;
}

function SendContent() {
    const searchParams = useSearchParams();
    const wallet = useWallet();
    const receiptRef = useRef<HTMLDivElement>(null);

    const corridors = CorridorService.getAllCorridors();

    // Form inputs
    const [direction, setDirection] = useState<Direction>('GLOBAL_TO_INDIA');
    const [selectedCorridorId, setSelectedCorridorId] = useState<string>('USA_IND');
    const [amount, setAmount] = useState<string>('1000');
    const [recipientName, setRecipientName] = useState<string>('Priya Sharma');
    const [payoutType, setPayoutType] = useState<'UPI' | 'BANK_TRANSFER'>('UPI');
    const [recipientIdentifier, setRecipientIdentifier] = useState<string>('priya.sharma@okaxis');
    const [bankName, setBankName] = useState<string>('State Bank of India');
    const [destChainId, setDestChainId] = useState<number>(0);

    // Processing & generated receipt states
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [receipt, setReceipt] = useState<RemittanceReceipt | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Selected corridor & derived live quote
    const activeCorridor: Corridor = CorridorService.getCorridorById(selectedCorridorId) || corridors[0];
    const sourceCurrency: Currency = direction === 'GLOBAL_TO_INDIA' ? activeCorridor.sourceCurrency : 'INR';
    const destCurrency: Currency = direction === 'GLOBAL_TO_INDIA' ? 'INR' : activeCorridor.sourceCurrency;

    const numAmount = parseFloat(amount) || 0;
    const fxQuote = FXService.convert(sourceCurrency, destCurrency, numAmount);

    useEffect(() => {
        const demoParam = searchParams.get('demo');
        const corridorParam = searchParams.get('corridor');

        if (demoParam === 'primary') {
            loadPrimaryDemo();
        } else if (corridorParam) {
            const found = corridors.find(c => c.id === corridorParam);
            if (found) {
                setSelectedCorridorId(found.id);
            }
        }
    }, [searchParams]);

    const loadPrimaryDemo = () => {
        setDirection('GLOBAL_TO_INDIA');
        setSelectedCorridorId('USA_IND');
        setAmount('1000');
        setRecipientName('Priya Sharma');
        setPayoutType('UPI');
        setRecipientIdentifier('priya.sharma@okaxis');
        setBankName('State Bank of India');
        setDestChainId(0);
        setReceipt(null);
        setErrorMessage(null);
    };

    // Submit transfer to backend
    const handleSendMoney = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!numAmount || numAmount <= 0) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const res = await fetch('/api/remittance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    direction,
                    corridorId: selectedCorridorId,
                    amount: numAmount,
                    recipientName,
                    payoutType,
                    recipientIdentifier,
                    bankName,
                    senderAddress: wallet.account || '0x71C2a839B310F0d27E6A9318b87e221087413697',
                    senderName: wallet.isConnected ? 'Connected Sender' : 'Johnathan Miller',
                    destChainId,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setErrorMessage(data.error || 'Transfer failed to process');
                setIsProcessing(false);
                return;
            }

            if (data.transaction) {
                TransactionService.saveTransaction(data.transaction as Transaction);
            }

            setReceipt(data.receipt);
            setIsProcessing(false);

        } catch (err: any) {
            console.error('Submission error:', err);
            setErrorMessage(err.message || 'Failed to communicate with settlement backend');
            setIsProcessing(false);
        }
    };

    const handlePrintReceipt = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
            <Header wallet={wallet} />

            <main className="page-container" style={{ maxWidth: 740 }}>
                {/* Page Heading & One-Click Demo Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 28,
                    flexWrap: 'wrap',
                    gap: 16
                }}>
                    <div>
                        <h1 className="page-title" style={{ fontSize: '1.95rem' }}>
                            Send Money Cross-Border
                        </h1>
                        <p className="page-subtitle">
                            Bilateral Global ↔ India settlement with transparent FX &amp; sub-1% fees
                        </p>
                    </div>

                    {!receipt && (
                        <button
                            type="button"
                            onClick={loadPrimaryDemo}
                            className="btn btn-secondary btn-sm"
                            style={{
                                background: '#fff7ed',
                                borderColor: '#fed7aa',
                                color: '#ea580c',
                                fontWeight: 700,
                                boxShadow: '0 1px 3px rgba(234, 88, 12, 0.1)',
                            }}
                        >
                            ⚡ 1-Click Demo ($1,000 USD)
                        </button>
                    )}
                </div>

                {errorMessage && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#991b1b',
                        padding: '14px 18px',
                        borderRadius: 12,
                        marginBottom: 20,
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                        <div><strong>Transfer Error:</strong> {errorMessage}</div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* VIEW A: OFFICIAL GENERATED REMITTANCE RECEIPT                              */}
                {/* ========================================================================= */}
                {receipt ? (
                    <div ref={receiptRef} className="fin-card" style={{
                        background: '#ffffff',
                        border: '1.5px solid #0f172a',
                        borderRadius: 16,
                        padding: '36px 32px',
                        boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.12)',
                        position: 'relative',
                    }}>
                        {/* Decorative Top Accent Bar */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 6,
                            background: 'linear-gradient(90deg, #f97316 0%, #2563eb 50%, #10b981 100%)',
                            borderRadius: '16px 16px 0 0',
                        }} />

                        {/* Receipt Top Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            borderBottom: '2px dashed #e2e8f0',
                            paddingBottom: 22,
                            marginBottom: 24,
                            flexWrap: 'wrap',
                            gap: 16
                        }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    BharatBridge <span style={{ color: '#f97316' }}>🇮🇳</span>
                                </div>
                                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                                    Official Cross-Border Remittance Receipt
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                                    Settled on Polkadot Asset Hub • Issued: {receipt.issuedAt}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <span className="badge badge-low" style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: 9999 }}>
                                    ✓ PAYMENT CREDITED
                                </span>
                                <div className="num-mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: 8 }}>
                                    {receipt.receiptNumber}
                                </div>
                            </div>
                        </div>

                        {/* Amount Credited Spotlight */}
                        <div style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: 14,
                            padding: '24px',
                            textAlign: 'center',
                            marginBottom: 26,
                        }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Total Amount Credited to Beneficiary
                            </div>
                            <div className="num-mono" style={{ fontSize: '2.6rem', fontWeight: 900, color: '#10b981', marginTop: 4, letterSpacing: '-0.02em' }}>
                                {receipt.destCurrency === 'INR' ? '₹' : ''}{receipt.recipientAmount.toLocaleString()} {receipt.destCurrency}
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#475569', marginTop: 6 }}>
                                Converted from <strong>${receipt.sourceAmount.toLocaleString()} {receipt.sourceCurrency}</strong> @ 1 {receipt.sourceCurrency} = {receipt.exchangeRate.toFixed(4)} {receipt.destCurrency}
                            </div>
                        </div>

                        {/* 4-Box Key Details Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 16,
                            marginBottom: 26
                        }}>
                            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                                    ORIGIN SENDER
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', marginTop: 4 }}>
                                    {receipt.senderName}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    Country: {receipt.senderCountry}
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                                    BENEFICIARY RECIPIENT
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', marginTop: 4 }}>
                                    {receipt.recipientName}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {receipt.bankName} • {receipt.recipientAccountOrUpi}
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                                    FEE &amp; PRICING
                                </div>
                                <div className="num-mono" style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginTop: 4 }}>
                                    ${receipt.sourceAmount.toFixed(2)} {receipt.sourceCurrency}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                                    Protocol Fee (0.30%): -${receipt.feeCharged.toFixed(2)} {receipt.sourceCurrency}
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                                    DOMESTIC CLEARING RAIL
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginTop: 4 }}>
                                    {receipt.payoutRail}
                                </div>
                                <div className="num-mono" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    Ref: {receipt.payoutReferenceNumber}
                                </div>
                            </div>
                        </div>

                        {/* Security Footer Notice */}
                        <div style={{
                            borderTop: '1px solid #e2e8f0',
                            paddingTop: 16,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            color: '#64748b',
                            flexWrap: 'wrap',
                            gap: 8,
                        }}>
                            <div>
                                Verified via <strong>{receipt.settlementNetwork}</strong>
                            </div>
                            <div className="badge badge-simulated" style={{ fontSize: '0.68rem' }}>
                                SIMULATED DOMESTIC RAIL
                            </div>
                        </div>

                        {/* Receipt Action Buttons */}
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={handlePrintReceipt}
                                className="btn btn-primary"
                                style={{ padding: '12px 24px', fontSize: '0.92rem' }}
                            >
                                🖨️ Print / Save PDF Receipt
                            </button>

                            <Link
                                href={`/transactions/${receipt.transactionId}`}
                                className="btn btn-secondary"
                                style={{ padding: '12px 24px', fontSize: '0.92rem' }}
                            >
                                View Blockchain Audit Trail →
                            </Link>

                            <button
                                type="button"
                                onClick={() => {
                                    setReceipt(null);
                                    setAmount('1000');
                                }}
                                className="btn btn-secondary"
                                style={{ padding: '12px 20px', fontSize: '0.92rem' }}
                            >
                                Send Another Transfer
                            </button>
                        </div>
                    </div>

                ) : (

                    /* ========================================================================= */
                    /* VIEW B: CLEAN, MODERN FINTECH TRANSFER FORM                               */
                    /* ========================================================================= */
                    <form onSubmit={handleSendMoney} className="fin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                                    Transfer Configuration
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>
                                    Select corridor and enter amount
                                </p>
                            </div>
                            <span className="badge badge-saffron" style={{ fontSize: '0.75rem' }}>
                                0.30% FLAT FEE
                            </span>
                        </div>

                        {/* Direction Switcher (Segmented Control) */}
                        <div style={{
                            background: '#f1f5f9',
                            padding: 4,
                            borderRadius: 12,
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 4,
                            marginBottom: 24,
                        }}>
                            <button
                                type="button"
                                onClick={() => setDirection('GLOBAL_TO_INDIA')}
                                style={{
                                    border: 'none',
                                    borderRadius: 9,
                                    padding: '10px 14px',
                                    fontSize: '0.88rem',
                                    fontWeight: direction === 'GLOBAL_TO_INDIA' ? 800 : 600,
                                    background: direction === 'GLOBAL_TO_INDIA' ? '#ffffff' : 'transparent',
                                    color: direction === 'GLOBAL_TO_INDIA' ? '#0f172a' : '#64748b',
                                    boxShadow: direction === 'GLOBAL_TO_INDIA' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                🌍 Global → India 🇮🇳 (Inward)
                            </button>
                            <button
                                type="button"
                                onClick={() => setDirection('INDIA_TO_GLOBAL')}
                                style={{
                                    border: 'none',
                                    borderRadius: 9,
                                    padding: '10px 14px',
                                    fontSize: '0.88rem',
                                    fontWeight: direction === 'INDIA_TO_GLOBAL' ? 800 : 600,
                                    background: direction === 'INDIA_TO_GLOBAL' ? '#ffffff' : 'transparent',
                                    color: direction === 'INDIA_TO_GLOBAL' ? '#0f172a' : '#64748b',
                                    boxShadow: direction === 'INDIA_TO_GLOBAL' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                🇮🇳 India → Global 🌐 (Outward LRS)
                            </button>
                        </div>

                        {/* Bilateral Corridor Selector */}
                        <div className="input-group">
                            <label className="input-label">
                                <span>Bilateral Remittance Corridor</span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                                    8 Bilateral Pairs Supported
                                </span>
                            </label>
                            <select
                                className="input-field"
                                value={selectedCorridorId}
                                onChange={(e) => setSelectedCorridorId(e.target.value)}
                                style={{ fontWeight: 600, color: '#0f172a' }}
                            >
                                {corridors.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.flag} {c.name} — Demo Rate: 1 {c.sourceCurrency} = ₹{c.demoRate.toFixed(2)} INR
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Amount Box */}
                        <div className="input-group">
                            <div className="input-label">
                                <span>You Send</span>
                                <span style={{ color: '#2563eb', fontWeight: 700 }}>
                                    Protocol Fee: 0.30% (${fxQuote.fee.toFixed(2)} {sourceCurrency})
                                </span>
                            </div>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: 16,
                                    fontWeight: 800,
                                    fontSize: '1.25rem',
                                    color: '#64748b',
                                }}>
                                    $
                                </span>
                                <input
                                    type="number"
                                    className="input-field num-mono"
                                    style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 800,
                                        paddingLeft: 34,
                                        paddingRight: 80,
                                        color: '#0f172a',
                                    }}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="1000"
                                    min="1"
                                    required
                                />
                                <span style={{
                                    position: 'absolute',
                                    right: 14,
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: 6,
                                    padding: '4px 10px',
                                    fontSize: '0.8rem',
                                    fontWeight: 800,
                                    color: '#334155',
                                }}>
                                    {sourceCurrency}
                                </span>
                            </div>
                        </div>

                        {/* Live Conversion Banner */}
                        <div style={{
                            background: '#f8fafc',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: 14,
                            padding: '18px 20px',
                            marginBottom: 24,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 12,
                        }}>
                            <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                                    GUARANTEED FX CONVERSION
                                </div>
                                <div style={{ fontSize: '0.92rem', color: '#334155', marginTop: 2 }}>
                                    1 {sourceCurrency} = <strong>{fxQuote.rate.toFixed(4)} {destCurrency}</strong>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                                    RECIPIENT RECEIVES
                                </div>
                                <div className="num-mono" style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>
                                    {destCurrency === 'INR' ? '₹' : ''}{fxQuote.recipientAmount.toLocaleString()} {destCurrency}
                                </div>
                            </div>
                        </div>

                        {/* Beneficiary Details Section */}
                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 22, marginTop: 4 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>
                                Beneficiary Information
                            </h3>

                            <div className="grid-2">
                                <div className="input-group">
                                    <label className="input-label">Recipient Full Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        placeholder="e.g. Priya Sharma"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Payout Rail</label>
                                    <select
                                        className="input-field"
                                        value={payoutType}
                                        onChange={(e) => setPayoutType(e.target.value as any)}
                                    >
                                        <option value="UPI">UPI Instant Rail (Simulated)</option>
                                        <option value="BANK_TRANSFER">IMPS / NEFT Direct (Simulated)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid-2">
                                <div className="input-group">
                                    <label className="input-label">
                                        {payoutType === 'UPI' ? 'UPI ID / VPA' : 'Bank Account / IBAN'}
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={recipientIdentifier}
                                        onChange={(e) => setRecipientIdentifier(e.target.value)}
                                        placeholder={payoutType === 'UPI' ? 'username@bank' : 'A/C Number & IFSC'}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Beneficiary Bank Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        placeholder="State Bank of India / HDFC"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ marginTop: 10 }}>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    background: '#0b1120',
                                    borderColor: '#0b1120',
                                    padding: '16px',
                                    fontSize: '1.05rem',
                                    fontWeight: 700,
                                    borderRadius: 12,
                                    boxShadow: '0 4px 14px rgba(11, 17, 32, 0.25)',
                                }}
                                disabled={isProcessing || !numAmount || numAmount <= 0}
                            >
                                {isProcessing ? (
                                    <span>⏳ Processing Transfer in Backend &amp; Generating Receipt...</span>
                                ) : (
                                    <span>🚀 Transfer ${numAmount.toLocaleString()} {sourceCurrency} → Generate Official Receipt</span>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default function SendPage() {
    return (
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading BharatBridge Remittance Engine...</div>}>
            <SendContent />
        </Suspense>
    );
}
