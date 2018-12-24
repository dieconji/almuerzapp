var MongoClient = require('mongodb').MongoClient; 
var ObjectID = require('mongodb').ObjectID;
var dbConfig = require('../../../db');
var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var fs = require('fs');
AWS.config.region = 'eu-west-1';

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	router.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

		if (req.method == 'OPTIONS') {
			res.status(200).send();
		} else {
			next(); 
		}

	});	
	
	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook', 
		passport.authenticate('facebook', { scope : [ 'email' ] }
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/',
			failureRedirect : '/error'
		})
	);
	
	// handle the callback after facebook has authenticated the user
	router.get('/logout',  isAuthenticated, function(req, res){	
		res.clearCookie('name');
		res.clearCookie('id');
		res.redirect('/misbares/bares');
		req.logout();
	});
	
	// handle the callback after facebook has authenticated the user
	router.get('/error',  isAuthenticated, function(req, res){
		res.end('Error de login');
	});

	//MongoDB
	router.post('/misbares/bares', function(req, res) { 
    	console.log('POST /misbares/bares'); 

    	var bar = req.body;
    	MongoClient.connect(dbConfig.url, function(err, db) { 
    		if (err) {
    			console.log(err);
    			res.status(500).send(err); 
    		} else {
    			var bares = db.collection('bares'); 	
    			bares.insertOne(bar, function(err, result) {
    				if (err) { 
    					console.log(err); 
    					res.status(500).send(err);
    				} else {
    					bar.id = result.insertedId;
    					//res.send(bar);
    					
    					// subir imagen en blanco
    					var fileStream = fs.createReadStream('static/images/blank.jpg');
    					fileStream.on('error', function (err) {
    						if (err) { throw err; }
    					});  
    					fileStream.on('open', function () {
    						var s3 = new AWS.S3();
    						s3.putObject({
    						    Bucket: 'almuerzapp',
    						    Key: result.insertedId + '.jpg',
    						    Body: fileStream
    						}, function (err) {
    							if (err) { throw err; }
    						});
    					});
    					
    					res.redirect('/misbares/bares/'+result.insertedId);
    					
    				}
    				db.close();
    				
    				
    			});
    		} 
    	});
    });

	router.get('/misbares/bares', function(req, res) { 
    	console.log('GET /misbares/bares'); 

		if (req.isAuthenticated()){
			var user = req.user.fb;			
			var name = user.firstName + ' ' + user.lastName;
			res.cookie('id', user.id);
			res.cookie('name', name);
		}
		
    	MongoClient.connect(dbConfig.url, function(err, db) { 
    		if (err) {
    			console.log(err);
    			res.status(500).send(err); 
    		} else {
    			var bares = db.collection('bares'); 
    			bares.find().toArray(function(err, docs) {
    				if (err) { 
    					console.log(err); 
    					res.status(500).send(err);
    				} else { 
    					docs.forEach(function(doc) {
    						doc.id = doc._id.toHexString();
    						delete doc._id; 
    					});
    					res.send(docs);
    				}
    				db.close();
    			});
    		} 
    	});
    	
    });

	router.get('/misbares/bares/:id', function(req, res) { 
    	console.log('GET /misbares/bares/' + req.params.id); 
    	MongoClient.connect(dbConfig.url, function(err, db) {
    		if (err) {
    			console.log(err);
    			res.status(500).send(err); 
    		} else {
    			var bares = db.collection('bares');
    			bares.findOne({_id: new ObjectID(req.params.id) }, function(err, doc) {
    				if (err) { 
    					console.log(err); 
    					res.status(404).send(err);
    				} else {
    					doc.id = doc._id.toHexString(); 
    					delete doc._id;
    					res.send(doc);
    				}
    				db.close();
    			});
    			
    		} 
    	});
    });

	router.put('/misbares/bares/:id', function(req, res) { 
    	console.log('PUT /misbares/bares/' + req.params.id); 

    	var doc = req.body;
    	delete doc.id;
    	
    	MongoClient.connect(dbConfig.url, function(err, db) {
    		if (err) { 
    			console.log(err); 
    			res.status(500).send(err);
    		} else {
    			var bares = db.collection('bares');
    			bares.replaceOne({
    				_id: new ObjectID(req.params.id) 
    			}, doc,
    				function(err, result) { 
    					if (err) {
    						console.log("Router: " + err);
    						res.status(404).send(err); 
    					} else {
    						res.send(req.body);
    					}
    					db.close();
    				});
    		} 
    	});
    	

    });

	router.delete('/misbares/bares/:id', function(req, res) { 
    	console.log('DELETE /misbares/bares/' + req.params.id); 

    	MongoClient.connect(dbConfig.url, function(err, db) { 
    		if (err) {
    			console.log(err);
    			res.status(500).send(err); 
    		} else {
    			var bares = db.collection('bares'); 
    			bares.deleteOne({_id: new ObjectID(req.params.id) },
    				function(err, result) { 
    				if (err) {
    					console.log(err);
    					res.status(404).send(err); 
    				} else {
    					res.status(200).send();
    				}
    				db.close();
    			});
    		} 
    	});
    });
	
	return router;
}





