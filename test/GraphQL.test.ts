import 'cross-fetch/polyfill'
import { GraphQLInt } from 'graphql'
import Koa from 'koa'
import { GraphQLCacheKey, GraphQLCacheValue } from '..'
import { GraphQL } from '../src/GraphQL'
import { createGraphQLKoaApp } from './helpers/createGraphQLKoaApp'
import { promisifyEvent } from './helpers/promisifyEvent'
import { startServer } from './helpers/startServer'

describe('GraphQL.cache population via `cache` constructor option', () => {
  const cache = {
    abcdefg: {
      data: {
        echo: 'hello',
      },
    },
  }
  it('GraphQL.cache', () => {
    const graphql = new GraphQL({ cache })
    expect(graphql.cache).toEqual(cache)
  })

  it('Graphql.cacheWrapper', () => {
    const graphql = new GraphQL({ cache })
    expect(graphql.cache).toEqual(cache)
  })

})

describe('GraphQL.operate()', () => {
  const testQuery = ({
    port,
    operation = { query: '{ echo }' },
    resetOnLoad = false,
    reloadOnLoad = false,
    initialGraphQLCache,
    graphql = new GraphQL({
      cache: {
        // Spread so that cache updates don’t mutate the original object.
        ...initialGraphQLCache,
      },
      cacheWrapper: (cache: any) => cache,
    }),
    expectedResolvedCacheValue,
    expectedResponseType = true,
    callback,
  }: any) => () => {
    const fetchEvent = promisifyEvent<{ cacheKey: string, cacheValuePromise: Promise<any> }>(graphql, 'fetch')
    const cacheEvent: any = promisifyEvent<{ cacheKey: string, cacheValuePromise: Promise<any> }>(graphql, 'cache')
    if (resetOnLoad) var resetEvent: any = promisifyEvent(graphql, 'reset')
    if (reloadOnLoad) var reloadEvent: any = promisifyEvent(graphql, 'reload')

    const { cacheKey, cacheValue, cacheValuePromise } = graphql.operate({
      fetchOptionsOverride(options: { url: string }) {
        options.url = `http://localhost:${port}`
      },
      operation,
      resetOnLoad,
      reloadOnLoad,
    })
    let cacheEventData: any
    cacheEvent.then((res:any) => {
      cacheEventData = res;
    })

    expect(typeof cacheKey).toEqual('string')
    expect(graphql.cache[cacheKey]).toEqual(cacheValue)

    it('Initial cache value', async () => {
    })
    expect(cacheValue).toEqual(initialGraphQLCache ? initialGraphQLCache[cacheKey] : undefined)


    test('graphql.operations key', () => {
    })
    expect(cacheKey in graphql.operations).toEqual(true)

    it('graphql.operations value', () => { })
    expect(graphql.operations[cacheKey]).toEqual(cacheValuePromise)

    graphql.operations[cacheKey].then((res: any) => {
      cacheValueResolved = res
    })
    let cacheValueResolved: any
    it('graphql.operations no longer contains the cache key', async () => {
      await graphql.operations[cacheKey]
      expect(cacheKey in graphql.operations).toEqual(false)
    })

    it('graphql.operations cache value resolved', async () => {
      expect(cacheValueResolved).toEqual(expectedResolvedCacheValue)
    })
    it('graphql.operate() cache value resolved', async () => {
      const value = await cacheValuePromise
      expect(value).toEqual(expectedResolvedCacheValue);
    })

    fetchEvent.then((res: any) => {
      fetchEventData = res
    })

    let fetchEventData: any

    it('GraphQL `fetch` event data property `cacheKey`', async () => {
      expect(fetchEventData.cacheKey).toEqual(cacheKey)
    })

    it('GraphQL `fetch` event data property `cacheValuePromise` resolved cache', async () => {
      expect(fetchEventData.cacheValuePromise).toEqual(cacheValuePromise);
    })

    // cacheEvent.then((res: any) => {
    //   cacheEventData = res
    // })

    it('GraphQL `cache` event data property `cacheKey`',  () => {
      expect(cacheEventData.cacheKey).toEqual(cacheKey);
    })

    it('GraphQL `cache` event data property `cacheValue`',  () => {
      expect(cacheEventData.cacheValue).toEqual(expectedResolvedCacheValue);
    })

    it('GraphQL `cache` event data property `response`', async () => {
       const evt = await cacheEventData
      expectedResponseType ?
        expect(evt.response instanceof Response).toBeTruthy()
        : expect(evt.response == undefined).toBeTruthy();


    })

    if (resetEvent) {
      it('GraphQL `reset` event data property `exceptCacheKey`', async () => {
        const resetEventData: any = await resetEvent

        expect(resetEventData.exceptCacheKey).toEqual(cacheKey);
      })

    }

    if (reloadEvent) {

      it('GraphQL `reload` event data property `exceptCacheKey`', async () => {
        const reloadEventData: any = await reloadEvent

        expect(reloadEventData.exceptCacheKey).toEqual(cacheKey);
      })
    }


    it('GraphQL cache', () => {
      expect(graphql.cache).toEqual({
        // If the cache was reset after loading, the only entry should be the
        // last query. Otherwise, the new cache value should be merged into the
        // initial GraphQL cache.
        ...(resetOnLoad ? {} : initialGraphQLCache),
        [cacheKey]: expectedResolvedCacheValue,
      });
    })

    if (callback) callback({ cacheKey })
  }







  describe(
    'With both `reloadOnLoad` and `resetOnLoad` options true',
    () => {
      const graphql = new GraphQL()
      expect(() => {
        graphql.operate({
          operation: { query: '' },
          reloadOnLoad: true,
          resetOnLoad: true,
        })
      }).toThrowError(new Error('operate() options “reloadOnLoad” and “resetOnLoad” can’t both be true.'));

    }
  )

  describe('With global fetch unavailable', () => {

    afterAll(async () => {
      const { server }: any = await serverInfo
      server.close();
      return
    });
    const port =  Math.floor(Math.random() * (55632 - 54632) + 54632)
    const serverInfo = startServer(createGraphQLKoaApp(), port)
    // Store the global fetch polyfill.
    const { fetch } = global

    // Delete the global fetch polyfill.
    //@ts-ignore
    delete global.fetch
    describe(
      'Run query',
      testQuery({
        port,
        expectedResolvedCacheValue: {
          fetchError: 'Global fetch API or polyfill unavailable.',
        },
        expectedResponseType: false,
      })
    )

    // Restore the global fetch polyfill.
    global.fetch = fetch
  })
})

