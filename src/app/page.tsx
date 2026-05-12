"use client";

import { useTransactionDashboard } from "@/features/transactions/hooks/useTransactionDashboard";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/formatters";

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
      <Navbar />

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
            value={formatCurrency(stats.totalSpent, "USD")}
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
