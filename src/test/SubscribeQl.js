// import 'cross-fetch/polyfill'
// import WebSocket from 'isomorphic-ws'
// import t from 'tap'
// import { GraphQL } from '../GraphQL'
// import { SubscribeQL } from '../SubscribeQL'
// import { subsctiptionServer } from './helpers/createGraphQLKoaApp.js'

// t.test('SubscribeQl', async t => {
//   let serverInfo = await subsctiptionServer().listen()
//   let port = serverInfo.port
//   global.WebSocket = WebSocket
//   const subs = SubscribeQL(`ws://localhost:${port}/graphql`, {
//     reconnect: true,
//     lazy: true
//   })
//   const subquery = `subscription{
//       bookAdded{
//         title
//       }
//     }`

//   const mutation = {
//     query: `mutation{
//       addBook(title:"test",author:"asdasd"){
//         author
//         title
//       }
//     }`
//   }

//   const subsctiption = subs.request({ query: subquery }).subscribe(c => {
//     console.log('RESULT')
//     serverInfo.server.close()
//     subsctiption.unsubscribe()
//     t.deepEquals(
//       {
//         data: {
//           bookAdded: {
//             title: 'test'
//           }
//         }
//       },
//       c
//     )
//     t.end()
//   })

//   subs.onConnected(() => {
//     const graphql = new GraphQL()
//     let mutationResult = {}
//     const { cacheKey, cacheValue, cacheValuePromise } = graphql.operate({
//       fetchOptionsOverride(options) {
//         options.url = `http://localhost:${port}/graphql`
//       },
//       operation: mutation
//     })
//   })

//   // await t.test('Check Subscription', t => {

//   //

//   // const graphql = new GraphQL()
//   // let mutationResult = {}
//   // setTimeout(async () => {
//   //   const { cacheKey, cacheValue, cacheValuePromise } = graphql.operate({
//   //     fetchOptionsOverride(options) {
//   //       options.url = `http://localhost:${port}/graphql`
//   //     },
//   //     operation: mutation
//   //   })

//   //   console.log('PORT')
//   //   mutationResult = await cacheValuePromise
//   //   // console.log(await cacheValuePromise)
//   // }, 1000);
//   // t.deepEquals(mutationResult, mutationResult)
//   // // console.log(await subs)
//   // let resolve
//   // return new Promise(r => resolve = r).resolve()
//   // t.equal(1, 1)
//   // })
//   console.log('end')
// })
