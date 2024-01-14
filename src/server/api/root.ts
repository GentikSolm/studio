import { z } from "zod";
import { createCallerFactory, router, tableProcedure } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  tables: router({
    rows: router({
      delete: tableProcedure
        .input(z.object({ rows: z.array(z.record(z.string(), z.unknown())) }))
        .mutation(async ({ ctx, input }) => {
          const params = [] as unknown[];
          const query =
            `DELETE FROM ${input.table} WHERE ` +
            input.rows.reduce((q, next, i) => {
              const thisRow = Object.entries(next).reduce((r, n, j) => {
                const [k, v] = n
                params.push(v);
                let comparitor = `${k} = ?`;
                if (v === null) comparitor = `${k} IS ?`;
                if (j === 0) {
                  return r + comparitor;
                }
                return r + ` AND ${comparitor}`;
              }, "");
              if (i === 0) {
                return q + `(${thisRow})`;
              }
              return q + ` OR (${thisRow})`;
            }, "");
          const res = await ctx.db.execute(query, params)
          return res.rowsAffected;
        }),
    }),
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const caller = createCallerFactory(appRouter);
