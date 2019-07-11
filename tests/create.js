<<<<<<< HEAD
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
=======
const ericSid = 'ACc51d785b0f47db21ef473c6f277cf2ef';
const ericToken = 'f24bf1d198b08682edf3b8b4e9548314';
const client = require("../index")(ericSid, ericToken, {
  appName: 'SSU',
  isPostgres: false,
  connectionURI: 'mongodb://localhost:27017/test-database'
  // connectionURI: 'postgres://dzpzgnep:888XIDsxi_eA6eKIuvalKanXPG50LfnH@raja.db.elephantsql.com:5432/dzpzgnep'
});

const asyncTest = async () => {
  await client.create("William", "+15303047464");
  await client.send("William");
  console.log(client.users);
}
const asyncVerify = async () => {
  try {
    await client.verify("William", '338033')
    console.log('text verified');
  } catch (err) {
    console.log('error in verifying text');
  }
}

// asyncTest();
asyncVerify();
>>>>>>> fc41a572cf789f7388c6057caeed425f83ddcc04
// console.log("client is", Client);

// Client.create("ian", "17604207520")
//   .then(user => console.log(user))
//   .catch(err => console.log(err));
