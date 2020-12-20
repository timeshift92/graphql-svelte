import 'cross-fetch/polyfill'
import Koa from 'koa'
import { startServer } from './helpers/startServer'
import { testQuery } from './helpers/graphqlOperate'





describe('With malformed response payload', () => {
  afterAll(async () => {
    const { server }: any = await serverInfo
    server.close();
    return
  });
  const port = Math.floor(Math.random() * (7000 - 6000) + 6000)
  const serverInfo = startServer(new Koa().use(async (ctx, next) => {
    ctx.response.status = 200
    ctx.response.type = 'json'
    ctx.response.body = '[{"bad": true}]'
    await next()
  }), port)

  describe(
    'Run query',
    testQuery({
      port,
      expectedResolvedCacheValue: {
        parseError: 'Malformed payload.',
      },
    })
  )
})
