const express = require("express")
const  {body} = require("express-validator")
const router = express.Router()
const User = require("../models/user")
const authController = require("../controllers/auth")



router.post("/signup", [
   body("email").trim().isEmail()
   .custom((value, req) => {
        return User.findOne({email: value})
        .then((user) => {
            if(user){
                return Promise.reject("email is already exist")
            }
        })
   }),
   body("password").trim().isLength({min: 5}),
   body("userName").trim().isLength({min: 5})
], authController.signUp)

router.post("/login", authController.login)


module.exports = router