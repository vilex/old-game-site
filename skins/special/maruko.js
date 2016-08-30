/* JS Document
 Version:	3.2.1
 Date:		2014/10/01
 Author:    Not-know Ni
 Update:    2015/06/29
 con:       all
 Based on： jQuery
 */
;(function (name, context, definition) {
    if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
    else if (typeof define === 'function' && define.amd) { define(definition); }
    else { context[name] = definition(); }
})('Fingerprint', this, function () {
    'use strict';
    var Fingerprint = function (options) {
        var nativeForEach, nativeMap;
        nativeForEach = Array.prototype.forEach;
        nativeMap = Array.prototype.map;

        this.each = function (obj, iterator, context) {
            if (obj === null) {
                return;
            }
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === {}) return;
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === {}) return;
                    }
                }
            }
        };

        this.map = function(obj, iterator, context) {
            var results = [];
            // Not using strict equality so that this acts as a
            // shortcut to checking for `null` and `undefined`.
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
            this.each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list);
            });
            return results;
        };

        if (typeof options == 'object'){
            this.hasher = options.hasher;
            this.screen_resolution = options.screen_resolution;
            this.canvas = options.canvas;
            this.ie_activex = options.ie_activex;
        } else if(typeof options == 'function'){
            this.hasher = options;
        }
    };

    Fingerprint.prototype = {
        get: function(){
            var keys = [];
            keys.push(navigator.userAgent);
            keys.push(navigator.language);
            keys.push(screen.colorDepth);
            if (this.screen_resolution) {
                var resolution = this.getScreenResolution();
                if (typeof resolution !== 'undefined'){ // headless browsers, such as phantomjs
                    keys.push(this.getScreenResolution().join('x'));
                }
            }
            keys.push(new Date().getTimezoneOffset());
            keys.push(this.hasSessionStorage());
            keys.push(this.hasLocalStorage());
            keys.push(!!window.indexedDB);
            //body might not be defined at this point or removed programmatically
            if(document.body){
                keys.push(typeof(document.body.addBehavior));
            } else {
                keys.push(typeof undefined);
            }
            keys.push(typeof(window.openDatabase));
            keys.push(navigator.cpuClass);
            keys.push(navigator.platform);
            keys.push(navigator.doNotTrack);
            keys.push(this.getPluginsString());
            if(this.canvas && this.isCanvasSupported()){
                keys.push(this.getCanvasFingerprint());
            }
            if(this.hasher){
                return this.hasher(keys.join('###'), 31);
            } else {
                return this.murmurhash3_32_gc(keys.join('###'), 31);
            }
        },

        /**
         * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
         *
         * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
         * @see http://github.com/garycourt/murmurhash-js
         * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
         * @see http://sites.google.com/site/murmurhash/
         *
         * @param {string} key ASCII only
         * @param {number} seed Positive integer only
         * @return {number} 32-bit positive integer hash
         */

        murmurhash3_32_gc: function(key, seed) {
            var remainder, bytes, h1, h1b, c1, c2, k1, i;

            remainder = key.length & 3; // key.length % 4
            bytes = key.length - remainder;
            h1 = seed;
            c1 = 0xcc9e2d51;
            c2 = 0x1b873593;
            i = 0;

            while (i < bytes) {
                k1 =
                    ((key.charCodeAt(i) & 0xff)) |
                    ((key.charCodeAt(++i) & 0xff) << 8) |
                    ((key.charCodeAt(++i) & 0xff) << 16) |
                    ((key.charCodeAt(++i) & 0xff) << 24);
                ++i;

                k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

                h1 ^= k1;
                h1 = (h1 << 13) | (h1 >>> 19);
                h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
                h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
            }

            k1 = 0;

            switch (remainder) {
                case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
                case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
                case 1: k1 ^= (key.charCodeAt(i) & 0xff);

                    k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
                    k1 = (k1 << 15) | (k1 >>> 17);
                    k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
                    h1 ^= k1;
            }

            h1 ^= key.length;

            h1 ^= h1 >>> 16;
            h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= h1 >>> 13;
            h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
            h1 ^= h1 >>> 16;

            return h1 >>> 0;
        },

        // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
        hasLocalStorage: function () {
            try{
                return !!window.localStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        hasSessionStorage: function () {
            try{
                return !!window.sessionStorage;
            } catch(e) {
                return true; // SecurityError when referencing it means it exists
            }
        },

        isCanvasSupported: function () {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        },

        isIE: function () {
            if(navigator.appName === 'Microsoft Internet Explorer') {
                return true;
            } else if(navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)){// IE 11
                return true;
            }
            return false;
        },

        getPluginsString: function () {
            if(this.isIE() && this.ie_activex){
                return this.getIEPluginsString();
            } else {
                return this.getRegularPluginsString();
            }
        },

        getRegularPluginsString: function () {
            return this.map(navigator.plugins, function (p) {
                var mimeTypes = this.map(p, function(mt){
                    return [mt.type, mt.suffixes].join('~');
                }).join(',');
                return [p.name, p.description, mimeTypes].join('::');
            }, this).join(';');
        },

        getIEPluginsString: function () {
            if(window.ActiveXObject){
                var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
                    'AcroPDF.PDF', // Adobe PDF reader 7+
                    'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
                    'QuickTime.QuickTime', // QuickTime
                    // 5 versions of real players
                    'rmocx.RealPlayer G2 Control',
                    'rmocx.RealPlayer G2 Control.1',
                    'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
                    'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
                    'RealPlayer',
                    'SWCtl.SWCtl', // ShockWave player
                    'WMPlayer.OCX', // Windows media player
                    'AgControl.AgControl', // Silverlight
                    'Skype.Detection'];

                // starting to detect plugins in IE
                return this.map(names, function(name){
                    try{
                        new ActiveXObject(name);
                        return name;
                    } catch(e){
                        return null;
                    }
                }).join(';');
            } else {
                return ""; // behavior prior version 0.5.0, not breaking backwards compat.
            }
        },

        getScreenResolution: function () {
            return [screen.height, screen.width];
        },

        getCanvasFingerprint: function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // https://www.browserleaks.com/canvas#how-does-it-work
            var txt = 'http://valve.github.io';
            ctx.textBaseline = "top";
            ctx.font = "14px 'Arial'";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle = "#069";
            ctx.fillText(txt, 2, 15);
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            ctx.fillText(txt, 4, 17);
            return canvas.toDataURL();
        }
    };


    return Fingerprint;

});
var ad_library_18183 = newhanawa = {
    //------------------------------------基础配置------------------------------------
    Id: 'index_id_' + Math.random().toString().replace('.', '_'),
    IE: 10,
    con: "all",
    ns: {},
    timer: new Array(),
    topname:"",
    floatname:"",
    pcsystem: [
        [/(Windows NT 5\.0|Windows 2000)/, "Win 2000"],
        [/(Windows NT 5\.1|Windows xp)/i, "Win XP"],
        [/(Windows NT 5\.2|Windows 2003)/, "Win 2003"],
        [/(Windows NT 6\.0|Windows Vista)/, "Win Vista"],
        [/(Windows NT 6\.1|Windows 7)/, "Win 7"],
        [/(Windows NT 6\.2; ARM;)/, "Windows RT"],
        [/(Windows NT 6\.2)/, "Win 8"],
        [/(Windows NT 6\.3)/, "Win 8.1"],
        [/(XBLWP7|WP7)/, "Windows Phone"],
        [/(Windows ?Mobile| WM([0-9]) )/, "Windows Mobile"],
        [/(Windows Phone).* (\d+)\.(\d+)/],
        [/(Win98|Windows 98)/, "Win 98"],
        [/(WinME|Windows ME)/, "Windows ME"],
        [/(WinCE|WindowsCE|Windows CE)/, "Windows CE"],
        [/(Touch[Pp]ad)\/(\d+)\.(\d+)/],
        [/(Android)[\- ]?([\d]+)\.([\d]+)/],
        [/(Linux)[\/ ]?(\d+)\.(\d+)/],
        [/Linux/, "Linux"],
        [/(Unix|UNIX|X11)/, "Unix"],
        [/(FreeBSD)/],
        [/(OpenBSD)/],
        [/(iPhone|iPad|iPod);.*CPU.*OS (\d+)(?:_\d+)?_(\d+).*Mobile/],
        [/(iPhone|iPad|iPod).*OS (\d+)_(\d+)/],
        [/(iPhone|iPad|iPod|CPU OS)/, "IOS"],
        [/(BlackBerry)[ ]?[0-9]*[i]?[\/]?([0-9]+)\.([0-9]*)/],
        [/(BB10|(Black[Bb]erry)|(RIM Tablet OS)|(Play[Bb]ook))/, "BlackBerry OS"],
        [/(CrOS) [a-z0-9_]+ (\d+)\.(\d+)/],
        [/(Samsung)/i, "Samsung"],
        [/\(Mobile;.+Firefox\/\d+\.\d+/, "Firefox OS"],
        [/(Brew|BREW|BMP)/, "Brew MP"],
        [/(Windows NT|SUSE|Fedora|Red Hat|PCLinuxOS|Puppy|PCLinuxOS|CentOS|hpwOS|webOS|AppleTV|Ubuntu|Kindle|Bada|Lubuntu|BackTrack|Slackware|Pre|Pixi|WebTV|GoogleTV|Symbian[Oo][Ss])[\/ ]?(\d+)\.(\d*)/],
        [/(HTC|Sprint APA(9292)|(ADR[A-Za-z0-9]+))/, "HTC"],
        [/(Mac)/, "Mac OS"],
        [/(J2ME)/, "J2ME"],
        [/(Symbian|SymbOS|S60|MeeGo|Series[ ]?60|SymbianOS\/9.1|NOKIA|Series40|Maemo)/i, "Symbian"],
        [/(WinNT4.0)/, "Windows NT 4.0"]
    ],
    browser: [
        [/(PaleMoon)/, "pm"],
        [/(Fennec)/, "fn"],
        [/(Flock)/, "fk"],
        [/(RockMelt)/, "rm"],
        [/(Navigator)/, "ng"],
        [/(MyIBrow)/, "mb"],
        [/(CrMo|CriOS)/, "cm"],
        [/(QQBrowser|TencentTraveler)/i, "qq"],
        [/(Maxthon)/, "ma"],
        [/(360SE|360EE|360browser)/i, "36"],
        [/(Theworld)/, "th"],
        [/( SE )/, "se"],
        [/(LBBROWSER)/, "lb"],
        [/(Lynx)/, "ln"],
        [/(CoolNovo)/, "cl"],
        [/(TaoBrowser)/, "tb"],
        [/(Arora)/, "aa"],
        [/(Epiphany)/, "ep"],
        [/(Links)/, "ls"],
        [/(Camino)/, "cmn"],
        [/(Konqueror)/, "kq"],
        [/(Avant Browser)/, "ab"],
        [/(ELinks)/, "el"],
        [/(Minimo)/, "mnm"],
        [/baiduie8|baidubrowser|FlyFlow|BIDUBrowser/, "bd"],
        [/(UCBrowser|UC Browser|UCWEB|UC AppleWebKit)/, "uc"],
        [/(OneBrowser)/, "ob"],
        [/(iBrowser\/Mini)/, "im"],
        [/(Nokia|BrowserNG|NokiaBrowser|Series60|S40OviBrowser)/, "nk"],
        [/(BB10|PlayBook|Black[bB]erry)/, "bb"],
        [/(OmniWeb)/, "ow"],
        [/(Blazer)/, "bz"],
        [/Qt/, "qt"],
        [/(NetFront)/, "nf"],
        [/(Silk)/, "sk"],
        [/(Teleca)/, "tc"],
        [/(Froyo)/, "fy"],
        [/(MSIE 9)/, "ie9"],
        [/(MSIE 8)/, "ie8"],
        [/(MSIE 7)/, "ie7"],
        [/(MSIE 6)/, "ie6"],
        [/(MSIE 10)/, "ie10"],
        [/(Opera Mini)/, "opm"],
        [/(Opera|Oupeng)/, "op"],
        [/(iPhone|iPad|iPod)/, "ms"],
        [/(Firefox)/, "ff"],
        [/(Chrome)/, "ch"],
        [/(Safari)/, "sa"],
        [/(MSIE)/, "ie"],
        [/(Android)/, "ad"]
    ],
    engine: [
        [1, "baidu.com", "word|wd|w"],
        [2, "google.com", "q"],
        [4, "sogou.com", "query|keyword"],
        [6, "search.yahoo.com", "p"],
        [7, "yahoo.cn", "q"],
        [8, "soso.com", "w|key|query"],
        [11, "youdao.com", "q"],
        [12, "gougou.com", "search"],
        [13, "bing.com", "q"],
        [14, "so.com", "q"],
        [14, "so.360.cn", "q"],
        [14, "v.360.cn", "q"],
        [14, "so.360kan.com", "kw"],
        [15, "jike.com", "q"],
        [16, "qihoo.com", "kw"],
        [17, "etao.com", "q"],
        [18, "soku.youku.com", "keyword"],
        [18, "soku.com", "keyword"],
        [19, "easou.com", "q"],
        [20, "glb.uc.cn", "keyword|word|q"],
        [21, "yunfan.com", "q|kw|key"],
        [22, "zhongsou.com", "w"],
        [23, "chinaso.com", "q|wd"]
    ],
    //获得cookie
    getcookie: function (name) {
        var CookieFound = false;
        var start = 0;
        var end = 0;
        var CookieString = document.cookie;
        var i = 0;
        while (i <= CookieString.length) {
            start = i;
            end = start + name.length;
            if (CookieString.substring(start, end) == name) {
                CookieFound = true;
                break;
            }
            i++;
        }
        if (CookieFound) {
            start = end + 1;
            end = CookieString.indexOf(";", start);
            if (end < start)end = CookieString.length;
            var getvalue = CookieString.substring(start, end);
            return unescape(getvalue);
        }
        return "";
    },
    //设置cookie
    setcookie: function (name, value, stime, domain) {
        try {
            domain = domain == null ? top.location.hostname : domain;
        } catch (e) {
            domain = domain == null ? location.hostname : domain;
        }
        stime = stime == null ? (3 * 60 * 60 * 1000) : stime;
        var extime = new Date();
        extime.setTime(extime.getTime() + stime);
        value = escape(value);
        var nameString = name + "=" + value;
        var expiryString = ";expires=" + extime.toGMTString();
        var domainString = ";domain=" + domain;
        var pathString = ";path=/";
        var setvalue = nameString + expiryString + domainString + pathString;
        document.cookie = setvalue;
    },
    remove: function (name, func) {
        if (this.timer[name])clearInterval(this.timer[name]);
        jQuery('#' + name + '_' + this.Id).remove();
        if (typeof(func) == 'function')func();
    },
    //添加关闭
    createAdClose: function (o, name, func, type) {
        var self = this;
        var img_c = document.createElement('img');
        img_c.title = '关闭';
        img_c.src = 'http://www.18183.com/templets/index2014/images/bg_close.png';
        with (img_c.style) {
            position = 'absolute';
            zIndex = 100000;
            width = '30px';
            height = '30px';
            top = 0;
            cursor = 'pointer';
        }
        if (type == "left") {
            img_c.style.left = 0;
        } else {
            img_c.style.right = 0;
        }
        img_c.onclick = function () {
            self.remove(name, func);
            return false;
        };
        if(self.ns[name][0].type==4){
            o.append(jQuery(img_c));
        }else{
            o.find("div").append(jQuery(img_c));
        }
        return jQuery(o);
    },
    //创建ADdiv
    createAdDiv: function (o, name) {
        var self = this;
        var nsName= new Array();
        if((self.ns[name] instanceof Array)){
            nsName=self.ns[name];
        }else{
            nsName=[self.ns[name]];
        }
        if (nsName[0].type != '4') {
            var h = nsName[0].height;
            var w = nsName[0].width;
        } else {
            var h = "";
            var w = "";
        }
        var obj = name + '_' + this.Id;
        var div = jQuery('<div></div>');
        div.css({'position': 'absolute', 'z-index': '999', 'top': '0', 'width': w + 'px', 'height': h + 'px'});
        div.attr("id", obj);
        jQuery(o).append(div);
        w = w == null ? '100%' : w;
        h = h == null ? '100%' : h;
        var s = '<div style="position:relative;z-index:1;width:' + w + ';height:' + h + '">';
        if (div && typeof(nsName[0]) == 'object') {
            if (nsName[0].type == '5') {
                s += "<a href=\"" + nsName[0].url + "\" style=\"position:absolute;z-index:6;top:0;left:0;display:block;width:"+nsName[0].seatwidth + ";height:" + nsName[0].seatheight + "\" target=\"" + this.ns[name].target + "\"></a>\
					<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" \
					codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0\"  \
					width=\"" + w + "\"  height=\"" + h + "\" >\
						<param name=\"movie\" value=\"" + nsName[0].src + "\">\
						<param name=\"quality\" value=\"high\">\
						<param name=\"wmode\" value=\"transparent\">\
					<embed src=\"" + nsName[0].src + "\" \
						quality=\"high\" wmode=\"transparent\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" \
						type=\"application/x-shockwave-flash\"  width=\"" + w + "\"  height=\"" + h + "\" ></embed>\
					</object>";
            } else if (nsName[0].type == '4') {
                //s = this.htmlspecialchars_decode(this.ns[name].htmls);
                s = this.htmlspecialchars_decode(nsName[0].htmls);
            } else {
                s += '<a href=\"' + nsName[0].url + '\" style="float:left;" target=\"' + nsName[0].target + '\" ><img src="' + nsName[0].src + '" border="0"  style=\"position:absolute; z-index:6; top:0 ;left:0;width:' + w + ';height:' + h + ' \"/></a>';
            }
            if (nsName[0].type != '4')s += '</div>';
            div.html(s);
        }
        return div;
    },
    createAdBanner: function (name,ind,num,k,g) {
        var self = this;
        var ind=ind || 0;
        var num=num || 10;
        if(typeof(self.ns[name])=="undefined")return;
        var nsName= new Array();
        if((self.ns[name] instanceof Array)){
            nsName=self.ns[name];
        }else{
            nsName=[self.ns[name]];
        }
        var sw=k || nsName[0].seatwidth,
            sh=g || nsName[0].seatheight,
        //ww=nsName[0].width,
        //hh=nsName[0].height,
            ww=k || nsName[0].seatwidth,
            hh=g ||nsName[0].seatheight,
            bodyw = document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
        if(nsName[0].type != '4'){
            if(ind==2){
                wwz=parseInt(ww.split("px")[0]);
                hhz=parseInt(hh.split("px")[0]);
                sw=bodyw+"px";
                sh=(bodyw/640)*90+"px";
                ww=bodyw+"px";
                hh=(bodyw/wwz)*hhz+"px";
            }
        }
        var s="";
        if(num<0)s+="<div class=\"hr_"+(0-num)+"\"></div>";
        s+="<div class=\""+name+"_frame\" style=\"position:relative;z-index:1;overflow:hidden;margin:0 auto;width:" + sw + ";height:" + sh + ";\" ><div class=\"alladzou_frame\"  style=\"position:absolute;float:left;z-index:1;left:0;top:0;overflow:hidden;width:" + parseInt(bodyw)*parseInt(nsName.length)+"px;height:" + sh + ";\"  dt=\"dt_"+name+"\" pos=\"0\"  num=\""+nsName.length+"\"  w=\""+(nsName[0].seatwidth=='100%' && ind==2?bodyw:nsName[0].seatwidth.split("px")[0])+"\"  >";
        for(i in nsName){
            if(typeof(nsName[i]) == 'object'){
                s+="<style>@keyframes dt_"+name+i+"\
{\
to {left:-"+(nsName[i].seatwidth=='100%' && ind==2?bodyw*i:parseInt(nsName[i].seatwidth.split("px")[0])*i)+"px;}\
}\
</style>";
                if(nsName[i].type == '5'){
                    s+= "<div id='" + name + i +"' style=\"position:relative;float:left;z-index:1;overflow:hidden;width:" + sw + ";height:" + sh + ";\"  pingurl=\""+nsName[i].pingUrl+"\"  ><a href=\"" + nsName[i].url + "\" style=\"position:absolute;z-index:1;top:0;left:0;display:block;width:"+ sw + ";height:" + sh + "\" target=\"" + nsName[i].target + "\" ></a>\
						<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" \
						codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0\"  \
						width=\"" + ww + "\"  height=\"" + hh + "\" >\
							<param name=\"movie\" value=\"" + this.ns[name][0].src + "\">\
							<param name=\"quality\" value=\"high\">\
							<param name=\"wmode\" value=\"transparent\">\
						<embed src=\"" + nsName[i].src + "\" \
							quality=\"high\" wmode=\"transparent\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" \
							type=\"application/x-shockwave-flash\"  width=\"" + ww + "\"  height=\"" + hh + "\" ></embed>\
						</object></a></div>";
                } else if (nsName[i].type == '4') {
                    s=this.htmlspecialchars_decode(nsName[i].htmls);
                } else {
                    s+='<div id=\"' + name + i + '\" style=\"float:left;overflow:hidden;width:' + sw + ';height:' + sh + ';" pingurl=\"'+nsName[i].pingUrl+'\"  ><a target=\"' +nsName[i].target + '\" href=\"' + nsName[i].url + '\"><img src=\"' + nsName[i].src + '\" border=\"0\"  style=\"width:' + ww + ';height:' + hh + ';display:block;\" /></a></div>';
                }
            }
        }
        if(nsName[0].type != '4')s+="</div></div>";
        if(ind==1&&num>0)s+="<div class=\"hr_"+num+"\"></div>";
        document.write(s);
    },
    createIndexAdBanner:function(name,num) {
        var self = this;
        self.createAdBanner(name,1,num);
    },
    createAdRoll:function(seconds){
        var self = this;
        var seconds=seconds || 5000
        setTimeout(function(){
            jQuery(".alladzou_frame").each(function(){
                var dt=jQuery(this).attr("dt");
                var pos=parseInt(jQuery(this).attr("pos"));
                var num=parseInt(jQuery(this).attr("num"));
                if(num==1)return;
                var w=parseInt(jQuery(this).attr("w"));
                pos+=1;
                if(pos>=num)pos=0;
                var obj=jQuery(this).attr("dt").split("_")[1]+pos;
                var pingurl=jQuery("#"+obj).attr("pingurl") || "";
                var obj=jQuery(this);
                obj.css({"animation":dt+pos+" 2s"});
                if(pingurl!="")jQuery("body").append("<div style='display:none;'><img src='"+pingurl+"' /></div>");
                setTimeout(function(){obj.css({"left":"-"+w*pos+"px"});},2000)
                obj.attr("pos",pos);
            });
            self.createAdRoll();
        },seconds);
    },
    checkPcSystem: function (e) {
        var t = navigator.userAgent.toString();
        try {
            for (var n in e) {
                var r = t.match(e[n][0]);
                if (r && r.length > 0) {
                    if (e[n].length == 1) {
                        var i = "";
                        for (var s = 1; s < r.length; s++) s > 1 && (i += s == 2 ? " " : "."),
                            i += r[s];
                        return i
                    }
                    if (e[n].length == 2) return e[n][1]
                }
            }
            return "0"
        } catch (o) {
            return "0"
        }
    },
    checkBrowser: function (e) {
        var t = navigator.userAgent.toString();
        try {
            for (var n in e) {
                var r = t.match(e[n][0]);
                if (r && e[n][1]) {
                    return e[n][1];
                }
                ;
            }
            return "0"
        } catch (i) {
            return "0"
        }
    },
    checkBrowserVer: function (e) {
        var t = navigator.userAgent.toString();
        try {
            for (var n in e) {
                var r = t.match(e[n][0]);
                if (r && e[n][1]) {
                    var v = t.split(e[n][1]);
                    var ver = v[2].split("/");
                    return ver[1];
                }
                ;
            }
            return "0"
        } catch (i) {
            return "0"
        }
    },
    checkBrowserVer2: function () {
        var e = {},
            t = navigator.userAgent.toLowerCase(),
            n;
        return (n = t.match(/msie ([\d.]+)/)) ? e.ie = n[1] : (n = t.match(/firefox\/([\d.]+)/)) ? e.firefox = n[1] : (n = t.match(/chrome\/([\d.]+)/)) ? e.chrome = n[1] : (n = t.match(/opera\/([\d.]+)/)) ? e.opera = n[1] : (n = t.match(/version\/([\d.]+).*safari/)) ? e.safari = n[1] : 0,
            e.ie ? "IE: " + e.ie : e.firefox ? "Firefox: " + e.firefox : e.chrome ? "Chrome: " + e.chrome : e.opera ? "Opera: " + e.opera : e.safari ? "Safari: " + e.safari : "0"
    },
    checkBrowserClient: function () {
        var e = navigator.userAgent.match(/iphone|android|phone|mobile|wap|netfront|x11|java|operamobi|operamini|ucweb|windowsce|symbian|symbianos|series|webos|sony|blackberry|dopod|nokia|samsung|palmsource|xda|pieplus|meizu|midp|cldc|motorola|foma|docomo|up.browser|up.link|blazer|helio|hosin|huawei|novarra|coolpad|webos|techfaith|palmsource|alcatel|amoi|ktouch|nexian|ericsson|philips|sagem|wellcom|bunjalloo|maui|smartphone|iemobile|spice|bird|zte-|longcos|pantech|gionee|portalmmm|jig browser|hiptop|benq|haier|^lct|320x320|240x320|176x220|bolt|eudoraweb|touchpad|windows ce|windows mobile/i) != null,
            t = navigator.platform.match(/Win32|Windows|Mac|Linux|X11/i) != null;
        return e ? 2 : t ? 1 : 0
    },
    codeid:null,
    browser1:null,
    bversion2:null,
    client:null,
    system:null,
    screenwidth:null,
    screenheight:null,
    screenwh:null,
    url:null,
    ref:null,
    dm:null,
    rdm:null,
    kw:null,
    uid:0,
    fuzhi:function(){
        var self = this;
        self.codeid = (new Fingerprint()).get();         //唯一识别id
        self.browser1 = self.checkBrowser(self.browser); //浏览器类型
        self.bversion2 = self.checkBrowserVer2();
        self.client = self.checkBrowserClient();
        self.system = self.checkPcSystem(self.pcsystem);  //系统

        self.screenwidth = screen.width;                  //屏幕宽
        self.screenheight = screen.height;                //屏幕高
        self.screenwh = self.screenwidth + "x" + self.screenheight;
        self.url = window.location.href;                  //当前地址
        self.ref = document.referrer;                     //跳转地址
        self.dm = self.url.match(/http:\/\/([^\/]+)\//i);  //当前域名
        self.rdm = self.ref.match(/http:\/\/([^\/]+)\//i); //跳转域名
        self.kw = self.getKeyword(self.ref); //搜索关键字
        self.dm = (self.dm == null) ? "" : self.dm[1];
        self.rdm = (self.rdm == null) ? "" : self.rdm[1];
        self.kw = (typeof(self.kw) == "undefined") ? "" : self.kw;

        self.system = encodeURIComponent(self.system);
        self.url = encodeURIComponent(self.url);
        self.ref = encodeURIComponent(self.ref);
        self.rdm = encodeURIComponent(self.rdm);
        self.bversion2 = encodeURIComponent(self.bversion2);
        self.uid = 0;
        self.setcookie('star_18183_ping', self.codeid + "|" + self.browser1 +"|" + self.bversion2 + "|" + self.system + "|" + self.screenwh+ "|" + self.client,86400*30,'18183.com');
    },
    createAdLink: function(){
        var self = this;
        document.write("<div style='display:none;'><img src=" + admPingUrl + "?t?=" + self.uid + "?t?=" + self.client + "?t?=" + self.browser1 + "?t?=" + self.bversion2 + "?t?=" + self.system + "?t?=" + self.screenwh + "?t?=" + self.dm + "?t?=" + self.url + "?t?=" + self.ref + "?t?=" + self.rdm + "?t?=" + self.kw + "></div>");
        /*
         document.write("<script language=javascript src='http://baidu.com?codeid="+codeid+"&browser="+browser+"&bversion="+bversion+"&system="+system+"&screenwidth="+screenwidth+"&screenheight="+screenheight+"&url="+url+"&ref="+ref+"&dm="+dm+"&rdm="+rdm[1]+"&kw="+kw+"'></script>");
         */
    },
    match_o: function (e, t) {
        var n = e.match(RegExp("(^|&|\\?|#)(" + t + ")=([^&#]*)(&|$|#)", ""));
        return n ? n[3] : null
    },
    match_q: function (e) {
        var t;
        return (t = (e = e.match(/^(https?:\/\/)?([^\/\?#]*)/)) ? e[2].replace(/.*@/, "") : null, e = t) ? e.replace(/:\d+$/, "") : e
    },
    getKeyword: function (ref) {
        var self = this;
        if (ref == "") return;
        var e = 0,
            t,
            n = "",
            kw = "";
        if ((e = ref.indexOf("://")) < 0) return;
        t = ref.substring(e + 3, ref.length),
        t.indexOf("/") > -1 && (t = t.substring(0, t.indexOf("/")));
        for (var r = 0, i = self.engine.length; r < i; r++) if (RegExp("(^|\\.)" + self.engine[r][1].replace(/\./g, "\\.")).test(self.match_q(ref))) {
            var s = self.match_o(ref, self.engine[r][2]) || "";
            if (s || self.engine[r][0] == 2 || self.engine[r][0] == 14 || self.engine[r][0] == 17)
                self.engine[r][0] == 1 && ref.indexOf("cpro.baidu.com") > -1 && (s = ""),
                    se = self.engine[r][0],
                    kw = s
        }
        return kw;
    },
    htmlspecialchars_decode: function (string, quote_style) {
        var optTemp = 0,
            i = 0,
            noquotes = false;
        if (typeof quote_style === 'undefined') {
            quote_style = 2;
        }
        string = string.toString()
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        var OPTS = {
            'ENT_NOQUOTES': 0,
            'ENT_HTML_QUOTE_SINGLE': 1,
            'ENT_HTML_QUOTE_DOUBLE': 2,
            'ENT_COMPAT': 2,
            'ENT_QUOTES': 3,
            'ENT_IGNORE': 4
        };
        if (quote_style === 0) {
            noquotes = true;
        }
        if (typeof quote_style !== 'number') {
            quote_style = [].concat(quote_style);
            for (i = 0; i < quote_style.length; i++) {
                if (OPTS[quote_style[i]] === 0) {
                    noquotes = true;
                } else if (OPTS[quote_style[i]]) {
                    optTemp = optTemp | OPTS[quote_style[i]];
                }
            }
            quote_style = optTemp;
        }
        if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
            string = string.replace(/&#0*39;/g, "'");
        }
        if (!noquotes) {
            string = string.replace(/&quot;/g, '"');
        }
        string = string.replace(/&amp;/g, '&');

        return string;
    },
    //------------------------------------广告位置------------------------------------
    //前弹
    top_ad_float: function (o, ww, hh) {
        var self = this;
        var ow = ww || 700;
        var oh = hh || 300;
        var t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
        var w = document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
        var h = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
        o.css("left", ((w - ow) / 2) + 'px');
        if (self.IE > 6) {
            o.css({"top": ((h - oh) / 2) + 'px', "position": "fixed"});
        } else {
            o.css({"top": (t + (h - oh) / 2) + 'px', "position": "absolute"});
        }
    },
    //右弹
    float_ad_float: function (o, ww, hh) {
        var self = this;
        var ow = ww || 270;
        var oh = hh || 200;
        var t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
        var w = document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
        var h = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
        o.css("right", 0);
        if (self.IE > 6) {
            o.css({"top": ((h - oh)) + 'px', "position": "fixed"});
        } else {
            o.css({"top": (t + (h - oh)) + 'px', "position": "absolute"});
        }
    },
    //------------------------------------广告展现------------------------------------
    //前弹
    top_ad: function (name){
        var self = this;
        var nsName= new Array();
        if((self.ns[name] instanceof Array)){
            nsName=self.ns[name];
        }else{
            nsName=[self.ns[name]];
        }
        if (typeof(nsName[0]) == 'object') {
            var topAd = self.createAdDiv("body", name);
            if (window.addEventListener) {
                window.addEventListener('scroll', function () {
                    self.top_ad_float(topAd);
                }, false);
                window.addEventListener('resize', function () {
                    self.top_ad_float(topAd);
                }, false);
            } else {
                window.attachEvent('onscroll', function () {
                    self.top_ad_float(topAd);
                });
                window.attachEvent('onresize', function () {
                    self.top_ad_float(topAd);
                });
            }
            self.top_ad_float(topAd);
            self.createAdClose(topAd, name , function () {
            },"right");
            self.timer[name] = setTimeout(function () {
                self.remove(name, function () {
                });
            }, nsName[0].timer);
        } else {
        }
    },
    //右弹
    float_ad: function (name) {
        var self = this;
        var nsName= new Array();
        if((self.ns[name] instanceof Array)){
            nsName=self.ns[name];
        }else{
            nsName=[self.ns[name]];
        }
        if (typeof(nsName[0]) == 'object') {
            if(document.getElementById("la_recommend")){document.getElementById("la_recommend").style.display="none";} ;
            var floatAd = self.createAdDiv('body', name);
            if (window.addEventListener) {
                window.addEventListener('scroll', function () {
                    self.float_ad_float(floatAd);
                }, false);
                window.addEventListener('resize', function () {
                    self.float_ad_float(floatAd);
                }, false);
            } else {
                window.attachEvent('onscroll', function () {
                    self.float_ad_float(floatAd);
                });
                window.attachEvent('onresize', function () {
                    self.float_ad_float(floatAd);
                });
            }
            self.float_ad_float(floatAd);
            self.createAdClose(floatAd, name, function () {
                self.top_ad(self.topname);
            }, "right");
            if(nsName[0].timer!=1000){
                self.timer[name] = setTimeout(function () {
                    self.remove(name, function () {
                        self.top_ad(self.topname);
                    });
                }, nsName[0].timer);
            }
        } else {
            self.top_ad(self.topname);
        }
    },
    //顶部下拉
    bigbanner_ad: function (name) {
        var self = this;
        var w = document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
        var nsName= new Array();
        if((self.ns[name] instanceof Array)){
            nsName=self.ns[name];
        }else{
            nsName=[self.ns[name]];
        }
        if (typeof(nsName[0]) == 'object') {
            var bigbBAd;
            var bigbSAd=jQuery("<div class=\"bigbannerad\" style=\"width:100%;height:0px;overflow:hidden;\"></div>");
            var bigbBAdclose=jQuery("<div class=\"bigbanneradclose\" style=\"width:40px;height:30px;overflow:hidden;position:fixed;z-index:201;top:0;right:0;background:#000;color:#fff;display:none;text-align:center;line-height:30px;cursor:pointer;\">关闭</div>");
            if(nsName[0].type =='5'){
                bigbBAd=jQuery("<div id=\"bigbannerad\" style=\" width:100%; height:600px; overflow:hidden; position:fixed; top:0px;background:#000;z_index:6; \"><a target=\"_blank\" href=\""+nsName[0].url+"\"  style=\"width:100%; height:600px; overflow:hidden; position:absolute;top:0px; dispaly:block; z-index:6;\"  ></a><object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0\"  width=\""+w+"\"  height=\"100%\" ><param name=\"movie\" value=\""+nsName[0].src+"\"><param name=\"quality\" value=\"high\"><param name=\"wmode\" value=\"transparent\"><embed src=\""+nsName[0].src+"\" quality=\"high\" wmode=\"transparent\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" type=\"application/x-shockwave-flash\"  width=\""+w+"\"  height=\"100%\" ></embed></object></div>");
            }else{
                bigbBAd=jQuery("<div id=\"bigbannerad\" style=\" width:100%; height:0px; overflow:hidden; position:fixed; top:0px; z-index:200;background:#000;\"><a target=\"_blank\" href=\""+nsName[0].url+"\"><img border=\"0\" width=\"100%\" src=\""+nsName[0].src+"\"  style=\" display:block;\"></a></div>");
            }
            bigbSAd.css({"width":"100%","height":"0px","overflow":"hidden"});
            bigbBAd.css({"width":"100%","height":"0px","overflow":"hidden","position":"fixed","top":"0px","z-index":"200"});
            jQuery("body").append(bigbSAd);
            jQuery("body").append(bigbBAd);
            jQuery(bigbBAd).append(bigbBAdclose);
            bigbBAdclose.click(function(){
                topSlide_ad('bigbannerad',1,"up");
            });
            topSlide_ad('bigbannerad', nsName[0].timer);
            bigbBAdclose.show();
            self.timer['#bigbanner_ad'] = setTimeout(function () {
                self.float_ad(self.floatname);
            }, self.ns[name][0].timer);
        } else {
            self.float_ad(self.floatname);
        }
    },
    //背投l
    bgfl_ad: function (name) {
        var self = this;
        var nsName= new Array();
        if((self.ns[name] instanceof Array)){
            nsName=self.ns[name];
        }else{
            nsName=[self.ns[name]];
        }
        if (typeof(nsName[0])== 'object') {
            var bgflAd = jQuery("<div><a href='" + nsName[0].url + "' target='" + nsName[0].target + "' ></a></div>");
            bgflAd.attr("id",name+"_bgflad");
            bgflAd.css({"display": "block", "height": "1024px", "position": "absolute", "z-index": "1px", "overflow": "hidden", "top": "35px", "left": "0", "width": "100%", "background": "url(" + nsName[0].src + ") center 0 no-repeat"});
            if ((this.ns['syqzttBanner'] instanceof Array)) {bgflAd.css({"top": "110px"});}
            if ((this.ns['ltqzttBanner'] instanceof Array)) {bgflAd.css({"top": "110px"});}
            if ((this.ns['qzttBanner'] instanceof Array)) {bgflAd.css({"top": "110px"});}
            bgflAd.find("a").css({"display": "block", "height": "1024px", "width": "100%","z-index":"0"});
            jQuery("body").append(bgflAd);
            //self.createAdClose(bgflAd, 'top', function(){self.rip_ad();},"right");
        }
    },
    banner_ad: function () {
        var self = this;
    },
    //------------------------------------执行------------------------------------
    //执行
    init: function (name1,name2) {
        var self = this;
        if (navigator.appName == "Microsoft Internet Explorer") {
            var userAgent = navigator.userAgent;
            var s = 'MSIE';
            self.IE = parseFloat(userAgent.substr(userAgent.indexOf(s) + s.length));
        }
        self.floatname=name1 || "float";
        self.topname=name2 || "top";
        self.float_ad(self.floatname);
        self.createAdLink();
        jQuery(function(){
            self.createAdRoll();
        });
    },
    bbsinit: function (name1,name2) {
        var self = this;
        if (navigator.appName == "Microsoft Internet Explorer") {
            var userAgent = navigator.userAgent;
            var s = 'MSIE';
            self.IE = parseFloat(userAgent.substr(userAgent.indexOf(s) + s.length));
        }
        self.floatname=name1 || "fmtbbs";
        self.topname=name2 || "xtbbs";
        self.float_ad(self.floatname);
    },
    indexinit: function(name1,name2,name3) {
        var self = this;
        if (navigator.appName == "Microsoft Internet Explorer") {
            var userAgent = navigator.userAgent;
            var s = 'MSIE';
            self.IE = parseFloat(userAgent.substr(userAgent.indexOf(s) + s.length));
        }
        self.floatname=name1 || "fmtindex";
        self.topname=name2 || "xtindex";
        var name3=name3 || "topshowindex"
        self.bigbanner_ad(name3);
    }
}
var intervalId = null;
function topSlide_ad(id,nStayTime,sState,nMaxHth,nMinHth){
    var w = document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
    this.stayTime=nStayTime || 1;
    this.maxHeigth=nMaxHth || (w/1680)*200;
    this.minHeigth=nMinHth || 0;
    this.state=sState || "down" ;
    var obj = document.getElementById(id);
    jQuery(obj).find("object").attr("width",w+"px").attr("height",(w/1680)*200);
    jQuery(obj).find("embed").attr("width",w+"px").attr("height",(w/1680)*200);
    if(intervalId != null)window.clearInterval(intervalId);
    function openBox(){
        var h = parseInt(obj.style.height.split("px")[0]);
        var sd=15;
        if(this.state == "down"){
            if(h+sd>this.maxHeigth){
                h=this.maxHeigth-sd;
                jQuery("#"+id+" img").css("height",this.maxHeigth+"px");
                jQuery("#"+id+" object").attr("height",this.maxHeigth+"px");
                jQuery("#"+id+" embed").attr("height",this.maxHeigth+"px");
                window.clearInterval(intervalId);
                intervalId=window.setInterval(closeBox,this.stayTime);
            }
        }
        if(this.state == "up"){
            jQuery(".bigbanneradclose").hide();
            if (h<sd){
                h=sd;
                window.clearInterval(intervalId);
                obj.style.display="none";
            }
        }
        jQuery(".top_toolbar .fixed").css("top",((this.state == "down") ? (h+ sd) : (h- sd))+"px");
        jQuery(".all_headline").css("top",((this.state == "down") ? (h+ sd) : (h- sd))+"px");
        jQuery(".all_hd_full").css("top",((this.state == "down") ? (h+ sd) : (h- sd))+"px");
        jQuery("#"+id).css("height", ((this.state == "down") ? (h+ sd) : (h- sd))+"px");
        jQuery("."+id).css("height", ((this.state == "down") ? (h+ sd) : (h- sd))+"px");
    }
    function closeBox(){
        topSlide_ad(id,this.stayTime,"up",this.nMaxHth,this.nMinHth);
    }
    intervalId = window.setInterval(openBox,1);
}
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var Terminal = {
    platform:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1 ,
            iPad: u.indexOf('iPad') > -1,
            wp: u.indexOf('Windows Phone') > -1
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
};
newhanawa.fuzhi();