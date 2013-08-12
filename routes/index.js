exports.login = function(req, res) {
    res.render('login', {});
};

exports.account = function(req, res,) {
    res.render('account', {});
}

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}
