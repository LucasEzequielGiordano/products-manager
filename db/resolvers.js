const User = require("../models/user");
const Product = require("../models/product");
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
        getProducts: async () => {
            try {
                const products = await Product.find({});
                return products;
            } catch (error) {
                console.log(error);
            }
        },
        getProduct: async (_, { id }) => {
            // check if the product exists or not
            const product = await Product.findById(id);
            if (!product) {
                throw new Error("Product not found");
            }
            return product;
        },
    },

    Mutation: {
        // Users
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
        // Auth Users
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
        // New Product
        newProduct: async (_, { input }) => {
            try {
                const product = new Product(input);

                // save in DB
                const result = await product.save();
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        updateProduct: async (_, { id, input }) => {
            // check if the product exists or not
            let product = await Product.findById(id);
            if (!product) {
                throw new Error("Product not found");
            }

            // save in DB
            product = await Product.findOneAndUpdate({ _id: id }, input, {
                new: true,
            });
            return product;
        },
        deleteProduct: async (_, { id }) => {
            // check if the product exists or not
            let product = await Product.findById(id);
            if (!product) {
                throw new Error("Product not found");
            }

            // delete
            await Product.findOneAndDelete({ _id: id });
            return "Product deleted";
        },
    },
};

module.exports = resolvers;
