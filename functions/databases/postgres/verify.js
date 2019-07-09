const postgresVerify = (userID, code) => {
  const { pgConnect } = this;
  return new Promise((resolve, reject) => {
    pgConnect()
      .then(({ database, done }) => {
        //Query to just check if the user was created
        const query = "SELECT * FROM twoauthusers WHERE userid=$1";
        const values = [String(userID)];

        database
          .query(query, values)
          .then(res => {
            const { sid, phone } = res.rows[0];

            if (!sid)
              return reject(new Error("SID Error: No SID exists for this user."));
            if (!phone)
              return reject(
                new Error(
                  "Phone Number Error: No phone number exists for this user."
                )
              );

            return this.client.verify
              .services(sid)
              .verificationChecks.create({
                to: phone,
                code
              })
              .then(verification => {
                if (verification.status === "approved") resolve(true);
                resolve(false);
              })
              .catch(err => {
                done();
                resolve(false);
              });
          })
          .catch(err => {
            done();
            reject(new Error("Could not find Database at Connection URI."));
          });
      })
      .catch(err => {
        done();
        reject(new Error("Could not find Database at Connection URI."));
      });
  });
  //invoke done before you reject
};

module.exports = postgresVerify;
