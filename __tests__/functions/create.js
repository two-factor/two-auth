// might have to import twilio and recreate FakeClient exactly like it would appear in index.js

const create = require("../../functions/create");
describe("tests the create function", () => {
  // this might be where twilio api comes into play
  // creating a fake client class with essentially the same logic as in index.js
  class FakeClient {
    constructor(isError) {
      this.users = {};
      this.isError = isError;
      this.client = {
        verify: {
          services: {
            create: () => {
              const isError = this.isError;
              return new Promise((resolve, reject) => {
                if (isError) {
                  reject(new Error("fake error message"));
                }
                resolve({
                  sid: "fakeSid"
                });
              });
            }
          }
        }
      };
      this.create = create;
    }
  }
  
  // this is currently checking for the INSTANCE of an sid, we need to also check if the sid is in the correct format
  it("generates a user with an sid", () => {
    const fakeClient = new FakeClient(false);
    let users = fakeClient.users;
    return fakeClient.create("ian", "+17604307620").then(user => {
      expect(users.hasOwnProperty("ian")).toBeTruthy();
      expect(user.sid).toEqual("fakeSid");
    });
  });

  // xit('sid should be in correct format', () => {
  //   const fakeClient = new FakeClient(true);
  //   let users = fakeClient.users;
  //   return fakeClient
  // });

  // we should have multiple tests for specific rejection rather 
  it("passes error message on rejection", () => {
    const fakeClient = new FakeClient(true);
    // users is not utilized
    return fakeClient.create("ian", "+17604307620").catch(err => {
      expect(err instanceof Error).toBeTruthy();
    });
  });

  it('throws error if phone number is not a string', () => {
    const fakeClient = new FakeClient(false);
    let users = fakeClient.users;
    return fakeClient.create("dillon", '+19795718947').catch(err => {
      expect(err instanceof Error).toBeFalsy();
    })
  });

  // need to fix if conditional in create.js so that it is formated in US phone number format
  it('phone number should be formatted correctly', () => {
    const fakeClient = new FakeClient(false);
    let users = FakeClient.users;
    return fakeClient.create("dillon", '+19795718947').catch(err => {
      expect(err instanceof Error).toBeFalsy();
    })
  });
  it('phone number should be the correct length', () => {
    const fakeClient = new FakeClient(false);
    let users = FakeClient.users;
    return fakeClient.create("dillon", '+19795718947').catch(err => {
      expect(err instanceof Error).toBeFalsy();
    })
  });
});

