# BharatBridge 🇮🇳 System Architecture

> India to the World. The Bridge for Global Money.
> India-First Cross-Border Remittance & Settlement Platform on Polkadot PVM.

---

## 1. High-Level Architecture Overview

BharatBridge bridges international currency senders and recipients in India (and vice versa) through a high-speed, sub-1% fee remittance pipeline built on Polkadot Asset Hub, smart contracts, and domestic instant payout rails (UPI/IMPS).

```
[ Sender (Web / Mobile) ]
           │
           ▼
[ Frontend (Next.js 14 / React 18 / Tailwind) ]
           │  (Ethers.js v6 / Wallet Auth)
           ▼
[ Backend API Gateway (Node.js / TypeScript) ]
    ├─► [ FX Engine & Oracle Services ] (Guaranteed Rates & 0.30% Fee Calculation)
    ├─► [ Deterministic Risk & Fraud Engine ] (Velocity, Sanction Lists, Velocity Limits)
    ├─► [ Compliance & Sanctions Engine ] (OFAC/FATF Screening & FATF Travel Rule)
    └─► [ Payment Rail Adapter Layer ] (UPI Instant Rail & IMPS / NEFT Settlement)
           │
           ▼
[ Smart Contract Layer (Solidity 0.8.24 / OpenZeppelin v5) ]
    ├─► Remittance.sol / BharatBridge.sol (Lifecycle Orchestration & Liquidity)
    ├─► Settlement.sol (Stablecoin Settlement & Multi-Token Support)
    ├─► FXOracle.sol (Multi-Currency India Corridors Rate Oracle)
    ├─► MockStablecoin.sol (Testnet Development & Faucet)
    └─► IXcmPrecompile.sol (Polkadot Parachain Asset Routing via 0x...0803)
           │
           ▼
[ Blockchain Settlement ]
    ├─► Polkadot Asset Hub (Native USDT / USDC)
    └─► Westend Asset Hub (Testnet)
```

---

## 2. Directory Layout & Module Breakdown

| Directory | Responsibilities | Technologies |
| :--- | :--- | :--- |
| `frontend/` | Consumer FinTech UI, Wallet integration, Remittance forms, Receipts | Next.js 14, React 18, Tailwind CSS, TypeScript |
| `backend/` | Microservice layer, REST APIs, Risk checks, FX calculation, Payout adapters | Node.js, Express / REST API, Ethers.js v6 |
| `contracts/` | On-chain settlement, access control, FX oracle, token transfers | Solidity 0.8.24, Hardhat, OpenZeppelin v5 |
| `blockchain/` | XCM routing helpers, Polkadot client, Asset Hub tokens, precompiles | Ethers.js v6, Substrate / Polkadot RPC |
| `config/` | Centralized network RPCs, supported currencies, environment parameters | TypeScript |
| `docs/` | Architectural specifications, deployment manuals, security disclosures | Markdown |

---

## 3. Financial & FX Engine
- **Flat Fee Model**: 0.30% protocol fee (vs. 5.3% global bank average).
- **Supported India Corridors**:
  - USD ↔ INR (`84.50`)
  - GBP ↔ INR (`107.20`)
  - EUR ↔ INR (`91.80`)
  - AED ↔ INR (`23.01`)
  - SGD ↔ INR (`62.80`)
  - CAD ↔ INR (`61.50`)
  - AUD ↔ INR (`54.90`)
  - JPY ↔ INR (`0.56`)

---

## 4. Deterministic Risk & Compliance
- **Rule-Based Fraud Detection**: Velocity monitoring, daily volume caps ($25,000 USD), monthly limits ($100,000 USD).
- **Sanctions & Screening**: OFAC / FATF simulated sanctions database screening.
- **FATF Travel Rule**: Automatic originator & beneficiary identification payloads attached to transfers exceeding $1,000 USD.

---

## 5. Security & Smart Contract Architecture
- **OpenZeppelin v5**: Inherits `Ownable`, `ReentrancyGuard`, `SafeERC20`.
- **Validation**: Zero address sanitization, rate sanity limits, non-reentrant state updates.
- **Wallet Authentication**: EIP-4361 / SIWE signature challenge-response authentication.
