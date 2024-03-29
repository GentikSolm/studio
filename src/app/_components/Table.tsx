"use client";
import {
  ColumnDef,
  RowSelectionState,
  SortingState,
  Table as TableType,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { ChevronsUpDownIcon, SortAsc, SortDesc } from "lucide-react";
import { memo, useMemo, useState } from "react";
import TableButtons from "./TableButtons";

export const Table = ({
  tableName,
  columns,
  data,
  editable,
}: {
  tableName: string;
  columns: string[];
  data: Record<string, unknown>[];
  editable?: boolean;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const cols = useMemo(() => {
    const base = [] as ColumnDef<Record<string, any>>[];
    if (editable) {
      base.push({
        id: "select-col",
        enableResizing: false,
        enableSorting: false,
      });
    }
    base.push(
      ...columns.map(
        (c) =>
          ({
            header: ({ column }) => {
              const currentSort = column.getIsSorted();
              let icon = <ChevronsUpDownIcon className="h-4 w-4" />;
              if (currentSort === "asc") icon = <SortAsc className="h-4 w-4" />;
              if (currentSort === "desc")
                icon = <SortDesc className="h-4 w-4" />;
              return (
                <button
                  className="flex w-full items-center justify-between"
                  onClick={() => {
                    const cur = column.getIsSorted();
                    if (!cur || cur === "asc") {
                      column.toggleSorting(cur === "asc");
                      return;
                    }
                    column.clearSorting();
                  }}
                >
                  <span className="w-full overflow-hidden truncate text-left">
                    {column.id}
                  </span>
                  <span className="h-4 w-4">{icon}</span>
                </button>
              );
            },
            minSize: 128,
            sortingFn: "text",
            accessorKey: c,
            cell: (props) => {
              const val = props.getValue();
              if (val === null || val === undefined)
                return <span className="text-gray-500">NULL</span>;
              return <span>{val as any}</span>;
            },
          }) as ColumnDef<Record<string, any>>,
      ),
    );
    return base;
  }, [columns, editable]);
  const table = useReactTable({
    columns: cols,
    //@ts-ignore might try and fix this later.
    data: data,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    state: {
      sorting,
      rowSelection,
    },
  });
  const colSizeInfo = table.getState().columnSizingInfo;
  const flatHeaders = table.getFlatHeaders();
  const columnSizeVars = useMemo(() => {
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < flatHeaders.length; i++) {
      const header = flatHeaders[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    // For perf. stop complaining
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colSizeInfo, flatHeaders]);
  
  return (
    <div className="relative flex h-full flex-col">
      <TableButtons
        table={table}
        tableName={tableName}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
      />
      <div className="h-full w-full overflow-hidden">
        <div
          className="relative h-full w-full overflow-auto font-mono"
          style={{
            ...columnSizeVars,
          }}
        >
          <div
            style={{
              width: table.getTotalSize(),
            }}
            className="sticky top-0 z-10 w-full bg-neutral-900"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="relative flex">
                {headerGroup.headers.map((header) => {
                  if (header.id === "select-col") {
                    return (
                      <div
                        key={header.id}
                        className="sticky left-0 top-0 z-20 -mt-2 border border-gray-600 bg-neutral-900 px-2.5 py-1.5"
                      >
                        <div className="flex h-full w-full items-center justify-center">
                          <input
                            type="checkbox"
                            className="rounded-sm bg-neutral-500 text-orange-600 focus:ring-0 focus:ring-offset-0"
                            id="checkbox"
                            checked={
                              Object.keys(rowSelection).length === data.length
                            }
                            onChange={table.getToggleAllRowsSelectedHandler()}
                          />
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={header.id}
                      className="relative -mt-2 border border-gray-600 px-2 py-1.5"
                      style={{
                        width: `calc(var(--header-${header?.id}-size) * 1px)`,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={clsx(
                          "absolute -right-2 top-0 z-10 h-full w-3 cursor-col-resize touch-none select-none",
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* When resizing any column we will render this special memoized version of our table body */}
          {table.getState().columnSizingInfo.isResizingColumn ? (
            <MemoizedTableBody table={table} />
          ) : (
            <TableBody table={table} />
          )}
        </div>
      </div>
    </div>
  );
};

function TableBody({ table }: { table: TableType<any> }) {
  return (
    <div>
      {table.getRowModel().rows.map((row) => (
        <div
          key={row.id}
          className={clsx(
            "flex w-fit",
            row.getIsSelected() && "bg-neutral-800",
          )}
        >
          {row.getVisibleCells().map((cell) => {
            if (cell.column.id === "select-col") {
              return (
                <div
                  key={cell.id}
                  onClick={row.getToggleSelectedHandler()}
                  className={clsx(
                    "sticky left-0 top-0 cursor-pointer border border-gray-600 px-2.5 py-1.5",
                    row.getIsSelected() ? "bg-neutral-800" : "bg-neutral-900 ",
                  )}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <input
                      type="checkbox"
                      className="cursor-pointer rounded-sm bg-neutral-500 text-orange-600 focus:ring-0 focus:ring-offset-0"
                      id="checkbox"
                      checked={row.getIsSelected()}
                      onChange={row.getToggleSelectedHandler()}
                    />
                  </div>
                </div>
              );
            }
            return (
              <div
                key={cell.id}
                className="overflow-hidden truncate border border-gray-600 px-1.5 py-1 text-sm"
                style={{
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                }}
              >
                {cell.renderValue<any>() ?? (
                  <span className="text-gray-400">NULL</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

//special memoized wrapper for our table body that we will use during column resizing
export const MemoizedTableBody = memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody;
