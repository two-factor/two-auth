const Client = require("../index")(process.env.SID, process.env.AUTH);

console.log("client is", Client);

Client.create("ian", "17604207520")
  .then(user => console.log(user))
  .catch(err => console.log(err));
