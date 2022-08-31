const { gql } = require("apollo-server");

// Schema
const typeDefs = gql`
    type User {
        id: ID
        name: String
        lastname: String
        email: String
        created: String
    }

    type Token {
        token: String
    }

    type Product {
        id: ID
        name: String
        stock: Int
        price: Float
        created: String
    }

    input UserInput {
        name: String!
        lastname: String!
        email: String!
        password: String!
    }

    input authenticateInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        stock: Int!
        price: Float!
    }

    type Query {
        # Users
        getUser(token: String!): User

        # Products
        getProducts: [Product]
        getProduct(id: ID!): Product
    }

    type Mutation {
        # Users
        newUser(input: UserInput): User
        authenticateUser(input: authenticateInput): Token

        # Products
        newProduct(input: ProductInput): Product
        updateProduct(id: ID!, input: ProductInput): Product
        deleteProduct(id: ID!): String
    }
`;

module.exports = typeDefs;
