import { useMemo } from "react";
import { TransactionRowState } from "@/features/transactions/types";

export interface TransactionStats {
  total: number;
  successCount: number;
  failedCount: number;
  pendingCount: number;
  totalSpent: number;
}

export function useTransactionStats(
  rows: TransactionRowState[]
): TransactionStats {
  return useMemo(() => {
    const successful = rows.filter((r) => r.displayStatus === "Success");

    return {
      total: rows.length,
      successCount: successful.length,
      failedCount: rows.filter((r) => r.displayStatus === "Failed").length,
      pendingCount: rows.filter((r) => r.displayStatus === "Pending").length,
      totalSpent: successful.reduce((sum, r) => sum + r.transaction.amount, 0),
    };
  }, [rows]);
}
