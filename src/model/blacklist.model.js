'use strict'
const mongoose = require('mongoose');
const DOCUMENT_NAME = 'blacklist'
const COLLECTION_NAME = 'blacklists'

var blacklistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    refreshToken:{
        type: String,
        required:true,
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, blacklistSchema, COLLECTION_NAME);