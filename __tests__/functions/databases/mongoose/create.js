const mongoose = require('mongoose');
const mongooseCreate = require ('../../../../functions/databases/mongoose/create');

describe('tests the create function', () => {
    class FakeClient {
        constructor(
          AccSID,
          AuthToken
        ) {
          this.AccSID = AccSID;
          this.AuthToken = AuthToken;
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
            this.TwoAuthUser = {
                create: ({
                    userID,
                    sid,
                    phone
                }) => {
                    return new Promise((resolve, reject) => {
                        resolve(5)
                    })
                }
            };
            this.create = mongooseCreate;
        }
      }

      it('generates a user with the right sid', async () => {
        const newClient = new FakeClient();
        // create a user using client.create()
        let result = await newClient.create('ian', '+17604307620')
        expect(result).toBe(5)
        // query database for that user
      });

      it('passes error message on rejection', () => {
        const newClient = new FakeClient();
        let users = newClient.users;
        newClient.create('ian', '+17604307620').catch(err => { expect(err instanceof Error).toBeTruthy();
      });
    });
});