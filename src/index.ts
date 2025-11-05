import { ApolloServer } from "apollo-server";
import { typeDefs } from "./config /types";
import { resolvers } from "./config /resolvers";

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
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
    } catch (err) {
        console.error("Failed to start Apollo Server:", err);
        process.exit(1); // Encerra o processo com erro
    }
}

startServer();
