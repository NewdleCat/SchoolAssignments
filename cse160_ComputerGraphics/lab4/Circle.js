class Circle
{
	constructor(x, y, rgba, size, seg)
	{
		this.x = x;
		this.y = y;
		// this.rgba = rgba;
		this.rgba = rgba
		this.size = size;
		this.segments = seg;
	}

	render()
	{
		var x = this.x;
		var y = this.y;
		var rgba = this.rgba;
		var size = this.size;

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);


		let angleStep=360/this.segments;
		// let pt1 = []
		// let pt2 = []
		// console.log(this.segments)
		var d = size/200.
		// var d = 1



		for(var angle = 0; angle < 360; angle = angle + angleStep)
		{
			let centerPt = [x, y];
			let angle1 = angle;
			let angle2 = angle + angleStep;
			let vec1 = [Math.cos(angle1*(Math.PI/180))*d, Math.sin(angle1*(Math.PI/180))*d];
			let vec2 = [Math.cos(angle2*(Math.PI/180))*d, Math.sin(angle2*(Math.PI/180))*d];
			let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
			let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

			drawTriangle([centerPt[0], centerPt[1],	pt1[0],pt1[1], 	pt2[0],pt2[1]])

		}


	}
}