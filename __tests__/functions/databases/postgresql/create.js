const client = require('../../../../index')(process.env.SID, process.env.AUTH, {
  isPostgres: true,
  appName: 'testApp',
  connectionURI: 'postgres://postgres:yellowjacket@localhost/twoauthtests',
});

// client.create("ian", "+17604207520");

client
  .create('ian', '+12016750593')
  .then(res => console.log(res))
  .catch(err => console.log(err));
// describe("Tests for Postgres Send", () => {

// });
