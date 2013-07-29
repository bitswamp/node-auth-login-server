exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}
