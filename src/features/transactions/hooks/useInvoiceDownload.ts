import { useCallback, RefObject } from "react";
import { TransactionRowState } from "@/features/transactions/types";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/formatters";

const INVOICE_GENERATION_DELAY_MS = 2000;

export function useInvoiceDownload(
  rowsRef: RefObject<TransactionRowState[]>,
  updateRow: (id: string, patch: Partial<TransactionRowState>) => void
) {
  const { addToast } = useToast();

  const downloadInvoice = useCallback(
    async (id: string) => {
      updateRow(id, { invoiceStatus: "generating" });

      const row = rowsRef.current.find((r) => r.transaction.id === id);

      await new Promise((resolve) =>
        setTimeout(resolve, INVOICE_GENERATION_DELAY_MS)
      );

      try {
        if (row) {
          const { transaction, displayStatus } = row;
          const content = [
            "INVOICE",
            "=".repeat(40),
            `Transaction ID : ${transaction.id}`,
            `Description    : ${transaction.description}`,
            `Date           : ${new Date(transaction.date).toLocaleString()}`,
            `Amount         : ${formatCurrency(
              transaction.amount,
              transaction.currency
            )}`,
            `Status         : ${displayStatus}`,
            "=".repeat(40),
            "Thank you for using our service.",
          ].join("\n");

          const blob = new Blob([content], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = `invoice-${transaction.id}.txt`;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(url);

          addToast(
            `Invoice for ${transaction.id} downloaded successfully.`,
            "success"
          );
        }
      } finally {
        updateRow(id, { invoiceStatus: "ready" });
      }
    },
    [rowsRef, updateRow, addToast]
  );

  return { downloadInvoice };
}
