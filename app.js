const express = require('express')
const app = express()
const path =require("path")
const mongoose = require("mongoose")
const feedRouters = require('./routers/feed')
const authRouter = require('./routers/auth')
const helmet = require("helmet")

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(helmet())
app.use('/images', express.static(path.join(__dirname, 'images')) )

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization')
    next()
})

app.use('/feed', feedRouters)
app.use('/auth', authRouter)
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500 ).json({message: error.message, data: error.data})
})
mongoose.set("strictQuery", false)
mongoose.connect("mongodb+srv://ahmedadel:Ahmed3ff72@cluster0.wktfawr.mongodb.net/socialMediaApp?retryWrites=true&w=majority")
.then((result) => {
    app.listen( process.env.PORT || 8080)
}).catch((err) => {
    console.log(err)
})
