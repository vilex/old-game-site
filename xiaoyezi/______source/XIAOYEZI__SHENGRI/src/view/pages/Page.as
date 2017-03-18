package view.pages
{
	import laya.maths.Rectangle;
	import laya.ui.Image;
	import laya.ui.View;
	import laya.utils.Handler;
	import laya.utils.Tween;
	
	public class Page extends View
	{
		/**
		 * {
		 * 		v: 显示对象
		 * 	 	e: 正常显示状态时的属性
		 * 		l: 离开显示状态时的属性
		 * 		t: 动画持续时间
		 * 		p: 设置页面属性
		 * } 
		 */		
		public var anis:Object ;
		
		private var cacheTweens:Array = [] ;
		private var isTweenning:Boolean = false ;
		
		public function Page()
		{
			super();
			
			this.width  = LayaUISample.GWidth ;
			this.height = LayaUISample.GHeight ;
			this.viewport = new Rectangle(0,0,width,height) ;
		}
		
		public function initParams(pars:Object):void
		{
			for(var key:String in pars) 
			{
				this[key] = pars[key] ;
			}	
		}
		
		public function initChildren(pars:Object):void
		{
			this.anis = pars ;
			for(var a:String in pars)
			{
				this[a] = new Image() ;
				addChild( this[a] ) ;
				
				for(var b:String in pars[a].p)
				{
					this[a][b] = pars[a]["p"][b] ;
				}
			}
		}
		
		public function enter():void
		{
			for(var a:String in anis) 
			{
				//Tween.to( this[a] , anis[a].e , anis[a].t ) ;
				__move( this[a] , anis[a].e , anis[a].t ) ;
			}
			
		}
		
		public function leave():void
		{
			var t:Number = 0 ;
			for(var a:String in anis) 
			{	
				Tween.to( this[a] , anis[a].l , anis[a].t ) ;
			}
		}
		
		private function __move(v:Image,p:Object,t:int):void
		{
			if( isTweenning )
			{
				cacheTweens.push({v:v,p:p,t:t});
				return ;
			}
			Tween.to( v , p , t , null, Handler.create(this , onMoveOne )) ;
			isTweenning = true ;
		}
		
		private function onMoveOne():void
		{
			isTweenning = false ;
			if( cacheTweens.length)
			{
				var obj:Object = cacheTweens.shift() ;
				__move( obj.v , obj.p , obj.t ) ;
			}
		}
		
		//
		public function set bgcolor(v:String):void
		{
			this.graphics.clear() ;
			this.graphics.drawRect(0,0,width,height,v);
		}
		
		public function set bgimage(v:String):void
		{
			var img:Image = new Image() ;
			img.skin = v ;
			img.top = 0 ;
			img.bottom = 0 ;
			img.left = 0 ;
			img.right = 0 ;
			addChild( img ) ;
		}
	}
}