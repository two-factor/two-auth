// send takes in a userID
// it searches through users object to find sid and phone number
// then uses twilio api to send text message
// returns a promise
function send(userID) {
  // props on the Client constructor object
  // users is never used, but is declared?
  // deconstructed props from this
  const { users, client, TwoAuthUser } = this;
  // const client = this.client;
  // const TwoAuthUser = this.TwoAuthUser;
  return new Promise((resolve, reject) => {
    // removed { userId: userId } because of new ES6 method
    // { userId: userId } is the same as { userId }
    TwoAuthUser.findOne({ userID })
      .then(user => {
        const { sid, phone } = user;
        // adding a return before reject inside a promise stops the thread of execution
        if (!sid) return reject(new Error("SID Error: No SID exists for this user."));
        if (!phone)
          return reject(
            new Error(
              "Phone Number Error: No phone number exists for this user."
            )
          );
              // exactly the same as ../verify.js
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
      })
      .catch(err => {
        reject(err);
        //"userID Error: This userID has not been created yet."
      });
  });
}

module.exports = send;
