// this test might need to connect to test DB for actual testing.
// if so, need actual PG methods, not mock ones
/*
MOCK DB INFO

* const client = require("../index")(process.env.SID, * process.env.AUTH, {
*   isPostgres: true,
*   appName:'DATABASE TEST two-factor',
*   connectionURI: "postgresql://tester:ilovetesting@localhost:5432/two-auth-db-test"
* });
*/

// NOTE: To properly test postgres connections, you must implemenet
// a postgres DB named "two-auth-db-test" with a user "tester" and password "ilovetesting"

// require postgres-specific create method
const generatePool = require("../../../../functions/databases/postgres/configure");
const create = require("../../../../functions/databases/postgres/create");
const mockURI = "postgresql://tester:ilovetesting@localhost:5432/two-auth-db-test";

describe('tests the pg create method', () => {

  class FakeClient {
    constructor(isError) {
      this.users = {};
      this.isError = isError;
      // mimics index.js functionality of connecting to DB
      // creating a new pgPool each new instance of FakeClient
      const testPgPool = generatePool(mockURI);
      // made into arrow function
      this.pgConnect = () => {
        return new Promise((resolve, reject) => {
          testPgPool.connect((err, database, done) => {
            if (err) {
              reject(new Error("Error connecting to Test Postgres Pool."));
            }
            // handles if DB is undefined or null
            if (!database) {
              throw new Error('Could not find Test Database at Connection URI.');
            }
            resolve({ database, done });
          })
        });
      };
      this.client = {
        verify: {
          services: {
            create: () => new Promise((resolve, reject) => {
              // this is the pertinent info from create method, off the service object.
              // Allows us to make proper DB insertion query
              if (isError) reject(new Error('fake error message'));
              resolve({ sid: 'testSID' });
            }),
          },
        },
      };
      this.create = create;
    }
  }

  // in each test, where we'll have access to DB object, must
  // drop all rows after expect invocation

  it("generates a postgres row with the correct sid", () => {
    const fakeClient = new FakeClient(false);
    // when pgConnect is invoked, it returns an object with database key/value pair, and done key/value pair.
    // destructuring those values here

    // the step below is probably not needed because of a 
    // real connection to a DB
    // let { database, done } = fakeClient.pgConnect();

    return fakeClient.create('fakeUser', '+11231231234').then((user) => {
      // should loosely equal object with same key/value pairs
      expect(user).toEqual({ userID: 'fakeUser', phone: '+11231231234', sid: 'testSID' });
    })
  })
});
