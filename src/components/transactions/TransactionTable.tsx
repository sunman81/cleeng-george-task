"use client";

import { TransactionRowState } from "@/types/transaction";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";

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

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  );
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
      {/* Bulk-action toolbar */}
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
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {hasRetrying && <Spinner className="h-4 w-4" />}
            Retry Selected ({selectedCount})
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {/* Select-all checkbox column */}
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
            {rows.map((row) => {
              const {
                transaction,
                selected,
                retryStatus,
                invoiceStatus,
                displayStatus,
              } = row;
              const isRetrying = retryStatus === "retrying";
              const isFailed = displayStatus === "Failed";
              const isSelectable = isFailed && retryStatus !== "retrying";

              return (
                <tr
                  key={transaction.id}
                  className={`transition-colors ${
                    selected ? "bg-red-50/60" : "hover:bg-gray-50/60"
                  } ${isRetrying ? "opacity-70" : ""}`}
                >
                  {/* Checkbox / spinner */}
                  <td className="w-12 px-6 py-4">
                    {isRetrying ? (
                      <Spinner className="h-4 w-4 text-red-500" />
                    ) : isSelectable ? (
                      <input
                        type="checkbox"
                        aria-label={`Select ${transaction.id}`}
                        checked={selected}
                        onChange={() => onToggleSelect(transaction.id)}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    ) : null}
                  </td>

                  {/* Transaction ID */}
                  <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                    {transaction.id}
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    {transaction.description}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {formatDate(transaction.date)}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-800">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    {isRetrying ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <Spinner className="h-3.5 w-3.5" />
                        Retrying…
                      </span>
                    ) : (
                      <StatusBadge status={displayStatus} />
                    )}
                  </td>

                  {/* Invoice */}
                  <td className="px-6 py-4 text-center">
                    <InvoiceButton
                      status={invoiceStatus}
                      onClick={() => onDownloadInvoice(transaction.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── InvoiceButton ────────────────────────────────────────────────────────────

import { InvoiceStatus } from "@/types/transaction";

function InvoiceButton({
  status,
  onClick,
}: {
  status: InvoiceStatus;
  onClick: () => void;
}) {
  const isGenerating = status === "generating";

  return (
    <button
      onClick={onClick}
      disabled={isGenerating}
      aria-label="Download invoice"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
        border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300
        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
        transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {isGenerating ? (
        <>
          <Spinner className="h-3.5 w-3.5 text-blue-500" />
          Generating…
        </>
      ) : status === "ready" ? (
        <>
          <DownloadIcon />
          Downloaded
        </>
      ) : (
        <>
          <DownloadIcon />
          Invoice
        </>
      )}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}
