"use client";

import { useTransactionRows } from "@/features/transactions/hooks/useTransactionRows";
import { useTransactionSelection } from "@/features/transactions/hooks/useTransactionSelection";
import { useTransactionRetry } from "@/features/transactions/hooks/useTransactionRetry";
import { useInvoiceDownload } from "@/features/transactions/hooks/useInvoiceDownload";
import { useTransactionStats } from "@/features/transactions/hooks/useTransactionStats";

export function useTransactionDashboard() {
  const { rows, setRows, rowsRef, updateRow } = useTransactionRows();

  const selection = useTransactionSelection(rows, setRows);
  const { retrySelected } = useTransactionRetry(setRows, rowsRef, updateRow);
  const { downloadInvoice } = useInvoiceDownload(rowsRef, updateRow);
  const stats = useTransactionStats(rows);

  return {
    rows,
    stats,
    ...selection,
    retrySelected,
    downloadInvoice,
  };
}

