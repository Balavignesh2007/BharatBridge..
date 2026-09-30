"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useWallet } from '../../hooks/useWallet';
import { TransactionService } from '../../services/transactionService';
import { CorridorService } from '../../services/corridorService';
import { Transaction, Corridor, getCurrencySymbol } from '../../types';

export default function TransactionsPage() {
    const wallet = useWallet();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [corridors, setCorridors] = useState<Corridor[]>([]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [corridorFilter, setCorridorFilter] = useState('ALL');

    useEffect(() => {
        setTransactions(TransactionService.getTransactions());
        setCorridors(CorridorService.getAllCorridors());
    }, []);

    // Filter logic
    const filteredTransactions = transactions.filter((t) => {
        // Search query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchId = t.id.toLowerCase().includes(q);
            const matchRecipient = t.recipient.name.toLowerCase().includes(q) || t.recipient.identifier.toLowerCase().includes(q);
            const matchSender = t.sender.name.toLowerCase().includes(q);
            if (!matchId && !matchRecipient && !matchSender) return false;
        }

        // Status filter
        if (statusFilter !== 'ALL' && t.status !== statusFilter) {
            return false;
        }

        // Corridor filter
        if (corridorFilter !== 'ALL') {
            const [src, dst] = corridorFilter.split('_');
            if (t.sourceCurrency !== src && t.destCurrency !== dst) {
                return false;
            }
        }

        return true;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
            <Header wallet={wallet} />

            <main className="page-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <h1 className="page-title">Transaction History</h1>
                        <p className="page-subtitle">
                            End-to-End Cross-Border Transfers & Settlement Records
                        </p>
                    </div>

                    <Link href="/send" className="btn btn-primary btn-sm">
                        + New Remittance
                    </Link>
                </div>

                {/* Filter Controls Bar */}
                <div className="fin-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14 }}>
                        <div>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Search by Tx ID, recipient name, or account/UPI..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div>
                            <select
                                className="input-field"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="REVIEW">Review Required</option>
                                <option value="BLOCKED">Blocked</option>
                            </select>
                        </div>

                        <div>
                            <select
                                className="input-field"
                                value={corridorFilter}
                                onChange={(e) => setCorridorFilter(e.target.value)}
                            >
                                <option value="ALL">All Corridors</option>
                                {corridors.map((c) => (
                                    <option key={c.id} value={`${c.sourceCurrency}_${c.destCurrency}`}>
                                        {c.flag} {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Date & Time</th>
                                <th>Direction</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Amount</th>
                                <th>FX Rate</th>
                                <th>Fee (0.30%)</th>
                                <th>Risk Result</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={11} style={{ textAlign: 'center', padding: '36px 20px', color: '#64748b' }}>
                                        No transactions match your current filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td>
                                            <Link href={`/transactions/${tx.id}`} style={{ fontWeight: 800, color: '#2563eb' }}>
                                                {tx.id}
                                            </Link>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                            {tx.date}
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                                                {tx.direction === 'GLOBAL_TO_INDIA' ? 'Inward (Global → India)' : 'Outward (India → Global)'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{tx.sender.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{tx.sourceCurrency}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{tx.recipient.name}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                {tx.recipient.payoutType}: {tx.recipient.identifier.slice(0, 16)}...
                                            </div>
                                        </td>
                                        <td>
                                            <div className="num-mono" style={{ fontWeight: 700 }}>
                                                {getCurrencySymbol(tx.sourceCurrency)}{tx.sourceAmount.toLocaleString()} {tx.sourceCurrency}
                                            </div>
                                            <div className="num-mono" style={{ fontSize: '0.75rem', color: '#16a34a' }}>
                                                ≈ {getCurrencySymbol(tx.destCurrency)}{tx.destAmount.toLocaleString()} {tx.destCurrency}
                                            </div>
                                        </td>
                                        <td className="num-mono" style={{ fontSize: '0.82rem' }}>
                                            1 {tx.sourceCurrency} = {tx.fxRate.toFixed(2)}
                                        </td>
                                        <td className="num-mono" style={{ fontSize: '0.82rem', color: '#475569' }}>
                                            {getCurrencySymbol(tx.sourceCurrency)}{tx.fee.toFixed(2)}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${tx.risk.level.toLowerCase()}`}>
                                                {tx.risk.level}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-completed">
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={`/transactions/${tx.id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                                                Details →
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            <Footer />
        </div>
    );
}
