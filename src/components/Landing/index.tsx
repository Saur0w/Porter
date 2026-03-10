"use client";

import styles from "./style.module.scss";
import Image from "next/image";

const images = [
    "/images/look.jpg",
    "/images/blue.jpg",
    "/images/nurture.jpg",
    "/images/musician.jpg",
    "/images/flwr.jpg",
    "/images/rosa.jpg",
    "/images/in.jpg",
    "/images/narin.jpg",
    "/images/green.jpg",
    "/images/adf.jpg",
];

export default function Landing() {
    return (
        <section className={styles.landing}>
            <div className={styles.imageContainer}>
                {images.map((image, index) => (
                    <Image
                        key={index}
                        src={image}
                        alt={`image-${index}`}
                        height={400}
                        width={500}
                    />
                ))}
            </div>
        </section>
    );
}