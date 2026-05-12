import { useCallback, useRef, useEffect, useState } from "react";
import {
  TransactionRowState,
  Transaction,
} from "@/features/transactions/types";
import { mockTransactions } from "@/features/transactions/data/mockTransactions";

function initRows(transactions: Transaction[]): TransactionRowState[] {
  return transactions.map((t) => ({
    transaction: t,
    selected: false,
    retryStatus: "idle",
    invoiceStatus: "idle",
    displayStatus: t.status,
  }));
}

export function useTransactionRows() {
  const [rows, setRows] = useState<TransactionRowState[]>(() =>
    initRows(mockTransactions)
  );

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

  return { rows, setRows, rowsRef, updateRow };
}
