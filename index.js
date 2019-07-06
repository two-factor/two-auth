const twilio = require("twilio");
const mongoose = require("mongoose");

const create = require("./functions/create.js");
const send = require("./functions/send.js");
const verify = require("./functions/verify.js");

const mongooseCreate = require("./mongoose/create");
const mongooseSend = require("./mongoose/send");
const mongooseVerify = require("./mongoose/verify");

const userSchema = require("./mongoose/userSchema");

const connect = (AccSID, AuthToken, mongoURI = null) => {
  return new Client(AccSID, AuthToken, mongoURI);
};

class Client {
  constructor(AccSID, AuthToken, mongoURI = null) {
    this.AccSID = AccSID;
    this.AuthToken = AuthToken;
    this.client = twilio(this.AccSID, this.AuthToken);
    this.users = {};

    if (mongoURI !== null) {
      mongoose
        .connect(mongoURI)
        .then(db => {
          console.log("Two Factor successfully connected to Mongo");
        })
        .catch(err => {
          throw new Error("Two Factor Unable to connect to Mongo");
        });
      this.TwoFactorUser = mongoose.model("TwoFactorUser", userSchema);
      this.create = mongooseCreate;
      this.send = mongooseSend;
      this.verify = mongooseVerify;
    } else {
      this.create = create;
      this.send = send;
      this.verify = verify;
    }
  }
}

module.exports = connect;
