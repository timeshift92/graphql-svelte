import 'cross-fetch/polyfill'
import { GraphQLInt } from 'graphql'
import Koa from 'koa'
import { GraphQLCacheKey, GraphQLCacheValue } from '../'
import { GraphQL } from '../src/GraphQL'
import { createGraphQLKoaApp } from './helpers/createGraphQLKoaApp'
import { promisifyEvent } from './helpers/promisifyEvent'
import { startServer } from './helpers/startServer'
import { testQuery } from './helpers/graphqlOperate'



describe('With parse error', () => {
  afterAll(async () => {
    const { server }: any = await serverInfo
    server.close();
    return
  });
  const port = Math.floor(Math.random() * (7000 - 6000) + 6000)
  const serverInfo = startServer(new Koa().use(async (ctx, next) => {
    ctx.response.status = 200
    ctx.response.type = 'text'
    ctx.response.body = 'Not JSON.'
    await next()
  }), port)
  describe(
    'Run query',
    testQuery({
      port,
      expectedResolvedCacheValue: {
        parseError: `invalid json response body at http://localhost:${port}/ reason: Unexpected token N in JSON at position 0`,
      },
    })
  )
})
