// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' + 
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
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
let drawMode = "square";

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];
var shapesList = [];

var CurrColorBox = "colorBox1";
var colorBox1 = [255, 255, 255]
var colorBox2 = [255, 255, 255]


function connectVariablesToGLSL()
{
    // Initialize shaders
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

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if(!u_Size)
  {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

function setupWebGL()
{
    // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) 
  {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function renderAllShapes()
{
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = shapesList.length;
  for(var i = 0; i < len; i++) 
  {
    shapesList[i].render()
  }
}

function convertCoords(ev)
{
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x, y])
}

function updateBoxColor()
{
  // console.log("ayy")

  let r = document.getElementById("rVal").value * 1
  let g = document.getElementById("gVal").value * 1
  let b = document.getElementById("bVal").value * 1
  color = "#" + dec2hexString(r) + dec2hexString(g) + dec2hexString(b)

  if(CurrColorBox == "colorBox1")
  {
    colorBox1 = [r, g, b]
    document.querySelector("#colorBox1").style.backgroundColor = color;
  }
  else if(CurrColorBox == "colorBox2")
  {
    colorBox2 = [r, g, b]
    document.querySelector("#colorBox2").style.backgroundColor = color; 
  }

}

function dec2hexString(dec) {
   let temp = dec.toString(16);

   if(temp.length == 1)
   {
    temp = "0" + temp;
   }

   return temp;
}

function click(ev) 
{

  if(ev.buttons == 1)
  {

    [x, y] = convertCoords(ev)
    let opacity = 1
    var r = document.getElementById("rVal").value / 255
    var g = document.getElementById("gVal").value / 255
    var b = document.getElementById("bVal").value / 255
    var size = document.getElementById("sizeVal").value
    var segments = document.getElementById("segmentCount").value
    
    if(drawMode == "square")
    {
      shapesList.push(new Point(x, y, [r, g, b, 1], size))

    } 
    else if(drawMode == "triangle")
    {
      shapesList.push(new Triangle(x, y, [r, g, b, 1], size))
    }
    else if(drawMode == "circle")
    {
      shapesList.push(new Circle(x, y, [r, g, b, 1], size, segments))
    }

  }


  renderAllShapes();
}

function clearCanvas()
{
  shapesList = [];
  renderAllShapes();
}

//------DrawMode Button Functions----------------
function squareMode(){ drawMode = "square";}
function triangleMode(){ drawMode = "triangle"}
function circleMode(){ drawMode = "circle"}
// --------------------------------------------
// -----Change Color Box Functions------------
function changeToColorBox1() 
{ 
  CurrColorBox = "colorBox1"
  document.getElementById("rVal").value = colorBox1[0]
  document.getElementById("gVal").value = colorBox1[1]
  document.getElementById("bVal").value = colorBox1[2]
}
function changeToColorBox2() 
{ 
  CurrColorBox = "colorBox2"
  document.getElementById("rVal").value = colorBox2[0]
  document.getElementById("gVal").value = colorBox2[1]
  document.getElementById("bVal").value = colorBox2[2]
}
// --------------------------------------------

function hexCodeHandler()
{
  hexCode = document.getElementById("hexCode").value
  if(hexCode.length == 6)
  {
    let r = hexCode[0] + hexCode[1]
    let g = hexCode[2] + hexCode[3]
    let b = hexCode[4] + hexCode[5]

    console.log("r: " + r + " g: " + g + " b: " + b)

    console.log(parseInt(r, 16))
    document.getElementById("rVal").value = parseInt(r, 16)
    document.getElementById("gVal").value = parseInt(g, 16)
    document.getElementById("bVal").value = parseInt(b, 16)
  }

  updateBoxColor()
}

function main() 
{

  setupWebGL();
  connectVariablesToGLSL();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = click;
  canvas.onmouseup = test()

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function test()
{
  console.log("test")
}
