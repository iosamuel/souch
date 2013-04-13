var http = require('http')
	querystring = require('querystring'),
	crypto = require('crypto');

/* Private API */
var options = {
	host: "localhost",
	port: 5984,
	headers: {
		'Content-Type': 'application/json'
	}
};

var _makeReq = function(data, cb) {
	if (typeof data === 'function'){
		cb = data;
		data = null;
	}
	var results = '';
	var req = http.request(options, function(res){
		res
			.on('data', function(recv){
				results += recv;
			})
			.on('end', function(){
				cb(JSON.parse(results));
			});
	});
	if (data) req.write(data);
	req.end();
};

/* Public Methods API */
Array.prototype.unique = function() {
	var n = [];
	for (var i=0; i<this.length; i++){
		var c = this[i].id;
		if (n.indexOf(c) > -1) { this.splice(i,1); i--; continue; }
		n.push(c);
	}
};

String.prototype.format = function() {
	var t = this.toString();
	for (var i=0; i<arguments.length; i++){
		t = t.replace('?', arguments[i]);
	}
	return t;
};

String.prototype.hash = function(t) {
	return crypto.createHash(t).update(this.toString()).digest('hex');
};

// CouchDB General API
var SouchDB = function(db, opts){
	this.db = db;
	if (opts){
		opts.host ? options.host = opts.host : '';
		opts.port ? options.port = opts.port : '';
		opts.user && opts.passwd ? options.headers['Authorization'] = 'Basic ' + new Buffer(opts.user+':'+opts.passwd).toString('base64') : '';
	}
};

SouchDB.prototype.design = function(name, opts, cb) {
	options.path = '/'+this.db+'/_design/'+name+'/_'+opts.type+'/'+opts.name+'?'+querystring.stringify(opts.params);
	options.method = 'GET';

	_makeReq(cb);
};

SouchDB.prototype.newDoc = function(field) {
	return new SouchDoc(this.db, field);
};

// DocumentLike API
var SouchDoc = function(db, field){
	if (!(field instanceof Object)) var field = { type:field };
	this.fieldName = Object.keys(field)[0];
	this.fieldValue = field[this.fieldName];
	this.db = db;
};

SouchDoc.prototype.get = function(id, cb) {
	options.path = '/'+this.db+'/'+id;
	options.method = 'GET';

	_makeReq(cb);
};

SouchDoc.prototype.post = function(data, cb) {
	options.path = '/'+this.db+'/';
	options.method = 'POST';
	data[this.fieldName] = this.fieldValue;
	data = JSON.stringify(data);

	_makeReq(data, cb);
};

SouchDoc.prototype.delete = function(id, cb) {
	this.get(id, function(result){
		var fullPid = result._id + '?rev=' + result._rev;

		options.path = '/'+this.db+'/'+fullPid;
		options.method = 'DELETE';

		_makeReq(cb);
	}.bind(this));
};

SouchDoc.prototype.put = function(id, data, cb) {
	data[this.fieldName] = this.fieldValue;
	data = JSON.stringify(data);

	this.get(id, function(result){
		var fullPid = result._id + '?rev=' + result._rev;

		options.path = '/'+this.db+'/'+fullPid;
		options.method = 'PUT';

		_makeReq(data, cb);
	}.bind(this));
};

module.exports = SouchDB;