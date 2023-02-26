const User = require("../models/user")
const { validationResult } = require("express-validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
exports.signUp = (req,res,next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        let error = new Error("invalid inputs")
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    async function dowork(){
        try{
            // throw new Error("Dummy")
            let hashedPassowd = await bcrypt.hash(req.body.password, 12)
            let user = new User({
                email: req.body.email,
                password: hashedPassowd,
                userName: req.body.userName
            })
            let savedUser = await user.save()
            res.status(201).json({message: "account created", userId: savedUser._id})
        }catch(err){
            err.statusCode = 500
            next(err)
        }
    }
    dowork()
}

exports.login = (req, res, next) => {
    async function doLogin(){
        try{
            let user = await User.findOne({email: req.body.email})
            console.log(user)
            if(!user){
                let error = new Error("authentication failed invalid email")
                error.statusCode = 401
                throw error
            }
            let EqualPass = await bcrypt.compare(req.body.password, user.password)
            if(!EqualPass){
                let error = new Error("authentication failed invalid password")
                error.statusCode = 401
                throw error
            }
            let token = jwt.sign(
                {email: user.email, userId: user._id.toString()},
                "adetlohmfo27a2omAANNR", 
                {expiresIn: "24h"})

            res.status(200).json({message: "login succeded", token: token, expiresIn: "24h" ,userId: user._id.toString()})
        }catch(err){
            if(!err.statusCode){
                err.statusCode = 500
            }
            next(err)
        }
    }
    doLogin()
}