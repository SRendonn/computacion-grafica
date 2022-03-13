const canvas = document.getElementById('canvas-webgl-transform');
const gl = canvas.getContext('webgl2');
const scaleXInput = document.getElementById('scaleX');
const scaleYInput = document.getElementById('scaleY');
const translateXInput = document.getElementById('translateX');
const translateYInput = document.getElementById('translateY');
const rotateInput = document.getElementById('rotate');
const resetButton = document.getElementById('reset');
const dimensionsForm = document.getElementById('dimensionsForm');
const inputEvent = new Event('input', { bubbles: false });
const inputEventBubbles = new Event('input', { bubbles: true });

if (gl) {
  function createProgram(gl, vertexShader, fragmentShader) {
    const app = gl.createProgram();
    gl.attachShader(app, vertexShader);
    gl.attachShader(app, fragmentShader);
    gl.linkProgram(app);

    if (!gl.getProgramParameter(app, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(app));
      gl.deleteProgram(app);
      return;
    }
    return app;
  }

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  function lerp(t, p1, p2) {
    return (1 - t) * p1 + t * p2;
  }

  function reduce(t, p1, p2, ...ps) {
    if (ps.length) return [lerp(t, p1, p2), ...reduce(t, p2, ...ps)];
    return [lerp(t, p1, p2)];
  }

  function deCasteljau(t, ps) {
    if (ps.length > 1) return deCasteljau(t, reduce(t, ...ps));
    return ps[0];
  }

  function setupProgram() {
    const attributes = {
      positions: [-0.2, -0.7, 0, 0.5],
    };

    const uniforms = {
      scale_matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      translate_vec: [0, 0, 0, 0],
      rotation_matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    };

    // En OpenGL - y por consiguiente en WebGL - existen las funciones glScale[x|y|z]
    // así como glTranslate[x|y|z]
    const vertexShaderCode = `
          attribute vec4 a_position;
          uniform mat4 u_scale_matrix;
          uniform vec4 u_translate_vec;
          uniform mat4 u_rotation_matrix;

          void main() {
              gl_Position = u_scale_matrix * a_position * u_rotation_matrix + u_translate_vec;
          }
      `;

    const fragmentShaderCode = `
          precision mediump float;
          
          void main() {
              gl_FragColor = vec4(0, 0, 0, 1.0);
          }
      `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderCode
    );

    const app = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(app);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // ? locations
    const positionAttributeLocation = gl.getAttribLocation(app, 'a_position');
    const scaleMatrixUniformLocation = gl.getUniformLocation(
      app,
      'u_scale_matrix'
    );
    const translateVecUniformLocation = gl.getUniformLocation(
      app,
      'u_translate_vec'
    );
    const rotationMatrixUniformLocation = gl.getUniformLocation(
      app,
      'u_rotation_matrix'
    );

    resetButton.addEventListener('click', function () {
      scaleXInput.value = '1';
      scaleXInput.dispatchEvent(inputEvent);
      scaleYInput.value = '1';
      scaleYInput.dispatchEvent(inputEvent);
      translateXInput.value = '0';
      translateXInput.dispatchEvent(inputEvent);
      translateYInput.value = '0';
      translateYInput.dispatchEvent(inputEvent);
      rotateInput.value = '0';
      rotateInput.dispatchEvent(inputEventBubbles);
    });

    dimensionsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(dimensionsForm);
      const espalda = formData.get('espalda');
      const ancho = formData.get('ancho');
      const cadera = formData.get('cadera');
      const largo = formData.get('largo');

      const w = Math.max(espalda, ancho, cadera, largo) * 2;
      const normalize = (n) => n / w;
      const centerX = (x, ref) => x - ref / 2;

      const caderaPointL = [centerX(0, cadera), 0];
      const caderaPointR = [centerX(cadera, cadera), 0];

      const anchoY = (2 / 3) * largo;
      const anchoPointL = [centerX(0, ancho), anchoY];
      const anchoPointR = [centerX(ancho, ancho), anchoY];

      const espaldaY = largo * 0.95;

      const espaldaPointL = [centerX(0, espalda), espaldaY];
      const espaldaPointR = [centerX(espalda, espalda), espaldaY];

      const largoXL = 0.25 * cadera;
      const largoXR = 0.75 * cadera;

      const cuelloPointsX = [
        centerX(largoXR, cadera),
        0,
        centerX(largoXL, cadera),
      ];
      const cuelloPointsY = [largo, largo * 0.9, largo];

      const cuelloPoints = [];
      for (let t = 0; t <= 1; t = t + 0.1) {
        const cuelloPointX_t = deCasteljau(t, cuelloPointsX);
        const cuelloPointY_t = deCasteljau(t, cuelloPointsY);

        cuelloPoints.push(cuelloPointX_t, cuelloPointY_t);
      }

      const mangasLength = (1 / 3) * espalda;
      const mangaPointsL = [
        espaldaPointL[0] - mangasLength * Math.cos(Math.PI / 3),
        espaldaY - mangasLength * Math.sin(Math.PI / 3),
        espaldaPointL[0],
        espaldaY - 2 * mangasLength * Math.sin(Math.PI / 3),
      ];
      const mangaPointsR = [
        espaldaPointR[0],
        espaldaY - 2 * mangasLength * Math.sin(Math.PI / 3),
        espaldaPointR[0] + mangasLength * Math.cos(Math.PI / 3),
        espaldaY - mangasLength * Math.sin(Math.PI / 3),
      ];

      attributes.positions = [
        ...caderaPointR,
        ...anchoPointR,
        ...mangaPointsR,
        ...espaldaPointR,
        ...cuelloPoints,
        ...espaldaPointL,
        ...mangaPointsL,
        ...anchoPointL,
        ...caderaPointL,
        ...caderaPointR,
      ].map(normalize);
      render();
    });

    canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.25 : 0.25;

      scaleXInput.value = (
        Number.parseFloat(scaleXInput.value) + delta
      ).toString();
      scaleYInput.value = (
        Number.parseFloat(scaleYInput.value) + delta
      ).toString();

      scaleXInput.dispatchEvent(inputEvent);
      scaleYInput.dispatchEvent(inputEventBubbles);
    });

    scaleXInput.addEventListener('input', function (e) {
      uniforms.scale_matrix[0] = Number.parseFloat(scaleXInput.value);
      gl.uniformMatrix4fv(
        scaleMatrixUniformLocation,
        false,
        uniforms.scale_matrix
      );
      document.querySelector(
        'label[for="scaleX"]'
      ).innerHTML = `Scale X: ${scaleXInput.value}`;
      if (e.bubbles) {
        render();
      }
    });

    scaleYInput.addEventListener('input', function (e) {
      uniforms.scale_matrix[5] = Number.parseFloat(scaleYInput.value);
      gl.uniformMatrix4fv(
        scaleMatrixUniformLocation,
        false,
        uniforms.scale_matrix
      );
      document.querySelector(
        'label[for="scaleY"]'
      ).innerHTML = `Scale Y: ${scaleYInput.value}`;
      if (e.bubbles) {
        render();
      }
    });

    translateXInput.addEventListener('input', function (e) {
      uniforms.translate_vec[0] = Number.parseFloat(translateXInput.value);
      gl.uniform4fv(translateVecUniformLocation, uniforms.translate_vec);
      document.querySelector(
        'label[for="translateX"]'
      ).innerHTML = `Translate X: ${translateXInput.value}`;
      if (e.bubbles) {
        render();
      }
    });

    translateYInput.addEventListener('input', function (e) {
      uniforms.translate_vec[1] = Number.parseFloat(translateYInput.value);
      gl.uniform4fv(translateVecUniformLocation, uniforms.translate_vec);
      document.querySelector(
        'label[for="translateY"]'
      ).innerHTML = `Translate Y: ${translateYInput.value}`;
      if (e.bubbles) {
        render();
      }
    });

    rotateInput.addEventListener('input', function (e) {
      const theta = (Number.parseFloat(rotateInput.value) * Math.PI) / 180;
      uniforms.rotation_matrix = [
        Math.cos(theta),
        -Math.sin(theta),
        0,
        0,
        Math.sin(theta),
        Math.cos(theta),
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
      ];
      gl.uniformMatrix4fv(
        rotationMatrixUniformLocation,
        false,
        uniforms.rotation_matrix
      );
      document.querySelector(
        'label[for="rotate"]'
      ).innerHTML = `Rotate: ${rotateInput.value}°`;
      if (e.bubbles) {
        render();
      }
    });

    gl.uniformMatrix4fv(
      scaleMatrixUniformLocation,
      false,
      uniforms.scale_matrix
    );
    gl.uniformMatrix4fv(
      rotationMatrixUniformLocation,
      false,
      uniforms.rotation_matrix
    );
    gl.uniform4fv(translateVecUniformLocation, uniforms.translate_vec);

    function render() {
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(attributes.positions),
        gl.STATIC_DRAW
      );
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(
        gl.LINE_STRIP,
        0,
        Math.floor(attributes.positions.length / 2)
      );
    }

    render();
  }

  window.onload = () => {
    setupProgram();
  };
}
