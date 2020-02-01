import { GraphQL, graphqlFetchOptions, hashObject, SubscribeQL } from './';
import { writable } from 'svelte/store';
const graphql = new GraphQL();

function cacheWritable(initial, key) {

  const {
    subscribe,
    set,
    update
  } = writable(initial);
  return {
    subscribe,
    set: val => {
      graphql.cache[key] = val;
      set(val);
    }
  };
}

function getOrSet(fetchOptionsOverride, data, withCache = true, getKey = (key) => key) {
  const fetchOptions = graphqlFetchOptions({
    ...data
  });

  fetchOptionsOverride(fetchOptions)
  const has = hashObject(fetchOptions);
  getKey(has);

  if (graphql.cache[has] && graphql.cache[has].graphQLErrors) {
    delete graphql.cache[has]
  }

  if (graphql.cache[has] && withCache) {
    return new Promise(res => res(graphql.cache[has]));
  }

  const pending = graphql.operate({
    fetchOptionsOverride,
    operation: {
      ...data
    }
  });
  return pending.cacheValuePromise;
}


let get = (fetchOptionsOverride, data, withCache = true) => {
  return getOrSet(fetchOptionsOverride, data, withCache)
}

let query = (fetchOptionsOverride, data, withCache = true) => {
  let key = '';
  const initial = new Promise(res =>  res);
  getOrSet(fetchOptionsOverride, data, withCache, _key => key = _key).then(
    result =>
      dt.set(graphql.cache[key])
  );
  const dt = cacheWritable(initial, key)

  return dt;
};


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
  return sub.request(query);
}


const client = (options) => {
  let cl = {};
  if (!options.headers)
    options.headers = { "content-type": "application/json" }
  if (options.ws) {
    let sub = initSub(options.ws, options.headers)
    cl.subscription = sub;
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
  cl.query = (data, cache) => query(fetchOptionsOverride, data, cache)
  cl.mutate = (data, cache = false) => get(fetchOptionsOverride, data, cache)
  cl.graphql = graphql;
  return {
    ...cl
  }
}




export { client as GraphQLProvider };
