#pragma strict

public var background:Texture;
function OnGUI () {
	GUI.DrawTexture(Rect (0,0,Screen.width,Screen.height), background);


	if (GUI.Button (Rect (Screen.width/2 - 100,Screen.height/2 + 100,200,50), "Back to Menu")) {
		Application.LoadLevel(0);
	}
}
