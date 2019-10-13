const bcrypt = require('bcrypt');

const pool = require('../connectDB');


module.exports.index = function(req, res, next) {
    res.render('auth/index', {
        title: 'Đăng nhập'
    })
};

module.exports.postAuth = async function(req, res, next) {
    //await pool.connect();
    var user = req.body.username;
    var password = req.body.password;

    var checkAccount = await bcrypt.compare(password, process.env.PASSADMIN);
    if (checkAccount) {
        //login
        console.log('ok');
        res.cookie('userName', process.env.ADMIN, { signed: true });
        res.redirect('/');
    } else {
        //no login
        console.log('no ok');
        res.render('auth/index', {
            title: 'Đăng nhập',
            errs: ['Thông tin đăng nhập không đúng'],
            username: req.body.username
        })
    }
};

module.exports.logOut = function(req, res, next) {
    req.app.locals.user = undefined;
    res.clearCookie('userName');
    res.redirect('/auth');
}