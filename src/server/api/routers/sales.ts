import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const salesRouter = createTRPCRouter({

  getAllSales: publicProcedure.query(async ({ ctx }) => {
    const sales = await ctx.db.sales.findMany({
      take: 100,
      orderBy: [
        {saleDay: "desc"}
      ]
    })
    return sales
  }),

});
