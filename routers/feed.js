const express = require('express')
const { body } = require('express-validator')
const feedController = require('../controllers/feed')
const multer  = require('multer')
const checkAuth = require("../util/isAuthenticatied")
const uploadImages = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'images')
        },
        filename: function (req, file, cb) {
            const uniquePuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniquePuffix + '-' + file.originalname)
        }
        }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
})


const router = express.Router()

router.get('/posts', checkAuth ,feedController.getPosts)

router.get('/post/:postId',checkAuth ,feedController.getPost)

router.post('/post', 
uploadImages.single("image"),
[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], checkAuth,feedController.createPost)

router.put('/post/:postId', 
uploadImages.single("image"),
[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], feedController.updatePost)

router.delete("/post/:postId", checkAuth ,feedController.deletePost)

module.exports = router