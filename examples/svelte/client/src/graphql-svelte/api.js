
import graphql, { fetchOptionsOverride } from "./config";
import { graphqlFetchOptions, hashObject, SubscribeQl } from "graphql-svelte/src/index.js";

let sub = new SubscribeQl('wss://go.spphone.uz/v1/graphql', {
  reconnect: true,
  // reconnectionAttempts:3,
  // timeout: 1000,
  lazy: true,
  connectionParams: async () => {
    return {
      headers: {
        "x-hasura-admin-secret": "tscorp"
      }
    };
  }
})
let subscribe = async (query) => {
  new Observable(observer => {
    let dt
    sub.request(query).subscribe({
      async  next({ data }) {
        if (data) {
          debugger;
          dt = data;
        }
      }
    })
    const timer = setTimeout(() => {
      if (dt == 'error')
        observer.error(new Error('Entered "error"'));
      else {
        observer.next(dt);
        observer.complete();
      }
    }, 250)
    return () => clearTimeout(timer);
  })
}



graphql.on('cache', onCache)

function onCache({ cacheKey: cachedCacheKey, cacheValue }) {

}
let get = async (query, variables) => {
  const fetchOptions = graphqlFetchOptions({
    query,
    variables
  });
  fetchOptionsOverride(fetchOptions)
  const has = hashObject(fetchOptions);
  if (graphql.cache[has])
    return new Promise((resolve, reject) => {
      resolve(graphql.cache[has]);
    });
  const pending = graphql.operate({
    fetchOptionsOverride,
    operation: {
      query,
      variables
    }
  });
  return pending.cacheValuePromise
}


export { get, subscribe };
