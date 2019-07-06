const send = require('./../functions/send');

describe('send unit tests', () => {
  const sid = 1;
  const phone = 2;
  let mockVerificationCreate = jest.fn();

  let client = {
    users: {
      test: {
        sid,
        phone,
      }
    },
    send,
    client: {
      verify: {
        services: () => ({
          verifications: {
            create: (obj) => {
              mockVerificationCreate();
              return new Promise((resolve) => {
                resolve(obj);
              });
            },
          },
        }),
      },
    },
  };

  beforeEach(() => {
    mockVerificationCreate.mockClear();
  })

  it('send should throw error upon sending to nonexistent user', () => {
    try {
      client.send('nonexistent');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('send should throw error upon nonexistent sid', () => {
    try {
      client.send('test');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('send should throw error upon nonexistent phone number', () => {
    try {
      client.send('test');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  })

  it('send should create a verification', () => {
    client.send('test');
    client.send('test');
    expect(mockVerificationCreate.mock.calls.length).toBe(2);
  })

  it('send should be passing an object to the verification.create call containing phone number and channel', (done) => {
    client.send('test').then((res) => {
      expect(res).toEqual({ to: phone, channel: 'sms' });
      done();
    });
  });
});
