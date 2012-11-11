#pragma strict

public var chaser:GameObject;
public var runner:GameObject;
private var chestPosition:Vector3;

public var chestCount:int = 4;

private var chestsFound:int = 0;

public var chests:Chest[];
public var gotChest: AudioClip;

//chooses a chest randomly from the pool available
private function ChooseChests():void
{

	var candidateNo:int = Random.Range(0, chests.Length - 1);
	//Debug.Log(candidateNo);
	//if already activated, choose another one
	if(chests[candidateNo].active)
	{
		ChooseChests();
	}
	else
	{
		chests[candidateNo].active = true;
	}
	
}

public function getChestLocations():Chest[]
{
	return chests;
}

function Start () {

	Screen.showCursor = false;
	//generate chest position and spawn chest
	chestPosition = new Vector3(0, 0, 0);
	
	for(var i:int = 0; i < chestCount; i++)
		ChooseChests();
}

function Update () {

	var chestsLeftToFind = chestCount - 1 - chestsFound;
	
	(GameObject.Find("PiecesLeftText").GetComponent(GUIText) as GUIText).text = "Pieces Left To Find: " + chestsLeftToFind;

	//check if runner is almost winning
	if(chestsFound == chestCount - 2)
	{
		chaser.GetComponent(ChaserAI).EmergencyTeleport();
	}


	//check if chaser has caught runner
	var distanceVector:Vector3 = runner.transform.position - chaser.transform.position;
	distanceVector.y = 0;
	
	Debug.Log(distanceVector.sqrMagnitude);
	if(distanceVector.sqrMagnitude <= 1)
	{
		Application.LoadLevel(3);
		//chaser win
	}
	
	//check if runner has reached chest
	for(var i:int = 0; i < chests.Length; i++)
	{
		if(chests[i].active)
		{
			distanceVector = chests[i].transform.position - runner.transform.position;
			distanceVector.y = 0;
			
			if(distanceVector.sqrMagnitude <= 5)
			{
				AudioSource.PlayClipAtPoint(gotChest, runner.transform.position);
				chestsFound++;		
				//remove chest
				chests[i].active = false;	
			}
		}
	}
	//Debug.Log(chestsFound);
	
	if(chestsFound >= (chestCount - 1))
	{
		//runner wins
		Application.LoadLevel(2);
	}
	
}