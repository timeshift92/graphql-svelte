import { GraphQLFetchOptions, queryType, graphqlOptions } from '..'
import { GraphQL } from './GraphQL'
import { graphqlFetchOptions } from './graphqlFetchOptions'
import { hashObject } from './hashObject'
import { SubscribeQL } from './SubscribeQL'
//@ts-ignore
export let client: {
  graphql: GraphQL;
  subscription({ query, variables }: { query: string, variables?: object }): {
    [x: number]: () => any;
    subscribe(observerOrNext?: any, onError?: any, onComplete?: any): {
      unsubscribe: () => void;
    };
  };
  sub: any;
  mutate({ query, variables, cache, key }: queryType): Promise<any>;
  query({ query, variables, cache, key }: queryType): Promise<any>;
} = {}
let _headers = {
  'content-type': 'application/json',
}

export function setHeaders(headers: any) {
  _headers = headers
}

export function headers() {
  return _headers
}



/**
 * * Gets default client {@link svqlConfig} for a
 * [GraphQL Client]{@link svqlConfig}.
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
export function getClient({ url, wsUrl, wsOptions = {}, graphqlOptions = {} }: graphqlOptions) {
  const graphql = new GraphQL(graphqlOptions)

  const fetchOptionsOverride = (_options: GraphQLFetchOptions) => {
    ; (_options.url = url), (_options.headers = headers())
  }

  function getOrSet(
    fetchOptionsOverride: Function,
    data: any,
    withCache: boolean,
    getKey = (key: any) => key
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
  /**
   * @param {event:string,callback:Function } client.on
   */
  client.graphql = graphql
  if (wsUrl) {
    const initSub = (ws: any) =>
      SubscribeQL(wsUrl, {
        reconnect: ws.reconnect || true,
        lazy: ws.lazy || true,
        ...(ws.connectionParams
          ? { connectionParams: ws.connectionParams }
          : {
            connectionParams: () => {
              return { headers: headers() }
            },
          }),
      })
    let sub = initSub(wsOptions)

    /**
     *
     * @param { query:string, variables:Object } client.subscription
     */
    client.subscription = ({ query, variables }) =>
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
   * @returns {Promise}
   */
  client.mutate = ({ query, variables, cache = false, key }: queryType): Promise<any> =>
    getOrSet(fetchOptionsOverride, { query, variables }, cache, key)
  /**
   *
   * @param {string} query
   * @param {Object} variables
   * @param {boolean} cache
   * @returns {Promise}
   */

  client.query = ({ query, variables, cache = true, key }: queryType): Promise<any> =>
    getOrSet(fetchOptionsOverride, { query, variables }, cache, key)

  return client
}
