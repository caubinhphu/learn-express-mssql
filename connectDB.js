const sql = require('mssql');

const config = {
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    server: process.env.SERVER,
    database: process.env.DATABASE
};

const pool = new sql.ConnectionPool(config);

module.exports = pool;