// Importing required libraries
const mongoose = require("mongoose")
const colors = require("colors")

// Setting strictQuery to false so fields can be added to database even if not specified in schema
mongoose.set("strictQuery", false);

// Function to connect to our MongoDB database
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE, () => {
            console.log(`Mongoose connected ${mongoose.connection.host}`.bgGreen.white)
        });
    } catch (error) {
        console.log(`Mongodb Server Issue ${error}`.bgRed.white)
    }
}

// Exporting connectToDatabase function for other files to use
module.exports = connectToDatabase