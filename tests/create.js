const client = require("../index")(process.env.SID, process.env.AUTH, {
  isPostgres: true,
  connectionURI: "postgres://student:ilovetesting@localhost/twoauthtests"
});

client.create("ian", "+17604207520");

// console.log("client is", Client);

// Client.create("ian", "17604207520")
//   .then(user => console.log(user))
//   .catch(err => console.log(err));
