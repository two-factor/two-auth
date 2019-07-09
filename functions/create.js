// Takes in a userID and phone number associated with that user
// returns a promise
// if resolved, adds a user Object with the userId, sid, and phone number associated with the service for that user...
// returns a reference to that object
// if rejected, throws error from verify API

// essentially this create function will create a property on client object that contains userID, sid, and phone number

// userID and phone parameters come from the client input
function create(userID, phone) {
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
}

module.exports = create;
