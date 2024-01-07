import { Table } from "~/app/_components/Table";
import { db } from "~/db";

export default async function Page({ params }: { params: { table: string } }) {
  const table = await db.execute(`SELECT * FROM ${params.table}`);
  return (
    <main className="h-full pt-1 overflow-hidden w-full">
      <Table columns={table.headers} data={table.rows} />
    </main>
  );
}
