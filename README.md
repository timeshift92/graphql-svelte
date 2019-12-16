# graphql-svelte

Alternate apollo-graphql for Svelte and other native js

# setup

```
$ npm i -d graphql-svelte <br>
$ yarn add --dev graphql-svelte
```

# how to use for vanilla js

```
import { GraphQL } from "graphql-svelte";
import { graphqlFetchOptions, hashObject, SubscribeQL } from "graphql-svelte";
const graphql = new GraphQL();

const fetchOptionsOverride = options => {
(options.url = "http://localhost:4000/graphql"),
(options.headers = {"content-type": "application/json"});
};

//if you need subscribtion

const sub = new SubscribeQL('wss://locahost:4000/v1/graphql', {
  reconnect: true,
  lazy: true,
  connectionParams: async () => {
    return {
      headers: {
        "x-hasura-admin-secret": "secret"
      }
    };
  }
})

let subscribe = (query) => {
  return sub.request(query);
}

//if you nedd query and mutate

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

```

# how to use for svelte

--- graphql.js

```


import { GraphQLProvider, reportCacheErrors } from "graphql-svelte";

const client = GraphQLProvider({
    url: 'http://localhost:8082/v1/graphql',
    headers: () => ({
        "content-type": "application/json",
        Accept: 'application/json',
        "x-hasura-admin-secret": "secret"
    }),
    ws: {
        url: 'ws://localhost:8082/v1/graphql'
    }
})
client.graphql.on('cache', reportCacheErrors)



export default client
```

--- api.js

```

import { queries } from "../queries"
import client from './graphql'

export async function get(query, variables = null) {
  return await client.get({ query: queries[query], variables })
}

export function query(query, variables = null) {
  return client.query({ query: queries[query], variables })
}

export async function mutate(mutation, variables = null) {
  return await client.mutate( { query: queries[mutation], variables })
}

export function subscription(query,  variables = null ) {
  return client.subscribe( { query: queries[query], variables })
}

export function restore(query, data) {

 return client.restore(query, data)
}

```
