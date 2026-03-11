"use client";
import { useRef, RefObject } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";


const vertexShader = `
  varying vec2 vUv;

  uniform float uDistortion;
  uniform float uTime;

  void main() {
    vUv = uv;

    vec3 pos = position;

    float wave = sin(pos.x * 0.015 + uTime * 1.5) * uDistortion * 4.0;
    pos.y += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader =  `
  uniform sampler2D uTexture;
  uniform float uDistortion;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    float ripple = sin(uv.y * 10.0 + uTime * 2.0) * uDistortion * 0.025;
    uv.x += ripple;
    
    float ca = uDistortion * 0.012;
    float r = texture2D(uTexture, uv + vec2( ca, 0.0)).r;
    float g = texture2D(uTexture, uv             ).g;
    float b = texture2D(uTexture, uv - vec2( ca, 0.0)).b;

    vec2 center = uv - 0.5;
    float vignette = 1.0 - dot(center, center) * 0.6;

    gl_FragColor = vec4(r, g, b, 1.0) * vignette;
  }
`;


interface Props {
    src: string;
    domRef: RefObject<(HTMLDivElement | null)[]>;
    domIndex: number;
    scrollVelocityRef: RefObject<number>;
}

export default function ImagePlane({ src, domRef, domIndex, scrollVelocityRef }: Props) {
    const meshRef     = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const distortion  = useRef(0);

    const texture = useLoader(TextureLoader, src);

    useFrame(({ clock }) => {
        const mesh     = meshRef.current;
        const material = materialRef.current;
        const el       = domRef.current[domIndex];

        if (!mesh || !material || !el) return;

        const rect = el.getBoundingClientRect();

        mesh.position.x = rect.left + rect.width  / 2 - window.innerWidth  / 2;
        mesh.position.y = -(rect.top + rect.height / 2 - window.innerHeight / 2);
        mesh.scale.x    = rect.width;
        mesh.scale.y    = rect.height;

        const targetDistortion = Math.abs(scrollVelocityRef.current);
        distortion.current += (targetDistortion - distortion.current) * 0.08;
        distortion.current *= 0.90;
        material.uniforms.uDistortion.value = distortion.current;
        material.uniforms.uTime.value       = clock.getElapsedTime();
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTexture:    { value: texture },
                    uDistortion: { value: 0 },
                    uTime:       { value: 0 },
                }}
            />
        </mesh>
    );
}