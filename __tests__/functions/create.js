const create = require("../functions/create");
describe("tests the create function", () => {
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

  it("generates a user with the right sid", () => {
    const fakeClient = new FakeClient(false);
    let users = fakeClient.users;
    return fakeClient.create("ian", "+17604307620").then(user => {
      expect(users.hasOwnProperty("ian")).toBeTruthy();
      expect(user.sid).toEqual("fakeSid");
    });
  });

  it("passes error message on rejection", () => {
    const fakeClient = new FakeClient(true);
    let users = fakeClient.users;
    return fakeClient.create("ian", "+17604307620").catch(err => {
      expect(err instanceof Error).toBeTruthy();
    });
  });
});
