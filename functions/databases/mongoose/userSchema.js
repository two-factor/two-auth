const { Schema } = require("mongoose");

const userSchema = new Schema({
  userID: String,
  sid: String,
  phone: String
});

module.exports = userSchema;
