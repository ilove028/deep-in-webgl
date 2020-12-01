(function() {
  const canvas = document.querySelector('canvas');
  const gl = Util.getWebGLContext(canvas);
  const vertexShader = Util.createShader(gl, gl.VERTEX_SHADER, document.querySelector('#vertexShader').textContent);
  const fragShader = Util.createShader(gl, gl.FRAGMENT_SHADER, document.querySelector('#fragShader').textContent);
  const program = Util.createProgram(gl, vertexShader, fragShader);
  const aPosition = gl.getAttribLocation(program, 'aPosition');
  const buffer = gl.createBuffer();
  const widthScale = d3.scaleLinear()
    .domain([0, canvas.width])
    .range([-1, 1]);
  const heightScale = d3.scaleLinear()
    .domain(0, canvas.height)
    .range([-1, 1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0.5, 0, 0, 0.5]), gl.STATIC_DRAW);
  const { width, height } = canvas;
  gl.viewport(width / 4, 0, width, height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(aPosition);

  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
})();