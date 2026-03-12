"use client";

import styles from "./style.module.scss";
import Image from "next/image";

const images = [
    { src: "/images/look.jpg", alt: "Look at the Sky" },
    { src: "/images/blue.jpg", alt: "White Flower" },
    { src: "/images/musician.jpg", alt: "Musician" },
    { src: "/images/adf.jpg", alt: "adf" },
];

export default function Landing() {
    return (
        <div className={styles.landing}>
            <canvas className={styles.canvas} />
            <div className={styles.grid}>
                <figure className={styles.imgWrap}>
                    {images.map((image, index) => (
                        <div key={index} className={styles.imageContainer}>
                            <Image src={image.src} alt={image.alt} fill sizes="500px" unoptimized />
                        </div>
                    ))}
                </figure>
            </div>
        </div>
    );
}