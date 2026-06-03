import { initTRPC } from '@trpc/server';
import { transformer } from '../shared/transformer.js';
import { Context } from './context.js';

/**
 * Initialization of the tRPC backend runtime environment.
 * This should be performed exactly once per backend to instantiate router 
 * and procedure factories.
 */
const t = initTRPC.context<Context>().create({
  /**
   * Data transformer used to serialize/deserialize complex data types 
   * (like Dates, Maps, Sets, and BigInts) across the network boundary.
   */
  transformer,
});

/**
 * Factory helper used to construct tRPC API routers.
 */
export const router = t.router;

/**
 * Builder helper used to define queries and mutations.
 * Public procedures do not enforce authorization checks and are accessible by anyone.
 */
export const publicProcedure = t.procedure;
