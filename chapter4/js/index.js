(function() {
  const canvas = document.querySelector('#canvas');
  const gl = Util.getWebGLContext(canvas);
  const VS_SOURCE = `
    attribute vec2 aPosition;
    attribute vec2 aUv;
    uniform mat4 uProject;
    uniform float uX;
    varying vec2 vUv;
    void main() {
      gl_Position = uProject * vec4(aPosition, 0.0, 1.0);
      vUv = vec2(aUv.x, aUv.y + uX);
    }
  `;
  const FS_SOURCE = `
    precision mediump float;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D(uTexture, vUv).gbra;
    }
  `;
  const vertexShader = Util.createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
  const fragmentShader = Util.createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
  const program = Util.createProgram(gl, vertexShader, fragmentShader);
  const proMatrix = glMatrix.mat4.ortho(new Array(16), 0, canvas.width, canvas.height, 0, 1000, -1000);

  // texture
  const texture = gl.createTexture();
  const img = new Image();
  img.src = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fningbo.sinaimg.cn%2F2014%2F0424%2FU7974P1480DT20140424141334.png&refer=http%3A%2F%2Fningbo.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1612060092&t=a6e0291e7d870a1a83feb895eac02543';
  img.crossOrigin = 'anonymous';
  // img.src = 'bg.png';
  texture.img = img;
  img.onload = function() {
    render(texture)
  }

  function render(texture) {
    const data = new Float32Array([
      100, 100, 0, 0,
      300, 100, 1, 0,
      300, 300, 1, 1,
      100, 100, 0, 0,
      300, 300, 1, 1,
      100, 300, 0, 1
    ]);
  
    // buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const aUv = gl.getAttribLocation(program, 'aUv');
    const uX = gl.getUniformLocation(program, 'uX');
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.img);

    const uProject = gl.getUniformLocation(program, 'uProject');

    // gl.clearColor(0, 0, 0, 0);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    let alpha = 0;
    gl.uniformMatrix4fv(uProject, false, proMatrix);
    gl.uniform1f(uX, alpha);

    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aUv);

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 4 * data.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 4 * data.BYTES_PER_ELEMENT, 2 * data.BYTES_PER_ELEMENT);

    function tick() {
      animate();
      requestAnimationFrame(tick)
    }
    function animate() {
      gl.uniform1f(uX, alpha);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      alpha += 0.01;
    }

    tick()
  }
})()