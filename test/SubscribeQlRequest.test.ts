import 'cross-fetch/polyfill'
import WebSocket from 'isomorphic-ws'
import { GraphQL } from '../src/GraphQL'
import { SubscribeQL, SubscriptionClient } from '../src/SubscribeQL'
import { subsctiptionServer } from './helpers/createGraphQLKoaApp'


describe('SubscribeQlConnections', () => {
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
    lazy: true,
    timeout: 150
  })

  const subquery = `subscription{
    bookAdded{
      title2
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


  it('request', (_done) => {

    const obs =  subs.getObserver({ complete:()=> {subs.close(); _done();}},(err:any) => console.log(err) )
    const r = subs.request({ query: subquery })

    .subscribe(
      obs
      // (r: any) => { console.log(r);  subs.close(); _done();  }
    , (e: any) => e, (comp: any) => {
    })
    subs.onError((e: any) => {
      console.log(e)
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
