import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const storesRouter = createTRPCRouter({

  getAllStores: publicProcedure.query(async ({ ctx }) => {
    const stores = await ctx.db.stores.findMany({
      select:{
        id: true,
        lat: true,
        lng: true,
        storeName: true,
        storeDesc: true,
        products: {
          select:{
            price: true,
            stock: true,
            product: {
              select:{
                id: true,
                productDesc: true,
                brand: true,
                volume: true,
                mesure: true,
              }
            }
          }
        }
      },
      take: 100,
      orderBy: [
        {storeName: "desc"}
      ]
    })
    return stores
  }),

});
