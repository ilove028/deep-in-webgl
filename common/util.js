class Util {
  static getWebGLContext(canvas) {
    return canvas.getContext('webgl');
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
      gl.deleteShader(shader);
      throw new Error(gl.getShaderInfoLog(shader));
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
}