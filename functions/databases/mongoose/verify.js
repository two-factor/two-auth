// takes in a username and code
// checks whether that code is valid for that username
// returns a promise
// if there is a formatting error, promise rejects
// if there is no error, resolves to be the status of the verification
// status is true if verification succeeded, false if verification failed

function verify(userID, code) {
  //this assigns TwoAuthUser the model that exists on the 'this' object named TwoAuthUser
  const TwoAuthUser = this.TwoAuthUser;
  //verify returns a promise object
  return new Promise((resolve, reject) => {
    //we use the 'findOne' method on the Mongoose model of 'TwoAuthUser' to look in our DB for a specific document matching inputted 'userID'
    //it also returns a promise
    TwoAuthUser.findOne({ userID })
      //if promise successful, it returns the user with the matching userID
      .then(user => {
        //we destructe returned user and extract the values at the properties of 'sid' & 'phone'
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
        //this IS some Twilio API shit
        //this functionality sends a texts to the phone registered at users[username]
        //this one refences 'this', which is different than the other files
        //this one also returns the resolved value
        return this.client.verify.services(sid)
          .verificationChecks.create({
            to: phone,
            code
          })
          //if promise successful, returns a verification object
          //verification object has a 'status' property
          //if value is approved, resolve function is invoked with the boolean of 'true'
          .then(verification => {
            if (verification.status === "approved") resolve(true);
            //we should consider changing the 'reject' on line 46 to resolve
            //operations were successful up to this point
            return reject(false);
          });
          //we should consider adding a .catch for error handling
      })
      //this .catch applies to the .findOne Promise
      .catch(err => {
        return reject(false);
      });
  });
}

module.exports = verify;
