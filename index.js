var crypto = require('crypto');

module.exports = require('./lib/souch.db');

module.exports.unique = function(a, f) {
	var n = [],
		f = f || 'id';
	for (var i=0; i<a.length; i++){
		var c = a[i][f];
		if (n.indexOf(c) >= 0) { a.splice(i,1); i--; continue; }
		n.push(c);
	}
	return a;
}

module.exports.format = function(s){
	var t = s.toString();
	for (var i=1; i<=arguments.length; i++){
		t = t.replace('?', arguments[i]);
	}
	return t;
}

module.exports.hash = function(s, t) {
	return crypto.createHash(t).update(s.toString()).digest('hex');
};