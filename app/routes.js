// app/routes.js
module.exports = function(app, passport) {
	
	//import user schema to send user info from database to the pages
	var User = require('../app/models/user');

	var Announcement = require('../app/models/announcement');
	//load the home screen and send user data to it
	app.get('/', function(req, res) {
		res.render('index.ejs', { user : req.user, announceMessage : announceMessage, announceName : announceName, announceDate : announceDate});
	});
	//create a variable to store the json string of all members in the database
	var nameArray = [];
	var jerseyArray = [];
	var positionArray = [];
	var ageArray = [];
	var hometownArray = [];
	var memberIdArray = [];
	var announceMessage;
	var announceName;
	var announceDate;
	var userId;
	var userProfile;
	//function to find all members in the database and convert it so it can be stored in a javascript variable
	function updateRoster(){
		User.find().lean().exec(function(err, members){
		if(err)
			throw err;
		else
			if(nameArray.length == 0){
				for(var i = 0; i<members.length; i++)
				{
				var name = members[i]['userInfo']['firstName'] + " " + members[i]['userInfo']['lastName'];
				nameArray.push(name);
				jerseyArray.push(members[i]['userInfo']['jerseyNumber']);
				positionArray.push(members[i]['userInfo']['position']);
				ageArray.push(members[i]['userInfo']['age']);
				hometownArray.push(members[i]['userInfo']['hometown']);
				memberIdArray.push(members[i]['_id']);
				}
			}
			else if(nameArray.length == members.length) {
				for(var i = 0; i<nameArray.length; i++) {
					var name = members[i]['userInfo']['firstName'] + " " + members[i]['userInfo']['lastName'];
					nameArray[i] = name;
					jerseyArray[i] = members[i]['userInfo']['jerseyNumber'];
					positionArray[i] = members[i]['userInfo']['position'];
					ageArray[i] = members[i]['userInfo']['age'];
					hometownArray[i] = members[i]['userInfo']['hometown'];
					memberIdArray[i] = members[i]['_id'];
				}
			}
			else {
				var name = members[members.length - 1]['userInfo']['firstName'] + " " + members[members.length - 1]['userInfo']['lastName'];
				nameArray.push(name);
				jerseyArray.push(members[members.length - 1]['userInfo']['jerseyNumber']);
				positionArray.push(members[members.length - 1]['userInfo']['position']);
				ageArray.push(members[members.length - 1]['userInfo']['age']);
				hometownArray.push(members[members.length - 1]['userInfo']['hometown']);
				memberIdArray.push(members[members.length - 1]['_id']);
			}
	});
	}
	function newAnnounce() {
		Announcement.find().sort({_id : -1}).limit(1).exec(function(err, announcements){
		if(err)
			throw err;
		else
			announceMessage = announcements[0]['announcement']['message'];
			announceName = announcements[0]['announcement']['name'];
			announceDate = announcements[0]['announcement']['date'];
		});
	}
	//checks to see if the user is logged in. If not then they are redirected to login page
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()){
			return next();
		}
		else {
			res.redirect('/login');
		}
	};
	//function to check if the user is an admin. If they are not it redirects them to the home page
	function isAdmin(req, res, next) {
		if(!req.user)
			res.redirect('/login');
		if(req.user.userInfo.privilege != "admin")
			res.redirect('/');
		else
			return next();
	}
	//render admin page. Checks user to ensure only admin can visit the page
	app.get('/admin', isAdmin, function(req, res) {
		res.render('admin.ejs', {user : req.user});
	});
	//renders all the pages and sends necessary data to be used by the pages
	app.get('/roster', function(req, res) {
		res.render('roster.ejs', {user : req.user, nameArray: nameArray, jerseyArray: jerseyArray, positionArray: positionArray, ageArray : ageArray, hometownArray : hometownArray, memberIdArray: memberIdArray});
	});
	app.get('/files', isLoggedIn, function(req, res) {
		res.render('files.ejs', {user : req.user});
	});
	app.get('/playbook', isLoggedIn, function(req, res) {
		res.render('playbook.ejs', {user : req.user});
	});

	app.post('/updateAnnouncement', function(req, res){
		var newAnnouncement = new Announcement();
		var currentdate = new Date(); 
		var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
        var name = req.user.userInfo.firstName + " " + req.user.userInfo.lastName;
		newAnnouncement.announcement.message = req.body.announcement;
		newAnnouncement.announcement.name = name;
		newAnnouncement.announcement.date = datetime;

		newAnnouncement.save(function(err){
			if(err)
				throw err;

			newAnnounce();
		});
		res.redirect('/');
	});

	//render the login page and pass the flash message to be used on the login page
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	//process the login form and use passport to authenticate the user login
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', //redirect to their profile page if login is successful
		failureRedirect : '/login', //redirect back to the login page if unsuccessful
		failureFlash : true
	}));
	//render the sign up page and pass the flash message to be used on the page
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	//process the sign up form again using passport to authenticate information
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', //if there are not errors on the sign up page redirect them to the profile page and have them logged in
		failureRedirect : '/signup', //redirect back to the sign up page if their are any erros
		failureFlash : true 
	}));

	//load the profile page and check to ensure they are logged in
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {user : req.user, userProfile : userProfile});
	});
	app.get('/profile/:name', function(req, res){
		
	});
	//update the user info in the database from the form on the user page
	app.post('/updateProfile', function(req, res) {
		User.findOne({'_id':req.user._id}, function(err, user) {
			if(err)
				throw err;

			user.userInfo.phoneNumber = req.body.phoneNumber;
			user.userInfo.age = req.body.age;
			user.userInfo.jerseyNumber = req.body.jerseyNumber;
			user.userInfo.position = req.body.position;
			user.userInfo.collegeYear = req.body.collegeYear;
			user.userInfo.major = req.body.major;
			user.userInfo.hometown = req.body.hometown;
			user.userInfo.privilege = req.body.privilege;

			user.save(function(err) {
				if(err)
					throw err;

				updateRoster();
			});
		});
		res.redirect('/profile');
	});
	app.post('/getUserProfile', function(req, res) {
		userId = req.body.userId;
		User.findOne({'_id': userId}, function(err, user){
			userProfile = user;
		});
		res.redirect('/profile');
	});
	//Logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

};
