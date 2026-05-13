"use client";

import { useTransactionDashboard } from "@/features/transactions/hooks/useTransactionDashboard";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/formatters";

export function TransactionsDashboard() {
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
    <>
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
          value={formatCurrency(stats.totalSpent, "USD")} // assumes single USD currency
          valueClassName="text-blue-600"
        />
      </div>

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
    </>
  );
}
