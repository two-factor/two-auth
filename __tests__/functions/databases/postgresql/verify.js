// NOTE: THESE TESTS HAVE NOT BEEN VERIFIED

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

const { postgresVerify } = require('../../../../functions/databases/postgres/postgresController');

const generatePool = require('../../../../functions/databases/postgres/configure');

const mockURI = 'postgresql://tester:ilovetesting@localhost:5432/two-auth-db-test';

describe('test for postgres', () => {
  const mockVerify = jest.fn();

  beforeAll(() => {
    mockVerify.mockClear();
  });

  const testPgPool = generatePool(mockURI);
  class FakeClient {
    constructor() {
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
          services: sid => ({
            verificationChecks: {
              create({ code }) {
                return new Promise((resolve, reject) => {
                  if (code === '123456') resolve({ status: 'approved' });
                  // copies format from vanilla verify
                  else resolve({ status: false });
                });
              },
            },
          }),
        },
      };
      this.verify = postgresVerify;
    }
  }

  // NOTE: WANT TO MOCK ADD ONE PERSON IN AT THE VERY BEGINNING, AND CLEAR IT OUT AT THE VERY END
  beforeEach(() => {
    testPgPool.connect((err, database, done) => {
      if (err) throw new Error('Error connecting to database beforeEach');
      database.query('DELETE FROM twoauthusers')
        .then(() => {
          done();
        })
        .catch((err) => {
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
        })
        .catch((err) => {
          throw new Error('Error clearing database row');
        });
    });
  });

  xit('is false if the verification is wrong', () => {
    const client = new FakeClient();
    client.verify('zep', '123400').then((result) => {
      expect(result).toBe(false);
    });
  });

  xit('return true from the promise ', () => {
    const client = new FakeClient();
    client.verify('zep', '123456').then((result) => {
      expect(result).toBe(true);
    });
  });
});
