"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Transaction, TransactionRowState } from "@/types/transaction";
import { mockTransactions } from "@/data/mockTransactions";
import { useToast } from "@/components/ui/Toast";

function initRows(transactions: Transaction[]): TransactionRowState[] {
  return transactions.map((t) => ({
    transaction: t,
    selected: false,
    retryStatus: "idle",
    invoiceStatus: "idle",
    displayStatus: t.status,
  }));
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount
  );
}

export function useTransactionDashboard() {
  const { addToast } = useToast();
  const [rows, setRows] = useState<TransactionRowState[]>(() =>
    initRows(mockTransactions)
  );

  // Keep a ref so async callbacks always read current state without stale closures
  const rowsRef = useRef(rows);
  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  const updateRow = useCallback(
    (id: string, patch: Partial<TransactionRowState>) => {
      setRows((prev) =>
        prev.map((r) => (r.transaction.id === id ? { ...r, ...patch } : r))
      );
    },
    []
  );

  // --- Selection ---

  const toggleSelect = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.transaction.id === id &&
        r.displayStatus === "Failed" &&
        r.retryStatus !== "retrying"
          ? { ...r, selected: !r.selected }
          : r
      )
    );
  }, []);

  const selectableFailedRows = useMemo(
    () =>
      rows.filter(
        (r) => r.displayStatus === "Failed" && r.retryStatus !== "retrying"
      ),
    [rows]
  );

  const selectedRows = useMemo(() => rows.filter((r) => r.selected), [rows]);

  const allFailedSelected =
    selectableFailedRows.length > 0 &&
    selectableFailedRows.every((r) => r.selected);

  const toggleSelectAll = useCallback(() => {
    const shouldSelect = !allFailedSelected;
    setRows((prev) =>
      prev.map((r) =>
        r.displayStatus === "Failed" && r.retryStatus !== "retrying"
          ? { ...r, selected: shouldSelect }
          : r
      )
    );
  }, [allFailedSelected]);

  // --- Retry ---

  const retrySelected = useCallback(async () => {
    const toRetry = rowsRef.current.filter((r) => r.selected);
    if (!toRetry.length) return;

    // Mark all as retrying and deselect atomically
    setRows((prev) =>
      prev.map((r) =>
        r.selected ? { ...r, retryStatus: "retrying", selected: false } : r
      )
    );

    addToast(
      `Retrying ${toRetry.length} payment${toRetry.length > 1 ? "s" : ""}…`,
      "info"
    );

    // Fire all retries concurrently with independent random delays
    await Promise.allSettled(
      toRetry.map(async (row) => {
        const delay = 1000 + Math.random() * 3000; // 1–4 seconds
        await new Promise((resolve) => setTimeout(resolve, delay));

        const succeeded = Math.random() > 0.2; // 80% success rate
        updateRow(row.transaction.id, {
          retryStatus: succeeded ? "retried_success" : "retried_failed",
          displayStatus: succeeded ? "Success" : "Failed",
        });
      })
    );
  }, [addToast, updateRow]);

  // --- Invoice Download ---

  const downloadInvoice = useCallback(
    async (id: string) => {
      updateRow(id, { invoiceStatus: "generating" });

      // Capture row data before the async delay
      const row = rowsRef.current.find((r) => r.transaction.id === id);

      // Simulate 2-second PDF generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (row) {
        const { transaction, displayStatus } = row;
        const lines = [
          `INVOICE`,
          `=`.repeat(40),
          `Transaction ID : ${transaction.id}`,
          `Description    : ${transaction.description}`,
          `Date           : ${new Date(transaction.date).toLocaleString()}`,
          `Amount         : ${formatCurrency(
            transaction.amount,
            transaction.currency
          )}`,
          `Status         : ${displayStatus}`,
          `=`.repeat(40),
          `Thank you for using our service.`,
        ].join("\n");

        const blob = new Blob([lines], { type: "text/plain" });
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

      updateRow(id, { invoiceStatus: "ready" });
    },
    [addToast, updateRow]
  );

  // --- Stats ---

  const stats = useMemo(() => {
    const successful = rows.filter((r) => r.displayStatus === "Success");
    const failed = rows.filter((r) => r.displayStatus === "Failed");
    const pending = rows.filter((r) => r.displayStatus === "Pending");
    const totalSpent = successful.reduce(
      (sum, r) => sum + r.transaction.amount,
      0
    );

    return {
      total: rows.length,
      successCount: successful.length,
      failedCount: failed.length,
      pendingCount: pending.length,
      totalSpent,
    };
  }, [rows]);

  return {
    rows,
    stats,
    selectedCount: selectedRows.length,
    selectableFailedCount: selectableFailedRows.length,
    allFailedSelected,
    toggleSelect,
    toggleSelectAll,
    retrySelected,
    downloadInvoice,
  };
}
