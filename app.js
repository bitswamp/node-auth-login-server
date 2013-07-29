var config = require('./config.json');

var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy
  , routes = require('./routes')

var app = express();

// all environments
app.set('port', config.port || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({ 
    secret: config.cookieSecret, 
    cookie: config.cookieOptions
}));
// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/logout', routes.logout);

app.get('/google', passport.authenticate('google'));
app.get('/google/return', 
    passport.authenticate('google'), 
    function(req, res) { 
        if (req.session.redirectUrl) {
            var url = req.session.redirectUrl;
            req.session.redirectUrl = null;
            res.redirect(url);
        } else {
            res.redirect('/'); 
        }
    }
);

passport.use(new GoogleStrategy({
        returnURL: 'http://' + config.subdomain + '.' + config.domain + '/google/return',
        realm: 'http://*.' + config.domain
    },
    function(identifier, profile, done) {
        profile.id = identifier;

        if (profile.emails
            && profile.emails[0].value.indexOf(config.emailFilter) > -1)
            done(null, profile);
        else
            done({ message: "Invalid login" });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

http.createServer(app).listen(app.get('port'));
