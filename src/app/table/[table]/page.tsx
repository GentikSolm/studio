import { Table } from "~/app/_components/Table";
import { db } from "~/db";
import ClientPage from "./ClientPage";

export default async function Page({ params }: { params: { table: string } }) {
  const table = await db.execute(`SELECT * FROM ${params.table}`);
  return (
    <ClientPage>
      <Table
        tableName={params.table}
        editable
        columns={table.headers}
        data={table.rows}
      />
    </ClientPage>
  );
}
