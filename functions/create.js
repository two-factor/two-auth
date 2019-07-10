// Takes in a userID and phone number associated with that user
// returns a promise
// if resolved, adds a user Object with the userId, sid, and phone associated with the service for that user...
// returns a reference to that object
// if rejected, throws error from verify API
function create(userID, phone) {
  //Get clear on what 'this' is
    //Could possibly be relative to Twilio API
  const { client, users, appName } = this;

  return new Promise((resolve, reject) => {
    //input for 'phone' argument must be a string
    if (typeof phone !== 'string') {
      //if it is not, we throw an error
      reject(new Error('typeof phone must be string'));
    }
    //input for 'phone' must be in a US phone number format
    if (phone.substring(0, 2) !== '+1') {
      //if improperly formatted, we throw an error
      reject(new Error('phone must be string formatted as such: +1XXXXXXXXXX'));
    }

    //we should consider verifying the proper length of the 'phone' number
    //we should also consider verifyint that each 'phone' number is all numbers

    //this logic could be relative to the Twilio API
    client.verify.services
      .create({ friendlyName: `${appName}` })
      //returns a promise
      .then((service) => {
        //data returned from promise is destructured for the property of 'sid'
        const { sid } = service;
        //either adds or updates the 'users' object at the given 'userID' with the object assigned
          //assigned object has 3x properties, userID, sid, phone
        users[userID] = {
          userID,
          sid,
          phone,
        };
        //if successful, this promise will return the newly created user object
        resolve(users[userID]);
      })
        //if unsuccessful, this promise will return the error message
      .catch(err => reject(new Error(String(err))));
  });
}
//create function is then exported for accessibility in other files
module.exports = create;
