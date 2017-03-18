package events
{
	import consts.Const;
	
	import laya.events.Event;
	
	import manager.EventManager;

	public class __setupStageEvents
	{
		private static var __event_distance:int = 50 ;
		private static var __lastX:Number ;
		private static var __lastY:Number ;
		public static function init():void
		{
			Laya.stage.on( Event.MOUSE_DOWN , __setupStageEvents , __setupStageEvents.onMouseDown ) ;
			Laya.stage.on( Event.MOUSE_UP , __setupStageEvents , __setupStageEvents.onMouseUp ) ;
		}
		
		public static function onMouseDown(evt:Event):void
		{
			__lastX = evt.stageX ;
			__lastY = evt.stageY ;
		}
		
		public static function onMouseUp(evt:Event):void
		{
			if(Math.abs(evt.stageX - __lastX) - Math.abs(evt.stageY - __lastY) > 0)
			{
				if(Math.abs(evt.stageX - __lastX) > __event_distance)
				{
					if(evt.stageX < __lastX)
					{
						// 向左滑
						EventManager.event( Const.MOVE_LEFT_STAGE ) ;
					}
					else
					{
						// 向右滑
						EventManager.event( Const.MOVE_RIGHT_STAGE ) ;
					}
				}
				else
				{
					// 点击
					EventManager.event( Const.CLICK_STAGE ) ;
				}
			}
			else
			{
				if(Math.abs(evt.stageY - __lastY) > __event_distance)
				{
					// 上下滑动
					if(evt.stageY < __lastY)
					{
						// 向上滑
						EventManager.event( Const.MOVE_UP_STAGE ) ;
					}
					else
					{
						// 向下滑
						EventManager.event( Const.MOVE_DOWN_STAGE ) ;
					}
				}
				else
				{
					// 点击
					EventManager.event( Const.CLICK_STAGE ) ;
				}
			}
		}
	}
}