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

		// allUV = allUV.concat([0,0,   1,1,   1,0]);
		// allUV = allUV.concat([0,0,   1,1,   0,1]);

		// allUV = allUV.concat([0,1,   1,1,   0,1]);
		// allUV = allUV.concat([0,1,   1,1,   1,1]);

		// allUV = allUV.concat([0,1,   0,0,   0,1]);
		// allUV = allUV.concat([0,1,   0,0,   0,0]);

		// allUV = allUV.concat([1,0,   1,1,   1,0]);
		// allUV = allUV.concat([1,0,   1,1,   1,1]);

		// allUV = allUV.concat([1,0,   0,0,   1,0]);
		// allUV = allUV.concat([1,0,   0,0,   0,0]);

		// allUV = allUV.concat([1,0,   0,1,   1,1]);
		// allUV = allUV.concat([1,0,   0,1,   0,0]);

		var allverts = [];
		allverts = allverts.concat([0,0,0,   1,1,0,   1,0,0]);
		allverts = allverts.concat([0,0,0,   1,1,0,   0,1,0]);

		allverts = allverts.concat([0,1,0,   1,1,1,   0,1,1]);
		allverts = allverts.concat([0,1,0,   1,1,1,   1,1,0]);

		allverts = allverts.concat([0,1,1,   0,0,0,   0,1,0]);
		allverts = allverts.concat([0,1,1,   0,0,0,   0,0,1]);

		allverts = allverts.concat([1,1,0,   1,1,1,   1,0,0]);
		allverts = allverts.concat([1,0,0,   1,1,1,   1,0,1]);

		allverts = allverts.concat([1,0,1,   0,0,0,   1,0,0]);
		allverts = allverts.concat([1,0,1,   0,0,0,   0,0,1]);

		allverts = allverts.concat([1,0,1,   0,1,1,   1,1,1]);
		allverts = allverts.concat([1,0,1,   0,1,1,   0,0,1]);

		var allNormals = []
		allNormals = allNormals.concat([0,0,-1,   0,0,-1,   0,0,-1]);
		allNormals = allNormals.concat([0,0,-1,   0,0,-1,   0,0,-1]);

		allNormals = allNormals.concat([0,1,0,   0,1,0,   0,1,0]);
		allNormals = allNormals.concat([0,1,0,   0,1,0,   0,1,0]);

		allNormals = allNormals.concat([-1,0,0,   -1,0,0,   -1,0,0]);
		allNormals = allNormals.concat([-1,0,0,   -1,0,0,   -1,0,0]);

		allNormals = allNormals.concat([1,0,0,   1,0,0,   1,0,0]);
		allNormals = allNormals.concat([1,0,0,   1,0,0,   1,0,0]);

		allNormals = allNormals.concat([0,-1,0,   0,-1,0,   0,-1,0]);
		allNormals = allNormals.concat([0,-1,0,   0,-1,0,   0,-1,0]);

		allNormals = allNormals.concat([0,0,1,   0,0,1,   0,0,1]);
		allNormals = allNormals.concat([0,0,1,   0,0,1,   0,0,1]);


		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// // allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// // allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);
		// allNormals = allNormals.concat([0,0,0,   0,0,0,   0,0,0]);


		// drawTriangle3DUV(allverts, allUV)
		drawTriangle3DUVNormal(allverts, allUV, allNormals)

	}
}