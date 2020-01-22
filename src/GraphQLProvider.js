import { GraphQL, graphqlFetchOptions, hashObject, SubscribeQL } from "../index";
import { observe } from 'svelte-observable';
const graphql = new GraphQL();


let get = async (fetchOptionsOverride, data, withCache = true) => {

  const fetchOptions = graphqlFetchOptions({
    ...data
  });

  fetchOptionsOverride(fetchOptions)
  const has = hashObject(fetchOptions);

  if (graphql.cache[has] && graphql.cache[has].graphQLErrors) {
    delete graphql.cache[has]
  }

  if (graphql.cache[has] && withCache) {
    return new Promise((resolve, reject) => {
      resolve(graphql.cache[has]);
    });
  }

  const pending = graphql.operate({
    fetchOptionsOverride,
    operation: {
      ...data
    }
  });
  let res = await pending.cacheValuePromise;
  return new Promise((resolve, reject) => { res.data ? resolve(res) : reject(res) })
}


const initSub = (ws, headers) => new SubscribeQL(ws.url, {
  reconnect: ws.reconnect || true,
  lazy: ws.lazy || true,
  ...ws.connectionParams ? { connectionParams: ws.connectionParams } : {
    connectionParams: () => {
      return { headers: { ...headers() } }
    }
  }
});

function restore(fetchOptionsOverride, data, cache) {

  if (data) {
    const fetchOptions = graphqlFetchOptions({
      ...data
    });
    fetchOptionsOverride(fetchOptions)
    const has = hashObject(fetchOptions);


    if (graphql.cache[has]) {
      graphql.cache[has] = cache
    }
    return graphql.cache[has]

  }

}

const subscribe = (sub, query) => {
  return observe(sub.request(query));
}


const client = (options) => {
  let cl = {};
  if (!options.headers)
    options.headers = { "content-type": "application/json" }
  if (options.ws) {
    let sub = initSub(options.ws, options.headers)
    cl.subsctiption = sub;
    cl.subscribe = (data) => subscribe(sub, data)
  }
  if (!options.url) {
    throw new Error('grpahql endpoint not set');
  }

  const fetchOptionsOverride = _options => {
    (_options.url = options.url),
      (_options.headers = options.headers());
  };

  cl.get = (data, cache) => get(fetchOptionsOverride, data, cache)
  cl.restore = (data, cache) => restore(fetchOptionsOverride, data, cache)
  cl.query = (data, cache = false) => observe(get(fetchOptionsOverride, data, cache))
  cl.mutate = (data, cache = false) => get(fetchOptionsOverride, data, cache)
  cl.graphql = graphql;
  return {
    ...cl
  }
}




export { client as GraphQLProvider };
