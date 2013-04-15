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

	this._makeReq(cb);
};

SouchDB.prototype.newDoc = function(field) {
	return new SouchDoc(field);
};

SouchDB.prototype._makeReq = function(data, cb) {
	if (typeof data === 'function'){
		cb = data;
		data = null;
	}
	var results = '';
	var req = http.request(this.options, function(res){
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