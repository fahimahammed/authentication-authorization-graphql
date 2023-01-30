module.exports = `#graphql
  type Query {
    hello: String
  },
  type User{
    id: ID
    name: String
    email: String
  },
  type AuthPayLoad{
    user: User
    token: String
  },
  type Mutation {
    signup(name: String, email: String, password: String): User
    login(email: String!, password: String!): AuthPayLoad
  }
`;