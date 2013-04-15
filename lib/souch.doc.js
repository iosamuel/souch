var SouchDB = require('./souch.db');

var SouchDoc = function(field){
	if (!(field instanceof Object)) field = { type:field };
	this.fieldName = Object.keys(field)[0];
	this.fieldValue = field[this.fieldName];
};
SouchDoc.prototype.__proto__ = SouchDB.prototype;

SouchDoc.prototype.get = function(id, cb) {
	this.options.path = '/'+this.db+'/'+id;
	this.options.method = 'GET';

	this._makeReq(cb);
};

SouchDoc.prototype.post = function(data, cb) {
	this.options.path = '/'+this.db+'/';
	this.options.method = 'POST';
	data[this.fieldName] = this.fieldValue;
	data = JSON.stringify(data);

	this._makeReq(data, cb);
};

SouchDoc.prototype.delete = function(id, cb) {
	this.get(id, function(result){
		var fullPid = result._id + '?rev=' + result._rev;

		this.options.path = '/'+this.db+'/'+fullPid;
		this.options.method = 'DELETE';

		this._makeReq(cb);
	}.bind(this));
};

SouchDoc.prototype.put = function(id, data, cb) {
	data[this.fieldName] = this.fieldValue;
	data = JSON.stringify(data);

	this.get(id, function(result){
		var fullPid = result._id + '?rev=' + result._rev;

		this.options.path = '/'+this.db+'/'+fullPid;
		this.options.method = 'PUT';

		this._makeReq(data, cb);
	}.bind(this));
};

module.exports = SouchDoc;