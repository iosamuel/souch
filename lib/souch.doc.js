var _makeReq = require('./souch.pv').fnReq;

var SouchDoc = function(db, options, field){
	if (!(field instanceof Object)) field = { type:field };
	this.fieldName = Object.keys(field)[0];
	this.fieldValue = field[this.fieldName];
	this.db = db;
	this.options = options;
};

SouchDoc.prototype.get = function(id, cb) {
	this.options.path = '/'+this.db+'/'+id;
	this.options.method = 'GET';

	_makeReq(this.options, cb);
};

SouchDoc.prototype.post = function(data, cb) {
	this.options.path = '/'+this.db+'/';
	this.options.method = 'POST';
	data[this.fieldName] = this.fieldValue;
	data = JSON.stringify(data);

	_makeReq(this.options, data, cb);
};

SouchDoc.prototype.delete = function(id, cb) {
	this.get(id, function(result){
		var fullPid = result._id + '?rev=' + result._rev;

		this.options.path = '/'+this.db+'/'+fullPid;
		this.options.method = 'DELETE';

		_makeReq(this.options, cb);
	}.bind(this));
};

SouchDoc.prototype.put = function(id, data, cb) {
	data[this.fieldName] = this.fieldValue;
	data = JSON.stringify(data);

	this.get(id, function(result){
		var fullPid = result._id + '?rev=' + result._rev;

		this.options.path = '/'+this.db+'/'+fullPid;
		this.options.method = 'PUT';

		_makeReq(this.options, data, cb);
	}.bind(this));
};

module.exports = SouchDoc;