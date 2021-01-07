(function() {
  const canvas = document.querySelector('#canvas');
  const gl = Util.getWebGLContext(canvas);


  function setup(canvas, gl) {
    const VS_SOURCE = `
      attribute vec2 aUv;
      uniform sampler2D uTexture;
      uniform mat4 uMvp;

      void main() {
        vec4 color = texture2D(uTexture, aUv);
        float gray = color.r * 0.3 + color.g * 0.59 + color.b * 0.11;
        gl_Position = uMvp * vec4(aUv * 2.0 - 1.0, gray * 3.0, 1.0);
      }
    `;

    const FS_SOURCE = `
      precision mediump float;

      void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.9, 1.0);
      }
    `;
    const vertexShader = Util.createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
    const fragmentShader = Util.createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);
    const program = Util.createProgram(gl, vertexShader, fragmentShader);
    return (width, height, maxHeight, divisions = 10) => {
      const g = function* (size) {
        const step = 1 / size;
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            yield step * (0.5 + i);
            yield step * (0.5 + j);
          }
        }
      }
      const datas = new Float32Array(g(divisions));
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, datas, gl.STATIC_DRAW);
      
      return Util.loadImage('https://webglfundamentals.org/webgl/resources/leaves.jpg').then((img) => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        return {
          canvas,
          gl,
          program,
          attributes: [{ name: 'aUv', value: gl.getAttribLocation(program, 'aUv') }],
          uniforms: [
            { name: 'uTexture', value: gl.getUniformLocation(program, 'uTexture') },
            { name: 'uMvp', value: gl.getUniformLocation(program, 'uMvp') }
          ],
          buffer,
          texture
        }
      });
    }
  }

  setup(canvas, gl)(100, 100, 3000, 50).then(render)

  function render({ gl, program, buffer, texture }) {
    const aUv = gl.getAttribLocation(program, 'aUv');
    const uTexture = gl.getUniformLocation(program, 'uTexture');
    const uMvp = gl.getUniformLocation(program, 'uMvp');
    const mat4 = glMatrix.mat4.create();
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.uniform1i(uTexture, gl.TEXTURE0);
    glMatrix.mat4.fromXRotation(mat4, 2 * Math.PI / 180);
    glMatrix.mat4.fromYRotation(mat4, 0 * Math.PI / 180);
    gl.uniformMatrix4fv(uMvp, false, mat4);

    gl.drawArrays(gl.POINTS, 0, 2500);
  }

})()