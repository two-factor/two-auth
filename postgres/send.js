module.exports = function(userID, phone) {
  return new Promise((resolve, reject) => {
    this.pgConnect()
      .then(pgDatabase => {
        // pgClient.query... blah blah logic
      })
      .catch(err => reject(err));
  });
};
