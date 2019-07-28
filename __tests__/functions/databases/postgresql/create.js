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
const generatePool = require('../../../../functions/databases/postgres/configure');
const { postgresCreate } = require('../../../../functions/databases/postgres/postgresController');

const mockURI = 'postgresql://tester:ilovetesting@localhost:5432/two-auth-db-test';

describe('tests the pg create method', () => {
  const testPgPool = generatePool(mockURI);

  class FakeClient {
    constructor(isError) {
      this.users = {};
      this.isError = isError;
      // mimics index.js functionality of connecting to DB
      // creating a new pgPool each new instance of FakeClient
      // made into arrow function
      this.pgConnect = () => new Promise((resolve, reject) => {
        testPgPool.connect((err, database, done) => {
          if (err) {
            reject(new Error('Error connecting to Test Postgres Pool.'));
          }
          // handles if DB is undefined or null
          if (!database) {
            throw new Error('Could not find Test Database at Connection URI.');
          }
          resolve({ database, done });
        });
      });
      this.client = {
        verify: {
          services: {
            create: () => new Promise((resolve, reject) => {
              // this is the pertinent info from create method, off the service object.
              // Allows us to make proper DB insertion query
              if (isError) reject(new Error('Error in establishing new two-auth user'));
              resolve({ sid: 'testSID' });
            }),
          },
        },
      };
      this.create = postgresCreate;
    }
  }
  // in each test, where we'll have access to DB object, must
  // drop all rows after expect invocation

  beforeEach(() => {
    testPgPool.connect((err, database, done) => {
      if (err) throw new Error('Error connecting to database beforeEach');
      database.query('DELETE FROM twoauthusers')
        .then(() => {
          done();
        }).catch((err) => {
          throw new Error('Error clearing database row');
        });
    });
  });

  afterEach(() => {
    testPgPool.connect((err, database, done) => {
      if (err) throw new Error('Error connecting to database afterEach');
      database.query('DELETE FROM twoauthusers')
        .then(() => {
          done();
        }).catch((err) => {
          throw new Error('Error clearing database row');
        });
    });
  });


  xit('phone number that is not a string should throw an error', () => {
    const fakeClient = new FakeClient(false);
    return fakeClient.create('Will', 19795718947)
      .catch((err) => {
        expect(err).toEqual(Error('typeof phone must be string'));
      });
  });

  xit('improperly formatted phone number should throw an error', () => {
    const fakeClient = new FakeClient(false);
    return fakeClient.create('Will', '9795718947')
      .catch((err) => {
        expect(err).toEqual(Error('phone must be string formatted as such: +1XXXXXXXXXX'));
      });
  });

  // as an example below: phone number with letters should throw an error
  xit('phone number including non numeric characters should throw an error', () => {
    const fakeClient = new FakeClient(false);
    return fakeClient.create('Will', '+197957189ab')
      .catch((err) => {
        expect(err).toEqual(Error('phone number must include only numbers'));
      });
  });

  xit('phone number not of proper length should throw an error', () => {
    const fakeClient = new FakeClient(false);
    return fakeClient.create('Will', '+1979571')
      .catch((err) => {
        expect(err).toEqual(Error('including the +1, the length of phone must equal 12'));
      });
  });


  // for catching error client.verify.services
  xit('if the create method from twilio fails, it should throw an error', () => {
    const fakeClient = new FakeClient(true);
    return fakeClient.create('Will', '+19795718947')
      .catch((err) => {
        expect(err).toEqual(Error('Error in establishing new two-auth user'));
      });
  });

  xit('generates a postgres row with the correct sid', () => {
    const fakeClient = new FakeClient(false);
    // when pgConnect is invoked, it returns an object with database key/value pair, and done key/value pair.
    // destructuring those values here

    // the step below is probably not needed because of a
    // real connection to a DB
    // let { database, done } = fakeClient.pgConnect();

    return fakeClient.create('fakeUser', '+11231231234').then((user) => {
      // should loosely equal object with same key/value pairs
      expect(user).toEqual({ userID: 'fakeUser', phone: '+11231231234', sid: 'testSID' });
    });
  });
});
