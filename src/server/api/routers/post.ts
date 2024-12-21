import { clerkClient, User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user:User) => {
  return {id:user.id, username:user.username, profileImageUrl:user.imageUrl}
}

export const postRouter = createTRPCRouter({

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [
        {createdAt: "desc"}
      ]
    })
    
    const userRaw = (await (await clerkClient()).users.getUserList({
      userId: posts.map((post)=> post.authorId),
      limit: 100,
    }));

    const userdata = userRaw.data;

    const users = userdata.map(filterUserForClient)

    return posts.map((post)=>{
      const author = users.find((user)=>user.id = post.authorId);

      if (!author || !author.username) throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:"No Author found"
      });

      return {
        post,
        author: {
          ...author,
          username: author.username
        }
      }
    })
  }),

  create: privateProcedure.input(
    z.object({
      content: z.string().min(1).max(280)
    })
  ).mutation(async ({ctx, input}) => {
    const authorId = ctx.userId;

    const post = await ctx.db.post.create({
      data: {
        authorId,
        content: input.content
      }
    })
  })
});
