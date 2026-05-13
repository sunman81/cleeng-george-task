import {
  TransactionRowState,
  TransactionStats,
} from "@/features/transactions/types";

export function isSelectableRow(row: TransactionRowState): boolean {
  return row.displayStatus === "Failed" && row.retryStatus !== "retrying";
}

export function computeTransactionStats(
  rows: TransactionRowState[]
): TransactionStats {
  let successCount = 0;
  let failedCount = 0;
  let pendingCount = 0;
  let totalSpent = 0;

  for (const row of rows) {
    switch (row.displayStatus) {
      case "Success":
        successCount++;
        totalSpent += row.transaction.amount;
        break;
      case "Failed":
        failedCount++;
        break;
      case "Pending":
        pendingCount++;
        break;
    }
  }

  return {
    total: rows.length,
    successCount,
    failedCount,
    pendingCount,
    totalSpent,
  };
}
