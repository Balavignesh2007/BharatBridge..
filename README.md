# BharatBridge 🇮🇳

**India-First Cross-Border Remittance & Settlement Platform**

> *India to the World. The Bridge for Global Money.*

---

## 1. Project Overview

**BharatBridge** is an enterprise-grade cross-border remittance and settlement infrastructure designed specifically for the global Indian diaspora and international trade corridors. By bridging native Polkadot Asset Hub stablecoins (USDT/USDC) and cross-consensus messaging (XCM) with an automated rule-based risk engine, simulated compliance checks, and domestic fiat payment rail abstractions, BharatBridge enables **sub-1% fees (0.30% flat)** and **instant settlement (< 12 seconds)** between India and top global economic corridors.

---

## 2. Problem Statement

Traditional cross-border remittances to and from India face severe friction:
- **Exorbitant Fees**: Legacy wire services (Western Union, MoneyGram, traditional SWIFT wires) charge between 3.5% and 6.5% through opaque currency conversion spreads and upfront wire fees.
- **Protracted Delays**: Traditional SWIFT transfers require 2 to 5 business days and traverse multiple correspondent banks.
- **Opaque FX Markups**: Senders rarely receive the real mid-market foreign exchange rate.
- **Fragmented Compliance**: Rigid batch compliance creates unexplained wire holds and regulatory friction under frameworks like the RBI Liberalised Remittance Scheme (LRS).

---

## 3. Solution

BharatBridge modernizes cross-border capital flows with a hybrid Web3 and FinTech infrastructure:
1. **Direct On-Chain Settlement**: Settles natively in seconds via Polkadot Asset Hub and XCM without correspondent banking chains.
2. **Transparent 0.30% Fee**: Transparent flat fee schedule with zero hidden exchange-rate markups.
3. **Deterministic Risk Controls**: Multi-rule security engine verifying transfer velocity, limits, and blacklists.
4. **Bilateral Corridors**: Native support for 8 bilateral international corridors connecting India to the USA, UK, Europe, UAE, Singapore, Canada, Australia, and Japan.
5. **Domestic Payment Abstraction**: Simulated domestic fiat settlement rails (IMPS / UPI) ensuring beneficiaries receive local currency directly.

---

## 4. Key Features

- **India ↔ Global Bilateral Corridors**: 8 supported international currency corridors covering over 85% of total Indian inward remittances.
- **Transparent FX Engine**: On-chain rate feed (`FXOracle.sol`) and TypeScript service calculating exact outputs, spreads, and fee breakdowns.
- **Rule-Based Risk Engine**: Deterministic security engine (strictly non-ML/AI) providing full explainability for risk classifications (LOW, MEDIUM, HIGH).
- **Simulated Compliance Layer**: Verifies AML statutory thresholds ($10,000 travel rule), simulated OFAC/UN sanctions watchlists, and corridor authorizations.
- **9-Stage Transaction Lifecycle**: Full end-to-end audit trail tracking each remittance from initiation to beneficiary payout.
- **Web3 Wallet & Testnet Integration**: Seamless MetaMask and EVM-compatible wallet support on Polkadot Asset Hub and Westend testnets.
- **One-Click Primary Hackathon Demo**: Pre-configured $1,000 USD → ₹84,246.50 INR flow demonstrating the full pipeline.

---

## 5. Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BharatBridge Frontend (Next.js 14)                  │
│       Landing (/)  •  Dashboard (/dashboard)  •  Send Money (/send)         │
│  Transactions (/transactions)  •  Corridors (/corridors)  •  Analytics      │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │                               │
┌──────────────────────▼──────────────┐ ┌──────────────▼──────────────────────┐
│       Core Modular Services         │ │        Web3 & Blockchain Layer      │
│  • fxService (Rates & Quotes)       │ │  • useWallet (MetaMask/EVM)         │
│  • riskService (Rule Engine)        │ │  • ethers.js v6                     │
│  • complianceService (AML/OFAC)     │ │  • Polkadot Asset Hub (Native PVM)  │
│  • paymentService (Mock Rails)      │ │  • Westend Asset Hub / Localhost    │
└──────────────────────┬──────────────┘ └──────────────┬──────────────────────┘
                       │                               │
┌──────────────────────▼───────────────────────────────▼──────────────────────┐
│                          Smart Contracts (Solidity 0.8.24)                  │
│   BharatBridge.sol (Core Settlement Engine) ─── FXOracle.sol (FX Rates)     │
│         │                                                                   │
│         └─── IXcmPrecompile.sol (0x000...0803) ─── MockStablecoin (USDT/C)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Polkadot XCM
                        ┌──────────────┼──────────────┐
                     Moonbeam        Astar        Hydration
                     (ID: 2004)    (ID: 2006)    (ID: 2034)
```

---

## 6. End-to-End Transaction Flow (9 Stages)

Every remittance created on BharatBridge traverses a 9-stage lifecycle:

```
[1. INITIATED]
       │
       ▼
[2. FRAUD RISK CHECK]         → Evaluated by deterministic rule engine (Score 0-100)
       │
       ▼
[3. COMPLIANCE CHECK]         → Simulated AML, OFAC, and corridor authorization
       │
       ▼
[4. FX QUOTE LOCKED]          → 0.30% fee applied, rate locked for execution
       │
       ▼
[5. STABLECOIN TRANSFER]      → On-chain transfer of USDT/USDC via Asset Hub
       │
       ▼
[6. CROSS-CHAIN SETTLEMENT]   → Polkadot XCM message dispatched to destination chain
       │
       ▼
[7. CURRENCY CONVERSION]      → Stablecoin converted via liquidity pool
       │
       ▼
[8. PAYMENT PROCESSING]       → Domestic payment rail instruction created
       │
       ▼
[9. RECIPIENT PAYOUT]         → Simulated IMPS/UPI credit confirmed to recipient
```

---

## 7. Rule-Based Risk Engine

BharatBridge deliberately avoids unpredictable "black-box" machine learning for compliance. Instead, it implements a **deterministic, rule-based risk engine**:

| Rule Category | Trigger Condition | Outcome | Reason Code |
|---|---|---|---|
| **Sanctions Blacklist** | Address matched in simulated sanctions set | HIGH (BLOCK) | `Sanctions entity match` |
| **Restricted Corridor** | Embargoed or unapproved jurisdiction | HIGH (BLOCK) | `Corridor policy violation` |
| **Single Transaction Cap** | Amount > $50,000 USD equivalent | HIGH (BLOCK) | `Exceeds single transaction cap` |
| **Enhanced Due Diligence** | Amount between $10,000 and $50,000 USD | MEDIUM (REVIEW) | `High-value secondary review required` |
| **Velocity Control** | > 5 transfers within 24 hours | MEDIUM (REVIEW) | `High transaction frequency detected` |
| **New Wallet Threshold** | New unverified wallet sending > $3,000 | MEDIUM (REVIEW) | `New wallet velocity threshold` |
| **Standard Retail** | Standard transfer within approved limits | LOW (PASS) | `Approved limits & verified corridor` |

---

## 8. Compliance Engine

The compliance service simulates regulatory controls required by central banks (such as RBI and FinCEN):
- **Statutory Reporting Cap**: Evaluates transactions against the $10,000 USD travel-rule threshold.
- **Sanctions & Watchlist Screening**: Checks sender and recipient against simulated OFAC/UN lists.
- **Corridor Legality**: Confirms bilateral regulatory approval between jurisdiction pairs.
- **Beneficiary Information**: Validates that recipient name and domestic routing identifiers (UPI ID / IFSC) are present.
- **Honesty Note**: Clearly labeled in the user interface as **`SIMULATED COMPLIANCE CHECK`**.

---

## 9. FX Engine

The FX Engine calculates real-time conversions, net payouts, and fees:
- **Base Fee**: Flat 0.30% (30 basis points) on transfer volume.
- **Conversion Formula**:
  $$\text{Fee} = \text{Amount} \times 0.0030$$
  $$\text{Net Amount} = \text{Amount} - \text{Fee}$$
  $$\text{Recipient Payout} = \text{Net Amount} \times \text{Exchange Rate}$$
- **Example ($1,000 USD → INR)**:
  - Input: $1,000.00 USD
  - Fee: $3.00 USD (0.30%)
  - Net: $997.00 USD
  - Exchange Rate: ₹84.50 / USD
  - Recipient Receives: **₹84,246.50 INR**

---

## 10. Blockchain Architecture

- **Polkadot Asset Hub**: Serves as the primary asset issuance and settlement hub.
- **Native Assets**: Handles USDT and USDC as native ERC-20 compatible assets with 6-decimal precision.
- **PVM (Polkadot Virtual Machine)**: High-performance smart contract execution layer combining EVM compatibility with Substrate primitives.

---

## 11. XCM & Cross-Chain Architecture

- **Cross-Consensus Messaging (XCM)**: Enables Asset Hub to dispatch cross-chain instructions to connected parachains.
- **Precompile Integration**: Calls the Polkadot Asset Hub XCM precompile at address `0x0000000000000000000000000000000000000803`.
- **Supported Chains**:
  - `0`: Polkadot Asset Hub (Same-chain settlement)
  - `2004`: Moonbeam Parachain
  - `2006`: Astar Parachain
  - `2034`: Hydration Parachain
  - `2030`: Bifrost Parachain

---

## 12. Payment Rail Adapter

Fiat payment processing is abstracted through the `PaymentRailAdapter` interface:

```typescript
export interface PaymentRailAdapter {
    createPayment(params): Promise<PaymentRailResult>;
    checkPaymentStatus(paymentId): Promise<PaymentRailResult>;
    processPayout(paymentId): Promise<PaymentRailResult>;
    getPaymentStatus(paymentId): PaymentRailResult | null;
}
```

The prototype implements `MockPaymentRailAdapter`, which simulates real-time domestic clearing rails:
- **India**: Simulated **UPI** (Unified Payments Interface) and **IMPS** (Immediate Payment Service).
- **International**: Simulated domestic ACH / SEPA rails.
- **Honesty Note**: Clearly labeled in the user interface as **`SIMULATED PAYMENT RAIL`**.

---

## 13. Supported Corridors

BharatBridge supports 8 bilateral corridors (16 directions total):

| Corridor | Currency Pair | Demo Rate | Payout Rail | Settlement Method |
|---|---|---|---|---|
| **USA ↔ India** 🇺🇸🇮🇳 | USD / INR | ₹84.50 | UPI / IMPS | Polkadot Asset Hub (USDT/C) |
| **UK ↔ India** 🇬🇧🇮🇳 | GBP / INR | ₹107.20 | UPI / NEFT | Polkadot XCM Parachain |
| **Europe ↔ India** 🇪🇺🇮🇳 | EUR / INR | ₹91.80 | UPI / IMPS | SEPA Simulation / XCM |
| **UAE ↔ India** 🇦🇪🇮🇳 | AED / INR | ₹23.01 | UPI Direct | Polkadot Asset Hub |
| **Singapore ↔ India** 🇸🇬🇮🇳 | SGD / INR | ₹62.80 | PayNow / UPI | XCM Precompile |
| **Canada ↔ India** 🇨🇦🇮🇳 | CAD / INR | ₹61.50 | IMPS / RTGS | Polkadot Asset Hub |
| **Australia ↔ India** 🇦🇺🇮🇳 | AUD / INR | ₹54.90 | UPI Payout | Polkadot Asset Hub |
| **Japan ↔ India** 🇯🇵🇮🇳 | JPY / INR | ₹0.56 | IMPS / UPI | Astar Parachain XCM (2006) |

---

## 14. Tech Stack

- **Smart Contracts**: Solidity 0.8.24, OpenZeppelin Contracts v5, Hardhat, Hardhat Toolbox
- **Web3 Integration**: ethers.js v6, MetaMask / EVM browser providers
- **Frontend Framework**: Next.js 14 (App Router), React 18, TypeScript 5
- **Styling**: Vanilla CSS Design System with financial tokens
- **Target Networks**: Polkadot Asset Hub, Westend Asset Hub (Testnet), Hardhat Localhost

---

## 15. Smart Contracts

| File | Description |
|---|---|
| [`contracts/BharatBridge.sol`](contracts/BharatBridge.sol) | Core remittance engine — handles token escrows, fee collection, XCM dispatch, and on-chain remittance records |
| [`contracts/FXOracle.sol`](contracts/FXOracle.sol) | Foreign exchange rate oracle with 18-decimal precision and bilateral pair lookups |
| [`contracts/MockStablecoin.sol`](contracts/MockStablecoin.sol) | Testnet ERC-20 stablecoin (USDT / USDC) with public `faucet()` |
| [`contracts/interfaces/IXcmPrecompile.sol`](contracts/interfaces/IXcmPrecompile.sol) | Polkadot Asset Hub XCM precompile interface (`0x...0803`) |
| [`contracts/Remyra.sol`](contracts/Remyra.sol) | Backward-compatibility wrapper inheriting from `BharatBridge` |

---

## 16. Primary Hackathon Demo Walkthrough

The platform includes a 1-click demonstration of the primary corridor:

1. **Navigate to Send Money**: Click **"Send Money"** in the top navigation or click **"⚡ 1-Click Primary Demo ($1,000 USD)"**.
2. **Pre-Filled Inputs**:
   - Direction: **USA → India (Inward)**
   - Source: **$1,000.00 USD**
   - Corridor: **USA ↔ India**
   - Recipient: **Priya Sharma** (`priya.sharma@okaxis`, State Bank of India)
3. **Step 1 — FX Calculation**:
   - Rate: ₹84.50 / USD
   - Fee: $3.00 (0.30%)
   - Recipient Amount: **₹84,246.50 INR**
4. **Step 2 — Risk & Compliance Verification**:
   - Rule-based risk evaluated: **LOW (Score: 5/100, PASS)**
   - Simulated compliance checks: **PASSED** (Sanctions clear, authorized corridor, below $10,000 AML cap)
5. **Step 3 — Review**: Senders review transparent breakdown and confirm.
6. **Step 4 — 9-Stage Execution**: Watch live progression through all 9 stages to instant simulated UPI payout.
7. **Step 5 — Transaction Details**: View full receipt, timeline, and simulated rail metadata under `/transactions/[id]`.

---

## 17. Installation & Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1. Clone & Install Dependencies
```bash
# Install root contract dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Compile & Test Smart Contracts
```bash
npm run compile
npm run test
```

### 3. Deploy Contracts Locally
```bash
# Terminal 1 — Start local Hardhat EVM node
npx hardhat node

# Terminal 2 — Deploy BharatBridge contracts
npm run deploy:local
```

### 4. Run Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 18. Environment Variables

Create a `.env` file at the root:
```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
WESTEND_RPC_URL=https://westend-asset-hub-eth-rpc.polkadot.io
POLKADOT_HUB_RPC_URL=https://polkadot-asset-hub-eth-rpc.polkadot.io
```

---

## 19. Testing

BharatBridge includes automated contract tests covering oracle conversions, 0.30% fee deductions, liquidity management, and remittance state transitions:

```bash
npm run test
```

Test results:
```
  BharatBridge Smart Contracts
    FXOracle
      √ should return the configured USD -> INR rate (84.50)
      √ should calculate correct fee and conversion for $1,000 USD to INR
      √ should support GBP, EUR, AED, SGD, CAD, AUD, and JPY corridors
    BharatBridge Remittance
      √ should execute same-chain remittance successfully with sub-1% fee
      √ should support liquidity provisioning

  5 passing
```

---

## 20. Demo / Testnet Limitations

- **Demo FX Rates**: Rates are based on configured demo quotes (e.g. ₹84.50 / USD).
- **Simulated Compliance**: Sanctions watchlist and AML checks are deterministic simulations designed to demonstrate regulatory logic.
- **Simulated Payout Rails**: Domestic bank transfers and UPI credits are simulated via `MockPaymentRailAdapter`.
- **Testnet Tokens**: Stablecoins used on testnet are minted via the built-in testnet faucet.

---

## 21. Real vs. Simulated Transparency Matrix

| Component | Status | Details |
|---|---|---|
| **Smart Contracts** | **REAL** | Compiled Solidity 0.8.24 contracts with reentrancy protection and ownership controls |
| **FX Rate Oracle** | **DEMO / CONFIGURABLE** | Configured demo rates for 8 corridors with 18-decimal precision |
| **Risk Engine** | **REAL LOGIC** | Fully functional deterministic rule engine evaluating amounts, velocity, and sanctions lists |
| **Compliance Layer** | **SIMULATED** | Demonstrates AML travel rule thresholds ($10k cap) and OFAC screening |
| **Blockchain Settlement** | **REAL / TESTNET** | Deploys to Polkadot Asset Hub testnet and Hardhat localhost EVM |
| **Cross-Chain XCM** | **SIMULATED / TESTNET** | Integrates with `IXcmPrecompile` (0x...0803); falls back to simulation when off-chain |
| **Domestic Payout Rails** | **SIMULATED** | Realistically simulates instant UPI / IMPS domestic credit to beneficiary accounts |

---

## 22. Future Roadmap

1. **Live Banking Partner Integration**: Link with authorized RBI AD-Category 1 banking partners for live inward IMPS/NEFT rail execution.
2. **Account Aggregator (AA) Integration**: Connect with India's Account Aggregator framework for instant KYC and bank account verification.
3. **PVM Rust Library Compilation**: Transition `FXOracle` from Solidity to a high-speed Rust library compiled to RISC-V for Polkadot PVM.
4. **Polkadot Mainnet Production Deployment**: Launch live liquidity pools for USDT and USDC on Polkadot Asset Hub mainnet.

---

## License

MIT License — Copyright (c) 2026 BharatBridge Contributors.
