class Scene {
  constructor(canvas) {
    this._canvas = document.querySelector('canvas');
    this._context = Util.getWebGLContext(canvas);
    this._meshs = [];
  }

  addMesh(mesh) {
    this._meshs.push(mesh);
  }

  setBackground(...args) {
    this._context.clearColor(...args);
  }

  render() {
    const gl = this._context;

    gl.clear(gl.COLOR_BUFFER_BIT);
    this._meshs.forEach((m) => {
      m.render();
    })
  }
}