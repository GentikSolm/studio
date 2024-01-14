import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { db } from "~/db";
import { z, ZodError } from "zod";

export const createTRPCContext = async () => {
  return {
    db,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const { router, createCallerFactory } = t;

export const procedure = t.procedure
export const tableProcedure = procedure.input(
  z.object({ table: z.string() }),
);
