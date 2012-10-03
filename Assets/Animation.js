#pragma strict

function Start () {
    this.animation["crossHand"].speed = 0.5f;
    this.animation["sideStep"].speed = 0.5f;
    this.animation["cowboy"].speed = 0.5f;
}

function Update () {
    if (Input.GetKeyDown(KeyCode.Alpha1)) { 
        this.animation["crossHand"].enabled = true;
    	this.animation["sideStep"].enabled = false;
   		this.animation["cowboy"].enabled = false;
           
        this.animation["crossHand"].time = 0;   
        this.animation.Sample();
        this.animation.Stop();     
        this.animation.Play("crossHand");
    }
    
    else if (Input.GetKeyDown(KeyCode.Alpha2)) {    
        this.animation["crossHand"].enabled = false;
    	this.animation["sideStep"].enabled = true;
   		this.animation["cowboy"].enabled = false;   
   		
   		this.animation["sideStep"].time = 0;
   		this.animation.Sample();
   		this.animation.Stop();
        this.animation.Play("sideStep");
    }
    
    
    else if (Input.GetKeyDown(KeyCode.Alpha3)) {     
    	this.animation["crossHand"].enabled = false;
    	this.animation["sideStep"].enabled = false;
   		this.animation["cowboy"].enabled = true; 
        
        this.animation["cowboy"].time = 0;
        this.animation.Sample();
        this.animation.Stop();
        this.animation.Play("cowboy");
    }
}