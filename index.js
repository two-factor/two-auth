const twilio = require("twilio");
const mongoose = require("mongoose");

// functions to be used if no database is used by the client
const { create, send, verify } = require('./functions/noDbController');

// import mongoose functions
const { mongooseCreate, mongooseSend, mongooseVerify } = require('./functions/databases/mongoose/mongooseController');
const userSchema = require("./functions/databases/mongoose/userSchema");

//import postgres functions
const { postgresCreate, postgresSend, postgresVerify} = require('./functions/databases/postgres/postgresController');
const generatePool = require("./functions/databases/postgres/configure");
const createTable = require("./functions/databases/postgres/createtable");

//
const connect = (
  // AccSID is Twilio account SID
  AccSID,
  // AuthToken is Twilio account token
  AuthToken,
  // optional parameters for when invoking twoAuth as a user
  options = {
    appName: "",
    isPostgres: false,
    connectionURI: null
  }
) => {
  // edge cases for entering information correctly into options parameter and providing default values to appName and isPostgres
  if (typeof options === "string")
    throw new Error(
      "Options config must be an object, as specified in the documentation."
    );
  if (!options.hasOwnProperty("appName")) {
    options.appName = "";
  }
  if (!options.hasOwnProperty("isPostgres")) {
    options.isPostgres = false;
  }
  // returns new client which is a constructor
  return new Client(AccSID, AuthToken, options);
};

// EXAMPLE CONFIG OBJECT
// options = {
//   appName: "three-auth",
//   isPostgres: true,
//   connectionURI: "Mongo_URI"
// }
class Client {
  constructor(AccSID, AuthToken, options) {
    this.appName = options.appName;
    this.AccSID = AccSID;
    this.AuthToken = AuthToken;
    // this.client verifies twilio account???
    this.client = twilio(this.AccSID, this.AuthToken);
    this.users = {};
    // this if conditional might lead us to want to change the original options.isPostgres to be REQUIRED to be a boolean
    // maybe use an if conditional to check if isPostgres is not true nor false nor null, then console.log('you fucked up')
    if (options.connectionURI !== null && options.isPostgres === false) {
      // when conditions are met, we connect to mongoose using the URI given
      // but what happens when we don't give a URI since it is an optional parameter?
      mongoose.connect(options.connectionURI)
        .then(db => {
          console.log("Two-Auth successfully connected to Mongo");
        })
        .catch(err => {
          throw new Error("Two-Auth Unable to connect to Mongo");
        });
      // this is used for creating a collection called 'two-auth-user'
      this.TwoAuthUser = mongoose.model("two-auth-user", userSchema);
      // how come we're not using native mongoose methods on the model? Because these are going to be the Two-Auth methods
      this.create = mongooseCreate;
      this.send = mongooseSend;
      this.verify = mongooseVerify;
    } else if (options.connectionURI !== null && options.isPostgres === true) {
      // connect to the Postgres database and assign a reference to the connected database to our client object
      const pgPool = generatePool(options.connectionURI);
      // this is used to reference if a table has already been created
      let tableCreated = false;
      // why is this not fat arrow syntax? We think it is because of the promise handling maybe? lol
      this.pgConnect = function () {
        return new Promise((resolve, reject) => {
          // connection using created pool
          pgPool.connect(function (err, database, done) {
            if (err) reject(new Error("Error connecting to Postgres Pool."));
            if (!database) {
              throw new Error("Could not find Database at Connection URI.");
            }
            // if table not created yet, create it and modify closure to reflect
            if (tableCreated === false) {
              database
                .query(createTable)
                .then(res => {
                  // ask Juan about resolve. we think it takes the object parameter and ask if database is connected or not and when done is "did it work?"
                  resolve({ database, done });
                  tableCreated = true;
                })
                // should probably use err or error
                .catch(e =>
                  reject(new Error("Error connecting to Postgres Pool."))
                );
            } else {
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
      this.create = create;
      this.send = send;
      this.verify = verify;
    }
  }
}

module.exports = connect;
