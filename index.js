const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

// DB connect
connectDB();

// server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers["authorization"] || "";
        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRET);
                return {
                    user,
                };
            } catch (error) {
                console.log(error);
            }
        }
    },
});

// start server
server.listen().then(({ url }) => {
    console.log(`Listening server on ${url}`);
});
