// bg
var bg_obj = {
	boxArr:[],
	bgc:null
};
function bg_box_style() {
	var box = document.createElement('div');
	var rw = Math.random() * bg_obj.bgc.clientWidth;
	var rh = Math.random() * bg_obj.bgc.clientHeight;
	var r=Math.floor(Math.random()*255);
	var g=Math.floor(Math.random()*255);
	var b=Math.floor(Math.random()*255);
	var rgb='rgb('+r+','+g+','+b+')';
	return "position:absolute;width:20px;height:20px;top:"+rw+"px;left:"+rh+"px;background-color:"+rgb+";-moz-transition: all 1s;-webkit-transition: all 1s;-o-transition: all 1s;transition: all 1s;"
}
function bg_move(){
	for(var i = 0; i < bg_obj.boxArr.length; i++){
		var box = bg_obj.boxArr[i];
		box.style.left = Math.random() * bg_obj.bgc.clientWidth + 'px'; 
		box.style.top = Math.random() * bg_obj.bgc.clientHeight + 'px';
	}
}

function bg_init() {
	bg_obj.bgc = document.getElementById('i-bg');
	var boxNum = 50;
	for(var i = 0; i < boxNum; i++){
		var box = document.createElement('div');
		box.style.cssText = bg_box_style();
		bg_obj.bgc.appendChild(box);
		bg_obj.boxArr.push(box);
	}

	setInterval(bg_move,3000)
}



function init() {
	bg_init();
}


window.onload = init;