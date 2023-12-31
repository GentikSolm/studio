import { Table } from "~/app/_components/Table";
import { db } from "~/db";

export default async function Page({ params }: { params: { table: string } }) {
  const table = await db.execute(`SELECT * FROM ${params.table} LIMIT 2`);
  return (
    <main className="h-full pt-1 overflow-scroll">
      <Table columns={table.headers} data={table.rows} />
    </main>
  );
}
