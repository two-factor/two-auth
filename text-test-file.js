//get Acc_SID & Auth_Token from Will, Eric, or Ian
const willSid = 'AC54a45c41470cf5d79516d925f59fc079';
const willToken = 'f1e816cf078a8ba4d23df270c1393dfe';
//require TwoAuth
const TwoAuth = require('./index');
const options = {
  appName: 'sketchersShapeUp',
  isPostgres: false,
  connectionURI: null,
  // added phoneCall as an optional parameter so that the client choose whether the user wants a sms or phone call

  // we need the full options object in order for phoneCall to work
  // defaultSMS: true
};
//invoke connect function we required
//this creates an instance of client that has 3x methods => create, send, & verify
const client = TwoAuth(willSid, willToken, options);

//if we invoke client.create w/ userID &  a phone number, a new client is created in Twilio
// console.log(client, '***');
const asnyncTest = async () => {
  await client.create('juanIsTheMan', '+15044270739');
  await client.send('juanIsTheMan', true);
}

asnyncTest();
// client.send('juanIsTheMan');
// client.verify('juanIsTheMan')
//once client is created, we can then send them a message via client.send
  //takes in a userID
  //sends verification code to number associated with userID
//to then verify that user, we invoke client.verify
  //takes in 2x arguments => userID & the code sent to the user
  //will return true or false based on whether verification code matches what Twilio sent to user