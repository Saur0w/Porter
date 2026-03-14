"use client";

import styles from "./style.module.scss";
import { Scene } from "./Scene";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

const images = [
    { src: '/images/look.jpg', alt: 'look at the sky' },
    { src: '/images/blue.jpg', alt: 'white flower' },
    { src: '/images/nurture.jpg', alt: 'Nurture' },
    { src: '/images/musician.jpg', alt: 'Musician' },
    { src: '/images/in.jpg', alt: 'interior' },
];

export default function Landing() {
    return (
        <section className={styles.landing}>
            <div className={styles.imageContainer}>
                {images.map((image, index) => (
                    <Scene key={index} src={image.src} alt={image.alt} />
                ))}
            </div>


            <Canvas
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                }}
                eventSource={typeof window !== 'undefined' ? document.body : undefined}
            >
                <View.Port />
            </Canvas>
        </section>
    );
}