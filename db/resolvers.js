const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

const createToken = (user, secret, expiresIn) => {
    console.log(user);
    const { id, email, name, lastname } = user;

    return jwt.sign({ id, email, name, lastname }, secret, { expiresIn });
};

// Resolvers
const resolvers = {
    Query: {
        getUser: async (_, { token }) => {
            const userID = await jwt.verify(token, process.env.SECRET);
            return userID;
        },
    },

    Mutation: {
        newUser: async (_, { input }) => {
            const { email, password } = input;
            // check if the user exists
            const userExist = await User.findOne({ email });
            if (userExist) {
                throw new Error("The user is already registered");
            }

            // hashear password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            // save on DB
            try {
                const user = new User(input);
                user.save();
                return user;
            } catch (error) {
                console.log(error);
            }
        },
        authenticateUser: async (_, { input }) => {
            const { email, password } = input;

            // if the user exists
            const userExist = await User.findOne({ email });
            if (!userExist) {
                throw new Error("The user doesn't exist");
            }

            // Check if the password is correct
            const correctPassword = await bcryptjs.compare(
                password,
                userExist.password
            );
            if (!correctPassword) {
                throw new Error("The password is incorrect");
            }

            // Create token
            return {
                token: createToken(userExist, process.env.SECRET, "24h"),
            };
        },
    },
};

module.exports = resolvers;
