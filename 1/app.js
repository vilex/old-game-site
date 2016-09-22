const PORT = 8000;

var mime = require('./config/mime.js').types;
var path = require('path');
var fs = require('fs')

require('http')
	.createServer( (request , response) => {
		
		var pathname = require('url')
						.parse(request.url)
						.pathname
		
		var realPath = 'static' + pathname
		
		fs.exists(realPath , (exists) => {
				if(!exists){
					response.writeHead(404,{'Content-Type':'text/plain'})
					response.write('This request URL ' + pathname + ' was not found on this server')
					response.end();

				}else{
						fs.readFile(realPath,'binary',(err , file) => {
							if(err){
								response.writeHead(500,{'Content-Type':'text/plain'})
								response.write("err")
								response.end()
							}else{
								var ext = path.extname(realPath)
								ext = ext ? ext.slice(1) : 'unkown'

								var ctype = mime[ext] || 'text/plain'
								
								response.writeHead(200,{'Content-Type':ctype})
								response.write(file,'binary')
								response.end()
							}
						})
				}
			})
	})
	.listen(PORT)

console.log('Server running at port: ' + PORT)