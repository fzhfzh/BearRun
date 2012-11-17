#pragma strict

public var grassTexture:Texture;
public var grassFootStep: AudioClip;
public var dirtFootStep: AudioClip;

private var timeBeforeUpdate:float = 0.5f;

function Start () {

}

function Update () {
	//var floorTexture:Texture = getTerrainTextureAt( transform.position );
	
	var surfaceIndex = TerrainSurface.GetMainTexture(transform.position);
	
	//Debug.Log(surfaceIndex);
	
	var isWalking:boolean = GameObject.Find("Player").GetComponent(FPSInputController).isWalking;
	
	var audio:AudioSource = new AudioSource();
	
	timeBeforeUpdate -= Time.deltaTime;
	
	if(timeBeforeUpdate <= 0)
	{
		timeBeforeUpdate = 0.5f;
		
		if(isWalking)
		{
			//index for grass texture
			if(surfaceIndex == 2)
			{
				timeBeforeUpdate = 0.7f;
		
				audio.PlayClipAtPoint(grassFootStep, transform.position);
			}
			else
			{
				timeBeforeUpdate = 0.5f;
		
				audio.PlayClipAtPoint(dirtFootStep, transform.position);
			}
		}
	}
}