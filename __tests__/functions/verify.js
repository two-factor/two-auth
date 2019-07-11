
const { verify } = require('../../functions/noDbController');

// On client check verify

describe('testing the verify method', () => {
  class FakeClient {
    // default param of correctInput to be used to check if the verification code was correct, but there was a failure in the verification process
    constructor(isError, correctInput = true) {
      this.client = {
        verify: {
          services: () => ({
            verificationChecks: {
              // verifies the code sent TO the provided phone number
              create: ({ to, code }) => new Promise((resolve, reject) => {
                // check docs on why the truthy value is 'approved' while falsy is false
                if (!isError && correctInput) resolve({ status: 'approved' });
                // changed reject to resolve because the promise is not rejecting the code, the result is simply false
                else if (!isError & !correctInput) resolve({ status: false });
                else reject('Error in verification process');
              }),
            },
          }),
        },
      };
      this.verify = verify;
      this.users = { Zep: { sid: 'Zep3246', phone: '+13479087000' } };
    }
  }

  // doesn't actually test the functionality of verify, but tests if the this.users object is empty
  it('throws an error if this.users is empty', () => {
    const fakeClient = new FakeClient(false);
    fakeClient.users = {};
    return fakeClient.verify('Zep').catch((err) => {
      expect(err instanceof Error).toBeTruthy();
    });
  });

  // need to check if users is populated but the user is not found
  // this syntax works for checking the correct error message when an error is thrown
  it('throws an error if username is not found in users object', () => {
    const fakeClient = new FakeClient(false);
    return fakeClient.verify('Will').catch((err) => {
      expect(err).toEqual(Error('userID Error: This userID has not been created yet.'));
    });
  });

  // this syntax allows for the testing of the error message itself
  it('throws an error if sid of the user not found', () => {
    const fakeClient = new FakeClient(false);
    fakeClient.users.Zep.sid = null;
    return expect(fakeClient.verify('Zep')).rejects.toThrow('SID Error: No SID exists for this user.');
    // return fakeClient.verify("Zep").catch(err => {
    //   expect(err instanceof Error).toBeTruthy()
    // });
  });

  // we don't need to check if the phone number is valid because create.js already handled that
  it('throws an error if phone number of the user is not found', () => {
    const fakeClient = new FakeClient(false);
    fakeClient.users.Zep.phone = null;
    return expect(fakeClient.verify('Zep')).rejects.toThrow('Phone Number Error: No phone number exists for this user.');
  });

  // test if user has correct verification code
  it("verification status should be 'approved' if the verification code matches", () => {
    const fakeClient = new FakeClient(false);
    return expect(fakeClient.verify('Zep')).resolves.toBeTruthy();
  });

  // tests if user provides incorrect verification code
  it('verification status should resolve to be false if the verification code does not match', () => {
    const fakeClient = new FakeClient(false, false);
    return expect(fakeClient.verify('Zep')).resolves.toBeFalsy();
  });

  // if error in verification process, should catch an error
  it('error in verification process should be caught', () => {
    const fakeClient = new FakeClient(true);
    return fakeClient.verify('Zep').catch((err) => {
      expect(err instanceof Error).toBeTruthy();
    });
  });
});
