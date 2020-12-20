import 'cross-fetch/polyfill'
import WebSocket from 'isomorphic-ws'
import { GraphQL } from '../src/GraphQL'
import { SubscribeQL, SubscriptionClient } from '../src/SubscribeQL'
import { subsctiptionServer } from './helpers/createGraphQLKoaApp'


describe('SubscribeQl', () => {
  let subscription: any;
  let subs: SubscriptionClient
  afterAll(async () => {
    const { server }: any = await serverInfo
    server.close();
    subs.close(true);
    subscription.unsubscribe()
    return server
  });
  const port = Math.floor(Math.random() * (55632 - 54632) + 54632)
  const serverInfo = subsctiptionServer().listen(port)
  //@ts-ignore
  global.WebSocket = WebSocket
  subs = SubscribeQL(`ws://localhost:${port}/graphql`, {
    reconnect: true,
    lazy: true
  })

  const subquery = `subscription{
    bookAdded{
      title
    }
  }`

  const mutation = {
    query: `mutation{
    addBook(title:"test",author:"asdasd"){
      author
      title
    }
  }`
  }
  it('url error', () => {
    const url = `asdgasd`
    expect(SubscribeQL).toThrow()
  })
  it('status closed', () => {
    expect(subs.status).toEqual(subs.wsImpl.CLOSED)
  })

  it('connection params undefined', (_done) => {
    const subs3 = SubscribeQL(`ws://localhost:${port}/graphql`, {
      reconnect: true,
      timeout: 100,
      inactivityTimeout: 100,
      connectionParams: () => { throw Error('asda') }
    })
    subs3.request({ query: subquery }).subscribe((r: any) => {
      subs3.close()
    })
    subs3.tryReconnect()
    subs3.checkConnection()
    expect(subs3.processReceivedData).toThrowError()
    subs3.checkMaxConnectTimeout()
    subs3.onReconnected(() => {
      subs3.close()
      _done()
    })
    subs3.close()

    _done()
  }, 1500)


  it('connection complete', (_done) => {
    const subs3 = SubscribeQL(`ws://localhost:${port}/graphql`, {
      reconnect: true,
      timeout: 100,
      inactivityTimeout: 100,
      connectionCallback: (c: any) => c,
      connectionParams: () => { throw Error('asda') }
    })

    const r = subs3.request({ query: subquery }).subscribe((r: any) => {
      subs3.close(false)
    }, (e: any) => e, (comp: any) => {
    })
    const obs = subs3.getObserver((r: any) => r, (e: any) => e, () => { })
    obs.complete()
    //@ts-ignore
    const obs3 = subs3.getObserver({ a: '1' }, (e: any) => e, () => { })
    obs.complete()
    subs3.processReceivedData(JSON.stringify({ type: "connection_error", id: subs3.operations[0] }))
    subs3.processReceivedData(JSON.stringify({ type: "connection_ack", id: subs3.operations[0] }))
    subs3.processReceivedData(JSON.stringify({ type: "complete", id: subs3.operations[0] }))
    subs3.close()
    _done()


  })

  it('status closed', (_done) => {
    const subs2 = SubscribeQL(`ws://localhost:${port}/graphql`, {
      reconnect: true,
      lazy: true
    })
    subs2.request({ query: subquery }).subscribe((r: any) => {
      console.log(r)
    })
    subs2.close()
    _done()
  })

  it('subscription without variables', (_done: any) => {
    subscription = subs.request({ query: subquery }).subscribe((c: any) => {
      subs.close(true)
      expect({
        data: {
          bookAdded: {
            title: 'test'
          }
        }
      }).toEqual(c)
      _done()
    })

    subs.onConnected(() => {
      const graphql = new GraphQL()
      let mutationResult = {}
      const { cacheKey, cacheValue, cacheValuePromise } = graphql.operate({
        fetchOptionsOverride(options: any) {
          options.url = `http://localhost:${port}/graphql`
        },
        operation: mutation
      })
    })

  }, 1500)

  it('subscription with variables', (_done: any) => {

    subscription = subs.request({ query: subquery, variables: { "Asdas": 'asda' } }).subscribe((c: any) => {
      const key = Object.keys(subs.operations)[0]
      subs.processReceivedData(JSON.stringify({ id: key, type: "complete", }))
      subs.processReceivedData(JSON.stringify({ id: key, type: "data", payload: { errors: [{1:1}] } }))

      subs.close(true)
      expect({
        data: {
          bookAdded: {
            title: 'test'
          }
        }
      }).toEqual(c)
      _done()
    }, (err: any) => {
      console.log('ERR subscription with variables')
      console.log(err)
    })
    const key = Object.keys(subs.operations)[0]
    subs.processReceivedData(JSON.stringify({ id: subs.operations[key], type: "connection_error", }));
    subs.reconnecting = true
    subs.processReceivedData(JSON.stringify({ id: subs.operations[key], type: "connection_ack", }));
    subs.processReceivedData(JSON.stringify({ id: subs.operations[key], type: "ka", }));
    subs.processReceivedData(JSON.stringify({ id: subs.operations[key], type: "complete", }));
    expect(() =>
      subs.processReceivedData(JSON.stringify({ id: subs.operations[key], type: "sadh324he", })))
      .toThrow()



    subs.onConnecting(() => {

    },'asdas')
    subs.onReconnected(() => {

    },'asdas')
    subs.onReconnecting(() => {

    },'asdas')
    subs.onDisconnected(() => {

    },'asdas')
    subs.onConnected(() => {

      subs.maxConnectTimeoutId
      const graphql = new GraphQL()
      let mutationResult = {}
      const { cacheKey, cacheValue, cacheValuePromise } = graphql.operate({
        fetchOptionsOverride(options: any) {
          options.url = `http://localhost:${port}/graphql`
        },
        operation: mutation
      })
    })

  }, 5500)

  it('subscription query error', (_done: any) => {

    subscription = subs.request({ query: 'subquery' }).subscribe((c: any) => {
      subs.close(true)
      expect({
        data: {
          bookAdded: {
            title: 'test'
          }
        }
      }).toEqual(c)
      _done()
    })
    subs.onError((e: any) => {
      expect(e).toBeTruthy()
      _done()
    })

    subs.onConnected(() => {
      const graphql = new GraphQL()
      let mutationResult = {}
      const { cacheKey, cacheValue, cacheValuePromise } = graphql.operate({
        fetchOptionsOverride(options: any) {
          options.url = `http://localhost:${port}/graphql`
        },
        operation: mutation
      })
    })

  })

  it('Incorrect option types. query must be a string', (_done: any) => {

    subscription = subs.request({ query: 12312 }).subscribe((c: any) => {
      subs.close(true)
      expect({
        data: {
          bookAdded: {
            title: 'test'
          }
        }
      }).toEqual(c)
      _done()
    }, (err: any) => {
      expect(err).toBeTruthy()
      _done()
    }, (complete: any) => {
      console.log(complete)
      expect(complete).toBeTruthy()
      _done()
    })
    subs.onError((e: any) => {

      expect(e).toBeTruthy()
      _done()
    })

    subs.onConnected(() => {
      const graphql = new GraphQL()
      let mutationResult = {}
      const { cacheKey, cacheValue, cacheValuePromise } = graphql.operate({
        fetchOptionsOverride(options: any) {
          options.url = `http://localhost:${port}/graphql`
        },
        operation: mutation
      })
    })

  })


})



