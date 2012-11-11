#pragma strict

function Start () {

}

function Update () {

}

function OnMouseOver () {
    GameObject.Find("PlayButton_OnExit").guiTexture.enabled = false;
    GameObject.Find("PlayButton_OnFocus").guiTexture.enabled = true;
}

function OnMouseDown () {
    Application.LoadLevel (1);
}

function OnMouseExit () {
	GameObject.Find("PlayButton_OnExit").guiTexture.enabled = true;
	GameObject.Find("PlayButton_OnFocus").guiTexture.enabled = false;
}