const twilio = require('twilio');

const send = (username) => {
  const client = twilio(this.AccSID, this.AuthToken);

  if (this.users[username]) throw new Error('Username Error: This username has not been created yet.');

  const { SID, phone } = this.users[username];

  if (SID) throw new Error('SID Error: No SID exists for this user.');
  if (phone) throw new Error('Phone Number Error: No phone number exists for this user.');

  return client
    .verify
    .services(SID)
    .verifications
    .create({
      to: phone,
      channel: 'sms',
    });
};

module.exports = send;
