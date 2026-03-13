"use client";

import { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/lib/Shader";

function ShaderMesh({ src }: { src: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const texture = useTexture(src);
    const [hovered, setHover] = useState(false);

    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uHover: { value: 0.0 }
    }), [texture]);

    useFrame((state, delta) => {
        if (materialRef.current) {
            const target = hovered ? 1.0 : 0.0;
            materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uHover.value,
                target,
                delta * 5
            );
        }
    });

    return (
        <mesh
            ref={meshRef}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

export function Scene({ src, alt }: { src: string; alt: string }) {
    return (
        <div
            style={{ width: "500px", height: "400px", position: "relative" }}
        >
            <Canvas camera={{ position: [0, 0, 0.86] }}>
                <Suspense fallback={null}>
                    <ShaderMesh src={src} />
                </Suspense>
            </Canvas>
        </div>
    );
}