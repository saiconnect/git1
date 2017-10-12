  var express = require('express');
  app = express();
  var mongoose = require('mongoose');
  var passport = require('passport');
  var bodyParser = require('body-parser');
  var LocalStrategy = require('passport-local');
  var passportLocalMongoose = require('passport-local-mongoose');
  var session = require('express-session');

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
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(session({secret: 'drdtftrst',
	resave : false,
	saveUninitialized: false
         }));

  app.use(bodyParser.json({ type: 'application/json' }));

  app.get("/register", function (req, res) {
   	res.render("register");
	});

  app.post("/register", function(req,resp) {
  req.session.username = req.body.username;
  req.session.password = req.body.password;
  res.end('done');	

  var info = req.body;

  new UserDetails ({
	username  : info.username,
	password: info.password
		}).save(function(err, doc){ 
	
        if(err) console.log(err);
		
	else console.log('inserted');
	    req.session.destroy();
	    resp.redirect('/login');
	        });
  
	  });


   app.post('/login',function(req, res) {
   req.session.username = req.body.username;
   req.session.password = req.body.password;
   console.log(req.session.username);

    if (req.session.username) {
           res.render("loginSuccess");
        }
    else { res.redirect('register');
	}
    },

    passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  	})
     );

   app.get('/loginFailure', function(req, res, next) {
   res.send('Failed to authenticate');
          });


   app.post('/userSuccess', function(req, res, next) {
      console.log("INFO: Use logged in successful " + req.body.username);
      console.log(req.body.username );
      UserDetails.find({'username': req.session.username }, function(err, docs) {
      console.log(docs );
      if(err){
	console.log(err);
	return res.status(500).send();
	   }      
        else { return res.status(200).send(docs);

             }   
        });
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



app.listen(3000);
console.log('Example on port 3000');

