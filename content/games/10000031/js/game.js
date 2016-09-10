var game = {};
var hasTouch =  (/mobile|Mobile/g).test(navigator.userAgent) && (("createTouch" in document) || ("ontouchstart" in window)),
	startEvent = hasTouch ? "touchstart" : "mousedown",
	moveEvent = hasTouch ? "touchmove" : "mousemove",
	endEvent = hasTouch ? "touchend touchcancel" : "mouseup";
game.eventTouchStart = startEvent;
game.eventTouchMove = moveEvent;
game.eventTouchEnd = endEvent;

var ImagePreloader = function(){
	this.imgList = [];
	var stepImages;
	for(var i = 0; i < picimgs.length; i++){
		stepImages = [];
		stepImages.push(picimgs[i]["url1"]);
		stepImages.push(picimgs[i]["url2"]);
		this.imgList.push(stepImages);
	}
	this.images = [];
	this.step = 0;
}
ImagePreloader.prototype.loadNext = function(){
	var self = this;
	if(self.imgList.length > 0 && self.step < self.imgList.length){
		var img = new Image();
		for(var i = 0; i < this.imgList[self.step].length; i++){
			img = new Image();
			img.src = this.imgList[self.step][i];
			this.images.push(img);
		}
		self.step++;
	}
}


var probe = {
	support: function(key) {
		var bln = true;
		switch (key) {
		case "boxshadow":
			bln = this.supportBoxShadow();
			break;
		default:
			break
		}
		return bln
	},
	supportBoxShadow: function() {
		var $testDiv = $('<div style="box-shadow:inset 0px -1px 1px  -1px #b2b2b2;"></div>');
		try {
			if ($testDiv.css("box-shadow")) {
				return true
			} else {
				return false
			}
		} catch(e) {
			return false
		}
	}
};


var scene = {}
var imagePreloader = new ImagePreloader();

var startScene = {
	$content: $("#startScene")
	,start: function(){
		$(".scene").hide();
		this.$content.show();
		this.bindEvent();

		imagePreloader.loadNext();
	}
	,end: function(){
		this.$content.hide();
	}
	,bindEvent: function(){
		var self = this;
		$("#startGame_btn").on(game.eventTouchEnd, function(){
			self.end();
			picgame.start();
			return false;
		});
		$("#startEasyGame_btn").on(game.eventTouchEnd, function(){
			self.end();
			picgame.start({mode:"easy"});
			return false;
		});
		$("#moreGame_btn").on(game.eventTouchEnd, function(){});
	}
}

var overScene = {
	$content: $("#overScene")
	,hasInit: false
	,init: function(){
		var self = this;
		self.$content.on(game.eventTouchEnd, "#again_btn", function(){
			self.end();
			// picgame.currIndex = 0;
			picgame.start();
			return false;
		}).on(game.eventTouchEnd, "#next_btn", function(){
			self.end();
			picgame.currIndex = picgame.currIndex + 1;
			picgame.start()
			return false;
		}).on(game.eventTouchEnd, "#left_btn", function(){
			var $girlList = $("#girlList");
			var left = parseInt($girlList.css("left"));
			if(left<0){
				$girlList.css("left", (left+(parseInt($("#girlListWrp").css("width"))))+"px")
			}
		}).on(game.eventTouchEnd, "#right_btn", function(){
			var $girlList = $("#girlList");
			var left = parseInt($girlList.css("left"));
			var glw = parseInt($("#girlListWrp").css("width"));
			if(left>-(parseInt($girlList.css("width"))-glw)){
				$girlList.css("left", (left-glw)+"px")
			}
		});

		self.setOnesList();
	}
	,setOnesList: function(){
		var self = this;
		var content = "";
		var fflag = false;
		for(var i = 0; i < picimgs.length; i+=4){
			content += '<li><ul class="glPage">';
			for(var j = 0; j < 4; j++){
				var index = i+j;
				if(picimgs[index]){
					content += '<li><div class="glItem" src="'+picimgs[index].url1+'" positionX="'+picimgs[index].face.x+'" positionY="'+picimgs[index].face.y+'" originW="'+picimgs[index].w+'" originH="'+picimgs[index].h+'"></div></li>';
				}else{
					fflag = true;
					break;
				}
			}
			content += '</ul></li>';
			if(fflag) break;
		}

		self.$content.find("#girlList").html(content);
	}
	,start: function(options, lastScene){
		var self = this;
		var configuration;
		setTimeout(function(){
			lastScene.$content.hide();
			if(!self.hasInit){
				self.init();
				self.hasInit = true;
			}
			self.$content.show();
			if(options.oType == "fail"){
				document.title = shareData.tTitle = "鏍¤姳鏉ユ壘鑼紝鎴戞壘鍒颁簡" +(picgame.currIndex)+ "涓牎鑺憋紝姹傝秴瓒婏紒"
				// submit_3366(picgame.currIndex)
				share_3366()
				configuration = {
					header: "闂叧澶辫触"
					,result: "浣犳病鏈夊湪"+picgame.maxSecond+"绉掑唴瀹屾垚闂叧"
					,controller: ["#again_btn", "#seekHelp_btn"]
					,mainContent: "#ones"
					,tip: "涓嶈姘旈锛岃繕鏈夎繖涔堝鏍¤姳鍦ㄧ瓑浣犳壘鑼摝锛�<br/>"
				}

			}else if(options.oType == "pass"){
				document.title = shareData.tTitle = "鏍¤姳鏉ユ壘鑼紝鎴戞壘鍒颁簡" +(picgame.currIndex + 1)+ "涓牎鑺憋紝姹傝秴瓒婏紒"
				// submit_3366(picgame.currIndex)
				configuration = {
					header: "闂叧鎴愬姛"
					,result: "鍏辨壘鍑�${totalNum}澶勪笉鍚岋紝鐢ㄦ椂${second}绉掞紝姝ｇ‘鐜�${correctPercent}锛岃秴杩�${defeatPercent}鐜╁"
					,controller: ["#next_btn", "#share_btn"]
					,mainContent: "#one"
				}
				/*if(btGame.checkNavigator() == "weixin"){
					shareTitle = "鎴戝凡缁忔垚鍔熸壘浜�"+(picgame.currIndex+1)+"浣嶆牎鑺辩殑鑼紝浣犳暍鏉ユ寫鎴樺悧锛�"
				}else{
					shareTitle = "鎴戝湪銆婃牎鑺辨潵鎵捐尙銆嬪凡缁忔垚鍔熸壘浜�"+(picgame.currIndex+1)+"浣嶆牎鑺辩殑鑼紝浣犳暍鏉ユ寫鎴樺悧锛熺偣鍑婚摼鎺ラ┈涓婂紑濮嬫寫鎴橈細http://doudou.a0bi.com/play/21-beauty/   锛園璞嗚眴灏忔父鎴� 涓嶡璇剧▼鏍煎瓙 鍏ㄦ皯鏍¤姳鑱旀墜鍑哄搧锛�"
				}*/
			}else if(options.oType == "passAll"){
				document.title = shareData.tTitle = "鏍¤姳鏉ユ壘鑼紝鎴戞壘鍒颁簡" +(picgame.currIndex + 1)+ "涓牎鑺憋紝姹傝秴瓒婏紒"
				// submit_3366(picgame.currIndex)
				configuration = {
					header: "鍏ㄩ儴閫氬叧"
					,result: "浣犲彧鑺变簡${second}绉掑畬鎴愰€氬叧锛岃秴杩�${allDefeatPercent}鐜╁锛佸姝ら叿鐐殑鎴愮哗锛屽悜灏忎紮浼翠滑鐐€€涓€鐣惂锛�"
					,controller: ["#share_btn", "#more_btn"]
					,mainContent: "#ones"
					,tip: "鏈夋病鏈夎鏍¤姳浠悓鍒板憿锛�"
				}
				/*if(btGame.checkNavigator() == "weixin"){
					shareTitle = "鎴戣姳浜�"+options.second+"绉掑氨鏀荤暐鎺�"+picimgs.length+"浣嶆牎鑺憋紝浣犳湁鎴戝帀瀹冲悧锛�"
				}else{
					shareTitle = "鎴戝湪銆婃牎鑺辨潵鎵捐尙銆嬩腑鑺变簡"+options.second+"绉掕交鏉炬敾鐣ユ帀18浣嶆牎鑺憋紝浣犳湁鎴戝帀瀹冲悧锛熺偣鍑婚摼鎺ラ┈涓婂紑濮嬫寫鎴橈細http://doudou.a0bi.com/play/21-beauty/   锛園璞嗚眴灏忔父鎴� 涓嶡璇剧▼鏍煎瓙 鍏ㄦ皯鏍¤姳鑱旀墜鍑哄搧锛�"
				}*/
			}
			/*btGame.setShare({
				title: shareTitle
				,platform:{
					sinaweibo: {
						gameIcon: true
					}
					,renren: {}
				}
			});*/
			$.extend(options, configuration)
			self.configure(options);
		}, 1000);
	}
	,end: function(){
		var self = this;
		self.$content.removeClass(self.oType);
		self.$content.hide();
	}
	,format: function(s, options){
		var result = s.replace(/\$\{(.*?)\}/g, function(a, key){
			if(options[key] != undefined){
				return "<span>"+options[key]+"</span>"
			}
		});
		return result;
	}
	,configure: function(options){
		var self = this;
		self.$content.addClass(options.oType);
		self.oType = options.oType;
		self.$content.find(".osResult").html(self.format(options.result, options));

		self.$content.find(".osController a").hide();
		for(var i = 0; i < options.controller.length; i++){
			self.$content.find(".osController").find(options.controller[i]).show();
		}

		self.$content.find(".osMainContent").hide();
		self.$content.find(options.mainContent).show();
		if(options.oType == "pass"){
			var $one = self.$content.find("#one");
			$one.find(".school").html(options.info.school);
			$one.find(".name").html(options.info.name);
			$one.find("img").attr("src", options.src);
			//$one.find("img").closest("a").attr("href", "");
		}else{
			var $ones = self.$content.find("#ones");
			$ones.find(".oTip").html(options.tip);
			$("#girlList").find(".glItem").each(function(){
				var $this = $(this);
				var imgWidth = parseInt($this.attr("originW"));
				var imgHeight = parseInt($this.attr("originH"));
				var width = parseInt($this.css("width"));
				var height = parseInt($this.css("height"));
				$this.css("background", "url("+$this.attr("src")+")")
				var x = parseInt($this.attr("positionX"))-(width/2);
				var y = parseInt($this.attr("positionY"))-(height/2);
				(x<0) && (x=0);
				(x+width>imgWidth) && (x=imgWidth-width);
				(y<0) && (y=0);
				(y+height>imgHeight) && (y=imgHeight-height);
				$this.css("background-position", -x+"px "+(-y+"px"));
			});
		}
	}
}

var picgame = {
	action: {
		totalNum: 0,
		clickNum: 0,
		correctNum: 0,
		correctPecent: 0,
		timerPasser: 0,
		clickData: null,
		passTotalNum: 0
	}
	,timer: null
	,second: 0
	,maxSecond: 60
	,currIndex: 0
	,firstInit: 0
	,totalSecond: 0
	,hasOver: true
	,mode: "normal"
	,easyModeTotalNum: [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4]
	,$content: $("#gameScene")
	,init: function(index, type) {
		var img = picimgs[index];
		this.currIndex = index;
		var self = this;
		self.action.totalNum = img.data.length;
		if(self.mode == "easy"){
			$(".easyMode").show();
		}else{
			$(".normalMode").show();
		}
		if(self.mode == "easy"){
			var l = self.easyModeTotalNum.length;
			self.action.passTotalNum = (index>=l)?self.easyModeTotalNum[l-1]:self.easyModeTotalNum[index];
		}else{
			self.action.passTotalNum = self.action.totalNum;
		}
		this.action.clickData = img.data;
		this.action.info = img.info;
		this.action.src = img.url1;
		for (var i = 0; i < this.action.clickData.length; i++) {
			this.action.clickData[i].find = false
		}
		$("#leftpic").css({
			width: img.w + "px",
			height: img.h + "px",
			background: "url(" + img.url1 + ")",
			"background-size": img.w + "px " + img.h + "px"
		});
		$("#rightpic").css({
			width: img.w + "px",
			height: img.h + "px",
			background: "url(" + img.url2 + ")",
			"background-size": img.w + "px " + img.h + "px"
		});
		imagePreloader.loadNext();
		for (var i = 0; i < img.data.length; i++) {
			var item = img.data[i];
			var $mask1 = $("<div id='maskleft" + i + "' data-id='" + i + "'></div>").addClass("floatmask").css({
				width: item.w + "px",
				height: item.h + "px",
				left: item.l + "px",
				top: item.t + "px"
			});
			var $mask2 = $("<div  id='maskright" + i + "'  data-id='" + i + "'></div>").addClass("floatmask").css({
				width: item.w + "px",
				height: item.h + "px",
				left: item.l + "px",
				top: item.t + "px"
			});
			$mask1.on(game.eventTouchEnd, function(e) {
				if(!self.hasOver){
					var id = $(this).attr("data-id");
					$("#maskleft" + id).addClass("showborder");
					$("#maskright" + id).addClass("showborder");
					self.action.clickData[id].find = 1;
					self.action.clickNum = self.action.clickNum + 1;
					self.showTips();
					e.stopPropagation();
					e.preventDefault()
				}
			});
			$mask2.on(game.eventTouchEnd, function(e) {
				if(!self.hasOver){
					var id = $(this).attr("data-id");
					$("#maskleft" + id).addClass("showborder");
					$("#maskright" + id).addClass("showborder");
					self.action.clickData[id].find = 1;
					self.action.clickNum = self.action.clickNum + 1;
					self.showTips();
					e.stopPropagation();
					e.preventDefault()
				}
			});
			if (type == 1) {
				$mask1.addClass("showborder");
				$mask2.addClass("showborder")
			}
			$("#leftpic").append($mask1);
			$("#rightpic").append($mask2)
		}
		if (self.firstInit == 0) {
			self.firstInit = 1;
			$("#picbox").on(game.eventTouchEnd, function() {
				if(!self.hasOver){
					self.action.clickNum = self.action.clickNum + 1;
					self.showTips()
				}
			})
		}
		self.showTips()
	}
	,showTips: function() {
		var self = this;
		var correctNum = 0;
		for (var i = 0; i < this.action.clickData.length; i++) {
			var item = this.action.clickData[i];
			if (item.find) {
				correctNum = correctNum + 1
			}
		}
		this.action.correctNum = correctNum;
		this.action.correctPecent = parseInt(correctNum * 100 / this.action.clickNum) ? parseInt(correctNum * 100 / this.action.clickNum) : 0;
		$(".totalNum").html(this.action.totalNum);
		$("#passTotalNum").html(this.action.passTotalNum);
		$("#clickNum").html(this.action.clickNum);
		$("#correctNum").html(this.action.correctNum);
		$("#correctPecent").html(this.action.correctPecent);
		$("#currLevel").html(self.currIndex + 1);
		if (this.action.correctNum == this.action.passTotalNum) {
			// self.gameNext()
			self.end();
			if(picimgs.length - 1 == this.currIndex){
				overScene.start({
					oType: "passAll"
					,second: self.totalSecond
					,allDefeatPercent:this.getAllPassDefeatPercent(self.totalSecond, picimgs.length*self.maxSecond)
				}, self);
				self.totalSecond = 0;
			}else{
				self.totalSecond += self.second;
				overScene.start({
					oType:"pass"
					,totalNum:this.action.passTotalNum
					,second:self.second
					,correctPercent:this.action.correctPecent+"%"
					,defeatPercent:this.getPassDefeatPercent(self.maxSecond, self.second, parseInt(this.action.correctPecent)/100)
					,info:this.action.info
					,src:this.action.src
				}, self);
			}
		}
		if (this.action.clickNum > 6 && this.action.correctPecent < 60) {
			self.end();
			overScene.start({
				oType: "fail"
			}, self);
		}
	}
	,startTimer: function() {
		var self = this;
		var interval = function(){
			var percent = Math.max(parseInt((self.maxSecond - self.second) * 100 / self.maxSecond), 0);
			var color = "#86e01e";
			if (percent > 80) {
				color = "#86e01e"
			} else if (percent > 60 && percent <= 80) {
				color = "#f2d31b"
			} else if (percent > 40 && percent <= 60) {
				color = "#f2b01e"
			} else if (percent > 20 && percent <= 40) {
				color = "#f27011"
			} else if (percent <= 20) {
				color = "#f63a0f"
			}
			$("#progressbar").css({
				width: percent + "%",
				"background-color": color
			});
			$("#timeshow").html(self.maxSecond - self.second);
			if (percent == 0) {
				self.end();
				overScene.start({
					oType: "fail"
				}, self);
			}
		};
		interval();
		this.timer = setInterval(function() {
			self.second = self.second + 1;
			interval();
		},
		1e3)
	}
	,stopTimer: function() {
		clearInterval(this.timer)
	}
	,start: function(options){
		this.hasOver = false;
		this.$content.show();
		if(options && options.mode){
			this.mode = options.mode;
		}
		this.gamestart();
	}
	,end: function(){
		var self = this;
		// this.$content.hide();
		self.hasOver = true;
		self.stopTimer()
	}
	,gamestart: function() {
		if (this.timer) {
			this.stopTimer()
		}
		this.action = {
			totalNum: 0,
			clickNum: 0,
			correctNum: 0,
			correctPecent: 0,
			timerPasser: 0,
			clickData: null,
			passTotalNum: 0
		};
		this.timer = null;
		this.second = 0;
		// a_why second temp
		this.maxSecond = 60;
		$("#leftpic").empty();
		$("#rightpic").empty();
		this.init(this.currIndex);
		this.startTimer()
	}
	,gamefinish: function() {}
	,getPassDefeatPercent: function(maxSecond, second, correctPercent){
		return ((.5*(1-(second/maxSecond))+.5*correctPercent)*99.6).toFixed(1)+"%";
	}
	,getAllPassDefeatPercent: function(second, totalSecond){
		return ((1-second/totalSecond)*99.9).toFixed(1)+"%";
	}
};
