import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const storeproductsRouter = createTRPCRouter({

  getAllStoreProducts: publicProcedure.query(async ({ ctx }) => {
    const storeproducts = await ctx.db.storeProduct.findMany({
      take: 100,
      orderBy: [
        {id: "desc"}
      ]
    })
    return storeproducts
  }),

});