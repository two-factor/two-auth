/* eslint-disable func-names */
// eslint-disable-next-line func-names
// different format for Postgres: export whole function, instead of
// exporting function definition
module.exports = function (userID, phone) {
  const { client, appName } = this;
  return new Promise((resolve, reject) => {
    // first step of this promise is to connect to database
    // unsure which DB we're connecting to
    this.pgConnect()
      // pgConnect was not deconstructed off "this" like it is in "send.js"
      // if connection is successful, returns an object with props "data" and "done"
      .then(({ database, done }) => {
        //input for 'phone' argument must be a string

        // import checks from vanilla create function to bolster verification of proper phone formatting
        if (typeof phone !== 'string') {
          //if it is not, we throw an error and invoke "done" to close DB connection
          done();
          // need to close thread of execution
          return reject(new Error('typeof phone must be string'));
        }
        //input for 'phone' must be in a US phone number format
        if (phone.substring(0, 2) !== '+1') {
          done();
          //if improperly formatted, we throw an error and invoke "done"
          return reject(new Error('phone must be string formatted as such: +1XXXXXXXXXX'));
        }
        if (phone.substring(2).match(/[^0-9]/g)) {
          done();
          return reject(new Error('phone number must include only numbers'))
        }
        // 12 includes '+', 1, and the full 10 digit phone number
        if (phone.length !== 12) {
          done();
          return reject(new Error('including the +1, the length of phone must equal 12'))
        }


        //we should consider verifying the proper length of the 'phone' number
        //we should also consider verifyint that each 'phone' number is all numbers

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
                // destructured result rows to match format in other methods. sql automatically lowercases column names
                const { userid: userID, phone, sid } = user.rows[0];
                const newUser = { userID, phone, sid }
                // this previously gave the entire sql query object back, not just the user information
                resolve(newUser);
              })
              .catch((err) => {
                // if there's an error, close DB connection with "done", and invoke "reject", and return error message
                console.log('Error in querying database');
                done();
                reject(err);
              });
          })

          //if unsuccessful, this promise will return the error message
          // does not return string of error, like other catches for client.verify.services.create
          .catch((err) => {
            console.log('Error in establishing new two-auth user');
            done();
            reject(err);
          });
      })
      // this catch is tough to test because, as far as we know, jest cannot determine if a connection to a database has been made
      .catch(err => {
        console.log('Error in connecting to database');
        reject(err);
      })
  });
};
