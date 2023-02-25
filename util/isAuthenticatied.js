const jwt = require("jsonwebtoken")
const mongoose = require("mongoose") 

module.exports = (req, res, next) => {
    let token = req.get("Authorization")
    if(!token){
        let error = new Error("not authentication")
        error.statusCode = 401
        throw error
    }
    let decodedToken
    try{
        decodedToken = jwt.verify(token, "adetlohmfo27a2omAANNR")
    }catch(err){
        err.statusCode = 500
        throw console;
    }
    if(!decodedToken){
        let error = new Error("not authentication")
        error.statusCode = 401
        throw error
    }
    console.log(decodedToken)
    req.userId = decodedToken.userId
    next()
}