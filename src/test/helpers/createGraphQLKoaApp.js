import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'
import { errorHandler, execute } from 'graphql-api-koa'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { subscriptionManager, schema } from "./subscriptions";
/**
 * Creates a GraphQL Koa app.
 * @param {object} fields GraphQL `query` fields.
 * @returns {object} Koa instance.
 */
export const createGraphQLKoaApp = (
  fields = {
    echo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        phrase: {
          type: GraphQLString,
          defaultValue: 'hello'
        }
      },
      resolve: (root, { phrase }) => phrase
    }
  }
) =>
  new Koa()
    .use(errorHandler())
    .use(bodyParser())
    .use(
      execute({
        schema: new GraphQLSchema({
          query: new GraphQLObjectType({
            name: 'Query',
            fields
          })
        })
      })
    )


export const createSubscriptionServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

const subscriptionServer = new SubscriptionServer({
  onConnect: async (connectionParams, webSocket) => {
    console.log('WebSocket connection established');
    // the following object fields will be added to subscriptions context and filter methods
    return {
      authToken: connectionParams.authToken
    }
  },
  onUnsubscribe: (a, b) => {
    console.log('Unsubscribing');
  },
  onDisconnect: (a, b) => {
    console.log('Disconnecting');
  },
  subscriptionManager: subscriptionManager
}, {
  server: createSubscriptionServer,
  path: '/'
});



