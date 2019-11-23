# graphql-svelte

Alternate apollo-graphql for Svelte and other native js

# setup

```
$ npm i -d graphql-svelte <br>
$ yarn add --dev graphql-svelte
```

# how to use

```
import { GraphQL } from "graphql-svelte";
import { graphqlFetchOptions, hashObject, SubscribeQL } from "graphql-svelte";
const graphql = new GraphQL();

const fetchOptionsOverride = options => {
    (options.url = "http://localhost:4000/graphql"),
      (options.headers = {
        "content-type": "application/json",
      });
};

//if you need subscribtion
let sub = new SubscribeQL('wss://locahost:4000/v1/graphql', {
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

A lightweight but powerful GraphQL client for Svelte using modern the first [Relay](https://facebook.github.io/relay) and [Apollo](https://apollographql.com/docs/react)

## API ( <b>attention </b> current information taken from https://github.com/jaydenseric/graphql-react)

### Table of contents

- [operate](GraphQL#operate)
- [graphql-svelte](#graphql-svelte)
- [setup](#setup)
- [how to use](#how-to-use)

  - [API ( <b>attention </b> current information taken from https://github.com/jaydenseric/graphql-react)](#api--battention-b-current-information-taken-from-httpsgithubcomjaydensericgraphql-react)

    - [Table of contents](#table-of-contents)
    - [class GraphQL](#class-graphql)
      - [See](#see)
      - [Examples](#examples)
      - [GraphQL instance method off](#graphql-instance-method-off)
      - [GraphQL instance method on](#graphql-instance-method-on)
        - [See](#see-1)
      - [GraphQL instance method operate](#graphql-instance-method-operate)
      - [GraphQL instance method reload](#graphql-instance-method-reload)
        - [Examples](#examples-1)
      - [GraphQL instance method reset](#graphql-instance-method-reset)
        - [Examples](#examples-2)
      - [GraphQL instance property cache](#graphql-instance-property-cache)
        - [Examples](#examples-3)
      - [GraphQL instance property operations](#graphql-instance-property-operations)
    - [function reportCacheErrors](#function-reportcacheerrors)
      - [Examples](#examples-4)
    - [type GraphQLCache](#type-graphqlcache)
      - [See](#see-2)
    - [type GraphQLCacheKey](#type-graphqlcachekey)
    - [type GraphQLCacheValue](#type-graphqlcachevalue)
    - [type GraphQLFetchOptions](#type-graphqlfetchoptions)
      - [See](#see-3)
    - [type GraphQLFetchOptionsOverride](#type-graphqlfetchoptionsoverride)
      - [See](#see-4)
      - [Examples](#examples-5)
    - [type GraphQLOperation](#type-graphqloperation)
      - [See](#see-5)
    - [type GraphQLOperationLoading](#type-graphqloperationloading)
      - [See](#see-6)
    - [type GraphQLOperationStatus](#type-graphqloperationstatus)
      - [See](#see-7)
    - [type HttpError](#type-httperror)

    - [type GraphQLCache](#type-graphqlcache)
      - [See](#see-6)
    - [type GraphQLCacheKey](#type-graphqlcachekey)
    - [type GraphQLCacheValue](#type-graphqlcachevalue)
    - [type GraphQLFetchOptions](#type-graphqlfetchoptions)
      - [See](#see-7)
    - [type GraphQLFetchOptionsOverride](#type-graphqlfetchoptionsoverride)
      - [See](#see-8)
      - [Examples](#examples-9)
    - [type GraphQLOperation](#type-graphqloperation)
      - [See](#see-9)
    - [type GraphQLOperationLoading](#type-graphqloperationloading)
      - [See](#see-10)
    - [type GraphQLOperationStatus](#type-graphqloperationstatus)
      - [See](#see-11)
    - [type HttpError](#type-httperror)


    - [type GraphQLCache](#type-graphqlcache)
      - [See](#see-6)
    - [type GraphQLCacheKey](#type-graphqlcachekey)
    - [type GraphQLCacheValue](#type-graphqlcachevalue)
    - [type GraphQLFetchOptions](#type-graphqlfetchoptions)
      - [See](#see-7)
    - [type GraphQLFetchOptionsOverride](#type-graphqlfetchoptionsoverride)
      - [See](#see-8)
      - [Examples](#examples-9)
    - [type GraphQLOperation](#type-graphqloperation)
      - [See](#see-9)
    - [type GraphQLOperationLoading](#type-graphqloperationloading)
      - [See](#see-10)
    - [type GraphQLOperationStatus](#type-graphqloperationstatus)
      - [See](#see-11)
    - [type HttpError](#type-httperror)

### class GraphQL

# operate

A lightweight GraphQL client that caches queries and mutations.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `options` | object? = `{}` | Options. |
| `options.cache` | [GraphQLCache](#type-graphqlcache)? = `{}` | Cache to import; usually from a server side render. |

#### See

- [`reportCacheErrors`](#function-reportcacheerrors) to setup error reporting.

#### Examples

_Construct a GraphQL client._

> ```js
> import { GraphQL } from 'graphql-react'
>
> const graphql = new GraphQL()
> ```

#### GraphQL instance method off

Removes an event listener.

| Parameter | Type     | Description    |
| :-------- | :------- | :------------- |
| `type`    | string   | Event type.    |
| `handler` | Function | Event handler. |

#### GraphQL instance method on

Adds an event listener.

| Parameter | Type     | Description    |
| :-------- | :------- | :------------- |
| `type`    | string   | Event type.    |
| `handler` | Function | Event handler. |

##### See

- [`reportCacheErrors`](#function-reportcacheerrors) can be used with this to setup error reporting.

#### GraphQL instance method operate

Loads or reuses an already loading GraphQL operation in [GraphQL operations](#graphql-instance-property-operations). Emits a [`GraphQL`](#class-graphql) instance `fetch` event if an already loading operation isn’t reused, and a `cache` event once it’s loaded into the [GraphQL cache](#graphql-instance-property-cache).

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `options` | object | Options. |
| `options.operation` | [GraphQLOperation](#type-graphqloperation) | GraphQL operation. |
| `options.fetchOptionsOverride` | [GraphQLFetchOptionsOverride](#type-graphqlfetchoptionsoverride)? | Overrides default GraphQL operation [`fetch` options](#type-graphqlfetchoptions). |
| `options.reloadOnLoad` | boolean? = `false` | Should a [GraphQL reload](#graphql-instance-method-reload) happen after the operation loads, excluding the loaded operation cache. |
| `options.resetOnLoad` | boolean? = `false` | Should a [GraphQL reset](#graphql-instance-method-reset) happen after the operation loads, excluding the loaded operation cache. |

**Returns:** [GraphQLOperationLoading](#type-graphqloperationloading) — Loading GraphQL operation details.

#### GraphQL instance method reload

GraphQL operation. Emits a [`GraphQL`](#class-graphql) instance `reload` event.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `exceptCacheKey` | [GraphQLCacheKey](#type-graphqlcachekey)? | A [GraphQL cache](#graphql-instance-property-cache) [key](#type-graphqlcachekey) for cache to exempt from reloading. |

##### Examples

_Reloading the [GraphQL cache](#graphql-instance-property-cache)._

> ```js
> graphql.reload()
> ```

#### GraphQL instance method reset

Resets the [GraphQL cache](#graphql-instance-property-cache), useful when a user logs out. Emits a [`GraphQL`](#class-graphql) instance `reset` event.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `exceptCacheKey` | [GraphQLCacheKey](#type-graphqlcachekey)? | A [GraphQL cache](#graphql-instance-property-cache) [key](#type-graphqlcachekey) for cache to exempt from deletion. Useful for resetting cache after a mutation, preserving the mutation cache. |

##### Examples

_Resetting the [GraphQL cache](#graphql-instance-property-cache)._

> ```js
> graphql.reset()
> ```

#### GraphQL instance property cache

Cache of loaded GraphQL operations. You probably don’t need to interact with this unless you’re implementing a server side rendering framework.

**Type:** [GraphQLCache](#type-graphqlcache)

##### Examples

_Export cache as JSON._

> ```js
> const exportedCache = JSON.stringify(graphql.cache)
> ```

_Example cache JSON._

> ```json
> {
>   "a1bCd2": {
>     "data": {
>       "viewer": {
>         "name": "Jayden Seric"
>       }
>     }
>   }
> }
> ```

#### GraphQL instance property operations

A map of loading GraphQL operations. You probably don’t need to interact with this unless you’re implementing a server side rendering framework.

**Type:** object&lt;[GraphQLCacheKey](#type-graphqlcachekey), Promise&lt;[GraphQLCacheValue](#type-graphqlcachevalue)>>

---

### function reportCacheErrors

A [`GraphQL`](#class-graphql) `cache` event handler that reports [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API), HTTP, parse and GraphQL errors via `console.log()`. In a browser environment the grouped error details are expandable.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `data` | object | [`GraphQL`](#class-graphql) `cache` event data. |
| `data.cacheKey` | [GraphQLCacheKey](#type-graphqlcachekey) | [GraphQL cache](#graphql-instance-property-cache) [key](#type-graphqlcachekey). |
| `data.cacheValue` | [GraphQLCacheKey](#type-graphqlcachekey) | [GraphQL cache](#graphql-instance-property-cache) [value](#type-graphqlcachevalue). |

#### Examples

_[`GraphQL`](#class-graphql) initialized to report cache errors._

> ```js
> import { GraphQL, reportCacheErrors } from 'graphql-react'
>
> const graphql = new GraphQL()
> graphql.on('cache', reportCacheErrors)
> ```

---

### type GraphQLCache

A [GraphQL cache](#graphql-instance-property-cache) map of GraphQL operation results.

**Type:** object&lt;[GraphQLCacheKey](#type-graphqlcachekey), [GraphQLCacheValue](#type-graphqlcachevalue)>

#### See

- [`GraphQL`](#class-graphql) constructor accepts this type in `options.cache`.
- [`GraphQL` instance property `cache`](#graphql-instance-property-cache) is this type.

---

### type GraphQLCacheKey

A [GraphQL cache](#type-graphqlcache) key, derived from a hash of the [`fetch` options](#type-graphqlfetchoptions) of the GraphQL operation that populated the [value](#type-graphqlcachevalue).

**Type:** string

---

### type GraphQLCacheValue

JSON serializable GraphQL operation result that includes errors and data.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `fetchError` | string? | `fetch` error message. |
| `httpError` | [HttpError](#type-httperror)? | `fetch` response HTTP error. |
| `parseError` | string? | Parse error message. |
| `graphQLErrors` | Array&lt;object>? | GraphQL response errors. |
| `data` | object? | GraphQL response data. |

---

### type GraphQLFetchOptions

GraphQL API URL and [polyfillable `fetch` options](https://github.github.io/fetch/#options). The `url` property gets extracted and the rest are used as [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) options.

**Type:** object

| Property      | Type               | Description                      |
| :------------ | :----------------- | :------------------------------- |
| `url`         | string             | GraphQL API URL.                 |
| `body`        | string \| FormData | HTTP request body.               |
| `headers`     | object             | HTTP request headers.            |
| `credentials` | string?            | Authentication credentials mode. |

#### See

- [`GraphQLFetchOptionsOverride` functions](#type-graphqlfetchoptionsoverride) accept this type.

---

### type GraphQLFetchOptionsOverride

Overrides default [GraphQL `fetch` options](#type-graphqlfetchoptions). Mutate the provided options object; there is no need to return it.

**Type:** Function

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `options` | [GraphQLFetchOptions](#type-graphqlfetchoptions) | [GraphQL `fetch` options](#type-graphqlfetchoptions) tailored to the [GraphQL operation](#type-graphqloperation), e.g. if there are files to upload `options.body` will be a [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData) instance conforming to the [GraphQL multipart request spec](https://github.com/jaydenseric/graphql-multipart-request-spec). |

#### See

- [`GraphQL` instance method `operate`](#graphql-instance-method-operate) accepts this type in `options.fetchOptionsOverride`.

#### Examples

_Setting [GraphQL `fetch` options](#type-graphqlfetchoptions) for an imaginary API._

> ```js
> options => {
>   options.url = 'https://api.example.com/graphql'
>   options.credentials = 'include'
> }
> ```

---

### type GraphQLOperation

A GraphQL operation. Additional properties may be used; all are sent to the GraphQL server.

**Type:** object

| Property    | Type   | Description                    |
| :---------- | :----- | :----------------------------- |
| `query`     | string | GraphQL queries/mutations.     |
| `variables` | object | Variables used in the `query`. |

#### See

- [`GraphQL` instance method `operate`](#graphql-instance-method-operate) accepts this type in `options.operation`.

---

### type GraphQLOperationLoading

A loading GraphQL operation.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `cacheKey` | [GraphQLCacheKey](#type-graphqlcachekey) | [GraphQL cache](#graphql-instance-property-cache) [key](#type-graphqlcachekey). |
| `cacheValue` | [GraphQLCacheValue](#type-graphqlcachevalue)? | [GraphQL cache](#type-graphqlcache) [value](#type-graphqlcachevalue) from the last identical query. |
| `cacheValuePromise` | Promise&lt;[GraphQLCacheValue](#type-graphqlcachevalue)> | Resolves the loaded [GraphQL cache](#type-graphqlcache) [value](#type-graphqlcachevalue). |

#### See

- [`GraphQL` instance method `operate`](#graphql-instance-method-operate) returns this type.

---

### type GraphQLOperationStatus

The status of a GraphQL operation.

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `load` | Function | Loads the GraphQL operation on demand, updating the [GraphQL cache](#graphql-instance-property-cache). |
| `loading` | boolean | Is the GraphQL operation loading. |
| `cacheKey` | [GraphQLCacheKey](#type-graphqlcachekey) | [GraphQL cache](#graphql-instance-property-cache) [key](#type-graphqlcachekey). |
| `cacheValue` | [GraphQLCacheValue](#type-graphqlcachevalue) | [GraphQL cache](#type-graphqlcache) [value](#type-graphqlcachevalue). |

#### See

---

### type HttpError

[`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) HTTP error.

**Type:** object

| Property     | Type   | Description       |
| :----------- | :----- | :---------------- |
| `status`     | number | HTTP status code. |
| `statusText` | string | HTTP status text. |

---
