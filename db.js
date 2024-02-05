const mariadbb = require('mariadb');

const pool  = mariadbb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    acquireTimeout: 30000
});

//connect and check for error
pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROOCOL_CONNECTION_LOST'){
            console.error('Database connect lost');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connection');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('Database connection was refused');
        }
    }
    if(connection) connection.release();
    return;
});
module.exports = pool ;