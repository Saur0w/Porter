"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import styles from "./scene.module.scss";

interface ImageMeshProps {
    src: string;
}

interface SceneProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export default function Scene({ src, alt, width, height }: SceneProps) {
    return (
        <div
            role="img"
            aria-label={alt}
            className={styles.Scene}
            style={{
                width,
                height,
                cursor: "crosshair",
            }}
        >
            <Canvas
                gl={{ antialias: true }}
                dpr={[1, 2]}
                camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
                style={{ display: "block", width: "100%", height: "100%" }}
            >

            </Canvas>
        </div>
    )
}