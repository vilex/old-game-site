/* JS Document
 Version:	1.1
 Date:		2014/02/14
 Author:		XX
 Update:
 */
(function($){
    $.fn.backtop=function(){
        var $alBackBox=$(this);
        $("#backtop").click(function() {
            $("html, body").animate({ scrollTop: 0 }, 120);
        });
        var $alBackFunc = function() {
            //获取滚动条高度和浏览器宽度
            var st = $(document).scrollTop(), winh = $(window).height();
            //(st > 0)? $alBackBox.show(): $alBackBox.hide();
            //IE6下的定位
            if (!window.XMLHttpRequest) {
                $alBackBox.css("top", st + winh - 700);
            };
        };
        //为滚动事件绑定函数
        $(window).bind("scroll", $alBackFunc);
        $alBackFunc();
        $('.close_backtop').click(function(){
            $('.la_backtop').hide();
        })
    };
    $.fn.ranking=function(){
        var $ranking=$(this);
        var $rankingUlLi=$(this).find("ul li");
        $rankingUlLi.each(function(i,j){
            $(j).mouseover(function(){
                $rankingUlLi.removeClass("select");
                $(j).addClass("select");
                $(j).find("img").lazyLoadImg({blank:'catalog/views/default/public/images/blank.gif'});
            });
        });
    };
    $.fn.huanyihuan=function(){
        var i=0;
        var $huanyihuanMore=$(this).find(".tit .more");
        var $huanyihuanUL=$(this).find(".con ul");
        $huanyihuanMore.click(function(){
            i++;
            if(i==3)i=0;
            $huanyihuanUL.hide();
            $huanyihuanUL.eq(i).show();
            $huanyihuanUL.eq(i).find("img").lazyLoadImg({blank:'catalog/views/default/public/images/blank.gif'});
        });
    };
    $.fn.lazyLoadImg = function(setting){
        var defaults = {
            lazySrc:'data-original',	//存放实际图片的地址，用法：<img src="空白小图片的地址" imgsrc="实际图片地址" />
            blank:'catalog/views/default/public/images/blank.gif'	//透明小图片的默认地址
        }
        setting = $.extend({},defaults,setting);
        return this.each(function(i){
            if(!$(this).attr(setting.lazySrc)){
                return;
            }
            if($(this).attr("src")=='' || $(this).attr("src")==setting.blank){
                $(this).attr("src",$(this).attr(setting.lazySrc));
            }
        });
    }
    $.fn.tab = function(setting){
        var defaults = {
            menu : '.tab_menu',	//标签菜单
            menuList : 'li',	//菜单单元块
            current : 'select',//被选中的标签菜单块的样式名
            con : '.tab_main',	//被切换的容器名
            eq : 1,				//默认显示第几个标签页内容
            //timer : '3000',	//自动轮播间隔
            //isAuto : false	//是否自动轮播，默认关闭
            blank:'catalog/views/default/public/images/blank.gif', //默认空白图片地址
            mouseType : 'click' //默认鼠标控制标签方式有'click'和'mouseover'
        }
        setting = $.extend({},defaults,setting);
        return this.each(function(k){
            var $box = $(this);
            var $menu = $box.find(setting.menu+':first');
            var $con = $box.find(setting.con);
            var $li = $menu.find(setting.menuList);
            var index = setting.eq-1;
            $li.removeClass(setting.current).eq(index).addClass(setting.current);
            $con.hide().eq(index).show();
            $li.each(function(i,j){
                $(j).bind(setting.mouseType,function(){
                    $li.removeClass(setting.current).eq(i).addClass(setting.current);
                    $con.hide().eq(i).show();
                    $con.eq(i).find("img").lazyLoadImg({blank:setting.blank});
                });
            });
        });
    }
    $.fn.moregame = function(box,link){
       var obj = this;
        $(this).data("pagenum","1");
        $(this).click(function(){
            b=parseInt($(this).data("pagenum"))+1;
            $(this).data("pagenum",b);
            $(obj).html("加载中<img src='catalog/views/default/public/images/ajax-loader.gif'>");
            $.ajax({
                type: "GET",
                url: link,
                data: "ajax=1&page="+$(this).data("pagenum"),
                dataType:"html",
                success: function(data){
                    if(data=='' || data == 'empty'){
                        $(obj).html("亲，没有了");
                    }else{
                        $(box).append(data);
                        $(obj).html("加载更多游戏");
                    }

                },
                error:function(msg){
                    alert("出错了");
                }
            });
        });
        return $(this);
    }
})(jQuery);
function copyToClipboard(b, c) {
    var d = jq(b);
    d.select();
    try {
        if (therange = void 0, 1 == copytoclip && (d.createTextRange && (therange = d.createTextRange()), therange = therange ? therange : document, therange.execCommand("Copy"))) {
            !1 != c && alert("\u590d\u5236\u6210\u529f\u3002\u73b0\u5728\u60a8\u53ef\u4ee5\u7c98\u8d34\uff08Ctrl+v\uff09\u5230Blog \u6216BBS\u4e2d\u4e86\u3002");
            return
        }
    } catch (e) {}
    alert("\u60a8\u4f7f\u7528\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6b64\u590d\u5236\u529f\u80fd\uff0c\u8bf7\u4f7f\u7528Ctrl+C\u6216\u9f20\u6807\u53f3\u952e\u3002")
}











