slider=document.getElementById("xinplist");
var py=0;
var nn,xp,yp,time,isScrolling;
var status=1;
var w=slider.getElementsByTagName("li")[0].offsetWidth;
var num=slider.getElementsByTagName("li").length;
var zw=(w+10)*num;
var pw=document.body.clientWidth-10;
var ww=zw-pw;
slider.style.width=zw+"px";
slider.style.transform="translate3d(0,0,0)";
slider.style.WebkitTransform="translate3d(0,0,0)";
var animated=function(t,jl){
	slider.style.WebkitTransitionDuration=t;
	slider.style.TransitionDuration=t;
	slider.style.transform="translate3d("+jl+"px,0,0)";
	slider.style.WebkitTransform="translate3d("+jl+"px,0,0)";
};
//touchstart事件  
var touchSatrtFunc=function(evt){
   try  
	{  
		//evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
		var touch = evt.touches[0]; //获取第一个触点  
		var x = Number(touch.pageX); //页面触点X坐标
		var y = Number(touch.pageY); //页面触点Y坐标  
		//记录触点初始位置 
		startX = x;
		startY = y;
		startPos=+new Date    //取第一个touch的坐标值
	}  
	catch (e) {  
	   alert('touchSatrtFunc：' + e.message);  
   }  
};
//touchmove事件，这个事件无法获取坐标
var touchMoveFunc=function(evt) {
   try  
   {  
		//evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
		var touch = evt.touches[0]; //获取第一个触点  
		var x = Number(touch.pageX); //页面触点X坐标
		var y = Number(touch.pageY); //页面触点Y坐 
		var lx=x+10;
		var rx=x-10;
		var ly=y+70;
		var ry=y-70;
		var text = 'TouchMove事件触发：（' + x + '）';  
		xp=x-startX;
		yp=y-startY;
		if(status==1){
			isScrolling = Math.abs(xp) < Math.abs(yp) ? 1:0;
			status=0;
		};
		if(isScrolling){
			status=1;
			nn=py;
		}else{
			evt.preventDefault();
			if(lx<startX){
				//document.title="左";
				nn=py-Math.abs(xp);
				animated("0s",nn);
			};
			if(rx>startX){
				//document.title="右";
				nn=py+Math.abs(xp);
				animated("0s",nn);	
			};
		};
		
	}  
   catch (e) {
	  alert('touchMoveFunc：' + e.message);  
	}  
};
//touchend事件  
var touchEndFunc=function(evt){
   try { 
   		var duration = +new Date - startPos;    //滑动的持续时间
		if(isScrolling===0){
			if(Number(duration)<200){
				//evt.preventDefault();
				time=500*Math.abs(xp)/pw;
				if((xp+10)<0){
					nn=py-Math.abs(xp)*zw/pw;	
					animated(time,nn);
				};
				if((xp-10)>0){
					nn=py+Math.abs(xp)*zw/pw;	
					animated(time,nn);
				};
			};
			if(nn>=0){
				animated("400ms",0);
				nn=0;
			}else if(Math.abs(nn)>=ww){
				animated("400ms",-ww);
				nn=-ww;
			};
			py=nn;
		};
		status=1;
		startX = 0;
		startY = 0;
		duration=0;
		//解绑事件
		slider.removeEventListener('touchmove',this,false);
		slider.removeEventListener('touchend',this,false);
		
   }  
	catch (e) {  
		alert('touchEndFunc：' + e.message);  
	}  
};
//绑定事件
bindEvent=function(){
	slider.addEventListener('touchstart', touchSatrtFunc, false);  
	slider.addEventListener('touchmove', touchMoveFunc, false);  
	slider.addEventListener('touchend', touchEndFunc, false);
};
bindEvent();