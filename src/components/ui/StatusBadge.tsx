import { TransactionStatus } from "@/types/transaction";

type StatusConfig = {
  label: string;
  className: string;
};

const statusConfig: Record<TransactionStatus, StatusConfig> = {
  Success: {
    label: "Success",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  Failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 ring-red-600/20",
  },
  Pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}
