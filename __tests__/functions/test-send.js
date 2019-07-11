// NOTE: These tests do not test Twilio API functionality. These tests only mimic Twilio API functionality.

// importing vanilla send function
const { send } = require('../../functions/noDbController');
// invoke describe, group send unit tests together
describe('send unit tests', () => {
  // create mock SID, phone
  const sid = 1;
  const phone = 2;
  // declare mock function of verification.create
  const mockVerificationCreate = jest.fn();

  // added testNoSid to test properly
  // declare client variable. assign object of users
  const client = {
    users: {
      test: {
        sid,
        phone,
      },
      testNoSid: {
        phone,
      },
      testNoPhone: {
        sid,
      },
    },
    isError: false,
    send,
    // mock Twilio functionality
    client: {
      verify: {
        // we should consider passing 'services' the SID as an argument
        services: () => ({
          verifications: {
            create: (obj) => {
              mockVerificationCreate();
              return new Promise((resolve, reject) => {
                // checks if isError is true
                // if it is, reject is invoked
                if (isError) reject('Error in creating verifiation object');
                // else, resolved is invoked
                resolve(obj);
              });
            },
          },
        }),
      },
    },
  };

  // before each test, clear all information mockVerificationCreate
  beforeEach(() => {
    mockVerificationCreate.mockClear();
  });

  afterEach(() => {
    client.isError = false;
  });
  // function should fail if trying to send to a user that does not exit in users object
  // checked functionality of test. edited and works properly now.
  it('send should throw error upon sending to nonexistent user', async () => {
    try {
      // changed to async to ensure promise from client.send would resolve
      await client.send('nonexistent');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  // with added phoneCall parameter, to check method of verification, it must be boolean for function to work
  it('send should throw error if phoneCall parameter is not boolean', async () => {
    try {
      await client.send('test', 'true');
    } catch (err) {
      expect(err).toEqual(new Error('phoneCall parameter must be boolean'));
    }
  });

  // function should fail if username parameter has no sid associated with it
  // checked functionality of test. edited and works properly.
  // only checks if sid prop is on user object and if the SID value itself exists
  it('send should throw error upon nonexistent sid', async () => {
    try {
      await client.send('testNoSid');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  // function should fail if user object doesn't have a phone property
  it('send should throw error upon nonexistent phone number', async () => {
    try {
      await client.send('test');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  // function validates a successful verification chain in Twilio API process.
  // checked. works as originally written.
  it('send should create a verification', () => {
    client.send('test');
    client.send('test');
    expect(mockVerificationCreate.mock.calls.length).toBe(2);
  });

  // function verifies that object argument of verifications.create is resolve in promise.
  // checked. works as originally written
  it('send should be passing an object to the verification.create call containing phone number and channel', () => {
    client.send('test').then((res) => {
      console.log('res inside client.send callback: ', res);
      expect(res).toEqual({ to: phone, channel: 'sms' });
    });
  });

  // function verifies an error is thrown if unable to send text to a user
  it('send should throw an error if unable to verify a successful send', (done) => {
    // isError is reassigned for purposes of this specific test
    client.isError = true;
    // invoke .send
    client.send('test')
      // chain on a .catch
      .catch((err) => {
        // inside of .catch, it expects to catch an instance of error
        expect(err instanceof Error).toBeTruthy();
        done();
      });
  });
});
