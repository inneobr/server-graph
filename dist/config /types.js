"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
// types.ts
const graphql_tag_1 = require("graphql-tag");
exports.typeDefs = (0, graphql_tag_1.gql) `
  type Usuario {
    ID: Int
    FULLNAME: String!
    USERNAME: String!
    EMAIL:  String
    PHONE:  String 
    CIDADE: Int
  }    

  input CreateUsuario {
    FULLNAME: String!
    USERNAME: String!
    PASSWORD: String!
    EMAIL: String
    PHONE: String 
    CIDADE: Int
  }

  # Input para atualizar usuário (todos opcionais)
  input UpdateUsuario {
    FULLNAME: String
    USERNAME: String
    PASSWORD: String
    EMAIL: String
    PHONE: String
    CIDADE: Int
  }

  type Mutation {
    createUsuario(input: CreateUsuario!): Usuario
    updateUsuario(id: Int!, input: UpdateUsuario!): Usuario
  }

  type Query {
    usuario(id: Int!): Usuario
    usuarios: [Usuario!]!
  }
`;
