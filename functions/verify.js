// takes in a username and code
// checks whether that code is valid for that username
// returns a promise
// if there is a formatting error, promise rejects
// if there is no error, resolves to be the status of the verification
// status is true if verification succeeded, false if verification failed
function verify(username, code) {
  //promise is returned from function
  return new Promise((resolve, reject) => {
    //asks if inputted 'username' exists inside of the 'users' object
    if (!this.users[username])
      //if it doesn't, throws an error
      reject(
        new Error("Username Error: This username has not been created yet.")
      );
    //if it does, we destructure the object and extract the 'sid' and 'phone' property values
    const { sid, phone } = this.users[username];
    //this confirms that the sid is not undefined
        //if it is, throws an error
    if (!sid) reject(new Error("SID Error: No SID exists for this user."));
    //this confirms that the phone is not undefined
        //if it is, throws an error
    if (!phone)
      reject(
        new Error("Phone Number Error: No phone number exists for this user.")
      );
    //this could be some Twilio API shit
    //this functionality sends a texts to the phone registered at users[username]
        //this one refences 'this', which is different than the other files
        //this one also returns the resolved value
    return this.client.verify
      .services(sid)
      .verificationChecks.create({
        to: phone,
        code
      })
      //if promise successful, returns a verification object
      //verification object has a 'status' property
      //if value is approved, resolve function is invoked with the boolean of 'true'
      .then(verification => {
        if (verification.status === "approved") resolve(true);
      //if value is not approved, reject function is invoked with the boolean of 'false'
      //unsure if return is needed
        return resolve(false);
      });
      //no .catch in place for error handling
      //we should consider implementing this
  });
}

module.exports = verify;
