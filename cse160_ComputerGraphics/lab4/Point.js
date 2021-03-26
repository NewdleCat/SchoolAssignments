class Point
{
  constructor(x, y, rgba, size)
  {
    this.x = x;
    this.y = y;
    this.rgba = rgba;
    this.size = size;
  }

  render()
  {
 

    var x = this.x;
    var y = this.y;
    var rgba = this.rgba;
    var size = this.size;

    gl.disableVertexAttribArray(a_Position);
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, x, y, 0.0);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size
    gl.uniform1f(u_Size, size)
    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
    // console.log("SAD")

    // drawTriangle([x,y,   x+0.1,y,   x,y+0.1])
    // console.log('sdas')
  }
}