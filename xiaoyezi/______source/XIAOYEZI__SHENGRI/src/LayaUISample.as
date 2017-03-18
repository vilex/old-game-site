package {
	import consts.Const;
	
	import events.__setupStageEvents;
	
	import laya.display.Stage;
	import laya.media.SoundManager;
	import laya.net.Loader;
	import laya.ui.Label;
	import laya.utils.Browser;
	import laya.utils.Handler;
	
	import manager.EventManager;
	
	import view.HomeScene;
	import view.TestView;
	import view.TopContainer;
	
	public class LayaUISample {
		
		public static var GWidth:Number ;
		public static var GHeight:Number ;
		
		private var loadingText:Label ;
		public function LayaUISample() {
			
			LayaUISample.GWidth = Browser.width ;
			LayaUISample.GHeight = Browser.height ;
			
			if( LayaUISample.GWidth > LayaUISample.GHeight )
			{
				LayaUISample.GWidth = LayaUISample.GHeight ;
				LayaUISample.GHeight = Browser.width ;
			}
			//初始化引擎
			Laya.init(LayaUISample.GWidth, LayaUISample.GHeight);
			
			Laya.stage.bgColor = "#000000" ;
			Laya.stage.screenMode	= Stage.SCREEN_VERTICAL;
			
			SoundManager.playMusic("res/sound/zjl_youdiantian.mp3") ;
			
			var __res:Array = [
				{url: "res/atlas/comp.json", type: Loader.ATLAS},
				{url: "config/pages.json", type: Loader.JSON}
			] ;
			
			loadingText = new Label() ;
			loadingText.width = LayaUISample.GWidth ;
			loadingText.height = 60 ;
			loadingText.centerX = 0 ;
			loadingText.centerY = 0 ;
			loadingText.fontSize = 40 ;
			loadingText.color = "#FFFFFF" ;
			loadingText.align = "center" ;
			Laya.stage.addChild(loadingText) ;
			loadingText.text = 'loading......' ;
			//加载引擎需要的资源
			Laya.loader.load(__res, Handler.create(this, onLoaded));
		}
		
		private function onLoaded():void {
			
			loadingText.removeSelf() ;
			loadingText.destroy() ;
			
			__setupStageEvents.init() ;
			
			Laya.stage.addChild( new HomeScene ) ;
			Laya.stage.addChild( new TopContainer ) ;
			//实例UI界面
			//var testView:TestView = new TestView();
			//Laya.stage.addChild(testView);
		}
	}
}