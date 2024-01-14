import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    router: appRouter,
    createContext: createTRPCContext,
    endpoint: "/api/trpc",
    req: request,
  });
};

export { handler as GET, handler as POST };
