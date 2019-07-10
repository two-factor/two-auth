const twilio = require("twilio");
const mongoose = require("mongoose");

const create = require("./functions/create.js");
const send = require("./functions/send.js");
const verify = require("./functions/verify.js");

// import mongoose functions
const mongooseCreate = require("./functions/databases/mongoose/create");
const mongooseSend = require("./functions/databases/mongoose/send");
const mongooseVerify = require("./functions/databases/mongoose/verify");
const userSchema = require("./functions/databases/mongoose/userSchema");

//import postgres functions
const generatePool = require("./functions/databases/postgres/configure");
const createTable = require("./functions/databases/postgres/createtable");
const postgresCreate = require("./functions/databases/postgres/create");
const postgresSend = require("./functions/databases/postgres/send");
const postgresVerify = require("./functions/databases/postgres/verify");

const connect = (
  //this is some Twilio account SID shit
  AccSID,
  //this is some Twilio authorization token shit
  AuthToken,
  //this is the third argument, which is optional
  //where we specicify an appName, connectionURI, and if the DB is Postgres or not
  options = {
    appName: "",
    connectionURI: null,
    isPostgres: false
  }
) => {
  //check if 'options' argument is a string
  if (typeof options === "string")
    //if it is a string, throws an error
    throw new Error(
      "Options config must be an object, as specified in the documentation."
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
//   appName: "",
//   connectionURI: null,
//   isPostgres: null
// }
class Client {
  constructor(AccSID, AuthToken, options) {
    // initializing instance's properties with parameters
    this.appName = options.appName;
    this.AccSID = AccSID;
    this.AuthToken = AuthToken;
    // look at docs about twilio API
    this.client = twilio(this.AccSID, this.AuthToken);
    this.users = {};

    // ensuring URI is there, and Postgres DB is false. if so, connect to MongoDB
    if (options.connectionURI !== null && options.isPostgres === false) {
      mongoose
        // connect to Mongo DB
        .connect(options.connectionURI)
        // if so, console log success
        .then(db => {
          console.log("Two Factor successfully connected to Mongo");
        })
        // if it doesn't connect, throw an error
        .catch(err => {
          throw new Error("Two Factor Unable to connect to Mongo");
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
      let tableCreated = false;
      this.pgConnect = function () {
        // returns new promise inside this method
        return new Promise((resolve, reject) => {
          // connection using created pool
          pgPool.connect(function (err, database, done) {
            // handles error if unable to connect to Postgres DB
            if (err) reject(new Error("Error connecting to Postgres Pool."));
            // handles if DB is undefined or null
            if (!database) {
              throw new Error("Could not find Database at Connection URI.");
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
                // catch error if querying DB is unsuccessful
                .catch(e =>
                  reject(new Error("Error connecting to Postgres Pool."))
                );
            } else {
              // if table has already been made, resolve with an object with database and done method
              resolve({ database, done });
            }
          });
        });
      };

      // assign the postgres functions to our client object
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
