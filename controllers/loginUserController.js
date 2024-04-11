const mariadb = require('mariadb');
const express = require('express');
const app = express();

// Create pool - สร้าง pool ของการเชื่อมต่อกับ MariaDB
const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'supit0109',
    database: 'user_authentication',
    connectionLimit: 10
});

// เส้นทางสำหรับการตรวจสอบตัวตนและเข้าสู่ระบบ
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT id, username, password FROM users WHERE username = ?';

    const connection = await pool.getConnection();
    try {
        const result = await connection.query(query, [username]);

        if (result.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = result[0];

        if (password === user.password) {
            return res.status(200).send('Login successful');
        } else {
            return res.status(401).send('Wrong password');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

// ส่วนอื่น ๆ ของโค้ดที่เกี่ยวข้องกับการสร้าง server หรือการใช้งาน express คงเดิม

