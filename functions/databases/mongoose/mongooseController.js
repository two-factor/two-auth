const mongooseController = {
  // Takes in a userID and phone number associated with that user
  // returns a promise
  // if resolved, adds a user Object with the userId, sid, and phone associated with the service for that user...
  // returns a reference to that object
  // if rejected, throws error from verify API
  mongooseCreate: function (userID, phone) {
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
      // //input for 'phone' must be in a US phone number format
      // if (phone.substring(0, 2) !== "+1") {
      //   //if improperly formatted, we throw an error
      //   reject(new Error("phone must be string formatted as such: +1XXXXXXXXXX"));
      // }
      if (!phone.match(/^\+?[1-9]\d{1,14}$/g)) reject(new Error('phone number invalid'));
  
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
  },
  // takes in a username and code
  // checks whether that code is valid for that username
  // returns a promise
  // if there is a formatting error, promise rejects
  // if there is no error, resolves to be the status of the verification
  // status is true if verification succeeded, false if verification failed
  mongooseVerify: function (userID, code) {
    //this assigns TwoAuthUser the model that exists on the 'this' object named TwoAuthUser
    const TwoAuthUser = this.TwoAuthUser;
    //verify returns a promise object
    return new Promise((resolve, reject) => {
      //we use the 'findOne' method on the Mongoose model of 'TwoAuthUser' to look in our DB for a specific document matching inputted 'userID'
      //it also returns a promise
      TwoAuthUser.findOne({ userID })
        //if promise successful, it returns the user with the matching userID
        .then(user => {
          //we destructe returned user and extract the values at the properties of 'sid' & 'phone'
          const { sid, phone } = user;
          //this confirms that the sid is not undefined
          //if it is, throws an error
          if (!sid) reject(new Error("SID Error: No SID exists for this user."));
          //this confirms that the phone is not undefined
          //if it is, throws an error
          if (!phone)
            reject(
              new Error(
                "Phone Number Error: No phone number exists for this user."
              )
            );
          //this IS some Twilio API shit
          //this functionality sends a texts to the phone registered at users[username]
          //this one refences 'this', which is different than the other files
          //this one also returns the resolved value
          return this.client.verify.services(sid)
            .verificationChecks.create({
              to: phone,
              code
            })
            //if promise successful, returns a verification object
            //verification object has a 'status' property
            //if value is approved, resolve function is invoked with the boolean of 'true'
            .then(verification => {
              if (verification.status === "approved") resolve(true);
              //we should consider changing the 'reject' on line 46 to resolve
              //operations were successful up to this point
              return reject(false);
            });
            //we should consider adding a .catch for error handling
        })
        //this .catch applies to the .findOne Promise
        .catch(err => {
          return reject(false);
        });
    });
  },
  // send takes in a userID
  // it searches through users object to find sid and phone number
  // then uses twilio api to send text message
  // returns a promise
  mongooseSend: function (userID) {
    //still unclear on what 'this' refers to
    //variable 'users' is assigned whatever value exists at this.users, which is not being used here
    const users = this.users;
    //variable 'client' is assigned whatever value exists at this.client
    const client = this.client;
    //TwoAuthUser is the Mongoose/MongoDB model for this particular DB
    const TwoAuthUser = this.TwoAuthUser;
    //returns a promise object
    return new Promise((resolve, reject) => {
      // invokes findOne method on any Mongoose model to found userID parameter
      TwoAuthUser.findOne({ userID: userID })
        // returns a promise, if search was successful. returns found user
        .then(user => {
          //if it does, we destructure the object and extract the 'sid' and 'phone' property values
          const { sid, phone } = user;
          //this confirms that the sid is not undefined
          //if it is, throws an error
          if (!sid) reject(new Error("SID Error: No SID exists for this user."));
          //this confirms that the phone is not undefined
          //if it is, throws an error
          if (!phone)
            reject(
              new Error(
                "Phone Number Error: No phone number exists for this user."
              )
            );
  
          //this could be some Twilio API shit
          //this functionality sends a texts to the phone in the found document in our DB
          client.verify
            .services(sid)
            .verifications.create({
              to: phone,
              //channel could be the way authentication is sent
              //in order to implement phone call stretch feature, we may need to change this
              channel: "sms"
            })
            //we are unsure what is exactly in the 'verification' data
            //could possible be a simple verification of whether the message was successfully sent
            .then(verification => {
              resolve(verification);
            })
            //if unsuccessful, we invoke the reject function and pass it the 'err'
            .catch(err => reject(err));
        })
        .catch(err => {
          reject(err);
          //"userID Error: This userID has not been created yet."
        });
    });
  }
};

module.exports = mongooseController;