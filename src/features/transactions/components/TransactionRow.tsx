import { TransactionRowState } from "@/features/transactions/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { InvoiceButton } from "@/features/transactions/components/InvoiceButton";
import { formatDate, formatCurrency } from "@/lib/formatters";

interface TransactionRowProps {
  row: TransactionRowState;
  onToggleSelect: (id: string) => void;
  onDownloadInvoice: (id: string) => void;
}

export function TransactionRow({
  row,
  onToggleSelect,
  onDownloadInvoice,
}: TransactionRowProps) {
  const { transaction, selected, retryStatus, invoiceStatus, displayStatus } =
    row;

  const isRetrying = retryStatus === "retrying";
  const isFailed = displayStatus === "Failed";
  const isSelectable = isFailed && !isRetrying;

  return (
    <tr
      className={`transition-colors ${
        selected ? "bg-red-50/60" : "hover:bg-gray-50/60"
      } ${isRetrying ? "opacity-70" : ""}`}
    >
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

      <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
        {transaction.id}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
        {transaction.description}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {formatDate(transaction.date)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-800">
        {formatCurrency(transaction.amount, transaction.currency)}
      </td>

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

      <td className="px-6 py-4 text-center">
        <InvoiceButton
          status={invoiceStatus}
          onClick={() => onDownloadInvoice(transaction.id)}
        />
      </td>
    </tr>
  );
}
