class Cube
{
	constructor()
	{
		// this.x = x;
		// this.y = y;
		// this.rgba = rgba;
		this.rgba = [1, 1, 1, 1];
		// this.size = size;
		// this.segments = seg;
		this.matrix = new Matrix4();
	}

	render()
	{
		// var x = this.x;
		// var y = this.y;
		var rgba = this.rgba;
		// var size = this.size;

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)


		//Front
		drawTriangle3D( [0,0,0,   1,1,0,   1,0,0] );
		drawTriangle3D( [0,0,0,   1,1,0,   0,1,0] );

		drawTriangle3D( [0,1,0,   1,1,1,   0,1,1] );
		drawTriangle3D( [0,1,0,   1,1,1,   1,1,0] );

		drawTriangle3D( [0,1,1,   0,0,0,   0,1,0] );
		drawTriangle3D( [0,1,1,   0,0,0,   0,0,1] );

		gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
		drawTriangle3D( [1,0,1,   1,1,0,   1,0,0] );
		drawTriangle3D( [1,0,1,   1,1,0,   1,1,1] );

		drawTriangle3D( [1,0,1,   0,0,0,   1,0,0] );
		drawTriangle3D( [1,0,1,   0,0,0,   0,0,1] );

		drawTriangle3D( [1,0,1,   0,1,1,   1,1,1] );
		drawTriangle3D( [1,0,1,   0,1,1,   0,0,1] );


	}
}