const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

if (gl) {
  function program() {
    const positions = [0, -0.75, 0.75, -0.75, -0.5, 0.5];
    const vertexShaderCode = `
          attribute vec4 a_position;
          
          void main() {
              gl_Position = a_position;
          }
      `;

    const fragmentShaderCode = `
          precision mediump float;
          
          void main() {
              gl_FragColor = vec4(0.75, 0.67, 0, 1.0);
          }
      `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderCode
    );

    const app = gl.createProgram();

    gl.attachShader(app, vertexShader);
    gl.attachShader(app, fragmentShader);
    gl.linkProgram(app);

    if (!gl.getProgramParameter(app, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(app));
      gl.deleteProgram(app);
      return;
    }

    gl.useProgram(app);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.clearColor(5 / 255, 5 / 255, 15 / 255, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const positionAttributeLocation = gl.getAttribLocation(app, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
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

  window.onload = program;
}
