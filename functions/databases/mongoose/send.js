// send takes in a userID
// it searches through users object to find sid and phone number
// then uses twilio api to send text message
// returns a promise
function send(userID) {
  //still unclear on what 'this' refers to
  //variable 'users' is assigned whatever value exists at this.users, which is not being used here
  const users = this.users;
  //variable 'client' is assigned whatever value exists at this.client
  const client = this.client;
  //TwoAuthUser is the Mongoose/MongoDB model for this particular DB
  const TwoAuthUser = this.TwoAuthUser;
  //returns a promise object
  return new Promise((resolve, reject) => {
    // invokes findOne method on any Mongoose model to found userID parameter
    TwoAuthUser.findOne({ userID: userID })
      // returns a promise, if search was successful. returns found user
      .then(user => {
        //if it does, we destructure the object and extract the 'sid' and 'phone' property values
        const { sid, phone } = user;
        //this confirms that the sid is not undefined
        //if it is, throws an error
        if (!sid) reject(new Error("SID Error: No SID exists for this user."));
        //this confirms that the phone is not undefined
        //if it is, throws an error
        if (!phone)
          reject(
            new Error(
              "Phone Number Error: No phone number exists for this user."
            )
          );

        //this could be some Twilio API shit
        //this functionality sends a texts to the phone in the found document in our DB
        client.verify
          .services(sid)
          .verifications.create({
            to: phone,
            //channel could be the way authentication is sent
            //in order to implement phone call stretch feature, we may need to change this
            channel: "sms"
          })
          //we are unsure what is exactly in the 'verification' data
          //could possible be a simple verification of whether the message was successfully sent
          .then(verification => {
            resolve(verification);
          })
          //if unsuccessful, we invoke the reject function and pass it the 'err'
          .catch(err => reject(err));
      })
      .catch(err => {
        reject(err);
        //"userID Error: This userID has not been created yet."
      });
  });
}

module.exports = send;
