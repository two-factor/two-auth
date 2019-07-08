module.exports = function(userID, phone) {
  return new Promise((resolve, reject) => {
    this.pgConnect()
      .then(({ database, done }) => {
        // pgClient.query... blah blah logic
        //invoke done before your resolve this promise
        done();
      })
      .catch((err, done) => {
        //invoke done before you reject
        done();
        reject(err);
      });
  });
};
