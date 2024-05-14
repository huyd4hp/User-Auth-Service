const express = require("express")
const morgan = require('morgan')
const helmet = require("helmet")
const clientRedis = require('./databases/redis')
// App
const app = express()
// Middleware
app.use(morgan('dev'));
app.use(helmet())
app.use(express.json())
// Database
require('./databases/mongo')
clientRedis.connect()
// Router
// Handle error
app.use((req,res,next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error)
})
app.use((err,req,res,next) => {
    const statusError = err.status || 500
    const messageError = err.message || "Internal Server Error"
    return res.status(statusError).json({
        status:'error',
        message:messageError
    })
})
// Export 
module.exports = app;
