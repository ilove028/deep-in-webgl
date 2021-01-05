(function() {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');
  const VS_SOURCE = `
    attribute vec2 aPosition;
    attribute vec2 aUv;
    varying vec2 vUv;

    void main() {
      gl_Position = aPosition;
      vUv = aUv;
    }
  `;
  const FS_SOURCE = `
    precision mediump float;
    uniform sampler2D uTexture0;
    uniform sampler2D uTexture1;
    varying vec2 vUv;

    void main() {
      gl_FragColor = texture2D(uTexture0, vUv) + texture2D(uTexture2, vUv);
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

  // buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  function createTexture() {
    const texture0 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture0;
  }

  Promise.all([
    Util.loadImage('https://webglfundamentals.org/webgl/resources/leaves.jpg'),
    Util.loadImage('https://webglfundamentals.org/webgl/resources/leaves.jpg')
  ]).then(([img0, img1]) => {

  })
})()