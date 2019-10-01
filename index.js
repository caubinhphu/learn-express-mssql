require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const sql = require('mssql');

const pool = require('./connectDB');
const sinhvienRoute = require('./routers/sinhvien.route');

const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('publics'));

app.get('/', function(req, res) {
    res.redirect('/sinhvien');
});

app.use('/sinhvien', sinhvienRoute);

app.listen(port, () => console.log('Server is running'));