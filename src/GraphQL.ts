import mitt from 'mitt'
import { graphqlFetchOptions } from './graphqlFetchOptions'
import { hashObject } from './hashObject'
import { GraphQLCache, GraphQLCacheKey, GraphQLCacheValue, GraphQLFetchOptions } from '../index'
const { on, off, emit } = mitt()

/**
 * A lightweight GraphQL client that caches queries and mutations.
 * @kind class
 * @name GraphQL
 * @param {object} [options={}] Options.
 * @param {GraphQLCache} [options.cache={}] Cache to import; usually from a server side render.
 * @param {GraphQLCache} [options.cacheWrapper={}] wrapper cacheValue
 * @see [`reportCacheErrors`]{@link reportCacheErrors} to setup error reporting.
 * @example <caption>Construct a GraphQL client.</caption>
 * ```js
 * import { GraphQL } from 'graphql-svelte'
 *
 * const graphql = new GraphQL()
 * ```
 */
export class GraphQL {

  constructor({ cache = {}, cacheWrapper}: any = {}) {
    this.cache = cache
    this.cacheWrapper = cacheWrapper
  }

  /**
    * wrapper for cache
    * @kind function
    * @name GraphQL#cacheWrapper
    * @example```ts
    *  import { writable } from 'svelte/store'
    *
    *  this.cacheWrapper(cacheValue)
    * ```
    */
  cacheWrapper: Function
  /**
   * Adds an event listener.
   * @kind function
   * @name GraphQL#on
   * @param {string} type Event type.
   * @param {Function} handler Event handler.
   * @see [`reportCacheErrors`]{@link reportCacheErrors} can be used with this to setup error reporting.
   */
  on = on

  /**
   * Removes an event listener.
   * @kind function
   * @name GraphQL#off
   * @param {string} type Event type.
   * @param {Function} handler Event handler.
   */
  off = off
  /**
   * Emits an event with details to listeners.
   * @param {string} type Event type.
   * @param {*} [details] Event details.
   * @ignore
   */
  emit = emit
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
  cache: GraphQLCache


  /**
   * A map of loading GraphQL operations. You probably don’t need to interact
   * with this unless you’re implementing a server side rendering framework.
   * @name GraphQL#operations
   */
  operations: Record<GraphQLCacheKey, Promise<GraphQLCacheValue>> = {}

  /**
   * Signals that [GraphQL cache]{@link GraphQL#cache} subscribers such as the
   * operation. Emits a [`GraphQL`]{@link GraphQL} instance `reload` event.
   * @kind function
   * @name GraphQL#reload
   * @param {GraphQLCacheKey} [exceptCacheKey] A [GraphQL cache]{@link GraphQL#cache} [key]{@link GraphQLCacheKey} for cache to exempt from reloading.
   * @example <caption>Reloading the [GraphQL cache]{@link GraphQL#cache}.</caption>
   * ```js
   * graphql.reload()
   * ```
   */
  reload = (exceptCacheKey: GraphQLCacheKey) => {
    this.emit('reload', { exceptCacheKey })
  }

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
  reset = (exceptCacheKey: string) => {
    let cacheKeys = Object.keys(this.cache)

    exceptCacheKey ? cacheKeys = cacheKeys.filter((hash) => hash !== exceptCacheKey) : ''

    cacheKeys.forEach((cacheKey) => delete this.cache[cacheKey])

    // Emit cache updates after the entire cache has been updated, so logic in
    // listeners can assume cache for all queries is fresh and stable.
    this.emit('reset', { exceptCacheKey })
  }

  /**
   * Fetches a GraphQL operation.
   * @param {GraphQLFetchOptions} fetchOptions URL and options for [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API).
   * @param {GraphQLCacheKey} cacheKey [GraphQL cache]{@link GraphQL#cache} [key]{@link GraphQLCacheKey}.
   * @returns {Promise<GraphQLCacheValue>} A promise that resolves the [GraphQL cache]{@link GraphQL#cache} [value]{@link GraphQLCacheValue}.
   * @ignore
   */
  fetch = ({ url, ...options }: GraphQLFetchOptions, cacheKey: GraphQLCacheKey): Promise<GraphQLCacheValue> => {
    let fetchResponse: any

    const fetcher =
      typeof fetch === 'function'
        ? fetch
        : () =>
          Promise.reject(
            new Error('Global fetch API or polyfill unavailable.')
          )
    const cacheValue: any = {}
    const cacheValuePromise = fetcher(url, options)
      .then(
        (response) => {
          fetchResponse = response

          if (!response.ok)
            cacheValue.httpError = {
              status: response.status,
              statusText: response.statusText,
            }

          return response.json().then(
            ({ errors, data }) => {
              // JSON parse ok.
              if (!errors && !data) cacheValue.parseError = 'Malformed payload.'
              if (errors) cacheValue.graphQLErrors = errors
              if (data) cacheValue.data = data
            },
            ({ message }) => {
              // JSON parse error.
              cacheValue.parseError = message
            }
          )
        },
        ({ message }) => {
          cacheValue.fetchError = message
        }
      )
      
      .then(() => {
        // Cache the operation.
        this.cache[cacheKey] =  this.cacheWrapper ? this.cacheWrapper(cacheValue):cacheValue

        // Clear the loaded operation.
        delete this.operations[cacheKey];

        this.emit('cache', {
          cacheKey,
          cacheValue,
          // May be undefined if there was a fetch error.
          response: fetchResponse,
        })

        return cacheValue
      })

    this.operations[cacheKey] = cacheValuePromise

    this.emit('fetch', { cacheKey, cacheValuePromise })

    return cacheValuePromise
  }

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
   *
   */
  operate = ({ operation, fetchOptionsOverride, reloadOnLoad, resetOnLoad }: any) => {

    if (reloadOnLoad && resetOnLoad) throw new Error('operate() options “reloadOnLoad” and “resetOnLoad” can’t both be true.')

    const fetchOptions = graphqlFetchOptions(operation)
     fetchOptionsOverride && fetchOptionsOverride(fetchOptions)
    const cacheKey = hashObject(fetchOptions)
    const cacheValuePromise =
      // Use an identical existing request or…
      this.operations[cacheKey] ||
      // …make a fresh request.
      this.fetch(fetchOptions, cacheKey)



    // Potential edge-case issue: Multiple identical queries with resetOnLoad
    // enabled will cause excessive resets.
    cacheValuePromise.then(() => {
      if (reloadOnLoad) this.reload(cacheKey)
      else if (resetOnLoad) this.reset(cacheKey)
    })

    return {
      cacheKey,
      cacheValue: this.cache[cacheKey],
      cacheValuePromise,
    }
  }
}
