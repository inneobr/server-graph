"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const types_1 = require("./config /types");
const resolvers_1 = require("./config /resolvers");
async function startServer() {
    const server = new apollo_server_1.ApolloServer({
        typeDefs: types_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        formatError: (err) => {
            console.error("GraphQL Error:", err);
            return {
                message: err.message,
                code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
            };
        },
    });
    try {
        const { url } = await server.listen({ port: 3000 });
        console.clear();
        console.log(`🚀 GRAPHQL V1.0`);
    }
    catch (err) {
        console.error("Failed to start Apollo Server:", err);
        process.exit(1); // Encerra o processo com erro
    }
}
startServer();
