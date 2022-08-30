const User = require("../models/user");
const bcryptjs = require("bcryptjs");

// Resolvers
const resolvers = {
    Query: {
        getCourse: () => "Demo",
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
    },
};

module.exports = resolvers;
