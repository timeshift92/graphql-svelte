export { GraphQL } from './src/GraphQL'
export { reportCacheErrors } from './src/reportCacheErrors'
export { graphqlFetchOptions } from './src/graphqlFetchOptions'
export { hashObject } from './src/hashObject'
export { SubscribeQL } from './src/SubscribeQL'
import * as svqlConfig from './src/svqlConfig'
export { svqlConfig }
/**
 * A [GraphQL cache]{@link GraphQL#cache} map of GraphQL operation results.
 * @see [`GraphQL`]{@link GraphQL} constructor accepts this type in `options.cache`.
 * @see [`GraphQL` instance property `cache`]{@link GraphQL#cache} is this type.
 */
export type GraphQLCache = Record<GraphQLCacheKey, GraphQLCacheValue>

/**
 * A [GraphQL cache]{@link GraphQLCache} key, derived from a hash of the
 * [`fetch` options]{@link GraphQLFetchOptions} of the GraphQL operation that populated
 * the [value]{@link GraphQLCacheValue}.
 */
export type GraphQLCacheKey = string;


/**
 * JSON serializable GraphQL operation result that includes errors and data.
 */
export type GraphQLCacheValue = { fetchError?: string, httpError?: HttpError, parseError?: string, graphQLErrors?: Array<Object>, data?: Object }

/**
 * GraphQL API URL and
 * [polyfillable `fetch` options](https://github.github.io/fetch/#options). The
 * `url` property gets extracted and the rest are used as
 * [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) options.
 * @kind typedef
 * @name GraphQLFetchOptions
 * @type {object}
 * @prop {string} url GraphQL API URL.
 * @prop {string|FormData} body HTTP request body.
 * @prop {object} headers HTTP request headers.
 * @prop {string} [credentials] Authentication credentials mode.
 * @see [`GraphQLFetchOptionsOverride` functions]{@link GraphQLFetchOptionsOverride} accept this type.
 */
export type GraphQLFetchOptions =
  {
    url: string,

    /**
     * A BodyInit object or null to set request's body.
     */
    body?: BodyInit | null;
    /**
     * A string indicating how the request will interact with the browser's cache to set request's cache.
     */
    cache?: RequestCache;
    /**
     * A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.
     */
    credentials?: RequestCredentials;
    /**
     * A Headers object, an object literal, or an array of two-item arrays to set request's headers.
     */
    headers?: HeadersInit;
    /**
     * A cryptographic hash of the resource to be fetched by request. Sets request's integrity.
     */
    integrity?: string;
    /**
     * A boolean to set request's keepalive.
     */
    keepalive?: boolean;
    /**
     * A string to set request's method.
     */
    method?: string;
    /**
     * A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.
     */
    mode?: RequestMode;
    /**
     * A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.
     */
    redirect?: RequestRedirect;
    /**
     * A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.
     */
    referrer?: string;
    /**
     * A referrer policy to set request's referrerPolicy.
     */
    referrerPolicy?: ReferrerPolicy;
    /**
     * An AbortSignal to set request's signal.
     */
    signal?: AbortSignal | null;
    /**
     * Can only be null. Used to disassociate request from any Window.
     */
    window?: any;
  }





/**
 * [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) HTTP error.
 * @kind typedef
 * @name HttpError
 * @type {object}
 * @prop {number} status HTTP status code.
 * @prop {string} statusText HTTP status text.
 */
export interface HttpError {
  status: number;
  statusText: string
};


export interface WSOptions {
  /**
   * @default undefined
   */
  connectionCallback?: Function;
  /**
   * @default {}
   */
  connectionParams?: Object;
  /**
   * @default  30000
   */
  timeout?: number;
  /**
   * @default false
   */
  reconnect?: boolean;
  /**
   * @default Infinity
   */
  reconnectionAttempts?: number;
  /**
   * @default false
   */
  lazy?: boolean;
  /**
   *@default 0
   */
  inactivityTimeout?: number;
}

export interface queryType {
  query: string;
  variables?: object;
  cache?: boolean;
  key?: (key: any) => any;
};

export interface graphqlOptions {
  url: string;
  wsUrl?: string;
  wsOptions?: WSOptions;
  graphqlOptions?: {
    cache?: Record<GraphQLCacheKey, GraphQLCacheValue>
    cacheWrapper?: Function
  }
}
