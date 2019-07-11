// NOTE: THESE TESTS HAVE NOT BEEN VERIFIED
const { postgresVerify } = require("../../../../functions/databases/postgres/postgresController");

describe("test for postgres", () => {
  class FakeClient {
    constructor() {
      this.pgConnect = function () {
        return new Promise((resolve, reject) => {
          resolve({
            database: {
              query: function (query, values, callback) {
                return new Promise((resolve, reject) => {
                  resolve({
                    rows: [
                      {
                        sid: "fakesid",
                        phone: "1234"
                      }
                    ]
                  });
                });
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
              verificationChecks: {
                create: function ({ code }) {
                  return new Promise((resolve, reject) => {
                    if (code === "123456") resolve({ status: "approved" });
                    else resolve({ status: "rejected" });
                  });
                }
              }
            };
          }
        }
      };
      this.verify = postgresVerify;
    }
  }

  it("is false if the verification is wrong", () => {
    const client = new FakeClient();
    client.verify("zep", "123400").then(result => {
      expect(result).toBe(false);
    });
  });

  it("return true from the promise ", () => {
    const client = new FakeClient();
    client.verify("zep", "123456").then(result => {
      expect(result).toBe(true);
    });
  });
});
