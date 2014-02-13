"use strict";

var nconf = require('nconf');
var express = require('express');
var passport = require('passport');
var exphbs  = require('express3-handlebars');
var loginController = require('./login_controller');
var passportConfig = require('./passport_config');
var path = require('path');

nconf.argv().env();
nconf.file({ file: 'config.json' });
nconf.defaults({
  'PORT': 3000
});

var app = express();
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.set('port', nconf.get('PORT'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.compress());
app.use(express.logger('dev'));
app.use(express.cookieParser('keyboard cat'));
app.use(express.cookieSession());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
app.use(function(req, res) {
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });    
  }
});
app.use(express.errorHandler());

/**
 * Application routes.
 */

app.get('/', loginController.index);
app.post('/auth', passport.authenticate('browserid', { successRedirect: '/' }));

app.listen(app.get('port'), function() {
  console.log("server listening on port %d in %s mode", app.get('port'), app.settings.env);
});