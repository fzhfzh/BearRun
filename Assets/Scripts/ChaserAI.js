#pragma strict

//var movespeed:float;
var target:GameObject;
var detectionRange:float = 20.0;
var nextWayPoint:WayPoint;


private var motor : CharacterMotor;
private var lastSeenPosition : Vector3;

private var timeBeforeWandering : float;

private var targetInRange : boolean;
private var targetInView : boolean;

private var currentState : String;

private var destinationPoint: Vector3;

public var allWayPoints : WayPoint[];

public var staticAudio: AudioClip;

public class pair implements System.IComparable
{
	public var distanceFromTarget:float;
	public var wayPointIndex:int;
	
	public function pair(index:int, distance:float)
	{
		wayPointIndex = index;
		distanceFromTarget = distance;
	}
	
	function CompareTo(obj: Object) : int { 

        var other :pair = obj; // Typecast to own class 

        return distanceFromTarget.CompareTo(other.distanceFromTarget); 

    }
};

public function EmergencyTeleport()
{
	//var wayPointSortArray : pair[] = new pair[allWayPoints.length];
	
	var wayPointSortArray:Array = new Array();
	
	for(var i:int = 0; i < allWayPoints.length; i++)
	{
		var distanceVector:Vector3 = allWayPoints[i].transform.position - target.transform.position;
		var distance:float = distanceVector.sqrMagnitude;
		
		wayPointSortArray.Add(new pair(i, distance));
		//wayPointSortArray[i] = new pair(i, distance);
	}
	
	//sort array
	wayPointSortArray.Sort();
	
	//target the closest waypoint
	nextWayPoint = allWayPoints[(wayPointSortArray[0] as pair).wayPointIndex];
	
	//for(var i:int = 0; i < allWayPoints.length; i++)
	//{
	//}
}

// Use this for initialization
function Awake () {
	motor = GetComponent(CharacterMotor);
}

function Start () {
	lastSeenPosition = this.transform.position;
	timeBeforeWandering = 0;
}

//function that patrols the map using a waypoint system
//and returns the direction vector to move per frame
private function Patrol() : Vector3
{
	var toTargetVector:Vector3 = nextWayPoint.transform.position - this.transform.position;
	toTargetVector.y = 0;

	//if arrived, move to next waypoint
	if(toTargetVector.sqrMagnitude < 1)
	{
		nextWayPoint = nextWayPoint.GetNextWayPoint();
	}
	
	return nextWayPoint.transform.position;
}

function Update () {
	//look at current conditions and change behavior accordingly
	var directionVector : Vector3;
	var toTargetVector : Vector3;
	
	toTargetVector = target.transform.position - this.transform.position;
	toTargetVector.y = 0;
	
	targetInRange = false;
	targetInView = false;
	//directionVector = this.Patrol();
	
	//is runner in range?
	if(toTargetVector.sqrMagnitude <= (detectionRange * detectionRange)) //compare squared magnitude is faster
	{
		targetInRange = true;
		(GameObject.Find("Main Camera").GetComponent(NoiseEffect) as NoiseEffect).enabled = true;
		AudioSource.PlayClipAtPoint(staticAudio, transform.position);
	}
	
	var distanceToTarget:float = toTargetVector.sqrMagnitude;
	
	//fuzzy logic to determine movespeed
	var veryFarIndex:float;
	var farIndex:float;
	var mediumIndex:float;
	var shortIndex:float;
	
	if(distanceToTarget >= 800)
	{
		this.GetComponent(NavMeshAgent).speed = 10.0;
		(GameObject.Find("Main Camera").GetComponent(NoiseEffect) as NoiseEffect).enabled = false;
	}
	else
	{
		
		this.GetComponent(NavMeshAgent).speed = 3.5;
	}
	
	//is runner in view?
	if(targetInRange)
	{
		//check if in view
		targetInView = true;
	}
		
	if(targetInView)
	{
		//updates target position and move towards target position
		lastSeenPosition = target.transform.position;
		directionVector = toTargetVector.normalized;
		currentState = "CHASING";
		
		//reset wandering count down as well
		timeBeforeWandering = 5.0f;
		
		//for now just a straight movement vector to target, with obstacles, A* will be used
		destinationPoint = target.transform.position;
	}	
	else
	{
		//if not at last seen location yet, move to last seen location
		toTargetVector = lastSeenPosition - this.transform.position;
		toTargetVector.y = 0;
		
		if(toTargetVector.sqrMagnitude >= 1)
		{
			directionVector = toTargetVector.normalized;
			destinationPoint = lastSeenPosition;
			currentState = "CHASING";
		}
		else
		{
			//changing last seen position to current position to prevent going back to previous position when wandering
			lastSeenPosition = this.transform.position;
			//else start looking around, or start wandering if looked around long enough
			//count down timer
			timeBeforeWandering -= Time.deltaTime;
			
			//if wandering timer not yet reached, remain at spot and look around
			if(timeBeforeWandering > 0)
			{
				currentState = "LOOKING AROUND";
				//look around
				var angleToTurn:float = timeBeforeWandering / Mathf.PI;
				directionVector = new Vector3(Mathf.Sin(angleToTurn), 0, Mathf.Cos(angleToTurn));
				directionVector = directionVector.normalized;
				destinationPoint = this.transform.position;
			}
			//else start wandering around again
			else
			{
				currentState = "WANDERING";
				destinationPoint = this.Patrol();
			}
		}
	}
		
	//else move to last seen location
	
	//reached last seen location? start look around count down
	
	//count down ended? walk around randomly
	
	
	//change movement to current AI movement
	
	
	if (directionVector != Vector3.zero) {
		// Get the length of the directon vector and then normalize it
		// Dividing by the length is cheaper than normalizing when we already have the length anyway
		var directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;
		
		// Make sure the length is no bigger than 1
		directionLength = Mathf.Min(1, directionLength);
		
		// Make the input vector more sensitive towards the extremes and less sensitive in the middle
		// This makes it easier to control slow speeds when using analog sticks
		directionLength = directionLength * directionLength;
		
		// Multiply the normalized direction vector by the modified length
		directionVector = directionVector * directionLength;
	}
	
	//Debug.Log("To Vector = " + directionVector);
	//move it
	this.GetComponent(NavMeshAgent).destination = destinationPoint;
	//motor.inputMoveDirection = directionVector;
	
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")