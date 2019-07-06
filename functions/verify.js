const twilio = require('twilio')

const verify = (username, code) => {
  const client = twilio(this.AccSID, this.AuthToken);

  if (!this.users[username]) throw new Error('Username Error: This username has not been created yet.');

  const { sid, phone } = this.users[username];

  return client
    .verify
    .services(sid)
    .verificationChecks
    .create({
      to: phone,
      code,
    })
    .then(verificationCheck => verificationCheck.status);
}

module.exports = verify;
