// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var multer = require('multer');
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, 'public/files/')
	},
	filename: function(req, file, cb){
		cb(null, file.originalname + '-' + Date.now())
	}
});

var upload = multer({storage: storage});

// configuration ===============================================================
var db = mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/public/images'));
app.use(express.static(__dirname + '/public/styles'));
app.use(express.static(__dirname + '/public/myprofile'));
app.use(express.static(__dirname + '/public/playbook'));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'secret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Server started on port ' + port);
