// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' + 
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix
let drawMode = "square";

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];
var shapesList = [];

var GlobalAngle = 20;
var hipShift = 0;
var TorsoAngle = 0;
var NeckAngle = 0;
var HeadAngle = 0;
var LegAngle = 0;
var Arm1Angle = 0;
var Arm2Angle = 0;
var Hand1Angle = 0;
var Hand2Angle = 0;

var AnimationState = false;
var PauseTimer = 0;
var TimeOffset = 0;

var stickColor = [1, 1, 1, 1];
var mainBodyColor = [.9, .9, .9, 1];
var otherFaceColors = [.6, .6, .6, 1];
var eyeColor = [.2, .2, .2, 1];

var PartyMode = false;
var PartyPause = 0;

var song = document.getElementById("partyTime");


function connectVariablesToGLSL()
{
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) 
  {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) 
  {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) 
  {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix)
  {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if(!u_Size)
  {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix)
  {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
}

function setupWebGL()
{
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) 
  {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}


function updateGlobalAngle()
{
  GlobalAngle = document.getElementById("angleVal").value;
  renderAllShapes();
}

function updateAngles(box)
{
  if (box == 'hip')
    hipShift = document.getElementById("hipShift").value;
  if (box == 'head')
    HeadAngle = document.getElementById("headAngle").value;
  if (box == 'neck')
    NeckAngle = document.getElementById("neckAngle").value;
  if (box == 'torso')
    TorsoAngle = document.getElementById("torsoAngle").value;
  if (box == 'leg')
    LegAngle = document.getElementById("legAngle").value;
  if (box == 'arm1')
    Arm1Angle = document.getElementById("arm1Angle").value;
  if (box == 'arm2')
    Arm2Angle = document.getElementById("arm2Angle").value;
  if (box == 'hand1')
    Hand1Angle = document.getElementById("hand1Angle").value;
  if (box == 'hand2')
    Hand2Angle = document.getElementById("hand2Angle").value;

}

function animationOn() {AnimationState = true; console.log(AnimationState);}
function animationOff() {AnimationState = false; console.log(AnimationState);}

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
    document.querySelector("#body").style.backgroundImage = "url(img/soviet.png)"
  }
}

function renderAllShapes()
{
  var globalRotMat = new Matrix4().rotate(GlobalAngle,0,1,0)
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // mainBodyColor = [1, 1, 1, 1];



//--------TORSO--------------------------------------
  var hip = new Cube();
  hip.rgba = mainBodyColor;
  hip.matrix.setTranslate(0, -.55, 0);
  hip.matrix.rotate(-hipShift, 0, 0, 1)
  var redCoordMat = new Matrix4(hip.matrix)
  hip.matrix.scale(.4, .3, .35)
  hip.matrix.translate(-.51, 0, 0)

  var torso = new Cube();
  torso.matrix = redCoordMat;
  torso.rgba = mainBodyColor;
  torso.matrix.translate(0, .25, 0);
  torso.matrix.rotate(-TorsoAngle, 0, 0, 1);
  var yellowCoordMat = new Matrix4(torso.matrix);
  var armCoordMat1 = new Matrix4(torso.matrix);
  var armCoordMat2 = new Matrix4(torso.matrix);
  torso.matrix.scale(.35, .6, .3);
  torso.matrix.translate(-.52, -.2, .1);

//----------NECK------------------------------
  var neck = new Cube();
  neck.matrix = yellowCoordMat;
  neck.rgba = mainBodyColor;
  neck.matrix.translate(0, .65, 0);
  neck.matrix.rotate(-NeckAngle, 0, 0, 1);
  var pinkCoordMat = new Matrix4(neck.matrix);
  neck.matrix.scale(.25, .4, .25);
  neck.matrix.translate(-.55, -.5, .15);

  var head = new Cube();
  head.matrix = pinkCoordMat;
  head.rgba = mainBodyColor;
  head.matrix.translate(0, .15, .04);
  head.matrix.rotate(-HeadAngle, 0, 0, 1);
  head.matrix.scale(.24, .35, .24)
  head.matrix.translate(-.55, 0, 0);
// ---------------------------------------------
//--------LEGS----------------------------------
  var leg1 = new Cube();
  leg1.rgba = mainBodyColor;
  leg1.matrix.translate(-.1, -.4, 0);
  leg1.matrix.rotate(-LegAngle, 0, 0, 1);
  leg1.matrix.scale(.15, -.5, .2)
  leg1.matrix.translate(-.55, 0, .4);

  var leg2 = new Cube();
  leg2.rgba = mainBodyColor;
  leg2.matrix.translate(.1, -.4, 0);
  leg2.matrix.rotate(-LegAngle, 0, 0, 1);
  leg2.matrix.scale(.15, -.5, .2)
  leg2.matrix.translate(-.55, 0, .4);
// -------------------------------------------
// --------ARMS-----------------------------

  //Arm1
  var shoulder1 = new Cube();
  shoulder1.matrix = armCoordMat1;
  shoulder1.rgba = mainBodyColor;
  shoulder1.matrix.translate(0, .2, .1);
  shoulder1CoordMat = new Matrix4(shoulder1.matrix);
  shoulder1.matrix.scale(.2, .2, .2);
  testMat = new Matrix4(shoulder1.matrix)

  var arm1 = new Cube();
  arm1.matrix = shoulder1CoordMat;
  arm1.rgba = mainBodyColor;
  arm1.matrix.translate(.15, -.05, 0);
  arm1.matrix.rotate(Arm1Angle, 0, 0, 1)
  var arm1CoordMat = new Matrix4(arm1.matrix);
  arm1.matrix.scale(.4, .2, .2);

  var hand1 = new Cube();
  hand1.matrix = arm1CoordMat;
  hand1.rgba = mainBodyColor;
  hand1.matrix.translate(.4, 0, 0);
  hand1.matrix.rotate(Hand1Angle, 0, 0 ,1);
  hand1.matrix.scale(.28, .18, .18);

  var hoof1 = new Cube();
  hoof1.matrix = new Matrix4(hand1.matrix);
  hoof1.rgba = otherFaceColors
  hoof1.matrix.translate(1, 0, 0);
  hoof1.matrix.scale(.1, 1 ,1);

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

  var arm2 = new Cube();
  arm2.matrix = shoulder2CoordMat;
  arm2.rgba = mainBodyColor;
  arm2.matrix.translate(.15, -.05, 0);
  arm2.matrix.rotate(Arm2Angle, 0, 0, 1)
  var arm2CoordMat = new Matrix4(arm2.matrix);
  arm2.matrix.scale(.4, .2, .2)

  var hand2 = new Cube();
  hand2.matrix = arm2CoordMat;
  hand2.rgba = mainBodyColor;
  hand2.matrix.translate(.4, 0 ,0);
  hand2.matrix.rotate(Hand2Angle, 0, 0 ,1);
  hand2.matrix.scale(.28, .18, .18);

  var hoof2 = new Cube();
  hoof2.matrix = new Matrix4(hand2.matrix);
  hoof2.rgba = otherFaceColors
  hoof2.matrix.translate(1, 0, 0);
  hoof2.matrix.scale(.1, 1 ,1);

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

  var eye2 = new Cube();
  eye2.matrix = new Matrix4(eye1.matrix);
  eye2.rgba = eyeColor;
  eye2.matrix.scale(-1, 1, 1)
  eye2.matrix.translate(2, 0, 0)


  var nose = new Cube();
  nose.matrix = new Matrix4(head.matrix);
  nose.rgba = mainBodyColor;
  nose.matrix.scale(.8, .4, .7);
  nose.matrix.translate(.1, .4, -.7);



  var mouth = new Cube();
  mouth.matrix = new Matrix4(nose.matrix);
  mouth.rgba = otherFaceColors;
  // mouth.rgba = [1, 0, 0, 1];
  mouth.matrix.scale(1.2, .3, .2);
  mouth.matrix.translate(-.1, .4, -.1)

  var nostril1 = new Cube();
  nostril1.matrix = new Matrix4(nose.matrix);
  nostril1.rgba = otherFaceColors;
  nostril1.matrix.scale(.3, .3, .2);
  nostril1.matrix.translate(2, 1.6, -.1)

  var nostril2 = new Cube();
  nostril2.matrix = new Matrix4(nostril1.matrix);
  nostril2.rgba = otherFaceColors;
  nostril2.matrix.scale(-1, 1, 1);
  nostril2.matrix.translate(.8, 0, 0)

  var ear1 = new Cube();
  ear1.matrix = new Matrix4(head.matrix);
  ear1.rgba = mainBodyColor;
  ear1.matrix.translate(.7, 1, .4)
  ear1.matrix.scale(.3, .4, .2)

  var ear2 = new Cube();
  ear2.matrix = new Matrix4(ear1.matrix);
  ear2.rgba = mainBodyColor;
  ear2.matrix.translate(-1.2, 0, 0)
  ear2.matrix.scale(-1, 1, 1)



  head.render();
  ear1.render();
  ear2.render();
  eye1.render();
  eye2.render();
  nose.render();
  mouth.render();
  nostril1.render();
  nostril2.render();
  neck.render();

  hip.render();
  torso.render();
  leg1.render();
  leg2.render();

  shoulder1.render();
  arm1.render();
  hand1.render();
  hoof1.render();

  shoulder2.render();
  arm2.render();
  hand2.render();
  hoof2.render();

  if (PartyMode)
  {
    stick1.render();
    stick2.render();
  }
  

}


var StartTime = performance.now()/1000;
var dt = performance.now()/1000 - StartTime;
var cooldown = 10

function tick()
{
  if (AnimationState == true)
  {
    dt = performance.now()/1000 - StartTime - PauseTimer;
  } else if(AnimationState == false)
  {
    PauseTimer = performance.now()/1000 - StartTime - dt
  }
  updateAnimations();

  if (PartyMode)
  {
    stickColor = [Math.random(), Math.random(), Math.random(), 1];
    mainBodyColor = [1, 0, 0, 1];
    otherFaceColors = [1, 1, 0, 1];
    eyeColor = [1, 1, 0, 1];
  } else {
    stickColor = [1, 1, 1, 1];
    mainBodyColor = [.9, .9, .9, 1];
    otherFaceColors = [.6, .6, .6, 1];
    eyeColor = [.2, .2, .2, 1];

  }

  renderAllShapes();

  requestAnimationFrame(tick);
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
      GlobalAngle = performance.now()/10 - TimeOffset 
      document.getElementById("angleVal").value = GlobalAngle
      if (GlobalAngle > 360) 
      {
        GlobalAngle = 0;
        document.getElementById("angleVal").value = 0
        TimeOffset = performance.now()/10
      }

    } 
  }
}

function main() 
{

  setupWebGL();
  connectVariablesToGLSL();

  // Specify the color for clearing <canvas>
  gl.clearColor(.0, .0, .0, 1.0);

  renderAllShapes();
  requestAnimationFrame(tick);
}



function test()
{
  console.log("test")
}
