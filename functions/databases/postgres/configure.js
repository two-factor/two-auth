var parse = require('pg-connection-string').parse;
const { Pool } = require('pg');

//function takes in a URI, returns a PG Pool

function generatePool(connectionURI) {
  const { user, port, host, database, password } = parse(connectionURI);

  return new Pool({
    user,
    host,
    database,
    password,
    port: port || 5432
  });
}

module.exports = generatePool;
