//functions for Postgres are exported differently than functions for MongoDB & for the generic function
//function takes in a userID & a code
module.exports = function (userID, code) {
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
};
