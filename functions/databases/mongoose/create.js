// Takes in a userID and phone number associated with that user
// returns a promise
// if resolved, adds a user Object with the userId, sid, and phone associated with the service for that user...
// returns a reference to that object
// if rejected, throws error from verify API
function create(userID, phone) {
  //Get clear on what 'this' is
    //Could possibly be relative to Twilio API
    //TwoAuthUser is the model for the MongoDB/Mongoose database
  const { client, TwoAuthUser, appName } = this;
  //promise is returned from this function being invoked
  return new Promise((resolve, reject) => {
    //input for 'phone' argument must be a string
    if (typeof phone !== "string") {
      //if it is not, we throw an error
      reject(new Error("typeof phone must be string"));
    }
    //input for 'phone' must be in a US phone number format
    if (phone.substring(0, 2) !== "+1") {
      //if improperly formatted, we throw an error
      reject(new Error("phone must be string formatted as such: +1XXXXXXXXXX"));
    }

    //we should consider verifying the proper length of the 'phone' number
    //we should also consider verifyint that each 'phone' number is all numbers

    //this logic could be relative to the Twilio API
    client.verify.services
      .create({ friendlyName: `${appName}` })
      //returns a promise
      .then(service => {
        //data returned from promise is destructured for the property of 'sid'
        const { sid } = service;
        //TwoAuthUser is a mongoose feature
        //here, we create a document to be added to the MongoDB
        TwoAuthUser.create({
          userID,
          sid,
          phone
        })
          //if user successfully created, we invoke the resolve function and pass the 'user' to it
          .then(user => {
            resolve(user);
          })
          //if user unsuccessfully created, we invoke the reject function and pass the 'err' to it
          .catch(err => {
            reject(err);
          });
      })
      //this .catch is relative to line 29
      //if that promise is unsuccessful, we invoke the reject function and pass the error message
      .catch(err => reject(new Error(String(err))));
  });
}

module.exports = create;
