exports.login = function(req, res) {
    var loggedout = req.session.loggedout;

    if (loggedout)
        req.session.loggedout = "";

    res.render('login', {
        user: req.user,
        loggedout: loggedout
    });
};

exports.account = function(req, res,) {
    res.render('account', { user: req.user });
}

exports.logout = function(req, res) {
    req.logout();
    req.session.loggedout = true;
    res.redirect('/');
}
