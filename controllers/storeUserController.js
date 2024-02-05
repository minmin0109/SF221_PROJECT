const mariadb = require('mariadb');


const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'supit0109',
    database: 'user_authentication',
    connectionLimit: 5
});

module.exports = async (req, res) => {
    console.log(req.body)

    const { username, password } = req.body;

    

    const connection = await pool.getConnection();

    try {
        const result = await connection.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password] // ใช้รหัสผ่านที่ไม่ได้ถูก hash
        );
        console.log('User registered successfully!!');
        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        const validationErrors = [error.message];
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        return res.redirect('/');
    } finally {
        connection.release(); // หลังจากที่ connection ได้ถูกใช้งานเสร็จสิ้น โดยทำให้ connection นั้นถูกคืนให้กับ pool เพื่อให้สามารถให้ connection อื่นใน pool ใช้งานได้
    }
};
