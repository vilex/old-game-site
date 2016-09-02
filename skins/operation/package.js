define("ui/widget/slideview",function(require, exports, module){
	var $ 		= require('lib/zepto'),
		ai		= require('lib/ai'),
		slip 	= require('lib/slip'),
		undefined;
	
	function Slider(_options){
		
		var options = $.extend({
			dom: null
		}, _options);
		
		var dom 			= options.dom,
			changImg		= dom.find('ul')[0],
			changeImgLi		= dom.find('.slider-ul li'),
			changImgLength  = changeImgLi.size(),
			img_width		= 320,
			undefined;
		
		if(ai.hv()){// 如果是竖屏图片适应屏幕
			var img_width  = ai.ww();
			var img_height = img_width/(3/1);
			img_height = Math.ceil(img_height, 10);
			
			for(var i= 0,l= changImgLength; i < l; i++ ){
				var change_img_li_now = changeImgLi[i];
				change_img_li_now.style.width  = img_width + "px";
				change_img_li_now.style.height = img_height + "px";
			}
			var ui_header_slideWrap = dom[0];
			ui_header_slideWrap.style.width  = img_width + "px";
			ui_header_slideWrap.style.height = img_height + "px";
		}
		
		function changeScreenEndFun() {
			dom.find('.slider-dot li.active').removeClass('active');
			dom.find('.slider-dot li:nth-child(' + (this.page+1) + ')').addClass('active');
		}
		
		changImg.style.width = ''+changImgLength*img_width+'px';
		slip('page', changImg,{
			change_time: 5000,
			num: changImgLength,
			no_follow: true,
			endFun: changeScreenEndFun
		});
		
		return;
	}
	
	return Slider;
});