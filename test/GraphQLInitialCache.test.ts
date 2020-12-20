import 'cross-fetch/polyfill'
import { GraphQLInt } from 'graphql'
import Koa from 'koa'
import { GraphQLCacheKey, GraphQLCacheValue } from '../'
import { GraphQL } from '../src/GraphQL'
import { createGraphQLKoaApp } from './helpers/createGraphQLKoaApp'
import { promisifyEvent } from './helpers/promisifyEvent'
import { startServer } from './helpers/startServer'
import { testQuery } from './helpers/graphqlOperate'

describe('Without and with initial cache', () => {
  afterAll(async () => {
    const { server }: any = await serverInfo
    server.close();
    return
  });
  const port = Math.floor(Math.random() * (7000 - 6000) + 6000)
  const serverInfo = startServer(createGraphQLKoaApp(), port)
  const expectedResolvedCacheValue = { data: { echo: 'hello' } }

  let hash: any;

  describe(
    'Without initial cache',
    testQuery({
      port,
      expectedResolvedCacheValue,
      callback({ cacheKey }: any) {
        hash = cacheKey
      },
    })
  )

  describe(
    'With initial cache',
    testQuery({
      port,
      initialGraphQLCache: {
        [hash]: expectedResolvedCacheValue,
      },
      expectedResolvedCacheValue,
    })
  )


});

