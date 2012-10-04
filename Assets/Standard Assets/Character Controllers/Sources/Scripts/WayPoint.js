#pragma strict

public var connectedWayPoints:WayPoint[];

function Start () {

}

function Update () {

}

function GetNextWayPoint():WayPoint
{
	//if no connected waypoint, which should not be, it will return null
	if(connectedWayPoints == null)
		return null;
		
	
	var size:int = connectedWayPoints.Length;

	//choose a random next waypoint to traverse to
	var choice:int = Random.Range(0, size - 1);
	
	
	return connectedWayPoints[choice];
}