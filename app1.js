var express = require('express');
app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var sessions = require('express-session');
var session;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/user', {
useMongoClient: true,
});


var Schema = mongoose.Schema;
var UserDetail = new Schema({
      username: String,
      password: String
      },              
         {
      	   collection: 'info'
         });

var UserDetails = mongoose.model('info', UserDetail);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(require('express-session')({
	secret: 'wah wah wah wah wah',
	resave: false,
	saveUninitialized: false
        }));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  	})
     );

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');

	});
app.get('/loginSuccess', function(req, res, next) {
  res.render("loginSuccess");

	});

app.get('/userSuccess', function(req, res, next) {

   UserDetails.findOne({'username': req.username, }, function(err, docs) {
console.log(docs);
   if(err){
	console.log(err);
	return res.status(500).send();
	}      
//res.json(err);

   else { return res.status(200).send(docs);

         }
 
     });
  //res.send('Successfully authenticated');
 });

passport.serializeUser(function(user, done) {
  done(null, user);
	});

passport.deserializeUser(function(user, done) {
  done(null, user);
	});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    // Auth Check Logic
    	UserDetails.findOne({
      		'username': username, 
    	}, function(err, user) {
      		if (err) {
        	return done(err);
     			 }
	if (!user) {
        return done(null, false);
      		    }

        if (user.password != password){
        return done(null, false);
      	}

      	return done(null, user);
    	    });
        });
    }));

app.get('/login', function (req, res) {
   res.render("login");
	});


app.get("/register", function (req, res) {
   res.render("register");
	});

app.post("/register", function(req,resp) {
	var info = req.body;

	new UserDetails ({
	username  : info.username,
	password: info.password
		}).save(function(err, doc){ 
	
	if(err) console.log(err);
		
	else //return('succesfully inserted');
        console.log('inserted');


req.session.destroy();
resp.redirect('/login');
	});
  

});

app.listen(3000);
console.log('Example on port 3000');

