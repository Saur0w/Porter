export const vertexShader = `
  uniform float uScrollVelocity;
  uniform float uHover;
  uniform vec2  uMouse;
  uniform float uTime;
  varying vec2  vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float scroll = uScrollVelocity * 0.8;   

    pos.z -= sin(uv.x * 3.14) * sin(uv.y * 3.14) * scroll;  
    pos.z -= sin(uv.y * 3.14) * scroll * 0.6;   
    pos.z += uv.y * scroll * 0.3;

    float dist  = distance(uv, uMouse);
    float bulge = smoothstep(0.35, 0.0, dist) * uHover;
    pos.z += bulge * 0.018;
    float wave = sin(uv.x * 8.0 + uv.y * 4.0 + uTime * 2.5) * uHover * 0.008;
    pos.z += wave * (1.0 - bulge); 

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float     uHover;
  uniform float     uTime;
  uniform vec2      uMouse;

  varying vec2 vUv;

  float random(vec2 seed) {
    return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    float dist      = distance(uv, uMouse);
    float clearZone = smoothstep(0.0, 0.44, dist);  

    float grain = (random(uv + uTime * 1.5) - 0.5) * 0.045;
    grain *= uHover * clearZone;
    uv += grain;

    float chromaStr = uHover * clearZone * 0.018;
    float r = texture2D(uTexture, uv + vec2( chromaStr, 0.0)).r;
    float g = texture2D(uTexture, uv                        ).g;
    float b = texture2D(uTexture, uv - vec2( chromaStr, 0.0)).b;

    vec3 col = vec3(r, g, b);
    float glow = (1.0 - clearZone) * uHover;   
    col += glow * 0.06;

    float vignette = distance(uv, vec2(0.5));
    vignette = smoothstep(0.3, 0.8, vignette);
    col *= 1.0 - vignette * (0.5 + uHover * 0.2);

    gl_FragColor = vec4(col, 1.0);
  }
`;