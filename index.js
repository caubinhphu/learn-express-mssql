require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const sql = require('mssql');

const pool = require('./connectDB');
const sinhvienRoute = require('./routers/sinhvien.route');
const authRoute = require('./routers/auth.route');

const authMiddleWare = require('./middlewares/auth.middleware');

const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(process.env.SECRECT));

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('publics'));

app.get('/', function(req, res) {
    res.redirect('/sinhvien');
});

app.use('/auth', authRoute);
app.use('/sinhvien', authMiddleWare.postAdmin, sinhvienRoute);

app.listen(port, () => console.log('Server is running'));