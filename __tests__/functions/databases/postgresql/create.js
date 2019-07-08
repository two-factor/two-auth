const create = require("../../../../functions/databases/postgres/create");
describe('tests the pg create method', () => {
  class FakeClient {
    constructor(isError) {
      this.users = {};
      this.isError = isError;
      this.pgConnect = function () {
        return new Promise((resolve, reject) => {
          resolve({
            database: {
              query: (query, values) => new Promise((resolve, reject) => {
                resolve('fakeUser');
              }),
            },
            done: () => null,
          });
        });
      };
      this.client = {
        verify: {
          services: {
            create: () => new Promise((resolve, reject) => {
              resolve({ sid: 'testSID' });
            }),
          },
        },
      };
      this.create = create;
    }
  }
  
  it("generates a postgres row with the correct sid", () => {
    const fakeClient = new FakeClient(false);
    let database = fakeClient.pgConnect();
    return fakeClient.create('fakeUser', '+11231231234').then((user) => {
      expect(user).toEqual('fakeUser');
    })
  })
});
