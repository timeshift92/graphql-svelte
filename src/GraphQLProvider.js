import { GraphQL, graphqlFetchOptions, hashObject, SubscribeQL } from "../index";
import { observe } from 'svelte-observable';
const graphql = new GraphQL();


let get = async (fetchOptionsOverride, data) => {

  const fetchOptions = graphqlFetchOptions({
    ...data
  });

  fetchOptionsOverride(fetchOptions)
  const has = hashObject(fetchOptions);

  if (graphql.cache[has]) {
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
      return { headers }
    }
  }
});

function restore(fetchOptionsOverride, data) {

  if (data) {
    const fetchOptions = graphqlFetchOptions({
      ...data
    });
    fetchOptionsOverride(fetchOptions)
    const has = hashObject(fetchOptions);

    if (graphql.cache[has]) {
      graphql.cache[has] = data
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
    cl.subscribe = (data) => subscribe(sub, data)
  }
  if (!options.url) {
    throw new Error('grpahql endpoint not set');
  }

  const fetchOptionsOverride = _options => {
    (_options.url = options.url),
      (_options.headers = options.headers);
  };

  cl.get = (data) => get(fetchOptionsOverride, data)
  cl.restore = (data) => restore(fetchOptionsOverride, data)
  cl.query = (data) => observe(get(fetchOptionsOverride, data))
  cl.mutate = (data) => get(fetchOptionsOverride, data)
  cl.graphql = graphql;
  return {
    ...cl
  }
}




export { client as GraphQLProvider };
