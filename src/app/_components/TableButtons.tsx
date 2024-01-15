import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { trpc } from "./providers";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import clsx from "clsx";
import { RowSelectionState, Table } from "@tanstack/react-table";
import { createPortal } from "react-dom";

export default function TableButtons({
  tableName,
  setRowSelection,
  rowSelection,
  table,
}: {
  tableName: string;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  rowSelection: RowSelectionState;
  table: Table<Record<string, unknown>>;
}) {
  const [showInsertRow, setShowInsertRow] = useState(false);
  const [outPortal, setOutPortal] = useState<HTMLElement | null>(null);
  const [isT, startT] = useTransition();
  const router = useRouter();
  const deleteRows = trpc.tables.rows.delete.useMutation({
    onSuccess: (res) => {
      toast.success(`Deleted ${res} rows`);
      setRowSelection({});
      startT(() => router.refresh());
    },
  });
  const selectedCount = Object.keys(rowSelection).length;
  useEffect(() => {
    setOutPortal(document.getElementById("Buttons"));
  }, []);
  return (
    outPortal &&
    createPortal(
      <div className="relative flex w-full justify-end gap-2 p-2 text-white">
        <div className="absolute bottom-0 h-0.5 w-full " />
        {selectedCount > 0 && (
          <button
            onClick={() => {
              deleteRows.mutate({
                table: tableName,
                rows: table
                  .getSelectedRowModel()
                  .flatRows.map((r) => r.original),
              });
            }}
            disabled={isT || deleteRows.isLoading}
            title="Delete"
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            {deleteRows.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            )}
            Delete {selectedCount} record{selectedCount > 1 && "s"}
          </button>
        )}
        <button
          disabled={isT}
          onClick={() => {
            setShowInsertRow((s) => !s);
          }}
          className="rounded-md border border-gray-600 px-2.5 py-2 hover:bg-neutral-800"
        >
          <Plus
            className={clsx(
              "h-5 w-5 transition-transform",
              showInsertRow && "rotate-45",
            )}
          />
        </button>
        <button
          disabled={isT}
          onClick={() => {
            startT(() => router.refresh());
          }}
          className="rounded-md border border-gray-600 px-2.5 py-3 hover:bg-neutral-800"
        >
          <RefreshCw className={clsx("h-4 w-4", isT && "animate-spin")} />
        </button>
      </div>,
      outPortal,
    )
  );
}
