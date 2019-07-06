// takes in a username and code
// checks whether that code is valid for that username
// returns a promise
// if there is a formatting error, promise rejects
// if there is no error, resolves to be the status of the verification
// status is true if verification succeeded, false if verification failed
function verify(username, code) {
  return new Promise((resolve, reject) => {
    if (!this.users[username])
      reject(
        new Error("Username Error: This username has not been created yet.")
      );

    const { sid, phone } = this.users[username];

    if (!sid) reject(new Error("SID Error: No SID exists for this user."));
    if (!phone)
      reject(
        new Error("Phone Number Error: No phone number exists for this user.")
      );

    return this.client.verify
      .services(sid)
      .verificationChecks.create({
        to: phone,
        code
      })
      .then(verification => {
        if (verification.status === "approved") resolve(true);
        return resolve(false);
      });
  });
}

module.exports = verify;
