#pragma strict

public var chaser:GameObject;
public var runner:GameObject;
private var chestPosition:Vector3;

public var chestCount:int = 5;

private var chestsFound:int = 0;

public var chests:Chest[];

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

function Start () {

	//generate chest position and spawn chest
	chestPosition = new Vector3(0, 0, 0);
	
	for(var i:int = 0; i < 4; i++)
		ChooseChests();
}

function Update () {

	//check if chaser has caught runner
	var distanceVector:Vector3 = runner.transform.position - chaser.transform.position;
	
	if(distanceVector.normalized.sqrMagnitude <= 0.1)
	{
		//chaser win
	}
	
	//check if runner has reached chest
	distanceVector = chestPosition - runner.transform.position;
	if(distanceVector.normalized.sqrMagnitude <= 0.1)
	{
		chestsFound++;
		
		//remove chest from array
	}
	
	if(chestsFound == chestCount)
	{
		//runner wins
	}
	
}