// Import jwt for secure transmission of information
const JWT = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try{
        // Extract token from query
        const token = req.headers['authorization'].split(" ")[1]

        // Verify that it matches signed token
        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(err){
                return res.status(200).send({
                    message:'Auth Failed',
                    success:false
                })
            }else{
                req.body.userId = decode.id
                next()
            }
        })
    }catch(err){
        console.log(error)
        res.status(401).send({
            message:'Auth Failed',
            success:false
        })
    }
}