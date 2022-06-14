const mysql = require("mysql");
const util = require("util");
require("dotenv").config();


const pool = mysql.createPool({
  connectionLimit: 10,
  host :process.env.grill_host,
  database : process.env.grill_name,
  user : process.env.grill_user,
  password : process.env.grill_pass,  
})

pool.query = util.promisify(pool.query);
module.exports = pool;