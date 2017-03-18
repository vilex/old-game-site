/**Created by the LayaAirIDE,do not modify.*/
package ui.pages {
	import laya.ui.*;
	import laya.display.*; 

	public class Page_AUI extends View {
		public var part_A:Image;
		public var part_B:Image;

		public static var uiView:Object ={"type":"View","props":{"width":640,"height":1136},"child":[{"type":"Label","props":{"y":518,"x":279,"text":"Page_A","fontSize":30,"color":"#ffffff"}},{"type":"Image","props":{"var":"part_A","skin":"comp/2716233525258563474.png","right":-373,"bottom":-307}},{"type":"Image","props":{"var":"part_B","top":-500,"skin":"comp/4c907f4c25cafac9b8e8ecf0ca163343.png","centerX":0}},{"type":"Image","props":{"top":0,"skin":"comp/true.jpg","right":0,"left":0,"bottom":0}}]};
		override protected function createChildren():void {
			super.createChildren();
			createView(uiView);
		}
	}
}