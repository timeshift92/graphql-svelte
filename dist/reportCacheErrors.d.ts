/**
 * A [`GraphQL`]{@link GraphQL} `cache` event handler that reports
 * [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API), HTTP, parse
 * and GraphQL errors via `console.log()`. In a browser environment the grouped
 * error details are expandable.
 * @kind function
 * @name reportCacheErrors
 * @param {object} data [`GraphQL`]{@link GraphQL} `cache` event data.
 * @param {GraphQLCacheKey} data.cacheKey [GraphQL cache]{@link GraphQL#cache} [key]{@link GraphQLCacheKey}.
 * @param {GraphQLCacheKey} data.cacheValue [GraphQL cache]{@link GraphQL#cache} [value]{@link GraphQLCacheValue}.
 * @example <caption>[`GraphQL`]{@link GraphQL} initialized to report cache errors.</caption>
 * ```js
 * import { GraphQL, reportCacheErrors } from 'graphql-react'
 *
 * const graphql = new GraphQL()
 * graphql.on('cache', reportCacheErrors)
 * ```
 */
export function reportCacheErrors({ cacheKey, cacheValue: { fetchError, httpError, parseError, graphQLErrors }, }: {
    cacheKey: any;
    cacheValue: any;
}): void;
