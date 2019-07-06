// takes in a username and code
// checks whether that code is valid for that username
// returns true if valid, false if invalid
function verify(username, code) {
  if (!this.users[username]) throw new Error('Username Error: This username has not been created yet.');

  const { sid, phone } = this.users[username];

  if (!sid) throw new Error('SID Error: No SID exists for this user.');
  if (!phone) throw new Error('Phone Number Error: No phone number exists for this user.');

  return this.client
    .verify
    .services(sid)
    .verificationChecks
    .create({
      to: phone,
      code,
    })
    .then((verification) => {
      if (verification.status === 'approved') return true;
      return false;
    });
}

module.exports = verify;
