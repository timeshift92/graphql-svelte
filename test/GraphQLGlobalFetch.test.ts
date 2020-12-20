import 'cross-fetch/polyfill'
import { GraphQLInt } from 'graphql'
import Koa from 'koa'
import { GraphQLCacheKey, GraphQLCacheValue } from '..'
import { GraphQL } from '../src/GraphQL'
import { createGraphQLKoaApp } from './helpers/createGraphQLKoaApp'
import { testQuery } from './helpers/graphqlOperate'
import { promisifyEvent } from './helpers/promisifyEvent'
import { startServer } from './helpers/startServer'







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

