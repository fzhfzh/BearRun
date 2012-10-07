#pragma strict

function OnGUI () {
	if (GUI.Button (Rect (Screen.width/2 - 100,Screen.height/2 + 100,200,50), "Start Game")) {
		Application.LoadLevel(1);
	}
}
