#pragma strict

function Start () {

}

function Update () {
			var distanceVector:Vector3 = this.transform.position - GameObject.Find("Player").transform.position;
			distanceVector.y = 0;
			
			if(distanceVector.sqrMagnitude <= 5)
			{
				this.active = false;
			}
}