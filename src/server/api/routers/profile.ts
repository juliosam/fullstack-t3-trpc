import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getUserByUserName: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      // Obtenemos el cliente de Clerk
      const client = await clerkClient();

      // Verificamos si `users` existe y no está vacío
      const users = await client.users.getUserList({
        username: [input.username],
      });

      if (!users.data || users.data.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Obtenemos el primer usuario y aseguramos que no sea undefined
      const user = users.data[0];
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Filtramos y retornamos el usuario
      return filterUserForClient(user);
    }),
});


