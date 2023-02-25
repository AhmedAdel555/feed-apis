const mongoose = require("mongoose") 

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    imageUrl:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: true,
    },
}, {timestamps: true})

module.exports = mongoose.model("post", postSchema, "post")