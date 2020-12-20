//@ts-nocheck
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import { errorHandler, execute } from 'graphql-api-koa'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

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
          defaultValue: 'hello',
        },
      },
      resolve: (root, { phrase }) => phrase,
    },
  }
) =>
  new Koa()
    .use(errorHandler())
    .use(bodyParser({}))
    .use(
      execute({
        schema: new GraphQLSchema({

          query: new GraphQLObjectType({
            name: 'Query',
            fields,
          }),
        }),
      })
    )
import { ApolloServer, gql, PubSub } from 'apollo-server'
// const { ApolloServer, gql,PubSub } = require('apollo-server');
const pubsub = new PubSub()
const typeDefs = gql`
      # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

      # This "Book" type defines the queryable fields for every book in our data source.
      type Book {
        title: String
        author: String
      }

      # The "Query" type is special: it lists all of the available queries that
      # clients can execute, along with the return type for each. In this
      # case, the "books" query returns an array of zero or more Books (defined above).
      type Query {
        books: [Book]
        echo: String
        requestCount: Int
      }

      type Subscription {
        bookAdded: Book
      }

      type Mutation {
        addBook(title: String, author: String): Book
      }
    `

let books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster'
  }
]

const BOOK_ADDED = 'BOOK_ADDED'

const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED])
    }
  },
  Query: {
    books(root, args, context) {
      return books
    },
    echo(root, args, context) {
      return 'hello'
    }
  },
  Mutation: {
    addBook(root, args, context) {
      pubsub.publish(BOOK_ADDED, { bookAdded: args })
      books.push(args)
      return args
    }
  }
}

export function subsctiptionServer(request?: any) {
  // resolvers.Query = Object.assign(resolvers.Query, request)
  return new ApolloServer({ typeDefs, resolvers })
}
