// const client = require('../../../../index')(process.env.SID, process.env.AUTH, {
//   isPostgres: true,
//   appName: 'testApp',
//   connectionURI: 'postgres://postgres:yellowjacket@localhost/twoauthtest',
// });

// // client.create("ian", "+17604207520");

// client
//   .create('ian', '+12016750593')
//   .then(res => console.log(res))
//   .catch(err => console.log(err));
// // describe("Tests for Postgres Send", () => {

// // });

describe('tests the pg create method', () => {
  class FakeClient {
    constructor() {
      this.pgConnect = function () {
        return new Promise((resolve, reject) => {
          resolve({
            query: (query, values) => new Promise((resolve, reject) => {
              resolve('fakeUser');
            }),
          });
        });
      };
    }
    this.client = {
      verify: {
        services: {
          create: ({})
        }
      }
    }
  }
});
