import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.products.findMany({
      take: 100,
      orderBy: [{ productDesc: "desc" }],
    });
    return products;
  }),
  addProduct: privateProcedure
    .input(
      z.object({
        productDesc: z.string(),
        productType: z.string(),
        brand: z.string(),
        volume: z.number(),
        mesure: z.string(),
        price: z.number(),
        sealerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        productDesc,
        productType,
        brand,
        volume,
        mesure,
        price,
        sealerId,
      } = input;
      await ctx.db.products.create({
        data: {
          productDesc,
          productType,
          brand,
          volume,
          mesure,
          price,
          sealerId,
        },
      });
    }),
  addProductsBulk: privateProcedure
    .input(
      z.array(
        z.object({
          productDesc: z.string(),
          productType: z.string(),
          brand: z.string(),
          volume: z.number(),
          mesure: z.string(),
          price: z.number(),
          sealerId: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.products.createMany({
        data: input, // Prisma soporta crear múltiples registros con createMany
        skipDuplicates: true, // Opcional: evita insertar duplicados si es necesario
      });
    }),
});

// brand       String
// productDesc String     @db.VarChar(255)
// productType String
// price       Int
// sealerId    String
// volume      Int
// mesure      String
