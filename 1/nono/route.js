function route(handle,pathname){
	if(typeof handle[pathname] === 'function'){
		return handle[pathname]();
	}else{
		return "404 Not Found"
	}
}
exports.route = route;