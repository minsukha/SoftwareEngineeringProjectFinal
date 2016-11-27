// app/routes.js
module.exports = function(app, passport) {
	
	//import user schema to send user info from database to the pages
	var User = require('../app/models/user');

	var Announcement = require('../app/models/announcement');

	var GameStats = require('../app/models/gamestats');

	var fs = require('fs');

	//load the home screen and send user data to it
	app.get('/', function(req, res) {
		res.render('index.ejs', { user : req.user, announceMessage : announceMessage, announceName : announceName, announceDate : announceDate});
	});

	//Arrays used to create the table in the roster page of all the approved members
	var nameArray = [];
	var jerseyArray = [];
	var positionArray = [];
	var ageArray = [];
	var hometownArray = [];
	var memberIdArray = [];
	var privilegeArray = [];
	//variables used to update the announcements on the home page
	var announceMessage;
	var announceName;
	var announceDate;

	//variables for the gamestats page
	var gameDateArray = [];
	var gameFullStatsArray = [];
	var gameOpponentArray = [];
	var gameResultArray = [];
	var gameStatsIdArray = [];
	//user id and user object for roster page
	var userId;
	var userProfile;
	//arrays used to create the table on the admin page so member privilege can be updated or deleted from the database
	var adminNameArray = [];
	var adminEmailArray = [];
	var adminPrivilegeArray = [];
	var adminMemberIdArray = [];
	var adminAttendanceArray = [];
	//user id  and user object for the admin page
	var adminUserId;

	//variables used for filesystem
	var filez = [];
	var fileUploadLocation = "files";

	var multer = require('multer');
	var storage = multer.diskStorage({
		destination: function(req, file, cb){
			fileUploadLocation = req.body.location;
			cb(null, 'public/'+fileUploadLocation+'/')
		},
		filename: function(req, file, cb){
			if(fileUploadLocation == "myprofile") {
				cb(null, req.user.userInfo.firstName + req.user.userInfo.lastName+'.png')
			}
			else {
				cb(null, file.originalname)
			}
		}
	});

	var upload = multer({storage: storage});

	function getFiles(req, res, next) {
		var path = 'public/files/';
		fs.readdir(path, function(err, docs) {
			filez = docs;
		});
		return next();
	}
	app.get('/files/:file(*)', function(req, res, next){
		var file = req.params.file;
		var path = 'public/files/' + file;
		res.download(path);
	});

function updateGameStats() {
		GameStats.find().lean().exec(function(err, gameStats) {
			if(err)
				throw err;
			else {
				if(gameDateArray.length === 0)
				{
					for(var i = 0; i<gameStats.length; i++) {
						var date = gameStats[i]['gameStats']['date'];
						var opponent = gameStats[i]['gameStats']['opponent'];
						var result = gameStats[i]['gameStats']['result'];
						var fullStats = gameStats[i]['gameStats']['fullStats'];
						var id = gameStats[i]['_id'];
						gameDateArray.push(date);
						gameOpponentArray.push(opponent);
						gameResultArray.push(result);
						gameFullStatsArray.push(fullStats);
						gameStatsIdArray.push(id);
					}
				}
				else if(gameDateArray.length === gameStats.length) {
					for(var i = 0; i<gameStats.length; i++) {
						var date = gameStats[i]['gameStats']['date'];
						var opponent = gameStats[i]['gameStats']['opponent'];
						var result = gameStats[i]['gameStats']['result'];
						var fullStats = gameStats[i]['gameStats']['fullStats'];
						var id = gameStats[i]['_id'];
						gameDateArray.push(date);
						gameOpponentArray.push(opponent);
						gameResultArray.push(result);
						gameFullStatsArray.push(fullStats);
						gameStatsIdArray.push(id);
					}
				}
				else if(gameDateArray.length > gameStats.length) {
					for(var i = 0; i<gameStats.length; i++) {
						var date = gameStats[i]['gameStats']['date'];
						var opponent = gameStats[i]['gameStats']['opponent'];
						var result = gameStats[i]['gameStats']['result'];
						var fullStats = gameStats[i]['gameStats']['fullStats'];
						var id = gameStats[i]['_id'];
						gameDateArray[i] = date;
						gameOpponentArray[i] = opponent;
						gameResultArray[i] = result;
						gameFullStatsArray[i] = fullStats;
						gameStatsIdArray[i] = id;
					}
					gameDateArray.pop();
					gameOpponentArray.pop();
					gameResultArray.pop();
					gameFullStatsArray.pop();
					gameStatsIdArray.pop();
				}
				else {
					var date = gameStats[gameStats.length - 1]['gameStats']['date'];
					var opponent = gameStats[gameStats.length - 1]['gameStats']['opponent'];
					var result = gameStats[gameStats.length - 1]['gameStats']['result'];
					var fullStats = gameStats[gameStats.length - 1]['gameStats']['fullStats'];
					var id = gameStats[gameStats.length - 1]['_id'];
					gameDateArray.push(date);
					gameOpponentArray.push(opponent);
					gameResultArray.push(result);
					gameFullStatsArray.push(fullStats);
					gameStatsIdArray.push(id);
				}
			}
		});

	}

	//function to find all members in the database and convert it so it can be stored in a javascript variable
	function updateRoster(){
		User.find().lean().exec(function(err, members){
		if(err)
			throw err;
		else
			if(nameArray.length == 0){
				for(var i = 0; i<members.length; i++)
				{
					if(members[i]['userInfo']['privilege'] != "Nonmember") {
						var name = members[i]['userInfo']['firstName'] + " " + members[i]['userInfo']['lastName'];
						nameArray.push(name);
						jerseyArray.push(members[i]['userInfo']['jerseyNumber']);
						positionArray.push(members[i]['userInfo']['position']);
						ageArray.push(members[i]['userInfo']['age']);
						hometownArray.push(members[i]['userInfo']['hometown']);
						memberIdArray.push(members[i]['_id']);
						privilegeArray.push(members[i]['userInfo']['privilege']);
					}
				}
			}
			else if(nameArray.length === members.length) {
				for(var i = 0; i<members.length; i++) {
					if(members[i]['userInfo']['privilege'] != "Nonmember") {
						var name = members[i]['userInfo']['firstName'] + " " + members[i]['userInfo']['lastName'];
						nameArray[i] = name;
						jerseyArray[i] = members[i]['userInfo']['jerseyNumber'];
						positionArray[i] = members[i]['userInfo']['position'];
						ageArray[i] = members[i]['userInfo']['age'];
						hometownArray[i] = members[i]['userInfo']['hometown'];
						memberIdArray[i] = members[i]['_id'];
						privilegeArray[i] = members[i]['userInfo']['privilege'];
					}
				}
			}
			else if(nameArray.length > members.length) {
				for(var i = 0; i<members.length; i++) {
					if(members[i]['userInfo']['privilege'] != "Nonmember") {
						var name = members[i]['userInfo']['firstName'] + " " + members[i]['userInfo']['lastName'];
						nameArray[i] = name;
						jerseyArray[i] = members[i]['userInfo']['jerseyNumber'];
						positionArray[i] = members[i]['userInfo']['position'];
						ageArray[i] = members[i]['userInfo']['age'];
						hometownArray[i] = members[i]['userInfo']['hometown'];
						memberIdArray[i] = members[i]['_id'];
						privilegeArray[i] = members[i]['userInfo']['privilege'];
					}
				}
				nameArray.pop();
				jerseyArray.pop();
				positionArray.pop();
				ageArray.pop();
				hometownArray.pop();
				memberIdArray.pop();
				privilegeArray.pop();
			}
			else {
				var name = members[members.length - 1]['userInfo']['firstName'] + " " + members[members.length - 1]['userInfo']['lastName'];
				nameArray.push(name);
				jerseyArray.push(members[members.length - 1]['userInfo']['jerseyNumber']);
				positionArray.push(members[members.length - 1]['userInfo']['position']);
				ageArray.push(members[members.length - 1]['userInfo']['age']);
				hometownArray.push(members[members.length - 1]['userInfo']['hometown']);
				memberIdArray.push(members[members.length - 1]['_id']);
				privilegeArray.push(members[members.length -1]['userInfo']['privilege']);
			}
	});
	}
	//puts all the users in the database into arrays to be parsed out into a table on the admin page for admin use. The admin will be able to delete users and update their privilege settings/accept nonmembers
	function updateAdminTable() {
		User.find().lean().exec(function(err, members) {
			if(err)
				throw err;
			else {
				if(adminNameArray.length === 0)
				{
					for(var i = 0; i<members.length; i++) {
						var name = members[i]['userInfo']['firstName'] + " " + members[i]['userInfo']['lastName'];
						adminNameArray.push(name);
						adminEmailArray.push(members[i]['userInfo']['email']);
						adminPrivilegeArray.push(members[i]['userInfo']['privilege']);
						adminAttendanceArray.push(members[i]['userInfo']['attendance']);
						adminMemberIdArray.push(members[i]['_id']);
					}
				}
				else if(adminNameArray.length === members.length) {
					for(var i = 0; i<members.length; i++) {
						var name = members[i]['userInfo']['firstName'] + " " + members[i]['userInfo']['lastName'];
						adminNameArray[i] = name;
						adminEmailArray[i] = members[i]['userInfo']['email'];
						adminPrivilegeArray[i] = members[i]['userInfo']['privilege'];
						adminAttendanceArray[i] = members[i]['userInfo']['attendance'];
						adminMemberIdArray[i] = members[i]['_id'];
					}
				}
				else if(adminNameArray.length > members.length) {
					for(var i = 0; i<members.length; i++) {
						var name = members[i]['userInfo']['firstName'] + " " + members[i]['userInfo']['lastName'];
						adminNameArray[i] = name;
						adminEmailArray[i] = members[i]['userInfo']['email'];
						adminPrivilegeArray[i] = members[i]['userInfo']['privilege'];
						adminAttendanceArray[i] = members[i]['userInfo']['attendance'];
						adminMemberIdArray[i] = members[i]['_id'];
					}
					adminNameArray.pop();
					adminEmailArray.pop();
					adminPrivilegeArray.pop();
					adminAttendanceArray.pop();
					adminMemberIdArray.pop();
				}
				else {
					var name = members[members.length - 1]['userInfo']['firstName'] + " " + members[members.length - 1]['userInfo']['lastName'];
					adminNameArray.push(name);
					adminEmailArray.push(members[members.length - 1]['userInfo']['email']);
					adminPrivilegeArray.push(members[members.length - 1]['userInfo']['privilege']);
					adminAttendanceArray.push(members[members.length - 1]['userInfo']['attendance']);
					adminMemberIdArray.push(members[members.length - 1]['_id']);
				}
			}
		});

	}
	function updateAdminAndRoster(req, res, next) {
		updateAdminTable();
		updateRoster();
		return next();
	};
	//get latest announcement from the database and set it to the variables for the index page
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
		if(req.user.userInfo.privilege != "Admin")
			res.redirect('/');
		else
			return next();
	}
	//render admin page. Checks user to ensure only admin can visit the page
	app.get('/admin', isAdmin, updateAdminAndRoster, function(req, res) {
		res.render('admin.ejs', {user : req.user, adminNameArray : adminNameArray, adminEmailArray : adminEmailArray, adminPrivilegeArray : adminPrivilegeArray, adminMemberIdArray : adminMemberIdArray, adminAttendanceArray : adminAttendanceArray});
	});
	//renders all the pages and sends necessary data to be used by the pages
	app.get('/roster', updateAdminAndRoster, function(req, res) {
		res.render('roster.ejs', {user : req.user, nameArray: nameArray, jerseyArray: jerseyArray, positionArray: positionArray, ageArray : ageArray, hometownArray : hometownArray, memberIdArray: memberIdArray, privilegeArray : privilegeArray});
	});
	app.get('/files', isLoggedIn, getFiles, function(req, res) {
		res.render('files.ejs', {user : req.user, files : filez});
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
		successRedirect : '/myprofile', //redirect to their profile page if login is successful
		failureRedirect : '/login', //redirect back to the login page if unsuccessful
		failureFlash : true
	}));
	//render the sign up page and pass the flash message to be used on the page
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	//process the sign up form again using passport to authenticate information
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/myprofile', //if there are not errors on the sign up page redirect them to the profile page and have them logged in
		failureRedirect : '/signup', //redirect back to the sign up page if their are any erros
		failureFlash : true 
	}));

	//load the profile page and check to ensure they are logged in
	app.get('/profile', function(req, res) {
		res.render('profile.ejs', {user : req.user, userProfile : userProfile});
	});
	app.get('/myprofile', isLoggedIn, function(req, res) {
		res.render('myprofile.ejs', {user : req.user});
	})
	app.get('/gamestats', function(req, res) {
		res.render('gamestats.ejs', {user : req.user, gameDateArray : gameDateArray, gameOpponentArray : gameOpponentArray, gameResultArray : gameResultArray, gameFullStatsArray : gameFullStatsArray, gameStatsIdArray : gameStatsIdArray});
	});
	app.post('/updateAttendance', function(req, res) {
		var attendanceMemberIds = req.body.attendanceCheck;
		if(attendanceMemberIds[attendanceMemberIds.length - 1] == "Reset") {
			for(var i = 0; i<attendanceMemberIds.length - 1; i++) {
				User.findOne({'_id':attendanceMemberIds[i]}, function(err, user){
					user.userInfo.attendance = 0;
					user.save(function(err){
						if(err)
							throw err;

						updateAdminTable();
					});
				});
			}
		}
		else {
			if(attendanceMemberIds[0].length == 1) {
				User.findOne({'_id':attendanceMemberIds}, function(err, user){
					user.userInfo.attendance += 1;
					user.save(function(err){
						if(err)
							throw err;

						updateAdminTable();
					});
				});
			}
			else {
				for(var i = 0; i<attendanceMemberIds.length; i++) {
					User.findOne({'_id':attendanceMemberIds[i]}, function(err, user){
						user.userInfo.attendance += 1;
						user.save(function(err){
							if(err)
								throw err;

							updateAdminTable();
						});
					});
				}
			}
		}
		res.redirect('/admin');
	});
	app.post('/updateGameStats', function(req, res) {
		var newGameStat = new GameStats();
		newGameStat.gameStats.date = req.body.gameDate;
		newGameStat.gameStats.opponent = req.body.gameOpponent;
		newGameStat.gameStats.result = req.body.gameResult;
		newGameStat.gameStats.fullStats = req.body.gameFullStats;

		newGameStat.save(function(err){
			if(err)
				throw err;
			updateGameStats();
		});
		res.redirect('/gamestats');
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
				updateAdminTable();
			});
		});
		res.redirect('/myprofile');
	});
	app.post('/getUserProfile', function(req, res) {
		userId = req.body.userId;
		User.findOne({'_id': userId}, function(err, user){
			userProfile = user;
		});
		if(!req.user)
			res.redirect('/profile');
		if(userId == req.user._id)
			res.redirect('/myprofile');
		else
			res.redirect('/profile');
	});
	app.post('/changeUserPrivilege', function(req, res){
		adminUserId = req.body.adminUserId;
		User.findOne({'_id': adminUserId}, function(err, user){
			user.userInfo.privilege = req.body.userPrivilege;

			user.save(function(err){
				if(err)
					throw err;
				updateAdminTable();
				updateRoster();
			});
		});
		res.redirect('/admin');
	});
	app.post('/deleteUser', function(req, res){
		adminUserId = req.body.adminUserId;
		User.remove({'_id':adminUserId}, function(err){
			if(err)
				throw err;
		});
		updateAdminTable();
		updateRoster();
		res.redirect('/admin');
	});
	app.post('/deleteGameStat', function(req, res){
		GameStats.remove({'_id':req.body.gameStatsId}, function(err){
			if(err)
				throw err;
		});
		updateGameStats();
		res.redirect('/gamestats');
	});
	//Logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.post('/fileUpload', upload.any(), function(req, res, cb){
		fileUploadLocation = req.body.location;
		cb(null, 'public/'+fileUploadLocation+'/');
		res.redirect('/'+fileUploadLocation);
	});
	/*
	app.post('/myprofile', upload.any(), function(req, res, cb){
		cb(null, 'public/profiles/');
		fileUploadLocation = "profiles";
		res.redirect('/myprofile');
	});
	*/
/*
	app.get('/download', function(req, res){
       
       
        //get the filename from the request and look for it in the public folder
        var file = 'public/files'+ req.body;

        if(!fs.exist(file)){
            return console.log('file not found');
        }
       

        //set a filename variable for later
        var filename = path.basename(file);

        //get the type of file it is (for the resend header)
        var mimetype= mime.lookup(file);

        //set the return header
        res.setHeader('Content-disposition','attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        //send the file in a stream
        var filestream = fs.createReadStream(file);
        filestream.pipe(res); });
*/
};
