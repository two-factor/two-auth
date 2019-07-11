/* eslint-disable func-names */
// eslint-disable-next-line func-names
// different format for Postgres: export whole function, instead of
// exporting function definition
module.exports = function (userID, phone) {
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
};
