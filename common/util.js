class Util {
  static getWebGLContext(selector) {
    if (typeof selector === 'string') {
      selector = document.querySelector(selector);
    }
    return selector.getContext('webgl');
  }
  /**
   * 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
   * @param {WebGLContext} gl 
   * @param {*} type 
   * @param {String} source 
   */
  static createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
    }
  }

  /**
   * 创建program
   * @param {WebGLContext} gl 
   * @param {*} vertexShader 
   * @param {*} fragmentShader 
   */
  static createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return program;
    } else {
      gl.deleteProgram(program);
      throw new Error(gl.getProgramInfoLog(program));
    }
  }

  /**
   * 在x y z 方向平移
   * @param {Number} tx 
   * @param {Number} ty 
   * @param {Number} tz 
   */
  static translate(tx, ty, tz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx,ty,tz,1
    ];
  }

  /**
   * 沿着x y z轴缩放
   * @param {Number} sx 
   * @param {Number} sy 
   * @param {Number} sz 
   */
  static scaling(sx, sy, sz) {
    return [
      sx, 0,  0, 0,
      0, sy,  0, 0,
      0,  0, sz, 0,
      0,  0,  0, 1
    ];
  }

  static rotateX(degree) {
    const radian = degree / 180 * Math.PI;
    const s = Math.sin(radian);
    const c = Math.cos(radian);
    return [
      1, 0,  0, 0,
      0, c,  s, 0,
      0, -s, c, 0,
      0, 0,  0, 1
    ];
  }
}