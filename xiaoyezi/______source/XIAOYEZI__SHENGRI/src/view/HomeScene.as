package view
{
	import consts.Const;
	
	import laya.display.Sprite;
	import laya.net.Loader;
	import laya.ui.View;
	import laya.utils.Tween;
	
	import manager.EventManager;
	
	import view.pages.Page;
	import view.pages.PageManager;
	
	public class HomeScene extends Sprite
	{
		private var pages:Array = [] ;
		private var pageIndex:int = 0 ;
		
		private var lock:Boolean = false ; 
		private var pageContainer:Sprite ;
		public function HomeScene()
		{
			super();
			
			initConfig();
			
			initUI() ;
			
			initListeners() ;
		}
		
		private function initConfig():void
		{
			this.width = LayaUISample.GWidth ;
			this.height = LayaUISample.GHeight ;
			
			pageIndex = 0 ;
		}
		
		private function initUI():void
		{
			pageContainer = new Sprite() ;
			pageContainer.width = width ;
			pageContainer.height = height ;
			addChild( pageContainer ) ;
			
			var pages_data:Object = Loader.getRes('config/pages.json') ;
			console.log(pages_data);
			var page:Page ;
			
			var index:int = 0 ;
			for each (var obj:Object in pages_data) 
			{
				page = new Page() ;
				page.y = index++ * height;
				pageContainer.addChild( page ) ;
				page.initParams( obj.p ) ;
				page.initChildren( obj.v ) ;
				pages.push( page ) ;
			}
			
			Laya.timer.once( 600 , this , function():void{
				(pages[0] as Page).enter() ;
			} ) ;
		}
		
		private function initListeners():void
		{
			EventManager.on(Const.MOVE_UP_STAGE , this, onMoveUp) ;
			EventManager.on(Const.MOVE_DOWN_STAGE , this, onMoveDown) ;
		}
		
		
		
		private function onMoveUp():void
		{
			if( lock )
			{
				return ;
			}
			if(pageIndex == pages.length - 1)
			{
				return ;
			}
			pageIndex++ ;
			resetPages(-1) ;
			lock = true ;
		}
		
		private function onMoveDown():void
		{
			if( lock )
			{
				return ;
			}
			if(pageIndex == 0)
			{
				return ;
			}
			pageIndex-- ;
			resetPages(1) ;
			lock = true ;
		}
		
		private function resetPages(direction:int):void
		{
			var lastIndex:int = pageIndex + direction ;
			var page:Page = pages[lastIndex] ;
			page.leave() ; 
			Laya.timer.once( 200 , this , onHideLastPagePart , [direction]) ;
		}
		
		private function onHideLastPagePart(direction:int):void
		{
			Tween.to( pageContainer , { y: pageContainer.y + direction * height } , 600 ) ;
			Laya.timer.once( 600 , this , onChangePageFinished ) ;
		}
		
		private function onChangePageFinished():void
		{
			var page:Page = pages[pageIndex];
//			PageManager.showPart( page['moves'] , 400 ) ;
			page.enter() ;
			Laya.timer.once( 400 , this ,onShowPagePart ) ;
		}
		
		private function onShowPagePart():void
		{
			lock = false ;	
		}
	}
}