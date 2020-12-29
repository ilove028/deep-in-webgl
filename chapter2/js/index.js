(function() {
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl');
  const VS_SOURCE = `
    attribute vec4 aPosition;
    void main() {
      gl_Position = aPosition;
    }
  `;
  const FS_SOURCE = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
      gl_FragColor = uColor;
    }
  `;
  const vertexShader = Util.createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
  const fragShader = Util.createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
  const program = Util.createProgram(gl, vertexShader, fragShader);

  // Init buffer
  const vertices = [
    0, 0
  ];
  const data = new Float32Array(vertices)
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  function fillBuffer(now) {
    const raidus = now / 500 * Math.PI;
    vertices.push(Math.cos(raidus), Math.sin(raidus));
    const data = new Float32Array(vertices);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

  function render(now) {
    // draw
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const uColor = gl.getUniformLocation(program, 'uColor');
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 2 * data.BYTES_PER_ELEMENT, 0);
    gl.useProgram(program);
    gl.uniform4f(uColor, 1, 1, 0, 1);
    fillBuffer(now);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
  }

  function tick(now) {
    render(now);
    requestAnimationFrame(tick);
  }

  tick(0)
})({})