module.exports = function(userID) {
  const { pgConnect, client } = this;
  return new Promise((resolve, reject) => {
    pgConnect()
      .then(({ database, done }) => {
        const query = "SELECT * FROM twoauthusers WHERE userID=$1";
        const values = [String(userID)];
        database.query(query, values, (err, res) => {
          if (err) {
            done();
            reject(err);
          }
          const { sid, phone } = res.rows[0];
          if (!sid) {
            done();
            reject(new Error("SID Error: No SID exists for this user."));
          }
          if (!phone) {
            done();
            reject(
              new Error(
                "Phone Number Error: No phone number exists for this user."
              )
            );
          }
          //invoke done before your resolve this promise
          client.verify
            .services(sid)
            .verifications.create({
              to: phone,
              channel: "sms"
            })
            .then(verification => {
              done();
              resolve(verification);
            })
            .catch(err => {
              done();
              reject(err);
            });
        });
      })
      .catch(err => {
        console.log(err);
        reject(err);
        //"userID Error: This userID has not been created yet."
      });
  });
};
