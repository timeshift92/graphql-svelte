import 'cross-fetch/polyfill'
import { GraphQLInt } from 'graphql'
import Koa from 'koa'
import { GraphQLCacheKey, GraphQLCacheValue } from '../'
import { GraphQL } from '../src/GraphQL'
import { createGraphQLKoaApp } from './helpers/createGraphQLKoaApp'
import { promisifyEvent } from './helpers/promisifyEvent'
import { startServer } from './helpers/startServer'
import { testQuery } from './helpers/graphqlOperate'

describe('With HTTP and GraphQL errors', () => {
  afterAll(async () => {
    const { server }: any = await serverInfo
    server.close();
    return
  });
  const port = Math.floor(Math.random() * (7000 - 6000) + 6000)
  const serverInfo = startServer(createGraphQLKoaApp(), port)

  describe(
    'Run query',
    testQuery({
      port,
      operation: { query: '{ b }' },
      expectedResolvedCacheValue: {
        httpError: {
          status: 400,
          statusText: 'Bad Request',
        },
        graphQLErrors: [
          {
            message: 'Cannot query field "b" on type "Query".',
            locations: [
              {
                line: 1,
                column: 3,
              },
            ],
          },
        ],
      },
    })
  )
})

