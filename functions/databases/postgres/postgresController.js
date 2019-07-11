const postgresController = {
  postgresCreate: function (userID, phone) {
    //Get clear on what 'this' is
     //Could possibly be relative to Twilio API
    const { client, appName } = this;
    return new Promise((resolve, reject) => {
      // first step of this promise is to connect to database
        // unclear of "this" reference, once again
        // unsure which DB we're connecting to
      this.pgConnect()
      // pgConnect was not deconstructed off "this" like it is in "send.js"
        // if connection is successful, returns an object with props "data" and "done"
        .then(({ database, done }) => {
      //input for 'phone' argument must be a string
          if (typeof phone !== 'string') {
        //if it is not, we throw an error and invoke "done" to close DB connection
            done();
            reject(new Error('typeof phone must be string'));
          }
      //input for 'phone' must be in a US phone number format
        //   if (phone.substring(0, 2) !== '+1') {
        //     done();
        // //if improperly formatted, we throw an error and invoke "done"
        //     reject(new Error('phone must be string formatted as such: +1XXXXXXXXXX'));
        //   }
        // checks for valid phone number from any country
        if (!phone.match(/^\+?[1-9]\d{1,14}$/g)) reject(new Error('phone number invalid'));
  
      //we should consider verifying the proper length of the 'phone' number
      //we should also consider verifyint that each 'phone' number is all numbers
  
      //this logic could be relative to the Twilio API
          client.verify.services
            .create({ friendlyName: `${appName}` })
        //returns a promise
            .then((service) => {
          //data returned from promise is destructured for the property of 'sid'
              const { sid } = service;
              // queries DB to add in new two-auth user. returns added user
              database.query('INSERT INTO twoauthusers(userID, sid, phone) VALUES($1, $2, $3) RETURNING *', [userID, sid, phone])
                .then((user) => {
                  // if successful, invokes "resolve" function and returns user object. closes DB connection with "done"
                  done();
                  resolve(user);
                })
                .catch((err) => {
                  // if there's an error, close DB connection with "done", and invoke "reject", and return error message
                  done();
                  reject(err);
                });
            })
          //if unsuccessful, this promise will return the error message
          // does not return string of error, like other catches for client.verify.services.create
            .catch((err) => {
              done();
              reject(err);
            });
        });
    });
  },
  postgresSend: function (userID) {
    //still unclear on what 'this' refers to
    //deconstructs client and pgConnect off "this"
    const { pgConnect, client } = this;
    // returns a promise object
    return new Promise((resolve, reject) => {
      //starts connetion to Postgres DB
      pgConnect()
        //deconstructs returned object, extracting our DB and the done method 
        .then(({ database, done }) => {
          // initializes query string, pulls all users from twoauthusers table that searches for parameter 
          const query = "SELECT * FROM twoauthusers WHERE userID=$1";
          // values is array that stores parameteried query, referenced in DB's query method
          const values = [String(userID)];
          // invoke DB.query method, passing in query string and values array
          database.query(query, values, (err, res) => {
            // if there's an error, close DB connection and invoke "reject" function with error
            if (err) {
              done();
              reject(err);
            }
            // destructure results from table query
            const { sid, phone } = res.rows[0];
            //this confirms that the sid is not undefined
            //if it is, closes DB connection and throws an error
            if (!sid) {
              done();
              reject(new Error("SID Error: No SID exists for this user."));
            }
            //this confirms that the phone is not undefined
            //if it is, closes DB connection and throws an error
            if (!phone) {
              done();
              reject(
                new Error(
                  "Phone Number Error: No phone number exists for this user."
                )
              );
            }
            // curious as to why "done" cannot be invoked here
            //invoke done before your resolve this promise
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
                // DB connection must be closed
                done();
                resolve(verification);
              })
              .catch(err => {
                //if unsuccessful, we invoke the reject function and pass it the 'err', as well as close DB connection
                done();
                reject(err);
              });
          });
          // no catch for DB query in finding user in DB
        })
        // this appears to be a connection error, not a DB query error
        .catch(err => {
          reject(err);
          //"userID Error: This userID has not been created yet."
        });
    });
  },
  postgresVerify: function (userID, code) {
    //destructuring this and extracting pgConnect from 'this' object
    const { pgConnect } = this;
    //returns a Promise
    return new Promise((resolve, reject) => {
      //connecting to the DB
      pgConnect()
        //returns an object with our DB and done method
        //we destructure it inside of the params
        .then(({ database, done }) => {
          //Query to just check if the user was created
          // initializes query string, pulls all users from twoauthusers table that searches for parameter
          const query = "SELECT * FROM twoauthusers WHERE userid=$1";
          // values is array that stores parameteried query, referenced in DB's query method
          const values = [String(userID)];
          // invoke DB.query method, passing in query string and values array
          database
            .query(query, values)
            .then(res => {
              // destructure results from table query
              const { sid, phone } = res.rows[0];
              //this confirms that the sid is not undefined
              //if it is, closes DB connection and throws an error
              if (!sid)
                reject(new Error("SID Error: No SID exists for this user."));
              //this confirms that the phone is not undefined
              //if it is, closes DB connection and throws an error
              if (!phone)
                reject(
                  new Error(
                    "Phone Number Error: No phone number exists for this user."
                  )
                );
              //this could be some Twilio API shit
              //this functionality sends a texts to the phone registered at users[username]
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
                  done();
                  if (verification.status === "approved") resolve(true);
                  resolve(false);
                })
                //if value is not approved, reject function is invoked with the boolean of 'false'
                //unsure if return is needed
                .catch(err => {
                  done();
                  resolve(false);
                });
            })
            //this is the .catch for the database.query Promise
            .catch(err => {
              done();
              reject(new Error("Could not find Database at Connection URI."));
            });
        })
        //this .catch applies to Promise returned from the database connection
        .catch(err => {
          done();
          reject(new Error("Could not find Database at Connection URI."));
        });
    });
    //invoke done before you reject
  }
};

module.exports = postgresController;