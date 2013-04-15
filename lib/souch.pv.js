var http = require('http');

var makeReq = function(options, data, cb) {
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

module.exports.fnReq = makeReq;