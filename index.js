const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: '.local-env' });
const app = express();

const ejs = require('ejs');
const expressSession = require('express-session');
const flash = require('connect-flash');

const indexController = require('./controllers/indexController');
const loginController = require('./controllers/loginController');
const registerController = require('./controllers/registerController');
const storeUserController = require('./controllers/storeUserController');
const loginUserController = require('./controllers/loginUserController');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // อัพเดทตรงนี้
app.use(flash());
app.use(expressSession({
    secret: "node secret"
}));
app.set('view engine', 'ejs');

app.get('/', indexController);
app.get('/login', loginController);
app.get('/register', registerController);
app.post('/user/register', (req, res) => {});
app.post('/user/login', (req, res) => {});



const PORT = process.env.PORT || '7414';

app.listen(7414, () => {
    console.log(`App listening on port ${PORT}`);
});
