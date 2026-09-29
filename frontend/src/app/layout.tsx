import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "BharatBridge 🇮🇳 — India-First Cross-Border Remittance & Settlement Platform",
    description: "India to the World. The Bridge for Global Money. Sub-1% fees, transparent FX conversion, rule-based risk engine, and Polkadot blockchain settlement.",
    icons: {
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🇮🇳</text></svg>",
    },
};

const BHARAT_STYLES = `
/* ==========================================================================
   BharatBridge World-Class FinTech Design System
   ========================================================================== */

:root {
  --primary: #0b1120;
  --primary-light: #1e293b;
  --primary-dark: #020617;
  
  --saffron: #f97316;
  --saffron-light: #fff7ed;
  --saffron-border: #fed7aa;
  
  --emerald: #10b981;
  --emerald-light: #ecfdf5;
  --emerald-border: #a7f3d0;
  
  --blue: #2563eb;
  --blue-light: #eff6ff;
  --blue-border: #bfdbfe;
  
  --amber: #f59e0b;
  --amber-light: #fffbeb;
  
  --rose: #ef4444;
  --rose-light: #fef2f2;
  
  --bg-page: #f8fafc;
  --bg-card: #ffffff;
  --bg-subtle: #f1f5f9;
  
  --text-main: #0f172a;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg-page);
  color: var(--text-main);
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

/* Layout Containers */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 24px 72px;
  width: 100%;
}

.page-title {
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-subtitle {
  font-size: 0.98rem;
  color: var(--text-muted);
  margin-top: 4px;
}

/* FinTech Cards */
.fin-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  padding: 28px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fin-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
}

/* Navigation Header */
.bb-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}

.bb-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.bb-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bb-logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.bb-badge {
  background: var(--saffron-light);
  color: #9a3412;
  border: 1px solid var(--saffron-border);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.bb-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bb-nav-link {
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.bb-nav-link:hover {
  color: var(--primary);
  background: var(--bg-subtle);
}

.bb-nav-active {
  color: var(--primary);
  background: #f1f5f9;
  font-weight: 700;
}

.bb-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bb-demo-pill {
  background: #f8fafc;
  border: 1px solid var(--border-strong);
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.bb-demo-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--emerald);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 2px 4px rgba(11, 17, 32, 0.15);
}

.btn-primary:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(11, 17, 32, 0.2);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #ffffff;
  color: var(--primary);
  border: 1.5px solid var(--border-strong);
}

.btn-secondary:hover {
  background: var(--bg-subtle);
  border-color: var(--primary);
}

.btn-sm {
  padding: 7px 14px;
  font-size: 0.82rem;
  border-radius: 8px;
}

.btn-lg {
  padding: 14px 28px;
  font-size: 1.05rem;
  border-radius: 12px;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.badge-low, .badge-completed {
  background: var(--emerald-light);
  color: #065f46;
  border: 1px solid var(--emerald-border);
}

.badge-medium {
  background: var(--amber-light);
  color: #92400e;
  border: 1px solid #fde68a;
}

.badge-high {
  background: var(--rose-light);
  color: #991b1b;
  border: 1px solid #fecaca;
}

.badge-demo {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.badge-simulated {
  background: var(--blue-light);
  color: #1e40af;
  border: 1px solid var(--blue-border);
}

.badge-saffron {
  background: var(--saffron-light);
  color: #9a3412;
  border: 1px solid var(--saffron-border);
}

/* Input Fields */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 20px;
}

.input-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  background: #ffffff;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 0.95rem;
  color: var(--text-main);
  outline: none;
  transition: all 0.15s ease;
}

.input-field:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

select.input-field {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

/* Monospace Numbers */
.num-mono {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

/* Tables */
.table-wrap {
  width: 100%;
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #ffffff;
  box-shadow: var(--shadow-sm);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;
}

.data-table th {
  background: #f8fafc;
  padding: 14px 18px;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
}

.data-table td {
  padding: 16px 18px;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  vertical-align: middle;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover td {
  background: #f8fafc;
}

/* Grids */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 900px) {
  .bb-badge { display: none; }
  .bb-header-inner { flex-wrap: wrap; }
  .bb-nav {
    order: 3;
    width: 100%;
    overflow-x: auto;
    padding-top: 10px;
    border-top: 1px solid var(--border);
  }
  .grid-2, .grid-3, .grid-4 {
    grid-template-columns: 1fr;
  }
  .page-container {
    padding: 20px 16px;
  }
}
`;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Embed Core BharatBridge FinTech Stylesheet Directly for 100% Reliability */}
                <style dangerouslySetInnerHTML={{ __html: BHARAT_STYLES }} />
            </head>
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
