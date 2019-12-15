// import 'cross-fetch/polyfill'
// import { GraphQLInt } from 'graphql'
// import Koa from 'koa'
// import t from 'tap'
// import { GraphQL } from '../GraphQL'
// import { SubscribeQL } from '../SubscribeQL'
// import { createSubscriptionServer } from './helpers/createGraphQLKoaApp'
// import { promisifyEvent } from './helpers/promisifyEvent'
// import { startServer } from './helpers/startServer'
// import { createServer } from "http";
// import { SubscriptionServer } from "subscriptions-transport-ws";
// import { subscriptionManager, schema } from "./helpers/subscriptions";

// t.test('SubscribeQl', async t => {
//   await t.test('With global fetch unavailable', async t => {

//      const createSubscriptionServer = createServer((request, response) => {
//       response.writeHead(404);
//       response.end();
//     });

//     const subscriptionServer = new SubscriptionServer({
//       onConnect: async (connectionParams, webSocket) => {
//         console.log('WebSocket connection established');
//         // the following object fields will be added to subscriptions context and filter methods
//         return {
//           authToken: connectionParams.authToken
//         }
//       },
//       onUnsubscribe: (a, b) => {
//         console.log('Unsubscribing');
//       },
//       onDisconnect: (a, b) => {
//         console.log('Disconnecting');
//       },
//       subscriptionManager: subscriptionManager
//     }, {
//       server: createSubscriptionServer,
//       path: '/'
//     });

//       const port = 5022
//       subscriptionServer.listen(port, () => {
//       console.log(`Websocket listening on port ${port}`)
//     })

//     // const port = await startServer(t, createSubscriptionServer)
//     // console.log(port)


//     const initSub = (ws, headers) => new SubscribeQL(ws.url, {
//       reconnect: ws.reconnect || true,
//       lazy: ws.lazy || true,
//       ...ws.connectionParams ? { connectionParams: ws.connectionParams } : {
//         connectionParams: () => {
//           return { headers }
//         }
//       }
//     });

//     let sub = initSub({ url: `ws://localhost:${port}` })

//     sub.request({ query: "{messages}" }).subscribe(c => {
//       console.log(c)
//     },e => {
//       console.log(e)
//     })

//   })
// })
