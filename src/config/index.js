require('dotenv').config()
const config = {
    app : {
        port:process.env.SERVICE_PORT || 5001,
        debug: process.env.MODE === "DEBUG"  
    },
    mongo:{
        host:process.env.MONGO_HOST || 'localhost',
        port:process.env.MONGO_PORT || 27017,
        username:process.env.MONGO_USERNAME,
        password:process.env.MONGO_PASSWORD,
        database:process.env.MONGO_DATABASE,
    },
    redis:{
        host:process.env.REDIS_HOST || 'localhost',
        port:+process.env.REDIS_PORT || 6379,
    },
    access_key:process.env.ACCESS_KEY,
    refresh_key:process.env.REFRESH_KEY,
}
module.exports = config