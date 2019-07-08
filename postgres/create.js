module.exports = function(userID, phone) {
  return new Promise((resolve, reject) => {
    this.pgConnect()
      .then((pgDatabase, done) => {
        // pgClient.query... blah blah logic
        //invoke done before your resolve this promise
        console.log("called create");
        done();
      })
      .catch((err, done) => {
        //invoke done before you reject
        reject(err);
      });
  });
};
