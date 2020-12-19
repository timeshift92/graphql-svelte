import { GraphQL } from './GraphQL'
import { graphqlFetchOptions } from './graphqlFetchOptions'
import { hashObject } from './hashObject'
import { SubscribeQL } from './SubscribeQL'

export let client
let _headers = {
  'content-type': 'application/json',
}

export function setHeaders(headers) {
  _headers = headers
}

export function headers() {
  return _headers
}

/**
 *
 * @param {*} url
 * @param {*} wsUrl
 * @param {{
 *   connectionCallback:string
 *   connectionParams:Object,
 *   timeout:number,
 *   reconnect:boolean,
 *   reconnectionAttempts:number,
 *   lazy:boolean,
 *   inactivityTimeout:number
 *   }} options
 */
export function getClient(url, wsUrl, wsOptions = {}) {
  const graphql = new GraphQL()

  const fetchOptionsOverride = (_options) => {
    ;(_options.url = url), (_options.headers = headers())
  }

  function getOrSet(
    fetchOptionsOverride,
    data,
    withCache = true,
    getKey = (key) => key
  ) {
    const fetchOptions = graphqlFetchOptions({ ...data })

    fetchOptionsOverride(fetchOptions)
    const has = hashObject(fetchOptions)
    getKey(has)

    if (graphql.cache[has] && graphql.cache[has].graphQLErrors) {
      delete graphql.cache[has]
    }

    if (graphql.cache[has] && withCache) {
      return new Promise((res) => res(graphql.cache[has]))
    }

    const pending = graphql.operate({
      fetchOptionsOverride,
      operation: {
        ...data,
      },
    })

    return pending.cacheValuePromise.then((r) => graphql.cache[has])
  }
  let client = {}
  client = Object.assign(client, graphql)

  if (wsUrl) {
    const initSub = (ws) =>
      SubscribeQL(wsUrl, {
        reconnect: ws.reconnect || true,
        lazy: ws.lazy || true,
        ...(ws.connectionParams
          ? { connectionParams: ws.connectionParams }
          : {
              connectionParams: () => {
                return headers()
              },
            }),
      })
    let sub = initSub(wsOptions)

    /**
     *
     * @param { query:string, variables:Object } client.subscription
     */
    client.subscription = (query, variables) =>
      sub.request({ query, variables })
    /**
     * @param {SubscribeQL} client.sub
     */
    client.sub = sub
  }
  /**
   *
   * @param {string} query
   * @param {Object} variables
   * @param {boolean} cache
   */
  client.mutate = (query, variables, cache = false) =>
    getOrSet(fetchOptionsOverride, { query, variables }, cache)
  /**
   *
   * @param {string} query
   * @param {Object} variables
   * @param {boolean} cache
   */
  client.query = (query, variables, cache = true) =>
    getOrSet(fetchOptionsOverride, { query, variables }, cache)
  /**
   *
   * @param {string} query
   * @param {Object} variables
   * @param {boolean} cache
   */
  return client
}
