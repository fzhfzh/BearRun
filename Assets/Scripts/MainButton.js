#pragma strict

function Start () {
	
}

function Update () {

}

function OnMouseOver () {
    GameObject.Find("Main_OnExit").guiTexture.enabled = false;
    GameObject.Find("Main_OnFocus").guiTexture.enabled = true;
}

function OnMouseDown () {
    Application.LoadLevel (1);
}

function OnMouseExit () {
	GameObject.Find("Main_OnExit").guiTexture.enabled = true;
	GameObject.Find("Main_OnFocus").guiTexture.enabled = false;
}