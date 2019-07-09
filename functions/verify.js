// takes in a username and code - (6 digit code from the SMS text)
// checks whether that code is valid for that username
// returns a promise
// if there is a formatting error, promise rejects
// if there is no error, resolves to be the status of the verification
// status is true if verification succeeded, false if verification failed
function verify(username, code) {
  return new Promise((resolve, reject) => {
    if (!this.users[username])
    // adding a return before reject inside a promise stops the thread of execution
      return reject(
        new Error("Username Error: This username has not been created yet.")
      );

    const { sid, phone } = this.users[username];

    if (!sid) return reject(new Error("SID Error: No SID exists for this user."));
    if (!phone)
      return reject(
        new Error("Phone Number Error: No phone number exists for this user.")
      );
    this.client.verify
      .services(sid)
      // creates a 'verificationChecks' object on the this.client.verify.services object
      .verificationChecks.create({
        to: phone,
        code
      })
      .then(verification => {
        if (verification.status === "approved") resolve(true);
        // unsure why returning the resolve
        resolve(false);
      });
  });
}

module.exports = verify;
