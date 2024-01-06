import Link from "next/link";
import { db } from "~/db";
import { env } from "~/env.mjs";

export default async function Home() {
  const tables = await db.execute(
    `SELECT table_name, table_rows FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = ?`,
    [env.DATABASE_NAME],
  );
  return (
    <main className="flex h-full items-center justify-center pt-20 text-xl">
      <div>
        <span className="font-semibold">{env.DATABASE_NAME} Tables</span>
        <div className="pt-2">
          <ul className="flex flex-col gap-4 rounded-md border border-neutral-700 px-10 py-5">
            {tables.rows.map((r) => (
              <li key={r.TABLE_NAME}>
                <Link
                  href={`/table/${ r.TABLE_NAME }`}
                  className="flex transition-colors hover:bg-neutral-800 justify-between gap-5 rounded-md border border-neutral-700 px-3 py-2"
                >
                  <span>{r.TABLE_NAME}</span>
                  <span className='font-mono'>{r.TABLE_ROWS}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
