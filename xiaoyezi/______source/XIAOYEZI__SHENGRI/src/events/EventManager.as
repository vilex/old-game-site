package manager
{
	import laya.events.EventDispatcher;
	import laya.utils.Handler;
	
	/**游戏内事件管理类**/
	public	class	EventManager	extends EventDispatcher
	{
		/**对象实例**/
		private	static	var	_instance:EventManager;
		
		public	function	EventManager()
		{
			super();
			return;
		}
		
		/**初始化**/
		private	static	function	init():void
		{
			if (_instance == null) 
			{
				_instance	= new EventManager();
			}
			
			return;
		}
		
		/**添加循环事件侦听**/
		public	static	function	on(event:String, caller:*, handler:Function, args:* = null):void
		{
			init();
			_instance.on(event, caller, handler, args);
			return;
		}
		
		/**添加单次事件侦听**/
		public	static	function	once(event:String, caller:*, handler:Function, args:*):void
		{
			init();
			_instance.once(event, caller, handler, args);
			return;
		}
		
		/**移除循环事件侦听**/
		public	static	function	off(event:String, caller:*, handler:Function, onlyOnce:Boolean=false):void
		{
			init();
			_instance.off(event, caller, handler, onlyOnce);
			return;
		}
		
		/**移除所有事件侦听**/
		public	static	function	offAll(event:String):void
		{
			init();
			_instance.offAll(event);
			return;
		}
		
		/**派发事件**/
		public	static	function	event(event:String, data:*=null):Boolean
		{
			init();
			return _instance.event(event, data);
		}
		
		/**返回是否存在侦听**/
		public	static	function	hasListener(event:String):Boolean
		{
			init();
			return _instance.hasListener(event);
		}
	}
}