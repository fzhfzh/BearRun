#pragma strict

//var movespeed:float;
var target:GameObject;
var detectionRange:float = 20.0;
var nextWayPoint:WayPoint;
var runnerCamera:Camera;

private var motor : CharacterMotor;
private var lastSeenPosition : Vector3;

private var timeBeforeWandering : float;

private var targetInRange : boolean;
private var targetInView : boolean;

private var currentState : String;

private var chests:Chest[];

private var chestPositionSeen: Vector3[];

private var timeSinceBlackBearOutOfSight:float = 0;
private var timeSinceLookingAround:float = 0;


// Use this for initialization
function Awake () {
	motor = GetComponent(CharacterMotor);
}

function Start () {
	lastSeenPosition = this.transform.position;
	timeBeforeWandering = 0;
	
	chests = (GameObject.Find("GameLogic").GetComponent("WinLoseCondition") as WinLoseCondition).getChestLocations();
	//Debug.Log(chests[0].transform.position);
	
	currentState = "LOOK FOR CHEST";
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
	
	return toTargetVector.normalized;
}

private function determineState():void
{
	var blackBearPosition = target.transform.position;
	//is black bear in sight?
	var pointInViewport:Vector3 = runnerCamera.WorldToViewportPoint();
	if(pointInViewport.z > 0 && pointInViewport.x > 0 && pointInViewport.y > 0
	&& pointInViewport.x < 1 && pointInViewport.y < 1)
	{
		currentState = "ESCAPE";
	}
	else
	{
		currentState = "LOOK FOR CHEST";
	}
}

function Update () {
	
	determineState();
	
	var directionVector : Vector3;
	var toTargetVector : Vector3;
	
	
	if(currentState == "LOOK FOR CHEST")
	{		
		//if there is stored chest locations go to chest
		if(chestPositionSeen.length != 0)
		{
			directionVector = chestPositionSeen[0] - transform.position;	
		}
		else
		{
			directionVector = this.Patrol();
		}
	}
	else if(currentState == "ESCAPE")
	{
		directionVector = transform.position - target.transform.position;
	}




















/*

	//look at current conditions and change behavior accordingly
	var directionVector : Vector3;
	var toTargetVector : Vector3;
	
	toTargetVector = target.transform.position - this.transform.position;
	toTargetVector.y = 0;
	
	targetInRange = false;
	targetInView = false;
	//directionVector = this.Patrol();
	
	//is chaser in range?
	if(toTargetVector.sqrMagnitude <= (detectionRange * detectionRange)) //compare squared magnitude is faster
	{
		targetInRange = true;
	}
	
	//is chaser in view?
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
	}	
	else
	{
		//if not at last seen location yet, move to last seen location
		toTargetVector = lastSeenPosition - this.transform.position;
		toTargetVector.y = 0;
		
		if(toTargetVector.sqrMagnitude >= 1)
		{
			directionVector = toTargetVector.normalized;
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
			}
			//else start wandering around again
			else
			{
				currentState = "WANDERING";
				directionVector = this.Patrol();
			}
		}
	}
		
	//else move to last seen location
	
	//reached last seen location? start look around count down
	
	//count down ended? walk around randomly
	
	
	//change movement to current AI movement
	
	*/
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
	motor.inputMoveDirection = directionVector;
	
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/FPS Input Controller")