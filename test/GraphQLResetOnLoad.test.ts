import 'cross-fetch/polyfill'
import { GraphQLInt } from 'graphql'
import Koa from 'koa'
import { GraphQLCacheKey, GraphQLCacheValue } from '../'
import { GraphQL } from '../src/GraphQL'
import { createGraphQLKoaApp } from './helpers/createGraphQLKoaApp'
import { promisifyEvent } from './helpers/promisifyEvent'
import { startServer } from './helpers/startServer'
import { testQuery } from './helpers/graphqlOperate'


describe('With `resetOnLoad` option', () => {
  afterAll(async () => {
    const { server }: any = await serverInfo
    server.close();
    return
  });
  const port = Math.floor(Math.random() * (7000 - 6000) + 6000)
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
    '`resetOnLoad` false (default)',
    testQuery({
      port,
      initialGraphQLCache,
      expectedResolvedCacheValue,
    })
  )

  describe(
    '`resetOnLoad` true',
    testQuery({
      port,
      resetOnLoad: true,
      initialGraphQLCache,
      expectedResolvedCacheValue,
    })
  )
})
