const express = require('express') // นำเข้า Express.js เพื่อใช้ในการสร้างแอปพลิเคชัน
const dotenv = require('dotenv');

dotenv.config({path: '.local-env'});
const app = express() //ตัวแปร app ถูกใช้เพื่อสร้างแอปพลิเคชัน Express, และไลบรารีต่าง ๆ ถูกนำเข้าเพื่อให้แอปพลิเคชันมีความสามารถในการแสดงผล,
//เชื่อมต่อฐานข้อมูล, จัดการเซสชัน, และแจ้งเตือนผู้ใช้


const ejs = require('ejs') //ใช้ในการแสดงผลข้อมูลต่างๆ
const expressSession = require('express-session') //นำเข้า Express Session เพื่อใช้ในการจัดการเซสชัน
const flash = require('connect-flash') //แจ้งเตือนข้อความในกรณีที่ไม่ได้กรอกฟอร์มมา

// controller
const indexController = require('./controllers/indexController')
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const storeUserController = require('./controllers/storeUserController')
const loginUserController = require('./controllers/loginUserController')

app.use(express.static('public')) // เพื่อให้สามารถเข้าถึงไฟล์ที่อยู่ในโฟลเดอร์ 'public'
app.use(express.json())
app.use(express.urlencoded())
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))
app.set('view engine' , 'ejs')

app.get('/' , indexController )
app.get('/login' , loginController )
app.get('/register' , registerController )
app.post('/user/register' , storeUserController)
app.post('/user/login' , loginUserController)


const PORT = process.env.PORT || '7414' ;

app.listen(7414 , () => {
    console.log(`App listening on port ${PORT}`);
})
