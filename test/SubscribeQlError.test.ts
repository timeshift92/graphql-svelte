import 'cross-fetch/polyfill'
import WebSocket from 'isomorphic-ws'
import { GraphQL } from '../src/GraphQL'
import { SubscribeQL, SubscriptionClient } from '../src/SubscribeQL'
import { subsctiptionServer } from './helpers/createGraphQLKoaApp'


describe('SubscribeQlError', () => {
  let subscription: any;
  let subs: SubscriptionClient
  afterAll(async () => {
    const { server }: any = await serverInfo
    server.close(true);
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
  it('Must provide a query.', () => {
    const subs3 = SubscribeQL(`ws://localhost:${port}/graphql`, {
      reconnect: false,
      lazy: false,
    })
    //@ts-ignore
    subs3.request().subscribe((re: any) => {
      expect(re).toBeTruthy()
      console.log(re)
    }, (e: any) => {
      expect(e).toBeTruthy()
    })
    subs3.checkOperationOptions({ query: 'asdgsad asdf', operationName: 'asdasd', variables: {} }, () => { })
    expect(() =>
      //@ts-ignore
      subs3.checkOperationOptions({}, () => { })).toThrow()
    expect(() =>
      //@ts-ignore
      subs3.checkOperationOptions({ query: 'asdgsad asdf' })).toThrow()

    subs3.formatErrors([])
    subs3.formatErrors({ errors: {} })
    subs3.formatErrors('asda')

  })

  it('connection error', (_done) => {
    const subs3 = SubscribeQL(`ws://localhost:${port}/graphql`, {
      reconnect: false,
      lazy: false,
    })
    const obs = subs3.getObserver({ complete: () => { console.log('COMPLETE') } })
    const r = subs3.request({ query: `asdgas {asdf }` }).subscribe(obs, (e: any) => {
      console.log('ERROR')
      subs3.close()
    }, (c: any) => {
    })
    subs3.onError((e: any) => {
      subs3.close()
    })
    _done()

  })

  it('connection complete - 2', (_done) => {
    const subs3 = SubscribeQL(`ws://localhost:${port}/graphql`, {
      reconnect: false,
      lazy: false,
    })
    const obs = subs3.getObserver({ complete: () => { console.log('COMPLETE') } })
    const r = subs3.request({ query: subquery }).subscribe(obs, (e: any) => { }, (c: any) => {
      console.log('COMPLETE')
    })

    subs3.close()
    _done()

  })
  it('clear timeouts', (_done) => {
    const subs3 = SubscribeQL(`ws://localhost:${port}/graphql`, {
      reconnect: true,
      timeout: 100,
      inactivityTimeout: 100,
      connectionCallback: (c: any) => c,
      connectionParams: () => { throw Error('asda') }
    })
    subs3.checkConnectionIntervalId = true;
    subs3.clearCheckConnectionInterval()
    subs3.inactivityTimeoutId = 15
    subs3.clearInactivityTimeout()
    subs3.close()

    _done()
  })

  it('checkConnection', () => {
    const subs3 = SubscribeQL(`ws://localhost:${port}/graphql`, {
      reconnect: false,
      timeout: 100,
      inactivityTimeout: 100,
      connectionCallback: (c: any) => c,
      connectionParams: () => { throw Error('asda') }
    })
    subs3.sendMessageRaw({ 'id': "1", 'type': 't', payload: "asdas" })

    subs3.reconnecting = false;
    subs3.checkConnection()
    subs3.wasKeepAliveReceived = true;
    subs3.checkConnection()
    subs3.connect()
    subs3.close()
  })




  it('connection complete', (_done) => {
    const subs3 = SubscribeQL(`ws://localhost:${port}/graphql`, {
      reconnect: false,
      // timeout: 100,
      lazy: true,
      connectionCallback: (c: any) => c,
      connectionParams: () => { throw Error('asda') }
    })
    const key = Object.keys(subs3.operations)[0]
    subs3.checkConnectionIntervalId = true;
    subs3.wasKeepAliveReceived = true
    subs3.processReceivedData(JSON.stringify({ id: subs3.operations[key], type: "ka", }))
    


    const r = subs3.request({ query: subquery }).subscribe((r: any) => {

      console.log(r)


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

    subs3.onConnected(() => {
      const graphql = new GraphQL()
      let mutationResult = {}

      const { cacheKey, cacheValue, cacheValuePromise } = graphql.operate({
        fetchOptionsOverride(options: any) {
          options.url = `http://localhost:${port}/graphql`
        },
        operation: mutation
      })
    })
    subs3.close()
    _done()


  })


})



