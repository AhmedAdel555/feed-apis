const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    status:{
        type: String,
        defult: "Iam new.."
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }]
})

module.exports = mongoose.model("user", userSchema, "user")