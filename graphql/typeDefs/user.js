const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    me: User @auth
    user(id: ID!): User @auth
    users: [User!]! @auth
  }

  extend type Mutation {
    signUp(
      email: String!,
      username: String!,
      firstname: String!,
      lastname: String!,
      password: String!,
      confirmPassword: String!
    ): User @guest
    signIn(username: String!, password: String!): User @guest
    signOut: Boolean @auth
  }

  type User {
    id: ID!
    email: String!
    username: String!
    firstname: String!
    lastname: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }
`;
