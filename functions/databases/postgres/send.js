module.exports = function (userID) {
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
};
