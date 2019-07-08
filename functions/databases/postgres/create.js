/* eslint-disable func-names */
// eslint-disable-next-line func-names

module.exports = function (userID, phone) {
  const { client, appName } = this;
  return new Promise((resolve, reject) => {
    this.pgConnect()
      .then(({ database, done }) => {
        if (typeof phone !== 'string') {
          reject(new Error('typeof phone must be string'));
        }
        if (phone.substring(0, 2) !== '+1') {
          reject(new Error('phone must be string formatted as such: +1XXXXXXXXXX'));
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
};
