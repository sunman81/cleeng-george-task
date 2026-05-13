import { useCallback, Dispatch, SetStateAction, RefObject } from "react";
import { TransactionRowState } from "@/features/transactions/types";
import { useToast } from "@/components/ui/Toast";
import { randomBetween } from "@/lib/utils";

const RETRY_MIN_DELAY_MS = 1000;
const RETRY_MAX_DELAY_MS = 4000;
const RETRY_SUCCESS_RATE = 0.8;

export function useTransactionRetry(
  setRows: Dispatch<SetStateAction<TransactionRowState[]>>,
  rowsRef: RefObject<TransactionRowState[]>,
  updateRow: (id: string, patch: Partial<TransactionRowState>) => void
) {
  const { addToast } = useToast();

  const retrySelected = useCallback(async () => {
    const toRetry = rowsRef.current.filter((r) => r.selected);
    if (!toRetry.length) return;

    setRows((prev) =>
      prev.map((r) =>
        r.selected ? { ...r, retryStatus: "retrying", selected: false } : r
      )
    );

    addToast(
      `Retrying ${toRetry.length} payment${toRetry.length > 1 ? "s" : ""}…`,
      "info"
    );

    await Promise.allSettled(
      toRetry.map(async (row) => {
        const delay = randomBetween(RETRY_MIN_DELAY_MS, RETRY_MAX_DELAY_MS);
        await new Promise((resolve) => setTimeout(resolve, delay));

        const succeeded = Math.random() < RETRY_SUCCESS_RATE;
        updateRow(row.transaction.id, {
          retryStatus: succeeded ? "retried_success" : "retried_failed",
          displayStatus: succeeded ? "Success" : "Failed",
        });
      })
    );
  }, [rowsRef, setRows, updateRow, addToast]);

  return { retrySelected };
}
