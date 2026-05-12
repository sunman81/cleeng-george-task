import { useCallback, useMemo, Dispatch, SetStateAction } from "react";
import { TransactionRowState } from "@/features/transactions/types";

export function useTransactionSelection(
  rows: TransactionRowState[],
  setRows: Dispatch<SetStateAction<TransactionRowState[]>>
) {
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

  const toggleSelect = useCallback(
    (id: string) => {
      setRows((prev) =>
        prev.map((r) =>
          r.transaction.id === id &&
          r.displayStatus === "Failed" &&
          r.retryStatus !== "retrying"
            ? { ...r, selected: !r.selected }
            : r
        )
      );
    },
    [setRows]
  );

  const toggleSelectAll = useCallback(() => {
    const shouldSelect = !allFailedSelected;
    setRows((prev) =>
      prev.map((r) =>
        r.displayStatus === "Failed" && r.retryStatus !== "retrying"
          ? { ...r, selected: shouldSelect }
          : r
      )
    );
  }, [allFailedSelected, setRows]);

  return {
    selectedCount: selectedRows.length,
    selectableFailedCount: selectableFailedRows.length,
    allFailedSelected,
    toggleSelect,
    toggleSelectAll,
  };
}
