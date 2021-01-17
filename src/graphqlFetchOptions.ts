import { GraphQLFetchOptions } from ".."

/**
 * Gets default [`fetch` options]{@link GraphQLFetchOptions} for a
 * [GraphQL operation]{@link GraphQLOperation}.
 * @param {GraphQLOperation} operation GraphQL operation.
 * @returns {GraphQLFetchOptions} [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) options.
 * @ignore
 */
export function graphqlFetchOptions(operation: any) {
  const fetchOptions: GraphQLFetchOptions = {
    url: '/graphql',
    method: 'POST',
    credentials:"include",
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  }
  fetchOptions.body = JSON.stringify(operation)

  return fetchOptions
}
