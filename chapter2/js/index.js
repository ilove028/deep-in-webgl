(function() {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  const VS_SOURCE = `
    attribute vec2 aPosition;
    attribute vec2 aUv;
    varying vec2 vUv;

    void main() {
      gl_Position = vec4(aPosition, 0, 1);
      vUv = aUv;
    }
  `;
  const FS_SOURCE = `
    precision mediump float;
    uniform sampler2D uTexture0;
    uniform sampler2D uTexture1;
    uniform float uX;
    varying vec2 vUv;

    void main() {
      gl_FragColor = texture2D(uTexture1, vUv) + texture2D(uTexture0, vec2(vUv.x + uX, vUv.y)).bgra;
      // gl_FragColor = vec4(1, 0, 1, 1);
    }
  `;
  const data = new Float32Array([
    -0.5,  0.5, 0, 0,
    0.5,   0.5, 1, 0,
    0.5,  -0.5, 1, 1,
    -0.5, -0.5, 0, 1
  ]);
  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3
  ]);

  const vertexShader = Util.createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
  const fragShader = Util.createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
  const program = Util.createProgram(gl, vertexShader, fragShader);
  const aPosition = gl.getAttribLocation(program, 'aPosition');
  const aUv = gl.getAttribLocation(program, 'aUv');
  const uTexture0 = gl.getUniformLocation(program, 'uTexture0');
  const uTexture1 = gl.getUniformLocation(program, 'uTexture1');
  const uX = gl.getUniformLocation(program, 'uX');

  // buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  function createTexture(img) {
    const texture0 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    return texture0;
  }

  Promise.all([
    Util.loadImage('https://webglfundamentals.org/webgl/resources/leaves.jpg'),
    Util.loadImage('https://c1.staticflickr.com/9/8873/18598400202_3af67ef38f_q.jpg')
  ]).then(([img0, img1]) => {
    gl.useProgram(program);
    const texture0 = createTexture(img0);
    const texutre1 = createTexture(img1);

    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.uniform1i(uTexture0, 1);

    gl.activeTexture(gl.TEXTURE0 + 2);
    gl.bindTexture(gl.TEXTURE_2D, texutre1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img1);
    gl.uniform1i(uTexture1, 2);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 4 * data.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 4 * data.BYTES_PER_ELEMENT, 2 * data.BYTES_PER_ELEMENT);

    let delta = 0;

    function render() {
      gl.uniform1f(uX, delta);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    function tick() {
      render();
      delta += 0.01;
      requestAnimationFrame(tick);
    }
    tick();
  })
})()