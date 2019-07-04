const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    me: User @auth
    user(id: ID!): User @admin
    users: [User!]! @admin
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
    authGoogle(accessToken: String!): User @guest
  }

  type User {
    id: ID!
    email: String!
    username: String!
    firstname: String
    lastname: String
    role: String!
    avatar: String
    locale: String
    createdAt: String!
    updatedAt: String!
  }
`;
