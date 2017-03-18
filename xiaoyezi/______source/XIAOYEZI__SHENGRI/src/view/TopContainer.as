package view
{
	import laya.display.Sprite;
	import laya.events.Event;
	import laya.media.SoundManager;
	import laya.ui.Image;
	import laya.utils.Handler;
	import laya.utils.Tween;
	
	public class TopContainer extends Sprite
	{
		
		private var arrow:Image ;
		private var logoMusic:Image ;

		private var musicState:Boolean = false ;
		
		public function TopContainer()
		{
			super();
			
			initConfig() ;
			
			initUI() ;
			
			initListeners() ;
		}
		
		private function initConfig():void
		{
			this.width = LayaUISample.GWidth ;
			this.height = LayaUISample.GHeight ;
		}
		
		private function initUI():void
		{
			arrow = new Image() ;
			arrow.skin = "comp/arrow.png";
			arrow.centerX = 0;
			arrow.bottom = 30 ;
			addChild( arrow ) ;
			
			logoMusic = new Image() ;
			logoMusic.skin = "comp/musicLogo.png" ;
			logoMusic.top = 20 ;
			logoMusic.right = 20 ;
			logoMusic.pivotX = 22 ;
			logoMusic.pivotY = 22 ;
			addChild( logoMusic ) ;
			
			loopArrow() ;
			onArrowHandler() ;
		}
		
		private function initListeners():void
		{
			logoMusic.on( Event.CLICK , this , onArrowHandler ) ;
		}
		
		private function onArrowHandler():void
		{
			if( musicState )
			{
				clearTimer( this , loopHandler ) ;
				musicState = false ;
				SoundManager.stopMusic() ;
			}
			else
			{
				musicState = true ;
				frameLoop( 1, this , loopHandler ) ;
				SoundManager.playMusic("res/sound/zjl_youdiantian.mp3") ;
			}
		}
		
		private function loopHandler():void
		{
			logoMusic.rotation += 10 ;
		}
		
		private function loopArrow():void
		{
			arrow.bottom = 30 ;
			arrow.alpha = 1 ;
			Tween.to( arrow , { bottom : 60 , alpha : 0} , 600 , null , Handler.create( this , loopArrow ) ) ;
		}
	}
}