/**Created by the LayaAirIDE,do not modify.*/
package ui.pages {
	import laya.ui.*;
	import laya.display.*; 

	public class Page_DUI extends View {

		public static var uiView:Object ={"type":"View","props":{"width":640,"height":1136},"child":[{"type":"Label","props":{"y":548,"x":309,"text":"Page_D","fontSize":30,"color":"#ffffff"}},{"type":"Image","props":{"y":20,"x":20,"top":0,"skin":"comp/true.jpg","right":0,"left":0,"bottom":0}}]};
		override protected function createChildren():void {
			super.createChildren();
			createView(uiView);
		}
	}
}