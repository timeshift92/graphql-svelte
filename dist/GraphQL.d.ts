/**
 * A lightweight GraphQL client that caches queries and mutations.
 * @kind class
 * @name GraphQL
 * @param {object} [options={}] Options.
 * @param {GraphQLCache} [options.cache={}] Cache to import; usually from a server side render.
 * @see [`reportCacheErrors`]{@link reportCacheErrors} to setup error reporting.
 * @example <caption>Construct a GraphQL client.</caption>
 * ```js
 * import { GraphQL } from 'graphql-svelte'
 *
 * const graphql = new GraphQL()
 * ```
 */
export class GraphQL {
    constructor({ cache, cacheWrapper }?: {
        cache?: {};
        cacheWrapper?: any;
    });
    /**
     * wrapper for cache
     * @kind function
     * @name GraphQL#cacheWrapper
     * @example <caption>Example wrapping cache</caption>
     * ```
     *  import { writable } from 'svelte/store'
     *
     *  this.cacheWrapper(cacheValue)
     * ```
     */
    cacheWrapper: any;
    /**
     * Adds an event listener.
     * @kind function
     * @name GraphQL#on
     * @param {string} type Event type.
     * @param {Function} handler Event handler.
     * @see [`reportCacheErrors`]{@link reportCacheErrors} can be used with this to setup error reporting.
     */
    on: {
        <T = any>(type: string | symbol, handler: import("mitt").Handler<T>): void;
        (type: "*", handler: import("mitt").WildcardHandler): void;
    };
    /**
     * Removes an event listener.
     * @kind function
     * @name GraphQL#off
     * @param {string} type Event type.
     * @param {Function} handler Event handler.
     */
    off: {
        <T_1 = any>(type: string | symbol, handler: import("mitt").Handler<T_1>): void;
        (type: "*", handler: import("mitt").WildcardHandler): void;
    };
    /**
     * Emits an event with details to listeners.
     * @param {string} type Event type.
     * @param {*} [details] Event details.
     * @ignore
     */
    emit: {
        <T_2 = any>(type: string | symbol, event?: T_2): void;
        (type: "*", event?: any): void;
    };
    /**
     * Cache of loaded GraphQL operations. You probably don’t need to interact
     * with this unless you’re implementing a server side rendering framework.
     * @kind member
     * @name GraphQL#cache
     * @type {GraphQLCache}
     * @example <caption>Export cache as JSON.</caption>
     * ```js
     * const exportedCache = JSON.stringify(graphql.cache)
     * ```
     * @example <caption>Example cache JSON.</caption>
     * ```json
     * {
     *   "a1bCd2": {
     *      "data": {
     *        "viewer": {
     *          "name": "Jayden Seric"
     *        }
     *      }
     *   }
     * }
     * ```
     */
    cache: any;
    /**
     * A map of loading GraphQL operations. You probably don’t need to interact
     * with this unless you’re implementing a server side rendering framework.
     * @kind member
     * @name GraphQL#operations
     * @type {object.<GraphQLCacheKey, Promise<GraphQLCacheValue>>}
     */
    operations: any;
    /**
     * Signals that [GraphQL cache]{@link GraphQL#cache} subscribers such as the
     * [`useGraphQL`]{@link useGraphQL} React hook should reload their GraphQL
     * operation. Emits a [`GraphQL`]{@link GraphQL} instance `reload` event.
     * @kind function
     * @name GraphQL#reload
     * @param {GraphQLCacheKey} [exceptCacheKey] A [GraphQL cache]{@link GraphQL#cache} [key]{@link GraphQLCacheKey} for cache to exempt from reloading.
     * @example <caption>Reloading the [GraphQL cache]{@link GraphQL#cache}.</caption>
     * ```js
     * graphql.reload()
     * ```
     */
    reload: (exceptCacheKey?: any) => void;
    /**
     * Resets the [GraphQL cache]{@link GraphQL#cache}, useful when a user logs
     * out. Emits a [`GraphQL`]{@link GraphQL} instance `reset` event.
     * @kind function
     * @name GraphQL#reset
     * @param {GraphQLCacheKey} [exceptCacheKey] A [GraphQL cache]{@link GraphQL#cache} [key]{@link GraphQLCacheKey} for cache to exempt from deletion. Useful for resetting cache after a mutation, preserving the mutation cache.
     * @example <caption>Resetting the [GraphQL cache]{@link GraphQL#cache}.</caption>
     * ```js
     * graphql.reset()
     * ```
     */
    reset: (exceptCacheKey?: any) => void;
    /**
     * Fetches a GraphQL operation.
     * @param {GraphQLFetchOptions} fetchOptions URL and options for [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API).
     * @param {GraphQLCacheKey} cacheKey [GraphQL cache]{@link GraphQL#cache} [key]{@link GraphQLCacheKey}.
     * @returns {Promise<GraphQLCacheValue>} A promise that resolves the [GraphQL cache]{@link GraphQL#cache} [value]{@link GraphQLCacheValue}.
     * @ignore
     */
    fetch: ({ url, ...options }: any, cacheKey: any) => Promise<any>;
    /**
     * Loads or reuses an already loading GraphQL operation in
     * [GraphQL operations]{@link GraphQL#operations}. Emits a
     * [`GraphQL`]{@link GraphQL} instance `fetch` event if an already loading
     * operation isn’t reused, and a `cache` event once it’s loaded into the
     * [GraphQL cache]{@link GraphQL#cache}.
     * @kind function
     * @name GraphQL#operate
     * @param {object} options Options.
     * @param {GraphQLOperation} options.operation GraphQL operation.
     * @param {GraphQLFetchOptionsOverride} [options.fetchOptionsOverride] Overrides default GraphQL operation [`fetch` options]{@link GraphQLFetchOptions}.
     * @param {boolean} [options.reloadOnLoad=false] Should a [GraphQL reload]{@link GraphQL#reload} happen after the operation loads, excluding the loaded operation cache.
     * @param {boolean} [options.resetOnLoad=false] Should a [GraphQL reset]{@link GraphQL#reset} happen after the operation loads, excluding the loaded operation cache.
     * @returns {GraphQLOperationLoading} Loading GraphQL operation details.
     */
    operate: ({ operation, fetchOptionsOverride, reloadOnLoad, resetOnLoad, }: {
        operation: any;
        fetchOptionsOverride: any;
        reloadOnLoad: boolean;
        resetOnLoad: boolean;
    }) => any;
}
