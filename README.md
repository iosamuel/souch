# Souch

Simple client interface for handle CouchDB Database from NodeJS with some utilities that you can use.

You can send suggestions in the github repo [http://github.com/iosamuel/souch](github.com/iosamuel/souch)

## How to use

	var CouchDB = require('souch');

	var db = new CouchDB('mydb', {
		host: 'localhost', // optional. Default to 'localhost'
		port: 5984, // optional. Default to 5984
		user: 'user', // optional
		passwd: 'passwd' // optional
	});

	* the second argument to CouchDB constructor is totally optional, in the case that it's not passed, the default values are used to comunicate with CouchDB
	* host -> can be passed if you have CouchDB in another host than localhost
	* port -> can be passed if you have CouchDB in another port than the default (5984)
	* user and passwd can be passed if you have security credentials in your database.
		. If these are omited, security is not passed to CouchDB, so the database has to be without credentials

## Souch API

The Souch API has four principally methods, each one corresponds with the four principal HTTP VERBS: GET, POST, PUT and DELETE.
The Souch API enfatizes the use of a field 'type' in all our docs per database, so when you want to use docs with Souch you have to pass the 'type' field value in the construct or alternatively you can pass an object with the field name and value to identify a group of docs.

Example of CouchDB docs in your DB:

	{
		'_id': 'orangeId123'
		'name': 'orange',
		'price': 1,
		'type': 'product'
	}

	{
		'_id': 'asiouq12kljasd01'
		'name': 'other',
		'price': 2,
		'type': 'product'
	}

	{
		'_id': 'someID'
		'name': 'Jhon',
		'age': 20,
		'password': 'somepassinsha1'
		'myType': 'user'
	}

	{
		'_id': 'someOtherID'
		'name': 'Smith',
		'age': 23,
		'password': 'someotherpassinsha1'
		'myType': 'user'
	}


Example of connection with credentials to a restricted database and the preparation to use docs, in this case with the field name of 'type' (default) and the value of 'product', as you can see up here and prepare to use a doc in these case with a diferent field name and value than the default (type).

	var CouchDB = require('souch');

	var db = new CouchDB('mydb', {
		user: 'admin',
		passwd: 'admin123'
	});

	var products = db.newDoc('product'); // here we use the default type field in our docs, so just pass the value for this field
	var users = db.newDoc({ myType:'user' }); // here we use a diferent field name than the default ('type'), so we pass the name of the field and his value

### GET

	products.get('orangeId123', function(result){
		console.log(result); // which return the simple doc json that you can see up with those fields, like: _id, name, price, type and you can play with any of these.
	});

### POST

	var newPost = {
		'_id': 'mynewdoc',
		'name': 'lemon',
		'price': 3
	}; // of course you don't have to worry about the 'type' field, this part Souch make automatically and you can omit _id field and then CouchDB create an ID for you
	products.post(newPost, function(result){
		console.log(result); // in this case 'result' is the JSON object that CouchDB send when an action is processed succefully with fields like, 'ok' or 'error' and these messages
	});

### PUT

	var post = {
		'name': 'new orange',
		'price': 2
	}; // pass the data to modify in the doc, like CouchDB say, have to send all the new data and the old data, of course Souch handle for you the _rev id, so you don't have to worry about that
	products.put('orangeId123', post, function(result){
		console.log(result); // in this case 'result' is the same JSON object that CouchDB send to POST
	}); // here you pass like first argument the ID for the doc to modify, the data to modify and of course, the callback to take the results from couchdb

	// or you can insert with PUT
	products.put('myNewId', post, true, function(result){ // the third argument tell that this info will be inserted in place of modified.
		console.log(result);
	});

### DELETE

	products.delete('orangeId123', function(result){
		console.log(result); // in this case 'result' is, again, the same JSON object that CouchDB send to POST
	});

### Design Docs
Of course, like CouchDB client have support to call design docs from the DB, here some examples of a map view.
Souch support distints types of design docs, like: show, map/reduce, list, etc.

An example call to a map view in an url like this: /database/_design/products/_view/all?descending=true

	var options = {
		descending: true,
	};
	db.design('products', { type:'view', name:'all', params:options }, function(results){ // type is optional. Default to 'view'
		for (var i=0; i<results.rows.length; i++){
			console.log(results.rows[i].name);
		}
	});

For use things like startkey and endkey and some other parameter use params in the object passed, here an example:

	var options = {
		descending:true,
		startkey:'["?\u9999"]'.format('o'),
		endkey:'["?"]'.format('o')
	};
	db.design('products', { name:'all', params:options }, function(results){ // here we use the default value of 'type' that is 'view'
		for (var i=0; i<results.rows.length; i++){
			console.log(results.rows[i].name);
		}
	});

As you can see here we use '.format' that is a function make in Souch for help you to have more cleanly your code and maintain very easily.

### Built-in methods

Souch has three public methods that you can use to simplify work with; format() for strings, hash() a shortcut to hash with crypto module for strings and unique() for arrays.
Here are some uses you can do with these methods:

	var souch = require('souch'); // whatever name for variable will work

	var options = {
		descending: true,
		startkey: souch.format('["?\u9999"]', 'o'), // we use format() to do clean and escalable code
		endkey: souch.format('["?"]', 'o')
	};
	db.design('products', { name:'all', params:options }, function(results){
		var rows = souch.unique(results.rows); 
		/* in the case that the request returns duplicate results we can use unique() for reduce the array to unique's ID.
		Note: ID is the default field to unique, you can pass as second argument field name to unique the results like this: souch.unique(results.rows, 'value') then the field value will unique the results */
		for (var i=0; i<rows.length; i++){
			console.log(rows[i].name);
		}
	});

	products.get('someID', function(result){
		if (souch.hash('somepassword', 'sha1') == result.password){ // here we use hash() to encrypt the password, see the api docs for crypto module in the page of nodejs to see the types of hash that support.
			console.log('Welcome!');
		}
	});


## Author
---------
Samuel Burbano Ramos - @iosamuel