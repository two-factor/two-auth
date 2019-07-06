const create = require('./functions/create.js')
const send = require('./functions/send.js')
const verify = require('./functions/verify.js')

const connect = (AccSID, AuthToken) => {
  return new Client(AccSid, AuthToken)
}


class Client {
  constructor(AccSID, AuthToken) {
    this.AccSID = AccSID;
    this.AuthToken = AuthToken;
  }

  create,
  send,
  verify
}

module.exports = connect