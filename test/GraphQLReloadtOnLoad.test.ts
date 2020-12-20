import 'cross-fetch/polyfill'
import { GraphQLInt } from 'graphql'
import Koa from 'koa'
import { GraphQLCacheKey, GraphQLCacheValue } from '../'
import { GraphQL } from '../src/GraphQL'
import { createGraphQLKoaApp } from './helpers/createGraphQLKoaApp'
import { promisifyEvent } from './helpers/promisifyEvent'
import { startServer } from './helpers/startServer'
import { testQuery } from './helpers/graphqlOperate'


describe('With `reloadOnLoad` option', () => {
  afterAll(async () => {
    const { server }: any = await serverInfo
    server.close();
    return
  });
  const port = Math.floor(Math.random() * (15000 - 6000) + 6000)
  const serverInfo = startServer(createGraphQLKoaApp(), port)

  const initialGraphQLCache = {
    abcdefg: {
      data: {
        b: true,
      },
    },
  }

  const expectedResolvedCacheValue = {
    data: {
      echo: 'hello',
    },
  }

  describe(
    '`reloadOnLoad` false (default)',
    testQuery({
      port,
      initialGraphQLCache,
      expectedResolvedCacheValue,
    })
  )

  describe(
    '`reloadOnLoad` true',
    testQuery({
      port,
      reloadOnLoad: true,
      initialGraphQLCache,
      expectedResolvedCacheValue,
    })
  )
})
