const twilio = require("twilio");
const mongoose = require("mongoose");

const create = require("./functions/create.js");
const send = require("./functions/send.js");
const verify = require("./functions/verify.js");

// import mongoose functions
const mongooseCreate = require("./mongoose/create");
const mongooseSend = require("./mongoose/send");
const mongooseVerify = require("./mongoose/verify");
const userSchema = require("./mongoose/userSchema");

//import postgres functions
const generatePool = require("./postgres/configure");
const createTable = require("./postgres/createtable");
const postgresCreate = require("./postgres/create");
const postgresSend = require("./postgres/send");
const postgresVerify = require("./postgres/verify");

const connect = (AccSID, AuthToken, mongoURI = null) => {
  return new Client(AccSID, AuthToken, mongoURI);
};

// EXAMPLE CONFIG OBJECT
// options = {
//   appName: "",
//   connectionURI: null,
//   isPostgres: null
// }
class Client {
  constructor(
    AccSID,
    AuthToken,
    options = {
      appName: "",
      connectionURI: null,
      isPostgres: false
    }
  ) {
    if (typeof options === "string")
      throw new Error(
        "Options config must be an object, as specified in the documentation."
      );
    if (!options.hasOwnProperty("isPostgres")) {
      options.isPostgres = false;
    }
    if (!options.hasOwnProperty("appName")) {
      options.appName = "";
    }
    this.AccSID = AccSID;
    this.AuthToken = AuthToken;
    this.client = twilio(this.AccSID, this.AuthToken);
    this.users = {};

    if (options.connectionURI !== null && options.isPostgres === false) {
      mongoose
        .connect(options.connectionURI)
        .then(db => {
          console.log("Two Factor successfully connected to Mongo");
        })
        .catch(err => {
          throw new Error("Two Factor Unable to connect to Mongo");
        });
      this.TwoAuthUser = mongoose.model("two-auth-user", userSchema);
      this.create = mongooseCreate;
      this.send = mongooseSend;
      this.verify = mongooseVerify;
    } else if (options.connectionURI !== null && options.isPostgres === true) {
      // connect the database and assign a reference to it to our client object
      const pgPool = generatePool(options.connectionURI);
      let tableCreated = false;
      this.pgConnect = function() {
        return new Promise((resolve, reject) => {
          // connection using created pool
          pgPool.connect(function(err, database, done) {
            if (err) reject(new Error("Error connecting to Postgres Pool."));
            if (!database) {
              throw new Error("Could not find Database at Connection URI.");
            }
            // if table not created yet, create it and modify closure to reflect
            if (tableCreated === false) {
              database
                .query(createTable)
                .then(res => {
                  resolve({ database, done });
                  tableCreated = true;
                })
                .catch(e =>
                  reject(new Error("Error connecting to Postgres Pool."))
                );
            } else {
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
      this.create = create;
      this.send = send;
      this.verify = verify;
    }
  }
}

module.exports = connect;
