const noDbController = {
  // Takes in a userID and phone number associated with that user
  // returns a promise
  // if resolved, adds a user Object with the userId, sid, and phone number associated with the service for that user...
  // returns a reference to that object
  // if rejected, throws error from verify API

  // essentially this create function will create a property on client object that contains userID, sid, and phone number

  // userID and phone parameters come from the client input
  create: function (userID, phone) {
    //Get clear on what 'this' is
    //Could possibly be relative to Twilio API
    const { client, users, appName } = this;

    return new Promise((resolve, reject) => {
      //input for 'phone' argument must be a string
      if (typeof phone !== 'string')
        //if it is not, we throw an error
        reject(new Error('typeof phone must be string'));

      //input for 'phone' must be in a US phone number format
      // if (phone.substring(0, 2) !== '+1') 
      //   //if improperly formatted, we throw an error
      //   reject(new Error('phone must be string formatted as such: +1XXXXXXXXXX'));

      // if (phone.substring(2).match(/[^0-9]/g)) 
      //   reject(new Error('phone number must include only numbers'));

      // if (phone.length !== 12) 
      //   reject(new Error('including the +1, the length of phone must equal 12'))

      if (!phone.match(/^\+?[1-9]\d{1,14}$/g)) reject(new Error('phone number invalid'))


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
  },
  // takes in a userID and code - (6 digit code from the SMS text)
  // checks whether that code is valid for that userID
  // returns a promise
  // if there is a formatting error, promise rejects
  // if there is no error, resolves to be the status of the verification
  // status is true if verification succeeded, false if verification failed
  verify: function (userID, code) {
    //promise is returned from function
    return new Promise((resolve, reject) => {
      //asks if inputted 'userID' exists inside of the 'users' object
      if (!this.users[userID])
        //if it doesn't, throws an error
        reject(
          new Error("userID Error: This userID has not been created yet.")
        );
      //if it does, we destructure the object and extract the 'sid' and 'phone' property values
      const { sid, phone } = this.users[userID];
      //this confirms that the sid is not undefined
      //if it is, throws an error
      if (!sid) reject(new Error("SID Error: No SID exists for this user."));
      //this confirms that the phone is not undefined
      //if it is, throws an error
      if (!phone)
        reject(
          new Error("Phone Number Error: No phone number exists for this user.")
        );
      //this could be some Twilio API shit
      //this functionality sends a texts to the phone registered at users[userID]
      //this one refences 'this', which is different than the other files
      //this one also returns the resolved value
      return this.client.verify
        .services(sid)
        .verificationChecks.create({
          to: phone,
          code
        })
        //if promise successful, returns a verification object
        //verification object has a 'status' property
        //if value is approved, resolve function is invoked with the boolean of 'true'
        .then(verification => {
          if (verification.status === "approved") resolve(true);
          //if value is not approved, reject function is invoked with the boolean of 'false'
          //unsure if return is needed
          return resolve(false);
        });
      //no .catch in place for error handling
      //we should consider implementing this
    });
  },
  // send takes in a userID
  // it searches through users object to find sid and phone number
  // then uses twilio api to send text message
  // returns a promise

  send: function (userID, phoneCall = false) {
    //still unclear on what 'this' refers to
    //variable 'users' is assigned whatever value exists at this.users
    const users = this.users;
    //variable 'client' is assigned whatever value exists at this.client
    const client = this.client;
    //returns a promise object
    return new Promise((resolve, reject) => {
      if (typeof phoneCall !== "boolean") reject(new Error('phoneCall parameter must be boolean'))

      //asks if inputted 'userID' exists inside of the 'users' object
      if (!users[userID])
        //if it doesn't, throws an error
        reject(
          new Error("userID Error: This userID has not been created yet.")
        );
      //if it does, we destructure the object and extract the 'sid' and 'phone' property values
      const { sid, phone } = users[userID];
      //this confirms that the sid is not undefined
      //if it is, throws an error
      if (!sid) reject(new Error("SID Error: No SID exists for this user."));
      //this confirms that the phone is not undefined
      //if it is, throws an error
      if (!phone)
        reject(
          new Error("Phone Number Error: No phone number exists for this user.")
        );
      //this could be some Twilio API shit
      //this functionality sends a texts to the phone registered at users[userID]
      client.verify
        .services(sid)
        .verifications.create({
          to: phone,
          //channel could be the way authentication is sent
          //in order to implement phone call stretch feature, we may need to change this
          channel: phoneCall ? "call" : "sms"
        })
        //we are unsure what is exactly in the 'verification' data
        //could possible be a simple verification of whether the message was successfully sent
        .then(verification => {
          resolve(verification);
        })
        //if unsuccessful, we invoke the reject function and pass it the 'err'
        .catch(err => reject(err));
    });
  }
};

module.exports = noDbController;