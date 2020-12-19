import 'cross-fetch/polyfill'
import nodeFetch from 'node-fetch'
import { GraphQLInt } from 'graphql'
import Koa from 'koa'
import t from 'tap'
import { GraphQL } from '../GraphQL'
import { createGraphQLKoaApp } from './helpers/createGraphQLKoaApp.js'
import { promisifyEvent } from './helpers/promisifyEvent'
import { startServer } from './helpers/startServer'

t.test('GraphQL.cache population via `cache` constructor option', t => {
  const cache = {
    abcdefg: {
      data: {
        echo: 'hello'
      }
    }
  }

  const graphql = new GraphQL({ cache })
  t.equal(graphql.cacheWrapper, null, 'Graphql.cacheWrapper')
  t.deepEquals(graphql.cache, cache, 'GraphQL.cache')
  const graphql2 = new GraphQL()
  t.deepEquals(graphql2.cache, {}, 'Graphql.cache')
  t.end()
})

t.test('GraphQL.operate()', async t => {
  /**
   * Tests [`GraphQL.operate()`]{@link GraphQL#query} under certain conditions.
   * @param {object} options Options.
   * @param {number} options.port GraphQL server port.
   * @param {GraphQLOperation} [options.operation] [GraphQL operation]{@link GraphQLOperation}.
   * @param {boolean} [options.resetOnLoad] Should the [GraphQL cache]{@link GraphQL#cache} reset once the query loads.
   * @param {GraphQLCache} [options.initialGraphQLCache] Initial [GraphQL cache]{@link GraphQL#cache}.
   * @param {GraphQL} [options.graphql] [`GraphQL`]{@link GraphQL} instance.
   * @param {GraphQLCacheValue} options.expectedResolvedCacheValue Expected [GraphQL cache]{@link GraphQL#cache} [value]{@link GraphQLCacheValue}.
   * @param {Function} [options.callback] Callback that accepts result metadata.
   * @returns {Promise} Resolves the test.
   * @ignore
   */
  const testQuery = ({
    port,
    operation = { query: '{ echo }' },
    resetOnLoad,
    reloadOnLoad,
    initialGraphQLCache,
    graphql = new GraphQL({
      cache: {
        // Spread so that cache updates don’t mutate the original object.
        ...initialGraphQLCache
      },
      cacheWrapper: cache => cache
    }),
    expectedResolvedCacheValue,
    expectedResponseType = Response,
    callback
  }) => async t => {
    const fetchEvent = promisifyEvent(graphql, 'fetch')
    const cacheEvent = promisifyEvent(graphql, 'cache')
    if (resetOnLoad) var resetEvent = promisifyEvent(graphql, 'reset')
    if (reloadOnLoad) var reloadEvent = promisifyEvent(graphql, 'reload')

    const { cacheKey, cacheValue, cacheValuePromise } = graphql.operate({
      fetchOptionsOverride(options) {
        options.url = `http://localhost:${port}`
      },
      operation,
      resetOnLoad,
      reloadOnLoad
    })
    t.type(cacheKey, 'string', 'cacheKey')
    t.equal(graphql.cache[cacheKey], cacheValue)
    t.deepEquals(
      cacheValue,
      initialGraphQLCache ? initialGraphQLCache[cacheKey] : undefined,
      'Initial cache value'
    )

    t.equals(cacheKey in graphql.operations, true, 'graphql.operations key')
    t.equals(
      graphql.operations[cacheKey],
      cacheValuePromise,
      'graphql.operations value'
    )

    const cacheValueResolved = await graphql.operations[cacheKey]

    t.equals(
      cacheKey in graphql.operations,
      false,
      'graphql.operations no longer contains the cache key'
    )

    t.deepEquals(
      cacheValueResolved,
      expectedResolvedCacheValue,
      'graphql.operations cache value resolved'
    )

    await t.resolveMatch(
      cacheValuePromise,
      expectedResolvedCacheValue,
      'graphql.operate() cache value resolved'
    )

    const fetchEventData = await fetchEvent

    t.equals(
      fetchEventData.cacheKey,
      cacheKey,
      'GraphQL `fetch` event data property `cacheKey`'
    )

    await t.resolveMatch(
      fetchEventData.cacheValuePromise,
      expectedResolvedCacheValue,
      'GraphQL `fetch` event data property `cacheValuePromise` resolved cache'
    )

    const cacheEventData = await cacheEvent

    t.equals(
      cacheEventData.cacheKey,
      cacheKey,
      'GraphQL `cache` event data property `cacheKey`'
    )

    t.deepEquals(
      cacheEventData.cacheValue,
      expectedResolvedCacheValue,
      'GraphQL `cache` event data property `cacheValue`'
    )

    t.type(
      cacheEventData.response,
      expectedResponseType,
      'GraphQL `cache` event data property `response`'
    )

    if (resetEvent) {
      const resetEventData = await resetEvent
      t.equals(
        resetEventData.exceptCacheKey,
        cacheKey,
        'GraphQL `reset` event data property `exceptCacheKey`'
      )
    }

    if (reloadEvent) {
      const reloadEventData = await reloadEvent
      t.equals(
        reloadEventData.exceptCacheKey,
        cacheKey,
        'GraphQL `reload` event data property `exceptCacheKey`'
      )
    }

    t.deepEquals(
      graphql.cache,
      {
        // If the cache was reset after loading, the only entry should be the
        // last query. Otherwise, the new cache value should be merged into the
        // initial GraphQL cache.
        ...(resetOnLoad ? {} : initialGraphQLCache),
        [cacheKey]: expectedResolvedCacheValue
      },
      'GraphQL cache'
    )

    if (callback) callback({ cacheKey })
  }

  await t.test('Without and with initial cache', async t => {
    const port = await startServer(t, createGraphQLKoaApp())
    const expectedResolvedCacheValue = { data: { echo: 'hello' } }

    let hash

    await t.test(
      'Without initial cache',
      testQuery({
        port,
        expectedResolvedCacheValue,
        callback({ cacheKey }) {
          hash = cacheKey
        }
      })
    )

    await t.test(
      'With initial cache',
      testQuery({
        port,
        initialGraphQLCache: {
          [hash]: expectedResolvedCacheValue
        },
        expectedResolvedCacheValue
      })
    )
  })

  await t.test('With global fetch unavailable', async t => {
    const port = await startServer(t, createGraphQLKoaApp())

    // Store the global fetch polyfill.
    const { fetch } = global

    // Delete the global fetch polyfill.
    delete global.fetch

    await t.test(
      'Run query',
      testQuery({
        port,
        expectedResolvedCacheValue: {
          fetchError: 'Global fetch API or polyfill unavailable.'
        },
        expectedResponseType: 'undefined'
      })
    )

    // Restore the global fetch polyfill.
    global.fetch = fetch
  })

  await t.test('With HTTP and parse errors', async t => {
    const port = await startServer(
      t,
      new Koa().use(async (ctx, next) => {
        ctx.response.status = 404
        ctx.response.type = 'text/plain'
        ctx.response.body = 'Not found.'
        await next()
      })
    )

    await t.test(
      'Run query',
      testQuery({
        port,
        expectedResolvedCacheValue: {
          httpError: {
            status: 404,
            statusText: 'Not Found'
          },
          parseError: `invalid json response body at http://localhost:${port}/ reason: Unexpected token N in JSON at position 0`
        }
      })
    )
  })

  await t.test('With parse error', async t => {
    const port = await startServer(
      t,
      new Koa().use(async (ctx, next) => {
        ctx.response.status = 200
        ctx.response.type = 'text'
        ctx.response.body = 'Not JSON.'
        await next()
      })
    )

    await t.test(
      'Run query',
      testQuery({
        port,
        expectedResolvedCacheValue: {
          parseError: `invalid json response body at http://localhost:${port}/ reason: Unexpected token N in JSON at position 0`
        }
      })
    )
  })

  await t.test('With malformed response payload', async t => {
    const port = await startServer(
      t,
      new Koa().use(async (ctx, next) => {
        ctx.response.status = 200
        ctx.response.type = 'json'
        ctx.response.body = '[{"bad": true}]'
        await next()
      })
    )

    await t.test(
      'Run query',
      testQuery({
        port,
        expectedResolvedCacheValue: {
          parseError: 'Malformed payload.'
        }
      })
    )
  })

  await t.test('With HTTP and GraphQL errors', async t => {
    const port = await startServer(t, createGraphQLKoaApp())
    await t.test(
      'Run query',
      testQuery({
        port,
        operation: { query: '{ b }' },
        expectedResolvedCacheValue: {
          httpError: {
            status: 400,
            statusText: 'Bad Request'
          },
          graphQLErrors: [
            {
              message: 'Cannot query field "b" on type "Query".',
              locations: [
                {
                  line: 1,
                  column: 3
                }
              ]
            }
          ]
        }
      })
    )
  })

  await t.test('With `resetOnLoad` option', async t => {
    const port = await startServer(t, createGraphQLKoaApp())

    const initialGraphQLCache = {
      abcdefg: {
        data: {
          b: true
        }
      }
    }

    const expectedResolvedCacheValue = {
      data: {
        echo: 'hello'
      }
    }

    await t.test(
      '`resetOnLoad` false (default)',
      testQuery({
        port,
        initialGraphQLCache,
        expectedResolvedCacheValue
      })
    )

    await t.test(
      '`resetOnLoad` true',
      testQuery({
        port,
        resetOnLoad: true,
        initialGraphQLCache,
        expectedResolvedCacheValue
      })
    )
  })

  await t.test('With `reloadOnLoad` option', async t => {
    const port = await startServer(t, createGraphQLKoaApp())

    const initialGraphQLCache = {
      abcdefg: {
        data: {
          b: true
        }
      }
    }

    const expectedResolvedCacheValue = {
      data: {
        echo: 'hello'
      }
    }

    await t.test(
      '`reloadOnLoad` false (default)',
      testQuery({
        port,
        initialGraphQLCache,
        expectedResolvedCacheValue
      })
    )

    await t.test(
      '`reloadOnLoad` true',
      testQuery({
        port,
        reloadOnLoad: true,
        initialGraphQLCache,
        expectedResolvedCacheValue
      })
    )
  })

  await t.test('With both `reloadOnLoad` and `resetOnLoad` options true', t => {
    const graphql = new GraphQL({
      fetcher: nodeFetch
    })

    t.throws(() => {
      graphql.operate({
        operation: { query: '' },
        reloadOnLoad: true,
        resetOnLoad: true
      })
    }, new Error('operate() options “reloadOnLoad” and “resetOnLoad” can’t both be true.'))

    t.end()
  })
})

t.test('Concurrent identical queries share a request', async t => {
  let requestCount = 0
  const port = await startServer(
    t,
    createGraphQLKoaApp({
      requestCount: {
        type: GraphQLInt,
        resolve: () => ++requestCount
      }
    })
  )

  const graphql = new GraphQL({
    fetcher: nodeFetch
  })

  const queryOptions = {
    fetchOptionsOverride(options) {
      options.url = `http://localhost:${port}`
    },
    operation: {
      query: '{ requestCount }'
    }
  }

  const {
    cacheKey: cacheKey1,
    cacheValuePromise: cacheValuePromise1
  } = graphql.operate(queryOptions)
  const {
    cacheKey: cacheKey2,
    cacheValuePromise: cacheValuePromise2
  } = graphql.operate(queryOptions)

  // To be sure no mistake was made in the test.
  t.equals(cacheKey1, cacheKey2, 'Shared fetch options hash')

  t.equals(cacheValuePromise1, cacheValuePromise2, 'Shared request')

  t.equals(
    Object.keys(graphql.operations).length,
    1,
    'Number of GraphQL operations loading'
  )

  t.equals(
    cacheKey1 in graphql.operations,
    true,
    'graphql.operations contains the cache key'
  )

  await Promise.all([cacheValuePromise1, cacheValuePromise2])
})

t.test('GraphQL.reload()', async t => {
  await t.test('With `exceptCacheKey` parameter', async t => {
    const graphql = new GraphQL({
      fetcher: nodeFetch
    })
    const exceptCacheKey = 'abcdefg'
    const reloadEvent = promisifyEvent(graphql, 'reload')

    graphql.reload(exceptCacheKey)

    const reloadEventData = await reloadEvent
    t.equals(
      reloadEventData.exceptCacheKey,
      exceptCacheKey,
      'GraphQL `reload` event data property `exceptCacheKey`'
    )
  })

  await t.test('Without `exceptCacheKey` parameter', async t => {
    const graphql = new GraphQL({ fetcher: nodeFetch })
    const reloadEvent = promisifyEvent(graphql, 'reload')

    graphql.reload()

    const reloadEventData = await reloadEvent
    t.equals(
      reloadEventData.exceptCacheKey,
      undefined,
      'GraphQL `reload` event data property `exceptCacheKey`'
    )
  })
})

t.test('GraphQL.reset()', async t => {
  await t.test('Without `exceptCacheKey` parameter', async t => {
    const graphql = new GraphQL({
      fetcher: nodeFetch,
      cache: {
        abcdefg: {
          data: {
            echo: 'hello'
          }
        }
      }
    })

    const resetEvent = promisifyEvent(graphql, 'reset')

    graphql.reset()

    const resetEventData = await resetEvent
    t.equals(
      resetEventData.exceptCacheKey,
      undefined,
      'GraphQL `reset` event data property `exceptCacheKey`'
    )

    t.deepEquals(graphql.cache, {}, 'GraphQL.cache')
  })

  await t.test('With `exceptCacheKey` parameter', async t => {
    const cache1 = {
      abcdefg: {
        data: {
          echo: 'hello'
        }
      }
    }

    const cache2 = {
      ghijkl: {
        data: {
          echo: 'hello'
        }
      }
    }

    const graphql = new GraphQL({
      fetcher: nodeFetch,
      cache: {
        ...cache1,
        ...cache2
      }
    })

    const exceptCacheKey = 'abcdefg'

    const resetEvent = promisifyEvent(graphql, 'reset')

    graphql.reset(exceptCacheKey)

    const resetEventData = await resetEvent
    t.equals(
      resetEventData.exceptCacheKey,
      exceptCacheKey,
      'GraphQL `reset` event data property `exceptCacheKey`'
    )

    t.deepEquals(graphql.cache, cache1, 'GraphQL.cache')
  })
})
