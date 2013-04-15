var SouchDB = require('./lib/souch.db').DB,
	crypto = require('crypto');

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

module.exports = SouchDB;