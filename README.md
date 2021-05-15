# graphql-svelte

Alternate apollo-graphql for Svelte and other native js

# Setup

```
$ pnpm i -d graphql-svelte
# OR
$ npm i -d graphql-svelte
# OR
$ yarn add --dev graphql-svelte
```

# Main config

```
import { svqlConfig } from "graphql-svelte";

const client = svqlConfig.getClient(url, wsUrl)
svqlConfig.setHeaders({ 'content-type': 'application/json' })

// Graphql Error
client.on('cache', ({ cacheKey, cacheValue: { fetchError, httpError, parseError, graphQLErrors } }) => {
    console.log(fetchError)
})

// WS Error
client.sub.onError(error => {
    console.log(error)
})

export {
    query: client.query,
    mutate: client.mutate,
    subsciption: client.subscription
}
```


# How to use for svelte

## Layout.svelte

```
<script>

import { SvGraphQL, svqlConfig } from "graphql-svelte";

// if you have fluent based graphql query generator for hasura
import Hasura from 'hasura-orm'
export function hasura(schema) {
	Hasura['provider'] = client
	const orm = new Hasura(schema)
	orm['provider'] = client
	return orm
}

const client = svqlConfig.getClient(url, wsUrl)
svqlConfig.setHeaders({ 'content-type': 'application/json' })

// Graphql Error
client.on('cache', ({ cacheKey, cacheValue: { fetchError, httpError, parseError, graphQLErrors } }) => {
  console.log(fetchError)
})

// WS Error
client.sub.onError(error => {
    console.log(error)
})
</script>

<SvGraphQL config={client} {hasura}>
  <slot></slot>
</SvGraphQL>


```
