"use client";

import { TransactionRowState } from "@/features/transactions/types";
import { Spinner } from "@/components/ui/Spinner";
import { TransactionRow } from "@/features/transactions/components/TransactionRow";

interface TransactionTableProps {
  rows: TransactionRowState[];
  selectedCount: number;
  selectableFailedCount: number;
  allFailedSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onRetrySelected: () => void;
  onDownloadInvoice: (id: string) => void;
}

export function TransactionTable({
  rows,
  selectedCount,
  selectableFailedCount,
  allFailedSelected,
  onToggleSelect,
  onToggleSelectAll,
  onRetrySelected,
  onDownloadInvoice,
}: TransactionTableProps) {
  const hasRetrying = rows.some((r) => r.retryStatus === "retrying");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {selectableFailedCount > 0 && (
        <div className="flex items-center justify-between gap-4 px-6 py-3 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-700 font-medium">
            {selectedCount > 0
              ? `${selectedCount} failed payment${
                  selectedCount > 1 ? "s" : ""
                } selected`
              : `${selectableFailedCount} failed payment${
                  selectableFailedCount > 1 ? "s" : ""
                } — select rows to retry`}
          </p>
          <button
            onClick={onRetrySelected}
            disabled={selectedCount === 0 || hasRetrying}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold
              bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed
              cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {hasRetrying && <Spinner className="h-4 w-4" />}
            Retry Selected ({selectedCount})
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="w-12 px-6 py-3">
                {selectableFailedCount > 0 && (
                  <input
                    type="checkbox"
                    aria-label="Select all failed transactions"
                    checked={allFailedSelected}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-left">Transaction ID</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Date &amp; Time</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-16 text-center text-gray-400 text-sm"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <TransactionRow
                  key={row.transaction.id}
                  row={row}
                  onToggleSelect={onToggleSelect}
                  onDownloadInvoice={onDownloadInvoice}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
