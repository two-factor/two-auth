// Takes in a userID and phone number associated with that user
// returns a promise
// if resolved, adds a user Object with the userId, sid, and phone associated with the service for that user...
// returns a reference to that object
// if rejected, throws error from verify API
function create(userID, phone) {
  const { client, TwoAuthUser, appName } = this;

  return new Promise((resolve, reject) => {
    if (typeof phone !== "string") {
      reject(new Error("typeof phone must be string"));
    }
    if (phone.substring(0, 2) !== "+1") {
      reject(new Error("phone must be string formatted as such: +1XXXXXXXXXX"));
    }
    client.verify.services
      .create({ friendlyName: `${appName}` })
      .then(service => {
        const { sid } = service;
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
