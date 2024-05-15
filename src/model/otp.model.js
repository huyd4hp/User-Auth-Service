"use strict";
const mongoose = require("mongoose");
const DOCUMENT_NAME = "otp";
const COLLECTION_NAME = "otps";

var otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    otp: {
      type: [
        {
          type: String,
        },
      ],
    },
    used: {
      type: Boolean,
      default: false,
    },
    expireAt: {
      type: Date,
      expires: 900,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, otpSchema, COLLECTION_NAME);
