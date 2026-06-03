import superjson from 'superjson';

/**
 * SuperJSON data transformer shared between client and server.
 * Enables automatic serialization and deserialization of advanced data types 
 * (such as Date, Map, Set, RegExp, and BigInt) over HTTP request payloads.
 * 
 * If you need to support custom classes or third-party types (like Temporal or Decimal.js),
 * register them here using SuperJSON's register custom recipes.
 * 
 * @see https://github.com/blitz-js/superjson#recipes
 */
export const transformer = superjson;
