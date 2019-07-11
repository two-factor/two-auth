const twilio = require('twilio');
const mongoose = require('mongoose');

// functions to be used if no database is used by the client
// const { create, send, verify } = require('./functions/noDbController');

const create = require('/Users/juanhart1/Documents/CSNYC/week_5/iteration_project_two_auth/functions/create.js');

const send = require('/Users/juanhart1/Documents/CSNYC/week_5/iteration_project_two_auth/functions/send.js');

const verify = require('/Users/juanhart1/Documents/CSNYC/week_5/iteration_project_two_auth/functions/verify.js');

// import mongoose functions
const { mongooseCreate, mongooseSend, mongooseVerify } = require('./functions/databases/mongoose/mongooseController');
const userSchema = require('./functions/databases/mongoose/userSchema');

//import postgres functions
const { postgresCreate, postgresSend, postgresVerify} = require('./functions/databases/postgres/postgresController');
const generatePool = require('./functions/databases/postgres/configure');
const createTable = require('./functions/databases/postgres/createtable');

//
const connect = (
  // AccSID is Twilio account SID
  AccSID,
  // AuthToken is Twilio account token
  AuthToken,
  //this is the third argument, which is optional
  //where we specicify an appName, connectionURI, and if the DB is Postgres or not
  options = {
    appName: '',
    isPostgres: false,
    connectionURI: null
  }
) => {
  // edge cases for entering information correctly into options parameter and providing default values to appName and isPostgres
  if (typeof options === 'string')
    throw new Error(
      'Options config must be an object, as specified in the documentation.'
    );
  //check if 'options' argument doesn't have a property named 'isPostgres'
  //not sure if this conditional is necessary
  if (!options.hasOwnProperty("isPostgres")) {
    options.isPostgres = false;
  }
  //check if 'options' argument doesn't have a property named 'appName'
  //not sure if this conditional is necessary
  if (!options.hasOwnProperty("appName")) {
    options.appName = "";
  }
  //if those checks aren't true, we return the returned value of invoking the Client constructor with 3x arguments, AccSID, AuthToken, options
  return new Client(AccSID, AuthToken, options);
};

// EXAMPLE CONFIG OBJECT
// options = {
//   appName: 'three-auth',
//   isPostgres: true,
//   connectionURI: 'Mongo_URI'
// }
class Client {
  constructor(AccSID, AuthToken, options) {
    // initializing instance's properties with parameters
    this.appName = options.appName;
    this.AccSID = AccSID;
    this.AuthToken = AuthToken;
    this.client = twilio(this.AccSID, this.AuthToken);
    this.users = {};
    // this if conditional might lead us to want to change the original options.isPostgres to be REQUIRED to be a boolean
    // maybe use an if conditional to check if isPostgres is not true nor false nor null, then console.log('you fucked up')
    if (options.connectionURI !== null && options.isPostgres === false) {
      // when conditions are met, we connect to mongoose using the URI given
      // but what happens when we don't give a URI since it is an optional parameter?
      mongoose.connect(options.connectionURI)
        .then(db => {
          console.log('Two-Auth successfully connected to Mongo');
        })
        // if it doesn't connect, throw an error
        .catch(err => {
          throw new Error('Two-Auth Unable to connect to Mongo');
        });
      // adding Mongoose model to this Client instance, if using MongoDB
      this.TwoAuthUser = mongoose.model("two-auth-user", userSchema);
      // binding Mongoose-specific functions to instance of Client
      this.create = mongooseCreate;
      this.send = mongooseSend;
      this.verify = mongooseVerify;
    } else if (options.connectionURI !== null && options.isPostgres === true) {
      // ensure URI is valid and check of working with Postgres DB.
      // connect the database and assign a reference to it to our client object
      const pgPool = generatePool(options.connectionURI);
      // this is used to reference if a table has already been created
      let tableCreated = false;
      this.pgConnect = () => {
        // returns new promise inside this method
        return new Promise((resolve, reject) => {
          // connection using created pool
          pgPool.connect((err, database, done) => {
            // handles error if unable to connect to Postgres DB
            if (err) reject(new Error("Error connecting to Postgres Pool."));
            // handles if DB is undefined or null
            if (!database) {
              throw new Error('Could not find Database at Connection URI.');
            }
            // if table not created yet, create it and modify closure to reflect
            if (tableCreated === false) {
              // if no table created, query DB with exported Query to make a new table
              database
                .query(createTable)
                // returns a promise after query
                .then(res => {
                  // if query is successful, result is not needed in resolve. resolve with an object with database and done method
                  resolve({ database, done });
                  // reassign tableCreated to true after a table is made
                  tableCreated = true;
                })
                // should probably use err or error
                // catch error if querying DB is unsuccessful
                .catch(e =>
                  reject(new Error('Error connecting to Postgres Pool.'))
                );
            } else {
              // if table has already been made, resolve with an object with database and done method
              resolve({ database, done });
            }
          });
        });
      };
      // assign the postgres functions to our client object that we created and imported from /functions
      this.create = postgresCreate;
      this.send = postgresSend;
      this.verify = postgresVerify;
    } else {
      // if URI is null, then assign "vanilla" versionf of the three methods
      this.create = create;
      this.send = send;
      this.verify = verify;
    }
  }
}

module.exports = connect;
