(function() {
  const indices = [
    0, 1, 2,
    1, 2, 3
  ];
  const vertices = [
    -0.5, 0.5, 0,
    0.5, 0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0
  ];
  const uvs = [
    0, 0,
    1, 0,
    0, 1,
    1, 1
  ];
  const VS_SOURCE = `
    attribute vec4 aPosition;
    attribute vec2 aUv;
    varying vec2 vUv;

    void main() {
      gl_Position = aPosition;
      vUv = aUv;
    }
  `;
  const FS_SOURCE = `
  precision mediump float;
  uniform sampler2D texture;
  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(texture, vUv);
  }
  `;

  const scene = new Scene('#canvas');
  new Mesh({ indices, vertices, uvs, vertexSource: VS_SOURCE, fragmentSource: FS_SOURCE }, scene);

  scene.render();

})();