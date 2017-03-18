/**Created by the LayaAirIDE,do not modify.*/
package ui.pages {
	import laya.ui.*;
	import laya.display.*; 

	public class Page_CUI extends View {

		public static var uiView:Object ={"type":"View","props":{"width":640,"height":1136},"child":[{"type":"Label","props":{"y":538,"x":299,"text":"Page_C","fontSize":30,"color":"#ffffff"}},{"type":"Image","props":{"y":10,"x":10,"top":0,"skin":"comp/true.jpg","right":0,"left":0,"bottom":0}}]};
		override protected function createChildren():void {
			super.createChildren();
			createView(uiView);
		}
	}
}