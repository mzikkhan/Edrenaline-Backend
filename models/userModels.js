// Importing mongoose library to act as a frontend to work with MongoDB
const mongoose = require("mongoose")

// Creating the users schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
    },
    number: {
        type: Number,
        required: [true, "number is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    emailToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
    },
})

// Establishing link between our model and our collection in MongoDB
const userModel = mongoose.model("users", userSchema)

// Making our model available to other files
module.exports = userModel