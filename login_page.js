var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var sessions = require('express-session');
var session;
var app = express();
var mongoose = require('mongoose');
var assert = require('assert');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));

app.use(sessions({
secret: 'hhdhgdd5e326e73yy2e288737',
resave: false,
saveUninitialized: true
        }))

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sai',
	{
	useMongoClient: true,
	});
/*var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/sai';
mongoose.Promise = global.Promise;
MongoClient.connect(url, function(err, db) 
	{
  	assert.equal(null, err);
  	console.log("Connected correctly to server");
	});*/

var userSchema = new mongoose.Schema
	({
	username: {type: String},
	password: {type: String},
	});

var User = mongoose.model('user', userSchema);

app.post('/reg',function(req,res)
	{
	new User ({
		     username  : req.body.username,
		     password: req.body.password,
                   }).save(function(err, doc){  
	                      if(err) res.json(err);
	                      else res.send('succesfully inserted');
			      console.log('succesfully inserted')
                           });

         });

app.get('/reg', function(req, resp) {
req.session.destroy();
resp.redirect('/log');


});

app.post('/log', function(req, resp) {

console.log(req.body.username);

User.findOne({username: req.body.username, password: req.body.password},  
//User.find({},  

function(err, user) {
if(err) {
console.log(err);
}
else if(user) {
console.log('hiiiii');
console.log(user.username);

}
else {
console.log(user);
console.log('Invalid');
}
});
});

app.get('/logout', function(req, resp) {
req.session.destroy();
resp.redirect('/reg');
});



app.get('/', function(req, res) 
	{
         res.sendFile(path.join(__dirname + '/login.html'));
        });

app.listen(3000);






