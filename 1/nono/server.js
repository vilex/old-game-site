var http  = require('http')
, 	 url  = require('url')
,    route = require('./route.js')
,   config = require('./config/rout.js')
,  handle = require('./handler/RequestHandler.js')

function on(port){
	http.createServer(function(req,res){
		
		var pathname = url.parse(req.url).pathname;
		console.log('pathname',pathname)
		var data = route.route(config.router , pathname);
		res.end(data)
		
	}).listen(port)
}

exports.on = on;