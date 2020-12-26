(function({ createShader, createProgram }) {
  const VS_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    varying vec4 vColor;
    void main() {
      gl_Position = aPosition;
      vColor = aColor;
    }
  `;
  const FS_SOURCE = `
    precision mediump float;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;
  const canvas = document.getElementsByTagName('canvas')[0];
  const gl = canvas.getContext('webgl');
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
  const program = createProgram(gl, vertexShader, fragShader);

  const vPosition = gl.getAttribLocation(program, 'aPosition');
  const aColor = gl.getAttribLocation(program, 'aColor');
  const vertices = [
    1.0,  0,   0, 1, 1, 0,
    0,    1.0, 0, 0, 1, 1,
    -1.0, 0,   0, 1, 0, 1
  ];

  const buffer = gl.createBuffer();
  const data = new Float32Array(vertices)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(vPosition);
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, data.BYTES_PER_ELEMENT * 6, 0);

  gl.enableVertexAttribArray(aColor);
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, data.BYTES_PER_ELEMENT * 6, data.BYTES_PER_ELEMENT * 3);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
})({
  createShader(context, type, source) {
    const shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);
    console.log(context.getShaderInfoLog(shader));
    return shader;
  },
  createProgram(context, vertexShader, fragShader) {
    const program = context.createProgram();
    context.attachShader(program, vertexShader);
    context.attachShader(program, fragShader);
    context.linkProgram(program);
    console.log(context.getProgramInfoLog(program));
    return program;
  }
})