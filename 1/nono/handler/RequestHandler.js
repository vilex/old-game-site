var fs = require('fs');
function home(){
	return fs.readFileSync(process.cwd() + '/views/login/index.html'); 
}

exports.home = home;