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
    1.0,  0,    0,
    0,    1.0,  0,
    -1.0, 0,    0,
    0,    -1.0, 0
  ];
  const indices = [
    0, 1, 2,
    0, 2, 3
  ]

  const buffer = gl.createBuffer();
  const data = new Float32Array(vertices)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(vPosition);
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 3 * data.BYTES_PER_ELEMENT, 0);

  gl.vertexAttrib4f(aColor, 1, 1, 0, 1);
  // gl.enableVertexAttribArray(aColor);
  // gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, data.BYTES_PER_ELEMENT * 6, data.BYTES_PER_ELEMENT * 3);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  gl.clearColor(0, 0, 0, 1);
  
  // gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  // 使用索引缓冲区 顶点缓冲区index由索引决定 可以任意顺序，而直接使用drawArrays index只能0 1 2， 3增加。
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  /**
   * getBydIndex(index) {
   *  getFromArrayBuffer(index)
   * }
   * 
   * getFromArrayBuffer(index) {
   *  const start = index * stride * BYTES_PER_ELEMENT + offset * BYTES_PER_ELEMENT
   *  const end = start + size * FLOAT.BYTES_PER_FLOAT;
   * }
   * 
   * setAttribute(name, value) {
   *   name = value
   * }
   * 
   * vertexShaderFunction(index, count isIndex) {
   *  const attributes = findAttributes();
   *  if (isIndex) {
   *    const i = indexBuffer[index]
   *    attributes.forEach(a => setAttribute(a, getFromArrayBuffer(i)));
   *  } else {
   *    attributes.forEach(a => setAttribute(a, getFromArrayBuffer(index)));
   *  }
   * }
   * 
   * for (let i = 0; i < 6) {
   *  {
   *    vertexShaderFunction(i, count = 6, true);
   *  }
   * }
   */
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