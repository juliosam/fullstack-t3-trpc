import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";

export const getSSGHelper = () => {
    const ctx = {db, userId: null}
    const ssg = createServerSideHelpers({
      router: appRouter,
      ctx,
      transformer: superjson,
    });
    return ssg
};