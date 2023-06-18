// Importing required libraries and classes
const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

// Mail Sender Details
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
    tls:{
        rejectUnauthorized: false
    }
})

// Function to encrypt password
const hashPassword = async (pass) => {
    const salt = await bcrypt.genSalt(10).then()
    const hashedPassword = await bcrypt.hash(pass, salt).then()
    return hashedPassword
}

// Setting Mail Options
const setMailOptions = (email, name, host, emailToken) =>{
    var mailOptions = {
        from: ` "Verify your email" <edrenaline0@gmail.com>`,
        to: email,
        subject: 'Edrenaline -verify your email',
        html: `<h2> Hi ${name}! Thank You for registering with Edrenaline </h2>
        <h4> Please click the link below to verify your email.</h4>
        <a href="http://${host}/api/user/verify-email?token=${emailToken}">Verify Your Email</a>`
    }
    return mailOptions
}

// Sending Mail
const sendEmail = (mail) =>{
    transporter.sendMail(mail, function(error, info){
        if(error){
            console.log(error)
        }else{
            alert('Verification link is sent to your email!')
        }
    })
}

// SignUp Callback Function
const signupController = async (req, res) => {
    try {
        // Check if user with this mail already exists
        const exists = await userModel.findOne({email:req.body.email}).then()
        if(exists){
            return res.status(200).send({message:'User already Exists', success:false})
        }

        // Encrypting user password
        req.body.password = await hashPassword(req.body.password)

        // For email verification
        req.body.emailToken = crypto.randomBytes(64).toString('hex')
        req.body.isVerified = false

        // Save new user to database
        const newUser = new userModel(req.body)
        await newUser.save()

        // Sending verification mail
        var mailOptions = setMailOptions(newUser.email, newUser.name, req.headers.host, newUser.emailToken)
        sendEmail(mailOptions)

        // Show success if all processes carried out
        res.status(201).send({ message:"Please verify mail to proceed.", success: true })
    }catch (error) {
        console.log(error),
        res.status(500).send({success:false, message: `Signup Controller ${error.message}`})
    }
}

// Login Callback
const loginController = async (req, res) => {
    try {
        // Check if mail exists in database
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(200).send({message:'User Not Found', success:false})
        }

        // Check if password matches given mail
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch){
            return res.status(200).send({message:'Invalid email or password.', success:false})
        }

        // Check if mail is verified
        if(user.isVerified){
            // Assign token for protection
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
            res.status(200).send({message:'Logged In Successfully!', success:true, token, data: {
                name: user.name,
                email: user.email,
                number: user.number,
                verified: user.isVerified,
            }})
        }else{
            res.status(200).send({message:'Account not verified.', success:false})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({message:`Error in Login Controller ${error.message}`})
    }
}

// Authentication
const authController = async (req, res) => {
    try {
        // Check if user exists
        const user = await userModel.findOne({_id:req.body.userId})
        if(!user){
            return res.status(200).send({
                message:"User Not Found",
                success:false,
            })
        }else{
            res.status(200).send({
                success: true,
                data: {
                    name: user.name,
                    email: user.email,
                },
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Auth Error',
            success: false,
            error,
        })
    }
}

// Email Verification
const verifyEmail = async(req, res)=>{
    try {
        // Extract token from query and find user with matching emailToken
        const token = req.query.token
        const user = await userModel.findOne({ emailToken : token})
        if(user){
            // Verify user
            user.emailToken = null
            user.isVerified = true
            await user.save()
            res.redirect('https://edrenaline-verify-email.netlify.app/')
        }else{
            res.redirect('http://localhost:3000/signup')
            console.log('Email not verified')
        }
    } catch (error) {
        console.log(error)
    }
} 

// Retrieve User Data
const userDataController = async (req, res) => {
    try {
        // Check if user exists
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(200).send({
                message:"User Not Found",
                success:false,
            })
        }else{
            res.status(200).send({
                success: true,
                data: {
                    name: user.name,
                    email: user.email,
                    number: user.number,
                },
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Auth Error',
            success: false,
            error,
        })
    }
}

module.exports = {loginController, signupController, authController, verifyEmail, userDataController}