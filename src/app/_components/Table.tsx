"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronsUpDownIcon } from "lucide-react";
export const Table = ({
  columns,
  data,
}: {
  columns: string[];
  data: Record<string, unknown>[]
}) => {
  const table = useReactTable({
    columns: columns.map((c) => ({
      header: c,
      accessorKey: c,
      cell: (props) => {
        const val = props.getValue()
        if(val === null || val === undefined) return <span className='text-gray-500'>NULL</span>
          return <span>{ props.getValue() }</span>
      },
    })),

    //@ts-ignore might try and fix this later.
    data: data,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="font-mono text-sm">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  key={header.id}
                  className="min-w-32 border border-gray-700 px-2.5 py-1.5 text-left font-normal text-gray-400"
                >
                  <div className="flex justify-between">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    <ChevronsUpDownIcon className="h-4 w-4" />
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => {
                console.log(
                  flexRender(cell.column.columnDef.cell, cell.getContext()),
                );
                return (
                  <td
                    key={cell.id}
                    className="min-w-32 border border-gray-700 px-2.5 py-1.5 text-left font-normal text-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="h-24 text-center">
              No results.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
