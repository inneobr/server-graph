import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Usuario {
    ID: Int
    FULLNAME: String!
    USERNAME: String!
    EMAIL: String
    PHONE: String
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

  input UpdateUsuario {
    FULLNAME: String
    USERNAME: String
    PASSWORD: String
    EMAIL: String
    PHONE: String
    CIDADE: Int
  }

  type AuthProps {
    token: String!
    usuario: Usuario!
  }

  type Mutation {
    login(username: String!, password: String!): AuthProps!
    createUsuario(input: CreateUsuario!): Usuario
    updateUsuario(id: Int!, input: UpdateUsuario!): Usuario
  }

  type Query {
    usuario(id: Int!): Usuario
    usuarios: [Usuario!]!
  }
`;
