var querystring = require('querystring'),
	SouchDoc = require('./souch.doc'),
	_makeReq = require('./souch.pv.js').fnReq;

var SouchDB = function(db, opts){
	this.options = {
		host: (opts && opts.host) ? opts.host : "localhost",
		port: (opts && opts.port) ? opts.port : 5984,
		headers: {
			'Content-Type': 'application/json'
		}
	};
	(opts && opts.user && opts.passwd) ? this.options.headers['Authorization'] = 'Basic ' + new Buffer(opts.user+':'+opts.passwd).toString('base64') : '';
	this.db = db;
};

SouchDB.prototype.design = function(name, opts, cb) {
	this.options.path = '/'+this.db+'/_design/'+name+'/_'+(opts.type ? opts.type : 'view')+'/'+opts.name+'?'+querystring.stringify(opts.params);
	this.options.method = 'GET';

	_makeReq(this.options, cb);
};

SouchDB.prototype.newDoc = function(field) {
	return new SouchDoc(this.db, this.options, field);
};

module.exports = SouchDB;