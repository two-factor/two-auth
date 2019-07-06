const twilio = require("twilio");

// Takes in a userID and phone number associated with that user
// returns a promise
// if resolved, adds a user Object with the userId, sid, and phone associated with the service for that user...
// returns a reference to that object
// if rejected, throws error from verify API
function create(userID, phone) {
  console.log("this", this);
  const client = this.client;
  console.log(client);
  const users = this.users;

  return new Promise((resolve, reject) => {
    if (typeof phone !== "string") {
      reject(new Error("typeof phone must be string"));
    }
    client.verify.services
      .create({ friendlyName: `Service for ${userID}` })
      .then(service => {
        const { sid } = service;
        users[userID] = {
          userID,
          sid,
          phone
        };
        resolve(users[userID]);
      })
      .catch(err => reject(err));
  });
}

module.exports = create;
