var http = require('http'),
	querystring = require('querystring'),
	SouchDoc = require('./souch.doc');

var SouchDB = function(db, opts){
	this.options = {
		host: opts.host || "localhost",
		port: opts.port || 5984,
		headers: {
			'Content-Type': 'application/json'
		}
	};
	(opts.user && opts.passwd) ? this.options.headers['Authorization'] = 'Basic ' + new Buffer(opts.user+':'+opts.passwd).toString('base64') : '';
	this.db = db;
};

SouchDB.prototype.design = function(name, opts, cb) {
	this.options.path = '/'+this.db+'/_design/'+name+'/_'+opts.type+'/'+opts.name+'?'+querystring.stringify(opts.params);
	this.options.method = 'GET';

	_makeReq(this.options, cb);
};

SouchDB.prototype.newDoc = function(field) {
	return new SouchDoc(this.db, this.options, _makeReq, field);
};

var _makeReq = function(options, data, cb) {
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

module.exports = SouchDB;