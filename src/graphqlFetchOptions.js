/**
 * Gets default [`fetch` options]{@link GraphQLFetchOptions} for a
 * [GraphQL operation]{@link GraphQLOperation}.
 * @param {GraphQLOperation} operation GraphQL operation.
 * @returns {GraphQLFetchOptions} [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) options.
 * @ignore
 */
export function graphqlFetchOptions(operation) {
  const fetchOptions = {
    url: '/graphql',
    method: 'POST',
    headers: { Accept: 'application/json' }
  }

  fetchOptions.headers['Content-Type'] = 'application/json'
  fetchOptions.body = JSON.stringify(operation)

  return fetchOptions
}
