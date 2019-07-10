const postgresController = {
  postgresCreate: (userID, phone) => {
    const { client, appName } = this;
    return new Promise((resolve, reject) => {
      this.pgConnect()
        .then(({ database, done }) => {
          if (typeof phone !== 'string') {
            done();
            reject(new Error('typeof phone must be string'));
          }
          if (phone.substring(0, 2) !== '+1') {
            done();
            reject(new Error('phone must be formatted as a string i.e.: +1XXXXXXXXXX'));
          }
          client.verify.services
            .create({ friendlyName: `${appName}` })
            .then((service) => {
              const { sid } = service;
              database.query('INSERT INTO twoauthusers(userID, sid, phone) VALUES($1, $2, $3) RETURNING *', [userID, sid, phone])
                .then((user) => {
                  done();
                  resolve(user);
                })
                .catch((err) => {
                  done();
                  reject(err);
                });
            })
            .catch((err) => {
              done();
              reject(err);
            });
        });
    });
  },
  postgresSend: (userID) => {
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
          reject(err);
          //"userID Error: This userID has not been created yet."
        });
    });
  },
  postgresVerify: (userID, code) => {
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
              this.client.verify
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
  }
};

module.exports = postgresController;