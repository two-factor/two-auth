const noDbController = {
  // Takes in a userID and phone number associated with that user
  // returns a promise
  // if resolved, adds a user Object with the userId, sid, and phone number associated with the service for that user...
  // returns a reference to that object
  // if rejected, throws error from verify API

  // essentially this create function will create a property on client object that contains userID, sid, and phone number

  // userID and phone parameters come from the client input
  create: (userID, phone) => {
    // deconstructing objects within this. and without this deconstruction the two-auth method would look like client.this.create
    const { client, users, appName } = this;

    return new Promise((resolve, reject) => {
      if (typeof phone !== 'string') {
        // adding a return before reject inside a promise stops the thread of execution
        return reject(new Error('typeof phone must be string'));
      }
      if (phone.substring(0, 2) !== '+1') {
        // adding a return before reject inside a promise stops the thread of execution
        return reject(new Error('phone must be formatted as a string i.e.: +1XXXXXXXXXX'));
      }
      // client.verify.services is from twilio Verify API
      client.verify.services
        // friendlyName is dumb. it's from twilio
        .create({ friendlyName: `${appName}` })
        .then((service) => {
          const { sid } = service;
          // userID is going to be a unique key
          users[userID] = {
            userID,
            sid,
            phone
          };
          resolve(users[userID]);
        })
        // why is this reject and not throw?
        .catch(err => reject(new Error(String(err))));
    });
  },
  // takes in a username and code - (6 digit code from the SMS text)
  // checks whether that code is valid for that username
  // returns a promise
  // if there is a formatting error, promise rejects
  // if there is no error, resolves to be the status of the verification
  // status is true if verification succeeded, false if verification failed
  verify: (username, code) => {
    return new Promise((resolve, reject) => {
      if (!this.users[username])
        // adding a return before reject inside a promise stops the thread of execution
        return reject(
          new Error('Username Error: This username has not been created yet.')
        );

      const { sid, phone } = this.users[username];

      if (!sid) return reject(new Error('SID Error: No SID exists for this user.'));
      if (!phone)
        return reject(
          new Error('Phone Number Error: No phone number exists for this user.')
        );
      this.client.verify
        .services(sid)
        // creates a 'verificationChecks' object on the this.client.verify.services object
        .verificationChecks.create({
          to: phone,
          code
        })
        .then(verification => {
          if (verification.status === 'approved') resolve(true);
          // unsure why returning the resolve
          resolve(false);
        });
    });
  },
  // send takes in a username
  // it searches through users object to find sid and phone number
  // then uses twilio api to send text message
  // returns a promise

  send: (username) => {
    // could probably deconstruct
    // const users = this.users;
    // const client = this.client;
    const { users, client } = this;
    return new Promise((resolve, reject) => {
      if (!users[username])
        // adding a return before reject inside a promise stops the thread of execution
        return reject(
          new Error('Username Error: This username has not been created yet.')
        );

      const { sid, phone } = users[username];

      if (!sid) reject(new Error('SID Error: No SID exists for this user.'));
      if (!phone)
        return reject(
          new Error('Phone Number Error: No phone number exists for this user.')
        );

      client.verify
        // services is passed in from the create
        .services(sid)
        .verifications.create({
          to: phone,
          channel: 'sms'
        })
        .then(verification => {
          resolve(verification);
        })
        .catch(err => reject(err));
    });
  }
};

module.exports = noDbController;