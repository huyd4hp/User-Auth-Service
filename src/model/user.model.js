"use strict";
const mongoose = require("mongoose");
const DOCUMENT_NAME = "user";
const COLLECTION_NAME = "users";

const RoleEnum = {
  USER: "User",
  EVENT_ADMIN: "EventAdmin",
  ADMIN: "Admin",
};
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: Object.values(RoleEnum),
    default: RoleEnum.USER,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
  },
});
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema, COLLECTION_NAME);
