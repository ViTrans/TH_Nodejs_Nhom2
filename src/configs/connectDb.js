const connectDb = async () => {
  // get the client
  const mysql = require("mysql2/promise");
  // create the connection
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "nodejs",
  });

  return connection;
};

export default connectDb;
