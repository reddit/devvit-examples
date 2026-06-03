import { createTRPCClient, httpBatchStreamLink } from '@trpc/client';
import type { AppRouter } from '../server/index';
import { transformer } from '../shared/transformer';

/**
 * The strongly-typed tRPC client instance.
 * Consumes the `AppRouter` type from the server to provide full compile-time type-safety 
 * for backend queries and mutations on the frontend client.
 * 
 * Note: Only the server's type signature is imported. No server implementation code is
 * bundled with the client-side build.
 */
export const trpc = createTRPCClient<AppRouter>({
  links: [
    /**
     * HTTP Batch Stream Link aggregates multiple procedure calls made within a short window
     * into a single HTTP request, reducing network overhead.
     */
    httpBatchStreamLink({
      url: window.location.origin + '/api',
      transformer,
    }),
  ],
});
