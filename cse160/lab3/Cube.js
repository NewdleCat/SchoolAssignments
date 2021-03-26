class Cube
{
	constructor()
	{
		this.rgba = [1, 1, 1, 1];
		this.matrix = new Matrix4();
		this.textureNum = -2;
	}

	render()
	{
		var rgba = this.rgba;

		// pass the texture number
		// console.log("FUC: " + this.textureNum + "USampler: " + u_Sampler0)
		gl.uniform1i(u_texturePicker, this.textureNum)

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)

		// console.log('fuck')
		//Front

		// drawTriangle3DUV( [0,0,0,   1,1,0,   1,0,0], [0,0,   1,1,   1,0] );
		// drawTriangle3DUV( [0,0,0,   1,1,0,   0,1,0], [0,0,   1,1,   0,1] );

		// drawTriangle3DUV( [0,1,0,   1,1,1,   0,1,1], [0,1,   1,1,   0,1] );
		// drawTriangle3DUV( [0,1,0,   1,1,1,   1,1,0], [0,1,   1,1,   1,1] );

		// drawTriangle3DUV( [0,1,1,   0,0,0,   0,1,0], [0,1,   0,0,   0,1] );
		// drawTriangle3DUV( [0,1,1,   0,0,0,   0,0,1], [0,1,   0,0,   0,0] );

		// drawTriangle3DUV( [1,0,1,   1,1,0,   1,0,0], [1,0,   1,1,   1,0] );
		// drawTriangle3DUV( [1,0,1,   1,1,0,   1,1,1], [1,0,   1,1,   1,1] );

		// drawTriangle3DUV( [1,0,1,   0,0,0,   1,0,0], [1,0,   0,0,   1,0] );
		// drawTriangle3DUV( [1,0,1,   0,0,0,   0,0,1], [1,0,   0,0,   0,0] );

		// drawTriangle3DUV( [1,0,1,   0,1,1,   1,1,1], [1,0,   0,1,   1,1] );
		// drawTriangle3DUV( [1,0,1,   0,1,1,   0,0,1], [1,0,   0,1,   0,0] );
		
		var allUV = []

		allUV = allUV.concat([0,0,   1,1,   1,0]);
		allUV = allUV.concat([0,0,   1,1,   0,1]);

		allUV = allUV.concat([0,0,   1,1,   1,0]);
		allUV = allUV.concat([0,0,   1,1,   0,1]);
		allUV = allUV.concat([0,0,   1,1,   1,0]);
		allUV = allUV.concat([0,0,   1,1,   0,1]);
		allUV = allUV.concat([0,0,   1,1,   1,0]);
		allUV = allUV.concat([0,0,   1,1,   0,1]);
		allUV = allUV.concat([0,0,   1,1,   1,0]);
		allUV = allUV.concat([0,0,   1,1,   0,1]);
		allUV = allUV.concat([0,0,   1,1,   1,0]);
		allUV = allUV.concat([0,0,   1,1,   0,1]);

		// allUV = allUV.concat([0,1,   1,1,   0,1]);
		// allUV = allUV.concat([0,1,   1,1,   1,1]);

		// allUV = allUV.concat([0,1,   0,0,   0,1]);
		// allUV = allUV.concat([0,1,   0,0,   0,0]);

		// allUV = allUV.concat([0,0,   1,1,   1,0]);
		// allUV = allUV.concat([0,0,   1,1,   1,1]);

		// allUV = allUV.concat([0,0,   0,0,   1,0]);
		// allUV = allUV.concat([0,0,   0,0,   0,0]);

		// allUV = allUV.concat([1,0,   0,1,   1,1]);
		// allUV = allUV.concat([1,0,   0,1,   0,0]);

		var allverts = [];

		allverts = allverts.concat([0,0,0,   1,1,0,   1,0,0]);
		allverts = allverts.concat([0,0,0,   1,1,0,   0,1,0]);

		allverts = allverts.concat([0,1,0,   1,1,1,   0,1,1]);
		allverts = allverts.concat([0,1,0,   1,1,1,   1,1,0]);

		allverts = allverts.concat([0,1,1,   0,0,0,   0,1,0]);
		allverts = allverts.concat([0,1,1,   0,0,0,   0,0,1]);
		drawTriangle3DUV(allverts, allUV)

		gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
		var allverts = [];
		allverts = allverts.concat([1,0,1,   1,1,0,   1,0,0]);
		allverts = allverts.concat([1,0,1,   1,1,0,   1,1,1]);

		allverts = allverts.concat([1,0,1,   0,0,0,   1,0,0]);
		allverts = allverts.concat([1,0,1,   0,0,0,   0,0,1]);

		allverts = allverts.concat([1,0,1,   0,1,1,   1,1,1]);
		allverts = allverts.concat([1,0,1,   0,1,1,   0,0,1]);



		drawTriangle3DUV(allverts, allUV)

	}
}