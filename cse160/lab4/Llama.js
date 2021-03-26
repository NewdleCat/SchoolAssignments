var hipShift = 0;
var TorsoAngle = 0;
var NeckAngle = 0;
var HeadAngle = 0;
var LegAngle = 0;
var Arm1Angle = 0;
var Arm2Angle = 0;
var Hand1Angle = 0;
var Hand2Angle = 0;

var BuildingNeckAngle = 0;
var BuildingHeadAngle = 0;

var stickColor = [1, 1, 1, 1];
var mainBodyColor = [.9, .9, .9, 1];
var otherFaceColors = [.6, .6, .6, 1];
var eyeColor = [.2, .2, .2, 1];

var GlobalAngleOffset = 0;

class Llama
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
		this.angle = 0;
		this.textureNumber = -2; 
	}

	render()
	{
	  //--------TORSO--------------------------------------
	  var hip = new Cube();
	  hip.rgba = mainBodyColor;
	  hip.matrix.setTranslate(this.x - 16, -.5, this.y - 16);
	  hip.matrix.rotate(this.angle + GlobalAngleOffset, 0, 1,0)
	  var legHipMat = new Matrix4(hip.matrix)
	  hip.matrix.rotate(-hipShift, 0, 0, 1)
	  var hipCoordMat = new Matrix4(hip.matrix)
	  hip.matrix.scale(.4, .3, .35)
	  hip.matrix.translate(-.51, 0, 0)
	  hip.render();

	  var torso = new Cube();
	  torso.textureNum = this.textureNumber;
	  torso.matrix = hipCoordMat;
	  torso.rgba = mainBodyColor;
	  torso.matrix.translate(0, .25, 0);
	  torso.matrix.rotate(-TorsoAngle, 0, 0, 1);
	  var yellowCoordMat = new Matrix4(torso.matrix);
	  var armCoordMat1 = new Matrix4(torso.matrix);
	  var armCoordMat2 = new Matrix4(torso.matrix);
	  torso.matrix.scale(.35, .6, .3);
	  torso.matrix.translate(-.52, -.2, .1);
	  torso.render();

	 //----------NECK------------------------------
	  var neck = new Cube();
	  neck.matrix = yellowCoordMat;
	  neck.rgba = mainBodyColor;
	  neck.matrix.translate(0, .65, 0);
	  neck.matrix.rotate(-NeckAngle, 0, 0, 1);
	  var pinkCoordMat = new Matrix4(neck.matrix);
	  neck.matrix.scale(.25, .4, .25);
	  neck.matrix.translate(-.55, -.5, .15);
	  neck.render();

	  var head = new Cube();
	  head.matrix = pinkCoordMat;
	  head.rgba = mainBodyColor;
	  head.matrix.translate(0, .15, .04);
	  head.matrix.rotate(-HeadAngle, 0, 0, 1);
	  head.matrix.scale(.24, .35, .24)
	  head.matrix.translate(-.55, 0, 0);
	  head.render();
	 // ---------------------------------------------
	 //--------LEGS----------------------------------
	  
	  var leg1 = new Cube();
	  leg1.rgba = mainBodyColor;
	  leg1.matrix = new Matrix4(legHipMat)
	  leg1.matrix.translate(-.1, .1, 0);
	  leg1.matrix.rotate(-LegAngle, 0, 0, 1);
	  leg1.matrix.scale(.15, -.4, .2)
	  leg1.matrix.translate(-.55, 0, .4);
	  leg1.render();

	  var leg2 = new Cube();
	  leg2.rgba = mainBodyColor;
	  leg2.matrix = new Matrix4(legHipMat)
	  leg2.matrix.translate(.1, .1, 0);
	  leg2.matrix.rotate(-LegAngle, 0, 0, 1);
	  leg2.matrix.scale(.15, -.4, .2)
	  leg2.matrix.translate(-.55, 0, .4);
	  leg2.render();
	 // -------------------------------------------
	 // --------ARMS-----------------------------

	  //Arm1
	  var shoulder1 = new Cube();
	  shoulder1.matrix = armCoordMat1;
	  shoulder1.rgba = mainBodyColor;
	  shoulder1.matrix.translate(0, .2, .1);
	  var shoulder1CoordMat = new Matrix4(shoulder1.matrix);
	  shoulder1.matrix.scale(.2, .2, .2);
	  shoulder1.render();

	  var arm1 = new Cube();
	  arm1.matrix = shoulder1CoordMat;
	  arm1.rgba = mainBodyColor;
	  arm1.matrix.translate(.15, -.05, 0);
	  arm1.matrix.rotate(Arm1Angle, 0, 0, 1)
	  var arm1CoordMat = new Matrix4(arm1.matrix);
	  arm1.matrix.scale(.4, .2, .2);
	  arm1.render();

	  var hand1 = new Cube();
	  hand1.matrix = arm1CoordMat;
	  hand1.rgba = mainBodyColor;
	  hand1.matrix.translate(.4, 0, 0);
	  hand1.matrix.rotate(Hand1Angle, 0, 0 ,1);
	  hand1.matrix.scale(.28, .18, .18);
	  hand1.render();

	  var hoof1 = new Cube();
	  hoof1.matrix = new Matrix4(hand1.matrix);
	  hoof1.rgba = otherFaceColors
	  hoof1.matrix.translate(1, 0, 0);
	  hoof1.matrix.scale(.1, 1 ,1);
	  hoof1.render();

	  var stick1 = new Cube();
	  stick1.matrix = new Matrix4(hand1.matrix);
	  stick1.rgba = stickColor
	  stick1.matrix.translate(1, .25, .25);
	  stick1.matrix.scale(1, .5 ,.5);




	  //Arm2
	  var shoulder2 = new Cube();
	  shoulder2.matrix = armCoordMat2;
	  shoulder2.rgba = mainBodyColor;
	  shoulder2.matrix.translate(0, .2, .05);
	  shoulder2.matrix.scale(-1, 1, 1)
	  var shoulder2CoordMat = new Matrix4(shoulder2.matrix);
	  shoulder2.matrix.scale(.2, .2, .2);
	  shoulder2.render();

	  var arm2 = new Cube();
	  arm2.matrix = shoulder2CoordMat;
	  arm2.rgba = mainBodyColor;
	  arm2.matrix.translate(.15, -.05, 0);
	  arm2.matrix.rotate(Arm2Angle, 0, 0, 1)
	  var arm2CoordMat = new Matrix4(arm2.matrix);
	  arm2.matrix.scale(.4, .2, .2)
	  arm2.render();

	  var hand2 = new Cube();
	  hand2.matrix = arm2CoordMat;
	  hand2.rgba = mainBodyColor;
	  hand2.matrix.translate(.4, 0 ,0);
	  hand2.matrix.rotate(Hand2Angle, 0, 0 ,1);
	  hand2.matrix.scale(.28, .18, .18);
	  hand2.render();

	  var hoof2 = new Cube();
	  hoof2.matrix = new Matrix4(hand2.matrix);
	  hoof2.rgba = otherFaceColors
	  hoof2.matrix.translate(1, 0, 0);
	  hoof2.matrix.scale(.1, 1 ,1);
	  hoof2.render();

	  var stick2 = new Cube();
	  stick2.matrix = new Matrix4(hand2.matrix);
	  stick2.rgba = stickColor
	  stick2.matrix.translate(1, .25, .25);
	  stick2.matrix.scale(1, .5 ,.5);

	 // ---------------Facial Features---------------------------

	  var eye1 = new Cube();
	  eye1.matrix = new Matrix4(head.matrix);
	  eye1.rgba = eyeColor;
	  eye1.matrix.scale(.2, .2, .2)
	  eye1.matrix.translate(3.5, 3, -.3)
	  eye1.render();

	  var eye2 = new Cube();
	  eye2.matrix = new Matrix4(eye1.matrix);
	  eye2.rgba = eyeColor;
	  eye2.matrix.scale(-1, 1, 1)
	  eye2.matrix.translate(2, 0, 0)
	  eye2.render();


	  var nose = new Cube();
	  nose.matrix = new Matrix4(head.matrix);
	  nose.rgba = mainBodyColor;
	  nose.matrix.scale(.8, .4, .7);
	  nose.matrix.translate(.1, .4, -.7);
	  nose.render();



	  var mouth = new Cube();
	  mouth.matrix = new Matrix4(nose.matrix);
	  mouth.rgba = otherFaceColors;
	  // mouth.rgba = [1, 0, 0, 1];
	  mouth.matrix.scale(1.2, .3, .2);
	  mouth.matrix.translate(-.1, .4, -.1)
	  mouth.render();

	  var nostril1 = new Cube();
	  nostril1.matrix = new Matrix4(nose.matrix);
	  nostril1.rgba = otherFaceColors;
	  nostril1.matrix.scale(.3, .3, .2);
	  nostril1.matrix.translate(2, 1.6, -.1)
	  nostril1.render();

	  var nostril2 = new Cube();
	  nostril2.matrix = new Matrix4(nostril1.matrix);
	  nostril2.rgba = otherFaceColors;
	  nostril2.matrix.scale(-1, 1, 1);
	  nostril2.matrix.translate(.8, 0, 0)
	  nostril2.render();

	  var ear1 = new Cube();
	  ear1.matrix = new Matrix4(head.matrix);
	  ear1.rgba = mainBodyColor;
	  ear1.matrix.translate(.7, 1, .4)
	  ear1.matrix.scale(.3, .4, .2)
	  ear1.render();

	  var ear2 = new Cube();
	  ear2.matrix = new Matrix4(ear1.matrix);
	  ear2.rgba = mainBodyColor;
	  ear2.matrix.translate(-1.2, 0, 0)
	  ear2.matrix.scale(-1, 1, 1)
	  ear2.render();

	 
	  if (PartyMode)
	  {
	    stick1.render();
	    stick2.render();
	  }
	}
}

class LlamaHead
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
		this.height = 0;
		this.temp = false;
		this.angle = 0;
		this.faceColors = [0, 0, 0, 1]
	}

	render()
	{

		// console.log('fuckyou')
		 //----------NECK------------------------------
		var neck = new Cube();
		neck.textureNum = 1
		neck.rgba = mainBodyColor;
		neck.matrix.translate(this.x - 20, this.height - 1, this.y - 20);
		neck.matrix.rotate(this.angle, 0, 1, 0);
		neck.matrix.rotate(-BuildingNeckAngle, 0, 0, 1);
		neck.matrix.scale(4, 8, 4);
		var pinkCoordMat = new Matrix4(neck.matrix);
		neck.matrix.translate(-.55, -.5, .15);
		neck.render();

		var head = new Cube();
		head.textureNum = 1
		head.matrix = pinkCoordMat;
		head.rgba = mainBodyColor;
		head.matrix.translate(0, .5, .04);
		head.matrix.rotate(-BuildingHeadAngle, 0, 0, 1);
		head.matrix.scale(1, 1, 1)
		head.matrix.translate(-.55, -.1, .1);
		head.render();
		// ---------------------------------------------


		// ---------------Facial Features---------------------------

		var eye1 = new Cube();
		eye1.rgba = this.faceColors;
		eye1.matrix = new Matrix4(head.matrix);
		eye1.matrix.scale(.2, .2, .2)
		eye1.matrix.translate(3.5, 3, -.3)
		eye1.render();

		var eye2 = new Cube();
		eye2.rgba = this.faceColors;
		eye2.matrix = new Matrix4(eye1.matrix);
		eye2.matrix.scale(-1, 1, 1)
		eye2.matrix.translate(2, 0, 0)
		eye2.render();


		var nose = new Cube();
		nose.textureNum = 1
		nose.matrix = new Matrix4(head.matrix);
		nose.matrix.scale(.8, .4, .7);
		nose.matrix.translate(.1, .4, -.7);
		nose.render();

		var mouth = new Cube();
		mouth.rgba = this.faceColors;
		mouth.matrix = new Matrix4(nose.matrix);
		// mouth.rgba = [1, 0, 0, 1];
		mouth.matrix.scale(1.2, .3, .2);
		mouth.matrix.translate(-.1, .4, -.1)
		mouth.render();

		var nostril1 = new Cube();
		nostril1.rgba = this.faceColors;
		nostril1.matrix = new Matrix4(nose.matrix);
		nostril1.matrix.scale(.3, .3, .2);
		nostril1.matrix.translate(2, 1.6, -.1)
		nostril1.render();

		var nostril2 = new Cube();
		nostril2.rgba = this.faceColors;
		nostril2.matrix = new Matrix4(nostril1.matrix);
		nostril2.matrix.scale(-1, 1, 1);
		nostril2.matrix.translate(.8, 0, 0)
		nostril2.render();

		var ear1 = new Cube();
		ear1.rgba = this.faceColors;
		ear1.matrix = new Matrix4(head.matrix);
		ear1.matrix.translate(.7, 1, .4)
		ear1.matrix.scale(.3, .4, .2)
		ear1.render();

		var ear2 = new Cube();
		ear2.rgba = this.faceColors;
		ear2.matrix = new Matrix4(ear1.matrix);
		ear2.matrix.translate(-1.2, 0, 0)
		ear2.matrix.scale(-1, 1, 1)
		ear2.render();



		// head.render();

		// neck.render();


	}
}


function updateAnimations()
{
  var speed = 5
  if (AnimationState == true)
  {
    Hand1Angle = 30 - (30 * Math.sin(dt * speed));
    document.getElementById("hand1Angle").value = Hand1Angle
    Arm1Angle = 30 - (30 * Math.sin(dt * speed));
    document.getElementById("arm1Angle").value = Arm1Angle

    hipShift = (0 + 10 * Math.sin(dt * speed))
    // console.log(hipShift)
    document.getElementById("hipShift").value = hipShift

    TorsoAngle = (10 * Math.sin(dt * speed));
    document.getElementById("torsoAngle").value = TorsoAngle

    NeckAngle = (5 * Math.sin(dt * speed));
    document.getElementById("neckAngle").value = NeckAngle

    HeadAngle = (5 * Math.sin(dt * speed));
    document.getElementById("headAngle").value = HeadAngle

    LegAngle = (5 * Math.sin(dt * speed));
    document.getElementById("legAngle").value = LegAngle


    Arm2Angle = 30 + (30 * Math.sin(dt * speed));
    document.getElementById("arm2Angle").value = Arm2Angle


    Hand2Angle = 30 + (30 * Math.sin(dt * speed));
    document.getElementById("hand2Angle").value = Hand2Angle

    if (PartyMode)
    {
      	GlobalAngleOffset = performance.now()/10 - TimeOffset 
      	if (GlobalAngleOffset > 360) 
      	{
          	GlobalAngleOffset = 0;
        	TimeOffset = performance.now()/10
        }

        BuildingNeckAngle = (5 * Math.sin(dt * speed));
    	document.getElementById("neckAngle").value = NeckAngle

    	BuildingHeadAngle = (5 * Math.sin(dt * speed));
    	document.getElementById("headAngle").value = HeadAngle


    } 
  }
}

function partyMode() 
{
  PartyMode = !PartyMode; 
  console.log("HEY")

  if(PartyMode == false)
  {
    song.pause();
    AnimationState = false;
    document.querySelector("#body").style.backgroundImage = "url(img/paint.png)"
  }

  if(PartyMode == true)
  {
    song.play()
    AnimationState = true;
    document.querySelector("#body").style.backgroundImage = "url(img/paint.jpg)"
  }
}