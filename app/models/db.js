// connect database
const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  port: 3325,
  user: 'root',
  password: '',
  database: 'assigment_nodejs'
});

module.exports = db;