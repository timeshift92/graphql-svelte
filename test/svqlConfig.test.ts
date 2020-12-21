import 'cross-fetch/polyfill'
import WebSocket from 'isomorphic-ws'
import { GraphQL } from '../src/GraphQL'
import { getClient, setHeaders, headers } from '../src/svqlConfig'
import { subsctiptionServer } from './helpers/createGraphQLKoaApp'

describe('setup config', () => {
  let subscription: any;
  //@ts-ignore

  let subs: SubscriptionClient
  afterAll(async () => {
    const { server }: any = await serverInfo
    server.close();
    subs.close(true);
    subscription.unsubscribe()
    return server
  });
  const port = 54634
  const serverInfo = subsctiptionServer().listen(port)
  //@ts-ignore
  global.WebSocket = WebSocket
  const client = getClient({ url: `http://localhost:${port}/graphql`, wsUrl: `ws://localhost:${port}/graphql`, wsOptions: { reconnect: true } })
  const client4 = getClient({ url: `http://localhost:${port}/graphql` })
  const client2 = getClient({
    url: 'test', wsUrl: 'test', wsOptions: {
      connectionParams: {}
    },
    graphqlOptions: {
      cacheWrapper: (r: any) => r
    }
  })

  let header = { 'test': 'test' }

  test('subscription config test', (_done) => {
    const client3 = getClient({ url: `http://localhost:${port}/graphql`, wsUrl: `ws://localhost:${port}/graphql`, wsOptions: { reconnect: true } })
    expect(client3.subscription({ query: 'test', variables: { a: 'asdsa' } })).toBeTruthy()
    expect(client3.subscription({
      query: `subscription{
      bookAdded{
        title
      }
    }`, variables: { a: 'asdsa' }
    }).subscribe((res: any) => {
      client3.sub.close()
      _done()
    })).toBeTruthy()

    client3.graphql.cache['1ir4vxr'] = {

    }

    client3.query({ query: ` books { title } ` }).then(res => {
      expect(res).toBeTruthy()

    })

    client3.query({ query: ` books { title } `, cache: false }).then(res => {
      expect(res).toBeTruthy()
      client3.query({ query: ` books { title } ` }).then(res => {
        expect(res).toBeTruthy()

      })
    })

    client3.sub.onConnected(() => {
      client3.mutate({
        query: `mutation{
        addBook(title:"test",author:"asdasd"){
          author
          title
        }
      }`})

    })

  })
  test('check client with cache options', () => {
    setHeaders(header)
    client.graphql.cache['q2selr'] = {
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
    }
    expect(client).toBeTruthy()
    expect(client.query({ query: 'test' })).toBeTruthy()
    expect(client.mutate({ query: 'test', cache: false, key: (k: any) => k })).toBeTruthy()
    expect(client.mutate({ query: 'test', cache: true, key: (k: any) => k })).toBeTruthy()

    expect(header).toEqual(headers())
  })

  test('check client', () => {
    setHeaders(header)
    client.graphql.cache['q2selr'] = {
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
    }
    expect(client).toBeTruthy()
    expect(client.query({ query: 'test' })).toBeTruthy()
    expect(client.mutate({ query: 'test', cache: false, key: (k: any) => k })).toBeTruthy()
    expect(client.mutate({ query: 'test', cache: true, key: (k: any) => k })).toBeTruthy()

    expect(header).toEqual(headers())
  })
  test('check client', () => {
    setHeaders(header)
    expect(client2).toBeTruthy()
    expect(client2.query({ query: 'test' })).toBeTruthy()
    expect(header).toEqual(headers())
  })



})
