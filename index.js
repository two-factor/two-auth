const twilio = require("twilio");

const create = require("./functions/create.js");
const send = require("./functions/send.js");
const verify = require("./functions/verify.js");

const connect = (AccSID, AuthToken) => {
  return new Client(AccSID, AuthToken);
};

class Client {
  constructor(AccSID, AuthToken) {
    this.AccSID = AccSID;
    this.AuthToken = AuthToken;
    this.client = twilio(this.AccSID, this.AuthToken);
    this.users = {};
    this.create = create;
    this.send = send;
    this.verify = verify;
  }
}

module.exports = connect;
