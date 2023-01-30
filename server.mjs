import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServerErrorCode } from '@apollo/server/errors';


// The GraphQL schema


// A map of functions which return data for the schema.
import typeDefs from './gql/schema/index.js';
import resolvers from './gql/resolvers/index.js';

const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError, error) => {
    //console.log(formattedError);
    if (
      formattedError.extensions.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
    ) {
      return {
        code: 400,
        status: formattedError.extensions.code,
        message: formattedError.message,
      };
    }
    return {
        code: 500,
        status: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
    };
    
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  cors(),
  bodyParser.json(),
  expressMiddleware(server),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000`);