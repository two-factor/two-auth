const ericSid = 'ACc51d785b0f47db21ef473c6f277cf2ef';
const ericToken = 'f24bf1d198b08682edf3b8b4e9548314';
const client = require('../index')(ericSid, ericToken, {
  appName: 'SSU',
  isPostgres: false,
  connectionURI: 'mongodb://localhost:27017/test-database',
  // connectionURI: 'postgres://dzpzgnep:888XIDsxi_eA6eKIuvalKanXPG50LfnH@raja.db.elephantsql.com:5432/dzpzgnep'
});


const asyncTest = async () => {
  await client.create('Will', '+15303047464');
  // need to account for new param in send
  await client.send('Will');
  console.log(client.users);
};
const asyncVerify = async () => {
  try {
    await client.verify('Will', '403062');
    console.log('authenticaiton verified');
  } catch (err) {
    console.log('error in verifying text');
  }
};

// asyncTest();
asyncVerify();
// console.log("client is", Client);

// Client.create("ian", "17604207520")
//   .then(user => console.log(user))
//   .catch(err => console.log(err));
