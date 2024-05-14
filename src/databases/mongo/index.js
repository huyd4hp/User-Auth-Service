const mongoose = require("mongoose");
const mongo = require("../../config/").mongo
const connectString = `mongodb://${mongo.username}:${mongo.password}@${mongo.host}:${mongo.port}`
class Database{
    constructor(){
        this.connect()
    }
    connect(){
        // if (1 === 1)
        // {
        //     mongoose.set('debug', true);
        //     mongoose.set('debug', {color:true})
        // }
        mongoose.connect(connectString)
        .then( _ => {
            console.log("INFO:   Connected to MongoDB");
        }
        ).catch(error => console.log(`Error: ${error}!`))
    }
    // 
    static getInstance(){
        if(!Database.instance)
        {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instance = Database.getInstance()
module.exports = instance

