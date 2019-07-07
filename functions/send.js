// send takes in a username
// it searches through users object to find sid and phone number
// then uses twilio api to send text message
// returns a promise
function send(username) {
  const users = this.users;
  const client = this.client;
  return new Promise((resolve, reject) => {
    if (!users[username])
      reject(
        new Error("Username Error: This username has not been created yet.")
      );

    const { sid, phone } = users[username];

    if (!sid) reject(new Error("SID Error: No SID exists for this user."));
    if (!phone)
      reject(
        new Error("Phone Number Error: No phone number exists for this user.")
      );

    client.verify
      .services(sid)
      .verifications.create({
        to: phone,
        channel: "sms"
      })
      .then(verification => {
        resolve(verification);
      })
      .catch(err => reject(err));
  });
}

module.exports = send;
