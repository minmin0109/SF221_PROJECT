const cookieParser = require('cookie-parser');
const mariadb = require('mariadb');
const express = require('express');
const app = express();
const passport = require('passport');
const bcrypt = require('bcrypt');

//create pool - สร้าง pool ของการเชื่อมต่อกับ MariaDB
const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'supit0109',
    database: 'user_authentication',
    connectionLimit: 10
});

const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
app.use(session({
    secret: 'jNRRja=gcz=$f^QIXCBj9w&xn}#n7S', //คีย์ที่ใช้ในการเข้ารหัสข้อมูล session เพื่อความปลอดภัย
    resave: false, //กำหนดว่า session ควรจะถูกบันทึกลงในฐานข้อมูลทุกครั้งที่มีการเปลี่ยนแปลง
    saveUninitialized: true, //กำหนดว่า session ควรถูกบันทึกถ้า session ไม่มีการเปลี่ยนแปลง
    cookie: { secure: false } // ตั้งค่าเกี่ยวกับ cookie ที่ใช้ในการเก็บ session ID ใช้กับ https เท่านั้น
}));
app.use(cookieParser());
app.use(passport.initialize()); //ข้อมูลผู้ใช้ที่ได้จากการตรวจสอบตัวตน
app.use(passport.session());

passport.use(new LocalStrategy(
    async (username, password, done) => {
        const connection = await pool.getConnection();
        try {
            const result = await connection.query(
                'SELECT id, username, password FROM users WHERE username = ?',
                [username]
            );

            if (result.length === 0) {
                return done(null, false, { 
                    message: 'User not found' 
                });
            }

            const user = result[0];

            // ใช้ bcrypt เพื่อเปรียบเทียบรหัสผ่านที่ hash ในฐานข้อมูล
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                return done(null, user);
            } else {
                return done(null, false, { 
                    message: 'Wrong password' 
                });
            }
        } catch (error) {
            console.error(error);
            return done(error);
        } finally {
            connection.release();
        }
    }
));

// Passport ใช้เพื่อเก็บข้อมูลของผู้ใช้ใน session จากการตรวจสอบตัวตน
passport.serializeUser((user, done) => {
    done(null, user.id); //เก็บค่า session ด้วย id เรียกด้วย callback function
});

//  Passport ใช้เพื่อดึงข้อมูลผู้ใช้จาก session
passport.deserializeUser(async (id, done) => { //session ID ที่ถูกเก็บไว้ใน cookie
    const connection = await pool.getConnection();
    try {
        const result = await connection.query(
            'SELECT id, username FROM users WHERE id = ?',
            [id]
        );

        if (result.length === 0) {
            return done(null, false); //ไม่พบข้อมูลผู้ใช้ / ไม่พบข้อมูลผู้ใช้ที่มี session ID นี้ในฐานข้อมูล
            //done จะถูกเรียกด้วย null เพื่อบอก Passport ว่าไม่มีข้อผิดพลาดเกิดขึ้นในขั้นตอนนี้
            //และข้อมูลผู้ใช้ที่ได้จากการ query จะถูกส่งกลับไปยัง Passport เพื่อให้ Passport ใช้ใน request ต่อไป
        }

        const user = result[0];
        return done(null, user);
    } catch (error) {
        console.error(error);
        return done(error);
    } finally {
        connection.release();
    }
});

// Middleware สำหรับการตรวจสอบตัวตน
module.exports = async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};
