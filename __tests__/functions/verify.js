// we need to provide tests and potentially update the functionality for the verify method that would not only check for the instances of user, phone number, etc. and the actual data itself such as the format of phone number, etc.

const { verify } = require("../../functions/noDbController");

//On client check verify

// needs better description text
describe("#verify", () => {
  class FakeClient {
    constructor(isError) {
      this.client = {
        verify: {
          services: () => ({
            verificationChecks: {
              create: ({ to, code }) => {
                return new Promise((resolve, reject) => {
                  if (!isError) resolve({ status: "approved" });
                  else reject({ status: false });
                });
              }
            }
          })
        }
      };
      this.verify = verify;
      this.users = { Zep: { sid: "Zep3246", phone: "+13479087000" } };
    }
  }

  it("throws an error if this.users is empty", () => {
    const fakeClient = new FakeClient(false);
    // FakeClient.users = {}
    return expect(fakeClient.verify("ian")).rejects.toBeInstanceOf(Error);
  });

  it("throws an error if sid of the user not found", () => {
    const fakeClient = new FakeClient(false);
    fakeClient.users["Zep"].sid = null;
    // FakeClient.users = {}
    return expect(fakeClient.verify("Zep")).rejects.toBeInstanceOf(Error);
  });

  it("throws an error if phone of the user not found", () => {
    const fakeClient = new FakeClient(false);
    fakeClient.users["Zep"].phone = null;
    // FakeClient.users = {}
    return expect(fakeClient.verify("Zep")).rejects.toBeInstanceOf(Error);
  });

  it("status approved if the code matches", () => {
    const fakeClient = new FakeClient(false);

    return expect(fakeClient.verify("Zep")).resolves.toBeTruthy();
  });
});
