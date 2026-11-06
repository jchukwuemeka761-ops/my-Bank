# JChukwuemeka's Financials (JF)

A production-grade, highly secure digital banking web application and customer wealth platform.

## Key Features

- **Brand Identity**: Custom deep emerald (`#0B6B4F`), dark emerald (`#084E3A`), and warm gold (`#F2B632`) visual language with the signature JF monogram logo.
- **Dual-Currency Core**: Seamless live conversion between **USD ($)** and **NGN (₦)** across all liquid accounts, investments, and transactions.
- **Double-Entry Ledger Architecture**:
  - Every fund transfer atomically creates corresponding debit and credit ledger journals (`ledger_entries`).
  - Client-generated **idempotency keys** prevent double-spending or duplicate network re-transmissions.
  - Client code **never** directly writes or mutates account balances.
- **Security & Multi-Factor Auth (MFA)**:
  - Mandatory 6-digit OTP verification with 5-minute expiry, 30s resend cooldown, and 5-attempt defensive lockout.
  - User-configurable anti-phishing security phrase displayed on every authentic challenge.
  - Automatic 10-minute inactivity session expiration with countdown warning modal.
- **Comprehensive Public Banking Portal**:
  - 8-Product Mega-Menu (Checking, High-Yield Savings & CDs, Credit Cards, Home Mortgages, Auto Loans, Small Business, Investing, Students).
  - Dynamic loan & mortgage amortization calculator with real-time monthly payment estimations.
  - Branch & fee-free ATM locator with interactive map and filter controls.
  - In-person and virtual appointment booking system.
  - Searchable knowledge base and emergency card fraud hotline.
- **Customer Financial Dashboard**:
  - Net worth aggregation across deposit, debt, and wealth accounts.
  - Real-time spending breakdown and financial health meter.
  - Accounts management with live transaction search, filtering, pagination, CSV exports, and printable e-statements.
  - Money movement hub (internal, P2P, and external ACH transfers with digital receipts).
  - Bill pay center with auto-pay schedulers and payee directory.
  - Full card controls: instant freeze/unfreeze, daily ATM & purchase sliders, travel notices, and PIN change requests.
  - Mobile check deposit with front & back camera simulator and MICR validation.
  - Simulated wealth investing terminal with commission-free paper trade executions.
  - Category budget envelopes and savings milestone goals.
  - End-to-end encrypted concierge messaging.
- **AI Banking Assistant**:
  - Built-in floating chat widget powered by Google Gemini API via server proxy (`/api/ai/chat`).
  - Automatic client-side sanitization: PAN numbers, CVVs, passwords, and SSNs are scrubbed before inference.
- **Compliance & Admin Portal (`/admin`)**:
  - Tier-3 KYC review queue (inspect government IDs and approve/reject with compliance notes).
  - AML transaction monitoring queue with risk scores and FinCEN hold releases.
  - Administrative card and account freeze governance.
  - Live system APY/APR benchmark controls.
  - Immutable append-only audit trail.

---

## Technical Stack

- **Framework**: Angular 21 (Zoneless, OnPush Change Detection, Signals, Standalone Components)
- **Styling**: Tailwind CSS v4 with `@custom-variant dark` support
- **Icons**: Angular Material Icons
- **Backend / SSR**: Express 5 on Node.js
- **AI Integration**: `@google/genai` SDK on Express backend (`/api/ai/chat`)
- **Rules & Persistence**: `firestore.rules` (enforcing per-user isolation, immutable ledgers, and admin-only collections)

---

## Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## Demo Credentials & Fast Role Switching

The application comes pre-loaded with comprehensive seed data:

1. **Customer Account**:
   - **User ID**: `alex.chukwuemeka`
   - **Password**: `DemoPassword2026!`
   - **Demo OTP Passcode**: `729415` (or any generated 6-digit code displayed)
   - **Anti-Phishing Phrase**: `Golden Palm & Emerald Shield`

2. **Compliance Officer / Admin Account**:
   - **User ID**: `admin.compliance`
   - **Password**: `AdminPassword2026!`
   - **Demo OTP Passcode**: `729415`

*Note: You can also click the quick **"Customer"** / **"Admin Portal"** buttons on the yellow top Demo Banner on any page to immediately switch profiles.*
