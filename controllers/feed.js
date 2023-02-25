const { validationResult } = require('express-validator')
const fs = require("fs")
const path = require("path")
const Post = require("../models/post")
const User = require("../models/user")
exports.getPosts = (req, res, next)=> {
    Post.find()
    .then((posts)=>{
        res.status(200).json({
            posts: posts
        })
    }).catch(()=>{
        err.statusCode = 500
        next(err)
    })
}

exports.createPost = (req, res, next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error(`Validation failed, input is not valid`)
        error.statusCode = 422
        error.data = errors.array()
        throw error
        // return res.status(422).json({message: "Validation failed, input is not valid", errors: errors.array()})
    }
    // create post in database here
    let post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.file.path,
        createdBy: req.userId,
    })
    async function dowork(){
        try{
            let savedPost = await post.save()
            let user = await User.findById(req.userId)
            user.posts.push(savedPost._id)
            let updatedUser = await user.save()
            res.status(201).json({
                message: 'create post successfully',
                post: savedPost,
                createdBy: {_id: updatedUser._id , name: updatedUser.userName}
            })
        }catch(err){
            err.statusCode = 500
            next(err)
        }
    }
    dowork()
    // post.save()
    // .then((result) => {
    //     res.status(201).json({
    //         message: 'create post successfully',
    //         post: result
    //     })
    // }).catch((err)=>{
    //     err.statusCode = 500
    //     next(err)
    // })
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.postId)
    .then((post) => {
        console.log(post)
        res.status(200).json({
            message: "get the post",
            post: post
        })
    }).catch((err)=>{
        err.statusCode = 500
        next(err)
    })
}

let clearImage = function(imagePath){
    p = path.join(__dirname, "..", imagePath)
    fs.unlink(p, (err) => {
        console.log(err)
    })
}

exports.updatePost = (req, res, next) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error(`Validation failed, input is not valid`)
        error.statusCode = 422
        throw error
    }
    let postId = req.params.postId
    Post.findById(postId)
    .then((post)=>{
        if(post.createdBy.toString() !== req.userId){
            const error = new Error(`authorisation failed`)
            error.statusCode = 403
            throw error
        }
        post.title= req.body.title
        post.content= req.body.content
        if (req.file){
            clearImage(post.imageUrl)
            post.imageUrl= req.file.path
        }
        return post.save()
    }).then((result)=>{
        res.status(200).json({message: "post updated." , post: result})
    }).catch((err)=>{
        err.statusCode = 500
        next(err)
    })
}

exports.deletePost = (req, res, next) => {
    let postId = req.params.postId
    let imageUrl = req.body.image
    Post.findById(postId)
    .then((post) => {
        if(post.createdBy.toString() !== req.userId){
            const error = new Error(`authorisation failed`)
            error.statusCode = 403
            throw error
        }
        clearImage(imageUrl)
        return Post.findByIdAndRemove(postId)
    }).then((result) => {
        return User.findById(req.userId)
    }).then((user)=>{
        user.posts.pull(postId)
        return user.save()
    }).then((result)=>{
        res.status(200).json({message: "post deleted."})
        console.log("deleted !!!!!!!!!!")
    })
    .catch((err)=>{
        err.statusCode = 500
        next(err)
    })
}
