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
    connectionCallback: (c: any) => c,
    connectionParams: () => { throw Error('asda') }
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






  it('Error Handle', (_done) => {


    subs.request({ query: `subscription{ bookAdded{  title  }  }` }).subscribe((r: any) => {
      console.log(r)
    }, (e: any) => e, (comp: any) => {
    })


    subs.onError((e:any)=>{
      expect(e).toBeTruthy()
      subs.close()
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

    },'asdas')

  })



})



