"use client";

import styles from "./style.module.scss";
import Image from "next/image";

const images = [
    { src: '/images/look.jpg', alt: 'Demo' },
    { src: '/images/blue.jpg', alt: 'Demo' },
    { src: '/images/nurture.jpg', alt: 'Demo' },
    { src: '/images/musician.jpg', alt: 'Demo' },
    { src: '/images/in.jpg', alt: 'Demo' },
];

export default function Landing() {
    return (
        <section className={styles.landing}>
            <div className={styles.imageContainer}>
                {images.map((image, index) => (
                    <Image
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={300}
                    />
                ))}
            </div>
        </section>
    )
}