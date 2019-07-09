// Takes in a userID and phone number associated with that user
// returns a promise
// if resolved, adds a user Object with the userId, sid, and phone associated with the service for that user...
// returns a reference to that object
// if rejected, throws error from verify API
const create = (userID, phone) => {
  const { client, TwoAuthUser, appName } = this;

  return new Promise((resolve, reject) => {
    if (typeof phone !== "string") {
      // adding a return before reject inside a promise stops the thread of execution
      return reject(new Error("typeof phone must be string"));
    }
    if (phone.substring(0, 2) !== "+1") {
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
}

module.exports = create;
