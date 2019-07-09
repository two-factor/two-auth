// send takes in a username
// it searches through users object to find sid and phone number
// then uses twilio api to send text message
// returns a promise

// amateur hour no fat arrow 
function send(username) {
  // could probably deconstruct
  // const users = this.users;
  // const client = this.client;
  const { users, client } = this;
  return new Promise((resolve, reject) => {
    if (!users[username])
    // adding a return before reject inside a promise stops the thread of execution
      return reject(
        new Error("Username Error: This username has not been created yet.")
      );

    const { sid, phone } = users[username];

    if (!sid) reject(new Error("SID Error: No SID exists for this user."));
    if (!phone)
      return reject(
        new Error("Phone Number Error: No phone number exists for this user.")
      );
    
    client.verify
    // services is passed in from the create
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
