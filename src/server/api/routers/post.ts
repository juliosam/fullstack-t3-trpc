import { clerkClient, User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user:User) => {
  return {id:user.id, username:user.username, profileImageUrl:user.imageUrl}
}

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters

// Create a new ratelimiter, that allows 3 requests per 1 minutes
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

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

      if (!author?.username) throw new TRPCError({
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
    const {success} = await ratelimit.limit(authorId);
    if (!success) throw new TRPCError({code: "TOO_MANY_REQUESTS"});
    
    const post = await ctx.db.post.create({
      data: {
        authorId,
        content: input.content
      }
    })
  })
});
