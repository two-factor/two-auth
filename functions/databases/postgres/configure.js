var parse = require('pg-connection-string').parse;
const { Pool } = require('pg');

//function takes in a URI, returns a PG Pool

function generatePool(connectionURI) {
  // parses URI to extract user, port, hot, database, password
  const { user, port, host, database, password } = parse(connectionURI);

  // returns new Postgres connection with parsed data
  return new Pool({
    user,
    host,
    database,
    password,
    port: port || 5432
  });
}

// export method for developer user. abstract away setting up DB connection
module.exports = generatePool;
