# graphql-svelte

Alternate apollo-graphql for Svelte and other native js

# setup

```
$ npm i -d graphql-svelte <br>
$ yarn add --dev graphql-svelte
```

# main config

````
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
​```
````

# how to use for svelte

## Layout.svelte

```
<script>

import { SvGraphQL,svqlConfig } from "graphql-svelte";

// if you have fluent based graphql quert generator for hasura
import Hasura from 'hasura-orm'
export function hasura(schema) {
	Hasura['provider'] = client
	const orm = new Hasura(schema)
	orm['provider'] = client
	return orm
}

const client = svqlConfig.getClient(url,wsUrl)
svqlConfig.setHeaders({ 'content-type': 'application/json' })
// Graphql Error
client.on('cache',({ cacheKey, cacheValue: { fetchError, httpError, parseError, graphQLErrors } }) => {
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
