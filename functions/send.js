// send takes in a username
// it searches through users object to find sid and phone number
// then uses twilio api to send text message
// returns a promise
function send(username) {
  if (!this.users[username]) throw new Error('Username Error: This username has not been created yet.');

  const { sid, phone } = this.users[username];

  if (!sid) throw new Error('SID Error: No SID exists for this user.');
  if (!phone) throw new Error('Phone Number Error: No phone number exists for this user.');

  return this.client
    .verify
    .services(sid)
    .verifications
    .create({
      to: phone,
      channel: 'sms',
    });

  console.log(this.users);
}

module.exports = send;
