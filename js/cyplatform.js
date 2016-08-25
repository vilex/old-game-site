// 手机访问还是电脑访问
var platform = function(){
	var p = navigator.platform;
	return p;
}


alert(platform());

var isMovie = false;
var pcs = ['win','mac','xll'];

for(var i = 0; i < pcs.length; i++){
	if(navigator.platform.indexOf(pcs[i])!=-1){
		isMovie = true;
	}	
}

if(isMovie){
	window.location.href = 'movie/index.html';
}else{
	window.location.href = 'pc/index.html';
}
