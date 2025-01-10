import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productsRouter = createTRPCRouter({

  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.products.findMany({
      take: 100,
      orderBy: [
        {productDesc: "desc"}
      ]
    })
    return products
  }),

});