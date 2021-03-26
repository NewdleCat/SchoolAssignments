// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec3 a_Normal;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec4 v_VertPos;\n' +
  'uniform float u_Size;\n' + 
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '  v_UV = a_UV;\n' +
  '  v_Normal = a_Normal;\n' +
  '  v_VertPos = u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform vec3 u_cameraPos;
  uniform sampler2D u_Sampler0; 
  uniform sampler2D u_Sampler1; 
  uniform sampler2D u_Sampler2; 
  uniform sampler2D u_Sampler3; 
  uniform sampler2D u_Sampler4; 
  uniform vec3 u_lightPos; 
  uniform vec3 u_spotPos; 
  uniform int u_texturePicker; 
  uniform bool u_mainLight;
  uniform bool u_spotLight;
  void main() {
  
    if (u_texturePicker == -2) { //Default color values
      gl_FragColor = u_FragColor;
    
    } else if (u_texturePicker == -1) { // Debugging blue color
      gl_FragColor = vec4(v_UV, 1, 1);
    
    } else if (u_texturePicker == 0) { // Test Texture
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    
    } else if (u_texturePicker == 1) { // Building Texture
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    
    } else if (u_texturePicker == 2) { // Skybox Texture
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    
    } else if (u_texturePicker == 3) { // wallTexture
      gl_FragColor = texture2D(u_Sampler3, v_UV);

    } else if (u_texturePicker == 4) { // Floor Texture
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    
    } else if (u_texturePicker == -3) { //Default color values
      gl_FragColor = vec4((v_Normal + 1.0)/2.0, 1.0);
    
    } else {
      gl_FragColor = vec4(1, .2, .2, 1); // Red for error
    }
  
    if (u_texturePicker != 2 && u_texturePicker != 3)
    {
      vec3 lightVector = u_lightPos - vec3(v_VertPos);
      float r= length(lightVector);

      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N, L), 0.0);

      vec3 R = reflect(-L, N);
      vec3 E = normalize(u_cameraPos - vec3(v_VertPos));
      float specular = pow(max(dot(E, R), 0.0), 10.0);

      vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
      vec3 ambient = vec3(gl_FragColor) * 0.3;
      if (u_mainLight == true)
      {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      }

      lightVector = u_spotPos - vec3(v_VertPos);
      r= length(lightVector);

      L = normalize(lightVector);
      N = normalize(v_Normal);
      nDotL = max(dot(N, L), 0.0);

      R = reflect(-L, N);
      E = normalize(u_cameraPos - vec3(v_VertPos));
      specular = pow(max(dot(E, R), 0.0), 10.0);

      diffuse = vec3(gl_FragColor) * nDotL * 0.7;
      ambient = vec3(gl_FragColor) * 0.3;
      if (u_spotLight == true)
      {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      }
    }



    // gl_FragColor.a = 1.0;
  }`

let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_lightPos;
let u_spotPos;
let GlobalCamera;
let drawMode = "square";

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];
var shapesList = [];

var GlobalAngle = 20;


var AnimationState = true;
var PauseTimer = 0;
var TimeOffset = 0;


var PartyMode = false;
var PartyPause = 0;

let normalState = false;
let LightPos = [0, 2.5, -2];
// Textures
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_texturePicker;
let u_cameraPos;
let u_mainLight;
let u_spotLight;

let MainLightState = true;
let SpotLightState = true;

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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0)
  {
    console.log('Failed to get the storage location of A_Normal');
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

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return false;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return false;
  }

  u_mainLight = gl.getUniformLocation(gl.program, 'u_mainLight');
  if (!u_mainLight) {
    console.log('Failed to get the storage location of u_mainLight');
    return false;
  }

  u_spotLight = gl.getUniformLocation(gl.program, 'u_spotLight');
  if (!u_spotLight) {
    console.log('Failed to get the storage location of u_spotLight');
    return false;
  }

  u_spotPos = gl.getUniformLocation(gl.program, 'u_spotPos');
  if (!u_spotPos) {
    console.log('Failed to get the storage location of u_spotPos');
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
  gl.uniform3f(u_lightPos, LightPos[0], LightPos[1], LightPos[2])
  gl.uniform3f(u_spotPos, 3, 3, 3);

  gl.uniform3f(u_cameraPos, GlobalCamera.eye.elements[0], GlobalCamera.eye.elements[1], GlobalCamera.eye.elements[2]);
  gl.uniform1i(u_mainLight, MainLightState);
  gl.uniform1i(u_spotLight, SpotLightState);

  var light = new Cube();
  light.rgba = [2, 2, 0, 1];
  light.matrix.translate(LightPos[0], LightPos[1] , LightPos[2]);
  light.matrix.scale(-0.1, -0.1, -0.1);
  light.matrix.translate(-0.5, -0.5, 0);
  light.render();

  var spotLight = new Cube();
  spotLight.rgba = [2, 2, 0, 1];
  spotLight.matrix.translate(3, 3, 3);
  spotLight.matrix.scale(-0.1, -0.1, -0.1);
  spotLight.matrix.translate(-0.5, -0.5, 0);
  spotLight.render();

  var floorBox = new Cube();
  floorBox.color = [0, 0, 0, 1];
  if (normalState == true)
    floorBox.textureNum = -3
  if (normalState == false)
    floorBox.textureNum = -2
  floorBox.matrix.translate(0, -.75, 0);
  floorBox.matrix.scale(50, 0, 50);
  floorBox.matrix.translate(-.5, 0, -.5);

  var skyBox = new Cube();
  skyBox.color = [1, 0, 0, 1];
  if (normalState == true)
    skyBox.textureNum = -3
  if (normalState == false)
    skyBox.textureNum = 2
  skyBox.matrix.scale(-50,-50,-50);
  skyBox.matrix.translate(-.5,-.5,-.5);
  skyBox.render();

  drawMap();


  floorBox.render();

  var ball = new Sphere();
  ball.matrix.translate(0, 1, 0);
  ball.render();

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

function animationOn() {AnimationState = true; console.log("Animation: " + AnimationState);}
function animationOff() {AnimationState = false; console.log("Animation: " + AnimationState);}
function normalsOn() {normalState = true; console.log("Normal: " + normalState);}
function normalsOff() {normalState = false; console.log("Normal: " + normalState);}
function updateLightX() {LightPos[0] = document.getElementById("lightX").value/10; renderAllShapes();}
function updateLightY() {LightPos[1] = document.getElementById("lightY").value/10; renderAllShapes();}
function updateLightZ() {LightPos[2] = document.getElementById("lightZ").value/10; renderAllShapes();}
function updateMainLight() {MainLightState = !MainLightState; console.log(MainLightState)}
function updateSpotLight() {SpotLightState = !SpotLightState; console.log(SpotLightState)}

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

  LightPos[2] = cos(dt);
  document.getElementById("lightZ").value = cos(dt) * 25;

  LightPos[0] = sin(dt);
  document.getElementById("lightX").value = sin(dt) * 25;

  renderAllShapes();

  requestAnimationFrame(tick);
}


