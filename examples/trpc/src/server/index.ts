import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { createContext } from './context.js';
import { createServer, context, getServerPort, redis } from '@devvit/web/server';

/**
 * The main tRPC application router defining available API procedures.
 * 
 * Procedures are divided into query procedures (for fetching data) and
 * mutation procedures (for modifying state/writing to Redis).
 */
const appRouter = router({
  /**
   * Initializes the frontend application with metadata.
   * Retrieves the current `postId` from the request-scoped Devvit context.
   */
  init: publicProcedure.query(async () => {
    const { postId } = context;
    return {
      postId,
    };
  }),

  counter: {
    get: publicProcedure.query(async () => {
      const resp = await redis.get('counter');
      return resp ? parseInt(resp) : 0;
    }),

    increment: publicProcedure
      .input(
        z.object({
          amount: z.number().positive().default(1),
        })
      )
      .mutation(async ({ input }) => {
        const resp = await redis.incrBy('counter', input.amount);
        return resp;
      }),

    decrement: publicProcedure
      .input(
        z.object({
          amount: z.number().negative().default(-1),
        })
      )
      .mutation(async ({ input }) => {
        const resp = await redis.incrBy('counter', input.amount);
        return resp;
      }),
  },
});

/**
 * Export type definition of the router to be consumed by the tRPC client.
 * This is type-only and does not share any runtime code with the client.
 */
export type AppRouter = typeof appRouter;

/**
 * Standard tRPC HTTP handler using the standalone HTTP adapter.
 * Sets the basePath to '/api/' to route all tRPC traffic.
 */
const handler = createHTTPHandler({
  router: appRouter,
  createContext,
  // You need the trailing slash here!
  basePath: '/api/',
});

/**
 * Start the standalone server wrapped by Devvit's server runtime.
 * Devvit `createServer` sets up AsyncLocalStorage so that imports like `context` and `redis`
 * are correctly scoped to individual incoming requests.
 */
createServer(handler).listen(getServerPort());
