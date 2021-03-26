 // DrawRectangle.js
function main() {
 // Retrieve <canvas> element <- (1)
 	var canvas = document.getElementById('example');
	if (!canvas) 
	{
		console.log('Failed to retrieve the <canvas> element');
		return;
	}

  // Get the rendering context for 2DCG <- (2)
 	var ctx = canvas.getContext('2d'); 
  // Draw a blue rectangle <- (3)
  	ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
  	ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
}

function drawVector(v, color)
{
	let canvas = document.getElementById('example');
	let ctx = canvas.getContext('2d');
	let x = v.elements[0] * 20
	let y = -v.elements[1] * 20
	ctx.beginPath();
  	ctx.strokeStyle = color;
  	ctx.moveTo(200, 200);
  	ctx.lineTo(x + 200, y + 200)
  	ctx.stroke();
}

function handleDrawEvent()
{

	clearCanvas()

	let x1 = document.getElementById("xInputV1").value;
	let y1 = document.getElementById("yInputV1").value;
	let x2 = document.getElementById("xInputV2").value;
	let y2 = document.getElementById("yInputV2").value;
	let v1 = new Vector3([x1, y1, 0]);
	let v3 = v1
	drawVector(v1, 'red');
	let v2 = new Vector3([x2, y2, 0]);
	let v4 = v2
	drawVector(v2, 'blue');

}
function handleDrawOperationEvent()
{
	// console.log("YOO")
	clearCanvas()

	let x1 = document.getElementById("xInputV1").value;
	let y1 = document.getElementById("yInputV1").value;
	let x2 = document.getElementById("xInputV2").value;
	let y2 = document.getElementById("yInputV2").value;
	let v1 = new Vector3([x1, y1, 0]);
	let v3 = v1
	drawVector(v1, 'red');
	let v2 = new Vector3([x2, y2, 0]);
	let v4 = v2
	drawVector(v2, 'blue');

	let selection = document.getElementById("Selector").value
	let scalar = document.getElementById("scalar").value || 1

	if(selection == "add")
	{
		v3.add(v2)
		drawVector(v3, 'green')
	}	
	if(selection == "sub")
	{
		v3.sub(v2)
		drawVector(v3, 'green')
	}
	if(selection == "div")
	{
		v3.div(scalar)
		v4.div(scalar)
		drawVector(v3, 'green')
		drawVector(v4, 'green')
	}
	if(selection == "mul")
	{
		v3.mul(scalar)
		v4.mul(scalar)
		drawVector(v3, 'green')
		drawVector(v4, 'green')
	}
	if(selection == "mag")
	{
		console.log("Magnitude v1: " + v1.magnitude())
		console.log("Magnitude v2: " + v2.magnitude())
	}
	if(selection == "angle")
	{
		console.log("Angle: "+ angleBetween(v1, v2))
	}
	if(selection == "norm")
	{
		v1.normalize()
		drawVector(v1, 'green')
		v2.normalize()
		drawVector(v2, 'green')
	}
	if(selection == "area")
	{
		console.log("Area of Triangle: "+ areaTriangle(v1, v2))
	}

}

function angleBetween(v1, v2)
{
	return Math.acos(Vector3.dot(v1, v2)/(v1.magnitude()*v2.magnitude())) * (180/Math.PI)
}

function areaTriangle(v1, v2)
{
	let result = Vector3.cross(v1, v2)
	return Math.sqrt(result.elements[2] * result.elements[2])/2
}

function clearCanvas()
{
	let canvas = document.getElementById('example');
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}