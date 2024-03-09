// ../dbconnect.ts

import mysql from "mysql";
import util from "util";
interface QueryAsyncFunction {
  (sql: string, values?: any): Promise<any>;
}

export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "202.28.34.197",
  user: "web66_65011212089",
  password: "65011212089@csmsu",
  database: "web66_65011212089",
});

export const queryAsync: QueryAsyncFunction = util.promisify(conn.query).bind(conn);


// import mysql from "mysql";
// import util from "util";
// export const conn = mysql.createPool({
//   connectionLimit: 10,
//   host: "202.28.34.197",
//   user: "tripbooking",
//   password: "tripbooking@csmsu",
//   database: "tripbooking",
// });

// export { mysql };

// export const queryAsync = util.promisify(conn.query).bind(conn);
