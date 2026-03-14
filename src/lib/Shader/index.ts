export const vertexShader = `
  uniform float uScrollVelocity;
  varying vec2 vUv;

  const float PI = 3.1415926535897932384626433832795;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float curve = sin(vUv.y * PI) * uScrollVelocity * 1.5;
    pos.z += curve;                                     

    gl_Position = projectionMatrix                     
                * modelViewMatrix                      
                * vec4(pos, 1.0);                
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
    float dist = distance(uv, uMouse);
    float mask = smoothstep(0.1, 0.3, dist);

    float noise = random(uv + uTime * 0.15) * uHover * 0.06 * mask;
    uv += noise;                      
  
    float offset = uHover * 0.018 * mask;    

    float r = texture2D(uTexture, uv + vec2( offset, 0.0)).r;
    float g = texture2D(uTexture, uv                    ).g;  
    float b = texture2D(uTexture, uv - vec2( offset, 0.0)).b;

    vec3 col = vec3(r, g, b);
    
    col += uHover * 0.07 * mask;
    gl_FragColor = vec4(col, 1.0);
  }
`;