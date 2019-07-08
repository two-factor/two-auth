// send takes in a userID
// it searches through users object to find sid and phone number
// then uses twilio api to send text message
// returns a promise
function send(userID) {
  const users = this.users;
  const client = this.client;
  const TwoAuthUser = this.TwoAuthUser;
  return new Promise((resolve, reject) => {
    TwoAuthUser.findOne({ userID: userID })
      .then(user => {
        const { sid, phone } = user;
        if (!sid) reject(new Error("SID Error: No SID exists for this user."));
        if (!phone)
          reject(
            new Error(
              "Phone Number Error: No phone number exists for this user."
            )
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
      })
      .catch(err => {
        reject(err);
        //"userID Error: This userID has not been created yet."
      });
  });
}

module.exports = send;
