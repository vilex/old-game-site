package view.pages
{
	import laya.utils.Tween;

	public class PageManager
	{
		public static function hidePart(data:Object,maxTime:int):void
		{	
			for(var key:* in data) 
			{
				Tween.to( data[key]['v'] , data[key]["s"] , Math.floor(Math.random() * maxTime) ) ;
			}
			
		}
		
		public static function showPart(data:Object,maxTime:int):void
		{
			for(var key:* in data)
			{
				Tween.to( data[key]['v'] , data[key]["e"] , Math.floor(Math.random() * maxTime) ) ;
			}
		}
		
	}
}