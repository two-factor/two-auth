const mongooseController = {
  // Takes in a userID and phone number associated with that user
  // returns a promise
  // if resolved, adds a user Object with the userId, sid, and phone associated with the service for that user...
  // returns a reference to that object
  // if rejected, throws error from verify API
  mongooseCreate: (userID, phone) => {
    const { client, TwoAuthUser, appName } = this;
    return new Promise((resolve, reject) => {
      if (typeof phone !== 'string') {
        // adding a return before reject inside a promise stops the thread of execution
        return reject(new Error('typeof phone must be string'));
      }
      if (phone.substring(0, 2) !== '+1') {
        // adding a return before reject inside a promise stops the thread of execution
        return reject(new Error('phone must be formatted as a string i.e.: +1XXXXXXXXXX'));
      }
      // twilio methods
      client.verify.services
        .create({ friendlyName: `${appName}` })
        // service comes from the services object
        .then(service => {
          const { sid } = service;
          // creates a new TwoAuthUser to be used by mongoose
          TwoAuthUser.create({
            userID,
            sid,
            phone
          })
            .then(user => {
              resolve(user);
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => reject(new Error(String(err))));
    });
  },
  // takes in a username and code
  // checks whether that code is valid for that username
  // returns a promise
  // if there is a formatting error, promise rejects
  // if there is no error, resolves to be the status of the verification
  // status is true if verification succeeded, false if verification failed
  mongooseVerify: (userID, code) => {
    const TwoAuthUser = this.TwoAuthUser;
    return new Promise((resolve, reject) => {
      TwoAuthUser.findOne({ userID })
        .then(user => {
          const { sid, phone } = user;
          if (!sid) reject(new Error('SID Error: No SID exists for this user.'));
          if (!phone)
            reject(
              new Error(
                'Phone Number Error: No phone number exists for this user.'
              )
            );
          this.client.verify.services(sid)
            .verificationChecks.create({
              to: phone,
              code
            })
            .then(verification => {
              if (verification.status === 'approved') resolve(true);
              return reject(false);
            });
        })
        .catch(err => {
          reject(false);
        });
    });
  },
  // send takes in a userID
  // it searches through users object to find sid and phone number
  // then uses twilio api to send text message
  // returns a promise
  mongooseSend: (userID) => {
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
          if (!sid) return reject(new Error('SID Error: No SID exists for this user.'));
          if (!phone)
            return reject(
              new Error(
                'Phone Number Error: No phone number exists for this user.'
              )
            );
          // exactly the same as ../verify.js
          client.verify
            .services(sid)
            .verifications.create({
              to: phone,
              channel: 'sms'
            })
            .then(verification => {
              resolve(verification);
            })
            .catch(err => reject(err));
        })
        .catch(err => {
          reject(err);
          //'userID Error: This userID has not been created yet.'
        });
    });
  }
};

module.exports = mongooseController;