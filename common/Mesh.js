class Mesh {
  constructor({ vertices, indices, uvs, normals, colores, vertexSource, fragmentSource }, scene) {
    this._vertices = vertices;
    this._indices = indices;
    this._uvs = uvs;
    this._normals = normals;
    this._colores = colores;
    this._vertexSource = vertexSource;
    this._fragmentSource = fragmentSource;
    this._scene = scene;
    this.parent = null;

    this.init();
    scene.addMesh(this);
  }
  init() {
    this.initProgram();
    this.initBuffer();
    this.initTexture();
    this.bindAttributes();
  }
  initProgram() {
    // TODO  compare general program
    this._vertexShader = Util.createShader(this._scene._context, this._scene._context.VERTEX_SHADER, this._vertexSource);
    this._fragmentShader = Util.createShader(this._scene._context, this._scene._context.FRAGMENT_SHADER, this._fragmentSource);
    this._program = Util.createProgram(this._scene._context, this._vertexShader, this._fragmentShader);
  }
  initBuffer() {
    const gl = this._scene._context;
    this._verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);

    this._uvsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._uvs), gl.STATIC_DRAW);

    this._indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);
  }
  bindAttributes() {
    const gl = this._scene._context;
    const program = this._program;
    this._attributes = [
      [gl.getAttribLocation(program, 'aPosition'), this._verticesBuffer, 3],
      [gl.getAttribLocation(program, 'aUv'), this._uvsBuffer, 2]
    ]
  }

  setAttributes() {
    const gl = this._scene._context;

    this._attributes.forEach(([target, buffer, size]) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(target);
      gl.vertexAttribPointer(target, size, gl.FLOAT, false, 0, 0);
    })
  }

  initTexture() {
    const gl = this._scene._context;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    this._texture = texture;
  }

  setTexture(target, unit = 0) {
    const gl = this._scene._context;
  
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.uniform1i(target, unit);
  }

  render() {
    // TODO reuse program
    const gl = this._scene._context;
    const program = this._program;
    gl.useProgram(program);
    this.setAttributes();
    gl.drawElements(gl.TRIANGLES, this._indices.length, gl.UNSIGNED_SHORT, 0);
  }
}