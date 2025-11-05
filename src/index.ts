import { resolvers } from "./config /resolvers";
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./config /types";
import { verifyToken } from "./utils/auth";

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
    
      let user = null;
      if (token) {
        try {
          user = verifyToken(token);
        } catch (err) {
          console.warn("Token inválido:", err);
          user = null; 
        }
      }
    
      return { user };
    },
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
    console.log(`🚀 GRAPHQL V1.0 em ${url}`);
  } catch (err) {
    console.error("Falha ao iniciar Apollo Server:", err);
    process.exit(1);
  }
}

startServer();