"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface ImageData {
    title: string;
    img: string;
}

const images: ImageData[] = [
    { title: "Look at the sky set", img: "/images/look.jpg" },
    { title: "Nurture Cover art", img: "/images/nurture.jpg" },
    { title: "White Flowers", img: "/images/blue.jpg" },
    { title: "ADF", img: "/images/adf.jpg" },
    { title: "flwr", img: "/images/flwr.jpg" },
    { title: "green", img: "/images/green.jpg" },
    { title: "interior", img: "/images/in.jpg" },
];

export default function Landing() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !sectionRef.current) return;

        const container = containerRef.current;
        const section = sectionRef.current;

        // Calculate total scroll width
        const getScrollAmount = () => container.scrollWidth - window.innerWidth;

        gsap.to(container, {
            x: () => -getScrollAmount(),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${getScrollAmount()}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            },
        });
    }, []);

    return (
        <section ref={sectionRef} className={styles.landing}>
            <div ref={containerRef} className={styles.container}>
                {images.map((item, index) => (
                    <div key={index} className={styles.imageContainer}>
                        <Image
                            src={item.img}
                            alt={item.title}
                            fill
                            sizes="30vw"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}