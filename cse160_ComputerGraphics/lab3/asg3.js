// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform float u_Size;\n' + 
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '  v_UV = a_UV;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'uniform vec4 u_FragColor;\n' + 
  'uniform sampler2D u_Sampler0;\n' + 
  'uniform sampler2D u_Sampler1;\n' + 
  'uniform sampler2D u_Sampler2;\n' + 
  'uniform sampler2D u_Sampler3;\n' + 
  'uniform sampler2D u_Sampler4;\n' + 
  'uniform int u_texturePicker;\n' + 
  'void main() {\n' +
  // '  gl_FragColor = u_FragColor;\n' +
  // '  gl_FragColor = vec4(v_UV, 1.0, 1.0);\n' +
  // '  gl_FragColor = texture2D(u_Sampler0, v_UV);\n' +
  
  
  '  if (u_texturePicker == -2) {\n' + //Default color values
  '    gl_FragColor = u_FragColor;\n' +

  '  } else if (u_texturePicker == -1) {\n' + // Debugging blue color
  '    gl_FragColor = vec4(v_UV, 1, 1);\n' +


  '  } else if (u_texturePicker == 0) {\n' + // Test Texture
  '    gl_FragColor = texture2D(u_Sampler0, v_UV);\n' +

  '  } else if (u_texturePicker == 1) {\n' + // Building Texture
  '    gl_FragColor = texture2D(u_Sampler1, v_UV);\n' +

  '  } else if (u_texturePicker == 2) {\n' + // Skybox Texture
  '    gl_FragColor = texture2D(u_Sampler2, v_UV);\n' +

  '  } else if (u_texturePicker == 3) {\n' + // Skybox Texture
  '    gl_FragColor = texture2D(u_Sampler3, v_UV);\n' +

  '  } else if (u_texturePicker == 4) {\n' + // Skybox Texture
  '    gl_FragColor = texture2D(u_Sampler4, v_UV);\n' +
  
  '  } else {\n' +
  '    gl_FragColor = vec4(1, .2, .2, 1);\n' + // Red for error
  '  }\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let GlobalCamera;
let drawMode = "square";

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];
var shapesList = [];

var GlobalAngle = 20;


var AnimationState = false;
var PauseTimer = 0;
var TimeOffset = 0;


var PartyMode = false;
var PartyPause = 0;


// Textures
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_texturePicker;

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

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0)
  {
    console.log('Failed to get the storage location of a_UV');
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

    // Get the storage location of u_Sampler


  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix)
  {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix)
  {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_texturePicker = gl.getUniformLocation(gl.program, 'u_texturePicker');
  if (!u_texturePicker)
  {
    console.log('Failed to get the storage location of u_texturePicker');
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

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return false;
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

function initTextures() 
{
  
  let fuckyou = new Image();  // Create the fuckyou object
  let buildingImage = new Image();
  let skyImage = new Image();
  let wallImage = new Image();
  let roadImage = new Image();
  
  if (!fuckyou) 
  {
    console.log('Failed to create the fuckyou object');
    return false;
  }
  if (!buildingImage)
  {
    console.log('Failed to create buildingImage object')
    return false;
  }
  if (!skyImage)
  {
    console.log('Failed to create skyImage object')
    return false;
  }
  if (!wallImage)
  {
    console.log('Failed to create skyImage object')
    return false;
  } 
  if (!roadImage)
  {
    console.log('Failed to create roadImage object')
    return false;
  }
  
  fuckyou.onload = function(){ loadTexture(fuckyou, u_Sampler0, 0); };
  buildingImage.onload = function(){ loadTexture(buildingImage, u_Sampler1, 1); };
  skyImage.onload = function(){ loadTexture(skyImage, u_Sampler2, 2); };
  wallImage.onload = function(){ loadTexture(wallImage, u_Sampler3, 3); };
  roadImage.onload = function(){ loadTexture(roadImage, u_Sampler4, 4); };


  fuckyou.src = 'img/testTexture.png';
  buildingImage.src = 'img/buildingTexture.jpg';
  skyImage.src = 'img/skyImage.jpg';
  wallImage.src = 'img/brick.jpg';
  roadImage.src = 'img/road.jpg';

  return true;
}

function loadTexture(image, sampler, num) 
{

  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  var buildingTexture = gl.createTexture();   // Create a texture object
  if (!buildingTexture) {
    console.log('Failed to create the buildingTexture object');
    return false;
  }
  var skyTexture = gl.createTexture();   // Create a texture object
  if (!skyTexture) {
    console.log('Failed to create the skyTexture object');
    return false;
  } 
  var wallTexture = gl.createTexture();   // Create a texture object
  if (!wallTexture) {
    console.log('Failed to create the wallTexture object');
    return false;
  }
  var roadTexture = gl.createTexture();   // Create a texture object
  if (!roadTexture) {
    console.log('Failed to create the roadTexture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  gl.activeTexture(gl.TEXTURE0 + num)


  if (num  == 0)
    gl.bindTexture(gl.TEXTURE_2D, texture);
  if (num  == 1)
    gl.bindTexture(gl.TEXTURE_2D, buildingTexture);
  if (num == 2)
    gl.bindTexture(gl.TEXTURE_2D, skyTexture);
  if (num == 3)
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);
  if (num == 4)
    gl.bindTexture(gl.TEXTURE_2D, roadTexture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(sampler, num)

}

function renderAllShapes()
{
  // console.log('In Render All Shapes!!!!')


  var projMat = new Matrix4();
  projMat.setPerspective(50, 1 * canvas.width/canvas.height, .1, 200)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);



  var viewMat = new Matrix4()
  viewMat.setLookAt(
    GlobalCamera.eye.elements[0],GlobalCamera.eye.elements[1],GlobalCamera.eye.elements[2],  
    GlobalCamera.at.elements[0],GlobalCamera.at.elements[1],GlobalCamera.at.elements[2],   
    GlobalCamera.up.elements[0],GlobalCamera.up.elements[1],GlobalCamera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);



  var globalRotMat = new Matrix4().rotate(GlobalAngle,0,1,0)
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // mainBodyColor = [1, 1, 1, 1];

  var floorBox = new Cube();
  floorBox.color = [0, 0, 0, 1];
  floorBox.textureNum = 4;
  floorBox.matrix.translate(0, -.75, 0);
  floorBox.matrix.scale(50, 0, 50);
  floorBox.matrix.translate(-.5, 0, -.5);

  var skyBox = new Cube();
  skyBox.color = [1, 0, 0, 1];
  skyBox.textureNum = 2
  skyBox.matrix.scale(50,50,50);
  skyBox.matrix.translate(-.5,-.5,-.5);
  skyBox.render();

  drawMap();


  floorBox.render();

  // renderLlama();
}

function keydown(ev)
{
  if (ev.keyCode == 68) // D --- move right
    GlobalCamera.right();
  if (ev.keyCode == 65) // A --- move left
    GlobalCamera.left();
  if (ev.keyCode == 87) // W --- move forward
    GlobalCamera.forward();
  if (ev.keyCode == 83)
    GlobalCamera.back();
  if (ev.keyCode == 69)
    GlobalCamera.rotateRight();
  if (ev.keyCode == 81)
    GlobalCamera.rotateLeft();
  if (ev.keyCode == 82)
    GlobalCamera.flyUp();
  if (ev.keyCode == 70)
    GlobalCamera.flyDown();
}

function main() 
{

  setupWebGL();
  connectVariablesToGLSL();

  GlobalCamera = new Camera()

  document.onkeydown = keydown;

  initTextures();

  gl.clearColor(.0, .0, .0, 1.0);

  renderAllShapes();
  requestAnimationFrame(tick);
}

// --------------------------------------------------------------------------------







function updateGlobalAngle()
{
  GlobalAngle = document.getElementById("angleVal").value;
  console.log('fuck')
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
    mainBodyColor = [0, .05, .1, 1];
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


