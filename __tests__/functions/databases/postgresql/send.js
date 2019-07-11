const { postgresSend } = require("../../../../functions/databases/postgres/postgresController");

// NOTE: THESE TESTS HAVE NOT BEEN VERIFIED

describe("tests the pg send function", () => {
  const mockSave = jest.fn(function (x) {
    return x;
  });

  beforeAll(() => {
    mockSave.mockClear();
  });
  class FakeClient {
    constructor(sidExists = true) {
      this.pgConnect = function () {
        return new Promise((resolve, reject) => {
          resolve({
            database: {
              query: function (query, values, callback) {
                mockSave();
                if (sidExists) {
                  callback(null, {
                    rows: [
                      {
                        sid: "fakesid",
                        phone: "1234"
                      }
                    ]
                  });
                } else {
                  callback(null, {
                    rows: [
                      {
                        sid: null,
                        phone: "1234"
                      }
                    ]
                  });
                }
              }
            },
            done: function () {
              return null;
            }
          });
        });
      };
      this.client = {
        verify: {
          services: function (sid) {
            return {
              verifications: {
                create: function ({ to, phone }) {
                  return new Promise((resolve, reject) => {
                    resolve("fakeverification");
                  });
                }
              }
            };
          }
        }
      };
      this.send = postgresSend;
    }
  }

  xit("successfully saves to a database", async () => {
    const client = new FakeClient();
    const result = await client.send();
    expect(mockSave.mock.calls.length).toBe(1);
  });

  xit("rejects with an error if no sid exists", async () => {
    const client = new FakeClient(false);
    const result = client.send();
    expect(result).rejects.toBeInstanceOf(Error);
  });

  xit("successfully resolves a verification from twilio", async () => {
    const client = new FakeClient();
    const result = await client.send();
    expect(result).toBe("fakeverification");
  });
});
