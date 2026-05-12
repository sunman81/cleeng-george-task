"use client";

import { useTransactionDashboard } from "@/hooks/useTransactionDashboard";
import { TransactionTable } from "@/components/transactions/TransactionTable";

export default function TransactionsPage() {
  const {
    rows,
    stats,
    selectedCount,
    selectableFailedCount,
    allFailedSelected,
    toggleSelect,
    toggleSelectAll,
    retrySelected,
    downloadInvoice,
  } = useTransactionDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">Cleeng</span>
          </div>
          <span className="text-sm text-gray-500">Subscriber Portal</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review your payment history, download invoices, and retry failed
            transactions.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Transactions" value={String(stats.total)} />
          <StatCard
            label="Successful"
            value={String(stats.successCount)}
            valueClassName="text-emerald-600"
          />
          <StatCard
            label="Failed"
            value={String(stats.failedCount)}
            valueClassName="text-red-600"
          />
          <StatCard
            label="Total Spent"
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(stats.totalSpent)}
            valueClassName="text-blue-600"
          />
        </div>

        {/* Transaction table */}
        <TransactionTable
          rows={rows}
          selectedCount={selectedCount}
          selectableFailedCount={selectableFailedCount}
          allFailedSelected={allFailedSelected}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onRetrySelected={retrySelected}
          onDownloadInvoice={downloadInvoice}
        />
      </main>
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  valueClassName = "text-gray-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}
