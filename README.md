# Cleeng Transactions Dashboard

A Transactions Management Dashboard built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

Allows subscribers to review payment history, download invoices, and retry failed payments in bulk.

---

## Features

- 📋 Transaction history with ID, description, date, amount and status
- 📄 Per-row invoice download with simulated PDF generation
- 🔁 Batch retry of failed payments with concurrent, independent row updates
- 🔔 Toast notifications for actions
- 📊 Summary stats (total, successful, failed, total spent)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm, yarn, pnpm, or bun

### Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build && npm start
# or
pnpm build && pnpm start
```

---

## Project Structure

```
src/
├── app/                        # Next.js App Router (layout, page)
├── components/
│   ├── layout/                 # Navbar
│   └── ui/                     # Shared UI: StatCard, StatusBadge, Spinner, Toast, icons
├── features/
│   └── transactions/
│       ├── components/         # TransactionTable, TransactionRow, InvoiceButton, TransactionsDashboard
│       ├── data/               # Mock transaction data
│       ├── hooks/              # useTransactionDashboard and focused sub-hooks
│       ├── types/              # TypeScript types and interfaces
│       └── utils/              # Pure helper functions
└── lib/                        # Shared utilities (formatters, utils)
```

---

## Tech Stack

| Tool                    | Purpose     |
| ----------------------- | ----------- |
| Next.js 15 (App Router) | Framework   |
| TypeScript              | Type safety |
| Tailwind CSS v4         | Styling     |
| React 19                | UI          |
