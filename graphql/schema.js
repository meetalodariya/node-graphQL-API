const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type AuthData {
    userId: String!
    token: String!
  }
  type Post {
    _id : ID
    title: String!
    content: String!
    creator: User!
  }
  type User{
    _id: ID
    name: String!
    email: String!
    password: String
    posts: [Post!]
  }
  input UserInput {
    name: String!  
    email: String!
    password: String!
  }
  type RootQuery {
    login(email: String! , password: String!): AuthData!
  }
  type RootMutation {
    createUser(UserInput: UserInput): User! 
  }
  
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
