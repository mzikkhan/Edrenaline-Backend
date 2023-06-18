// Importing necessary libraries and classes
const express = require("express")
const { userDataController, loginController, signupController, authController, verifyEmail } = require("../controllers/userController")
const authMiddleware = require("../middlewares/authMiddleware")

// Router object
const router = express.Router()

// LOGIN | POST | USER
router.post("/login", loginController)

//  SIGNUP | POST | USER
router.post("/signup", signupController)

// AUTH | POST | USER
router.post('/getUserData', authMiddleware, authController)

// RETRIVE DATA | POST | USER
router.post('/getData', userDataController)

// EMAIL VERIFICATION | GET | USER
router.get('/verify-email', verifyEmail)

// Making our router accessible to other files
module.exports = router