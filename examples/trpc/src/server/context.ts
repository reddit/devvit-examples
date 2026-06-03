import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';

/**
 * Creates the tRPC context for each incoming HTTP request.
 * Since this example utilizes request-scoped proxies exported from `@devvit/web/server`
 * (like `context`, `redis`, and `reddit`), we do not need to populate the tRPC context object.
 * However, this function is still required by tRPC to establish type safety for requests.
 */
export async function createContext(_options: CreateHTTPContextOptions) {
  return {};
}

/**
 * Reusable Context type signature derived from the createContext function return type.
 */
export type Context = Awaited<ReturnType<typeof createContext>>;
