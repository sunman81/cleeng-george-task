import { useCallback, useMemo, Dispatch, SetStateAction } from "react";
import { TransactionRowState } from "@/features/transactions/types";
import { isSelectableRow } from "@/features/transactions/utils/transactionUtils";

export function useTransactionSelection(
  rows: TransactionRowState[],
  setRows: Dispatch<SetStateAction<TransactionRowState[]>>
) {
  const selectableFailedRows = useMemo(
    () => rows.filter(isSelectableRow),
    [rows]
  );

  const selectedCount = useMemo(
    () => rows.reduce((n, r) => n + (r.selected ? 1 : 0), 0),
    [rows]
  );

  const allFailedSelected = useMemo(
    () =>
      selectableFailedRows.length > 0 &&
      selectableFailedRows.every((r) => r.selected),
    [selectableFailedRows]
  );

  const toggleSelect = useCallback(
    (id: string) => {
      setRows((prev) =>
        prev.map((r) =>
          r.transaction.id === id && isSelectableRow(r)
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
        isSelectableRow(r) ? { ...r, selected: shouldSelect } : r
      )
    );
  }, [allFailedSelected, setRows]);

  return {
    selectedCount,
    selectableFailedCount: selectableFailedRows.length,
    allFailedSelected,
    toggleSelect,
    toggleSelectAll,
  };
}
