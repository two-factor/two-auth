const { Schema } = require('mongoose');

// deconstructed keys in Schema for more security
const userSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  sid: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
  }
});

module.exports = userSchema;
