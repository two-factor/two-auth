const twilio = require('twilio');

// send takes in a username
// it searches through users object to find sid and phone number
// then uses twilio api to send text message
const send = (username) => {
  const client = twilio(this.AccSID, this.AuthToken);

  if (!this.users[username]) throw new Error('Username Error: This username has not been created yet.');

  const { sid, phone } = this.users[username];

  if (!sid) throw new Error('SID Error: No SID exists for this user.');
  if (!phone) throw new Error('Phone Number Error: No phone number exists for this user.');

  return client
    .verify
    .services(sid)
    .verifications
    .create({
      to: phone,
      channel: 'sms',
    });
};

module.exports = send;
