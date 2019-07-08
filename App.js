const Client = require("./index")('AC307f83011f4e85c3b80560128a3ada18', '5e6536e39b68aab14033e0b2cc8b8274');


console.log("client is", Client);

Client.create("zepvalue", "+13474953775")
  .then(user => console.log(user))
  .catch(err => console.log(err));

Client.verify("ian")
  .then(user => console.log(user))
  .catch(err => console.log(err));
