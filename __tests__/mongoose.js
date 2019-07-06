const client = require("../index")(
  "AC307f83011f4e85c3b80560128a3ada18",
  "5e6536e39b68aab14033e0b2cc8b8274",
  "mongodb://localhost/twofactortest"
);
client
  .create("ian", "+17604207520")
  .then(user => console.log(user))
  .catch(err => console.log(err));
