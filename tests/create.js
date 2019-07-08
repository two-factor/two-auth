const client = require("../index")(process.env.SID, process.env.AUTH, {
  isPostgres: true,
  appName:'DATABASE two-factor',
  connectionURI: "postgres://zepvalue:linux@localhost/twoauthtests"
});

//client.create("ian", "+17604207520");
//client.send("ian")
client.verify("ian", '851701')
// console.log("client is", Client);

// Client.create("ian", "17604207520")
//   .then(user => console.log(user))
//   .catch(err => console.log(err));
