import { useMemo } from "react";
import {
  TransactionRowState,
  TransactionStats,
} from "@/features/transactions/types";
import { computeTransactionStats } from "@/features/transactions/utils/transactionUtils";

export function useTransactionStats(
  rows: TransactionRowState[]
): TransactionStats {
  return useMemo(() => computeTransactionStats(rows), [rows]);
}
