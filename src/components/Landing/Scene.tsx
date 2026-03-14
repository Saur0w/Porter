"use client";

import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/lib/Shader";

function ShaderMesh({ src }: { src: string }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const texture = useTexture(src);
    const [hovered, setHover] = useState(false);

    const lastScrollY = useRef(0);
    const targetVelocity = useRef(0);

    const uniforms = useMemo(() => ({
        uTexture: { value: texture },
        uHover: { value: 0.0 },
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uScrollVelocity: { value: 0.0 }
    }), [texture]);

    useEffect(() => {
        lastScrollY.current = window.scrollY;
    }, []);

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

            const targetHover = hovered ? 1.0 : 0.0;
            materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uHover.value,
                targetHover,
                delta * 5
            );

            const currentScrollY = window.scrollY;
            targetVelocity.current = (currentScrollY - lastScrollY.current) * 0.005;
            lastScrollY.current = currentScrollY;

            materialRef.current.uniforms.uScrollVelocity.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uScrollVelocity.value,
                targetVelocity.current,
                0.1
            );
        }
    });

    return (
        <mesh
            ref={meshRef}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onPointerMove={(e) => {
                if (materialRef.current && e.uv) {
                    materialRef.current.uniforms.uMouse.value.copy(e.uv);
                }
            }}
        >
            <planeGeometry args={[1, 1, 32, 32]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

export function Scene({ src }: { src: string; alt: string }) {
    return (
        <div style={{ width: "500px", height: "400px", position: "relative" }}>
            <Canvas camera={{ position: [0, 0, 0.86] }}>
                <Suspense fallback={null}>
                    <ShaderMesh src={src} />
                </Suspense>
            </Canvas>
        </div>
    );
}