import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const storesRouter = createTRPCRouter({
  getAllStores: publicProcedure.query(async ({ ctx }) => {
    const stores = await ctx.db.stores.findMany({
      select: {
        id: true,
        lat: true,
        lng: true,
        storeName: true,
        storeDesc: true,
        products: {
          select: {
            price: true,
            stock: true,
            product: {
              select: {
                id: true,
                productDesc: true,
                brand: true,
                volume: true,
                mesure: true,
              },
            },
          },
        },
      },
      take: 100,
      orderBy: [{ storeName: "desc" }],
    });
    return stores;
  }),
  add: privateProcedure
    .input(
      z.object({
        storeDesc: z.string(),
        storeName: z.string(),
        lat: z.number(),
        lng: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { storeDesc, storeName, lat, lng } = input;
      await ctx.db.stores.create({
        data: {
          storeDesc,
          storeName,
          lat,
          lng,
        },
      });
    }),
});
