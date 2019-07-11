//required mongoose module
const mongoose = require("mongoose");
const mocha = require('mocha');
const chai = require('chai')
const expect = chai.expect;
//required 'create' function from this file
const { mongooseCreate } = require("../../../../functions/databases/mongoose/mongooseController");
const userSchema = require('../../../../functions/databases/mongoose/userSchema.js')

const testModel = mongoose.model('testModel', userSchema);
// const testUser = new testModel({ userID: 'ep36', sid: '1', phone: '+19712222222' });
// const testUser2 = new testModel({ userID: 'jh1', sid: '2', phone: '+15042222222' });

describe('Database Tests', function () {
  before((done) => {
    //Process for creating/connection to mongoDB
    //if using homebrew, run 'brew services start mongodb' in terminal
    //to stop, run 'brew services stop mongodb'
    //once running, you can use 'node' to run the file db connection is in
    //should be g2g
    mongoose.connect('mongodb://localhost:27017/test-database', { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('We are finally fucking connected!!!');
      done();
    });
  });
  xit('is this shit working???', (done) => {
    testModel.find({ userID: 'jh1' }, (err, doc) => {
      expect(doc).to.have.lengthOf.above(0);
      done();
    });
  });

  //describing the test suite
  describe("tests the create/verify/send functions for Mongoose", () => {
    //created a fake client
    //similar to Client class
    //has additional properties of AccSID & AuthToken
    //also has fake data in it
    class FakeClient {
      constructor(AccSID, AuthToken) {
        //instances of FakeClient will have the following properties
        this.AccSID = AccSID;
        this.AuthToken = AuthToken;
        //this.client is where Twilio API functionality is mimicked
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
        //this emulates the saving of a document to the database
        //instead of returning the document created if successful, simply returns the number 5
        this.TwoAuthUser = {
          create: ({ userID, sid, phone }) => {
            return new Promise((resolve, reject) => {
              testModel.create({ userID: 'shiloh', sid: 'fakeSid', phone: '+19711234567' }, (err, doc) => {
                if (err) throw err;
                resolve(doc);
              })
            });
          }
        };
        //initializes a property named 'create' on FakeClient instances
        //assigned to the imported mongooseCreate function
        this.create = mongooseCreate;
      }
    }

    xit("should pass if user successfully created w/ valid userID, sid, & phone number", async () => {
      const newClient = new FakeClient();
      let result = await newClient.create('shiloh', "+19711234567");
      expect(result).to.include({ userID: 'shiloh', sid: 'fakeSid', phone: '+19711234567' });
    });

    xit("should pass if user exists in the MongoDB", async () => {
      const newClient = new FakeClient();
      let result = await newClient.send('shiloh');
      console.log(result, '***');
      expect(result).to.include({ userID: 'shiloh', sid: 'fakeSid', phone: '+19711234567' });
    });

    after(done => {
      mongoose.connection.close(done);
    })
  })

});
