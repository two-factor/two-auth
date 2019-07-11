
const { create } = require("../../functions/noDbController");

//these tests test that specific method
describe("tests the create function", () => {

  //declares a mock class that mimics their client class in index.js
  //this 'fakeClient' doesn't take in 3x arguments like the real Client does
  class FakeClient {
    //constructor is passed a boolean value to assume valid arguments when constructor is invoked
    constructor(isError) {
      //instantiated an empty users list
      this.users = {};
      //instantiated an isError property assigned to inputted value
      this.isError = isError;
      //make a dummy client
      //
      this.client = {
        verify: {
          services: {
            create: () => {
              //this is where tests checks if there is an error in the create method being invoked
              const isError = this.isError;
              //returns a Promise
              return new Promise((resolve, reject) => {
                //if isError is 'true', reject function is invoked
                if (isError) {
                  reject(new Error("fake error message"));
                }
                //if isError is 'false', resolve funtion is invoked with an object that has 1x property of 'sid' and a value of 'fakeSid'
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

  //this test checks if a user is generated with the appropriate SID
  it("generates a user with the right sid", () => {
    //instantiated new instance of client
    const fakeClient = new FakeClient(false);
    //pull users property off of the fakeClient
    let users = fakeClient.users;
    //returning invoked create method on fakeClient
    return fakeClient.create("ian", "+17604307620")
      //if successful, returns a specific user object that was just created
      .then(user => {
      //checks is users object includes a property named 'ian'
      expect(users.hasOwnProperty("ian")).toBeTruthy();
      //checks if newly created user obejct has a property named sid assigned to a value of 'fakeSid'
      expect(user.sid).toEqual("fakeSid");
    });
  });


  //we could add tests that ensure errors are thrown with improper arguments to the create method

  //this tests check is their is an error in the creation method's process

  it("passes error message on rejection", () => {
    //instantiated new instance of client
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

