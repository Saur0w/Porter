export const vertexShader =  `
  varying vec2 vUv;

  void main() {
    vUv = uv;                                         
    gl_Position = projectionMatrix                     
                * modelViewMatrix                      
                * vec4(position, 1.0);                
  }
`;

export const fragmentShader = `
  uniform sampler2D uTexture;   
  uniform float     uHover;     
  uniform float     uTime;  
      
  varying vec2 vUv;
  
  float random(vec2 seed) {
    return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    float noise = random(uv + uTime * 0.15) * uHover * 0.06;
    uv += noise;                      
    
    float offset = uHover * 0.018;    

    float r = texture2D(uTexture, uv + vec2( offset, 0.0)).r;
    float g = texture2D(uTexture, uv                    ).g;  
    float b = texture2D(uTexture, uv - vec2( offset, 0.0)).b;

    vec3 col = vec3(r, g, b);
    col += uHover * 0.07;

    gl_FragColor = vec4(col, 1.0);
  }
`;