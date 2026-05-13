export type TransactionStatus = "Success" | "Failed" | "Pending";

export type RetryStatus =
  | "idle"
  | "retrying"
  | "retried_success"
  | "retried_failed";

export type InvoiceStatus = "idle" | "generating" | "ready";

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  status: TransactionStatus;
}

export interface TransactionRowState {
  transaction: Transaction;
  selected: boolean;
  retryStatus: RetryStatus;
  invoiceStatus: InvoiceStatus;
  displayStatus: TransactionStatus;
}

export interface TransactionStats {
  total: number;
  successCount: number;
  failedCount: number;
  pendingCount: number;
  totalSpent: number;
}
