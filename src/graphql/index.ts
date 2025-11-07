import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';
import { usuarioResolvers } from './modules/usuario/usuario.resolvers';

// Load all .gql files in modules recursively
const typesArray = loadFilesSync(path.join(__dirname, 'modules/**/*.gql'));

// Load resolvers manually (loadFilesSync doesn't work well with TypeScript in runtime)
const resolversArray = [
  usuarioResolvers,
  // Add more resolvers here as you create new modules
];

// Merge typeDefs and resolvers
const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers(resolversArray);

export { typeDefs, resolvers };

// Limpa o terminal
console.clear();