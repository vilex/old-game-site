package view.pages
{
	import ui.pages.Page_AUI;
	
	public class Page_A extends Page_AUI
	{
		public var moves:Object ;
		
		public function Page_A()
		{
			super();
			
			initConfig() ;
		}
		
		private function initConfig():void
		{
			moves = {
				A : {
					v : part_A ,
					s : {
						bottom : -307,
						right  : -373
					},
					e : {
						bottom : 5,
						right  : -40
					}
				},
				B : {
					v : part_B ,
					s : {
						top : -500
					},
					e : {
						top : 0
					}
				}
				
			} ;
		}
		
		
	}
}