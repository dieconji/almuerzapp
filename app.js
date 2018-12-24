// REQUIRE
require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser');
var dbConfig = require('./db');
var mongoose = require('mongoose');
var passport = require('passport');
var initPassport = require('./static/js/passport/init');
var expressSession = require('express-session');
var routes = require('./static/js/routes/Router')(passport);


// DB
mongoose.connect(dbConfig.url);

// Express
var app = express(); 
app.use(bodyParser.json()); 
app.use(express.static('static'));
app.use(expressSession(
	{
		secret: 'mySecretKey2016',
	    name: 'AlmuerzAppCookie',
	    // store: sessionStore, // connect-mongo session store
	    proxy: true,
	    resave: true,
	    saveUninitialized: true
	}));
app.use(cookieParser());
	

// PASSPORT
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

app.use('/', routes);

// GO
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1"; 
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080; 
app.listen(port, ipaddress);

console.log('Servidor arrancado!'); 