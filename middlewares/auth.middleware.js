module.exports.postAdmin = function(req, res, next) {
    var userName = req.signedCookies.userName;
    if(!userName) {
        res.redirect('/auth');
        return;
    }
    if(userName !== process.env.ADMIN) {
        res.redirect('/auth');
        return;
    }
    
    req.app.locals.user = 'Admin';
    next();
}