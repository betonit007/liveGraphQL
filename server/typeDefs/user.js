const { gql } = require('apollo-server-express')

module.exports = gql`

type Image {
    url: String
    public_id: String
  }

  type User {
    _id: ID!,
    firstName: String,
    lastName: String,
    email: String!,
    password: String!
    images: [Image]
    about: String
    createdAt: String
    updatedAt: String
  }

  type AuthToken {
    token: String
  }

  type UserCreateResponse {
    username: String!
    email: String!
    token: String!
}

input userCredsInput {
  email: String!,
  password: String!
}

  #input type
  input ImageInput {
    url: String
    public_id: String
  }

  #input type
  input UserUpdateInput {
    username: String
    name: String
    email: String!
    images: [ImageInput]
    about: String
  }

  type Query {
    profile: User!
    publicProfile(username: String!): User!
    allUsers: [User!]
  }

  type Mutation {
    userCreate(input: userCredsInput): UserCreateResponse!
    userUpdate(input: UserUpdateInput): User!
    userLogin(input: userCredsInput!): AuthToken!
}
`