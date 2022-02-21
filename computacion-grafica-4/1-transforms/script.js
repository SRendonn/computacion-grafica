const canvasOg = document.getElementById('canvas-webgl-og');
const glOg = canvasOg.getContext('webgl2');

const canvas = document.getElementById('canvas-webgl-transform');
const gl = canvas.getContext('webgl2');
const scaleXInput = document.getElementById('scaleX');
const scaleYInput = document.getElementById('scaleY');
const translateXInput = document.getElementById('translateX');
const translateYInput = document.getElementById('translateY');
const rotateInput = document.getElementById('rotate');

if (glOg && gl) {
  function programOg() {
    const attributes = {
      positions: [0.5, -0.5, -0.5, 0.5],
    };
    const vertexShaderCode = `
          attribute vec4 a_position;

          void main() {
              gl_Position = a_position;
          }
      `;

    const fragmentShaderCode = `
          precision mediump float;
          
          void main() {
              gl_FragColor = vec4(0, 0, 0, 1.0);
          }
      `;

    const vertexShader = createShader(
      glOg,
      glOg.VERTEX_SHADER,
      vertexShaderCode
    );
    const fragmentShader = createShader(
      glOg,
      glOg.FRAGMENT_SHADER,
      fragmentShaderCode
    );

    const app = createProgram(glOg, vertexShader, fragmentShader);

    glOg.useProgram(app);

    const positionBuffer = glOg.createBuffer();
    glOg.bindBuffer(glOg.ARRAY_BUFFER, positionBuffer);
    glOg.bufferData(
      glOg.ARRAY_BUFFER,
      new Float32Array(attributes.positions),
      glOg.STATIC_DRAW
    );
    glOg.clearColor(1.0, 1.0, 1.0, 1.0);
    glOg.clear(glOg.COLOR_BUFFER_BIT);

    const positionAttributeLocation = glOg.getAttribLocation(app, 'a_position');
    glOg.enableVertexAttribArray(positionAttributeLocation);
    glOg.vertexAttribPointer(
      positionAttributeLocation,
      2,
      glOg.FLOAT,
      false,
      0,
      0
    );
    glOg.drawArrays(glOg.LINE_STRIP, 0, 2);
  }

  function programTransform() {
    const attributes = {
      positions: [0.5, -0.5, -0.5, 0.5],
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

          void main() {
              gl_Position = u_scale_matrix * a_position + u_translate_vec;
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

    scaleXInput.addEventListener('change', function () {
      uniforms.scale_matrix[0] = Number.parseFloat(scaleXInput.value);
    });

    scaleYInput.addEventListener('change', function () {
      uniforms.scale_matrix[5] = Number.parseFloat(scaleYInput.value);
      console.log(scaleYInput.value);
    });

    translateXInput.addEventListener('change', function () {
      uniforms.translate_vec[0] = Number.parseFloat(translateXInput.value);
    });

    translateYInput.addEventListener('change', function () {
      uniforms.translate_vec[1] = Number.parseFloat(translateYInput.value);
    });

    rotateInput.addEventListener('change', function () {
      const theta = (Number.parseFloat(rotateInput.value) * Math.PI) / 180;
      uniforms.rotation_matrix = [
        Math.cos(theta),
        -Math.sin(theta),
        Math.sin(theta),
        Math.cos(theta),
      ];
    });

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(attributes.positions),
      gl.STATIC_DRAW
    );
    const scaleMatrixUniformLocation = gl.getUniformLocation(
      app,
      'u_scale_matrix'
    );
    gl.uniformMatrix4fv(
      scaleMatrixUniformLocation,
      false,
      uniforms.scale_matrix
    );
    const translateVecUniformLocation = gl.getUniformLocation(
      app,
      'u_translate_vec'
    );
    gl.uniform4fv(translateVecUniformLocation, uniforms.translate_vec);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const positionAttributeLocation = gl.getAttribLocation(app, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, 2);
  }

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

  window.onload = () => {
    programOg();
    programTransform();
  };

  window.requestAnimationFrame(renderLoop);
}
