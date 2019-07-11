const willSid = 'AC54a45c41470cf5d79516d925f59fc079';
const willToken = 'f1e816cf078a8ba4d23df270c1393dfe';
const client = require("../index")(willSid, willToken, {
  isPostgres: false,
  appName:'SSU',
  connectionURI: null
});

console.log((client.create("ian", "+17604207520")));
// client.send("ian")
// client.verify("ian", '851701')
// console.log("client is", Client);

// Client.create("ian", "17604207520")
//   .then(user => console.log(user))
//   .catch(err => console.log(err));
