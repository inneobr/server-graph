import {typeDefs, resolvers} from "./graphql";
import { ApolloServer } from "apollo-server";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    return {
      message: error.message,
      code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
    };
  },
});

server.listen().then(({url})=> {
  console.log(`GRAPHQL V1.0\n${url}`)
})