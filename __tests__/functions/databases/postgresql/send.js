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
const { postgresSend } = require('../../../../functions/databases/postgres/postgresController');


describe('tests the pg send function', () => {
  const mockSave = jest.fn(x => x);

  beforeAll(() => {
    mockSave.mockClear();
  });
  class FakeClient {
    constructor(sidExists = true) {
      this.pgConnect = function () {
        return new Promise((resolve, reject) => {
          resolve({
            database: {
              query(query, values, callback) {
                mockSave();
                if (sidExists) {
                  callback(null, {
                    rows: [
                      {
                        sid: 'fakesid',
                        phone: '1234',
                      },
                    ],
                  });
                } else {
                  callback(null, {
                    rows: [
                      {
                        sid: null,
                        phone: '1234',
                      },
                    ],
                  });
                }
              },
            },
            done() {
              return null;
            },
          });
        });
      };
      this.client = {
        verify: {
          services(sid) {
            return {
              verifications: {
                create({ to, phone }) {
                  return new Promise((resolve, reject) => {
                    resolve('fakeverification');
                  });
                },
              },
            };
          },
        },
      };
      this.send = postgresSend;
    }
  }

  xit('successfully saves to a database', async () => {
    const client = new FakeClient();
    const result = await client.send();
    expect(mockSave.mock.calls.length).toBe(1);
  });

  xit('rejects with an error if no sid exists', async () => {
    const client = new FakeClient(false);
    const result = client.send();
    expect(result).rejects.toBeInstanceOf(Error);
  });

  xit('successfully resolves a verification from twilio', async () => {
    const client = new FakeClient();
    const result = await client.send();
    expect(result).toBe('fakeverification');
  });
});
