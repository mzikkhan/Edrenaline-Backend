// Importing necessary libraries and classes
const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connectToDatabase = require('./config/db')

// dotenv config
dotenv.config()

// MongoDB connection
connectToDatabase()

// Rest Object
const app = express()

// Middlewares
app.use(express.json())
app.use(morgan('dev'))

// CORS
var cors = require('cors')
app.use(cors())

// Routes
app.use("/api/user", require("./routes/userRoutes"))

// Listen Port
const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log(`Server running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`.bgCyan.white)
})