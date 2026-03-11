"use client";

import styles from "./page.module.css";
import Landing from "@/components/Landing";
import Preloader from "@/components/Preloader";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const preloaderRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lenis = new Lenis();

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);
    useGSAP(() => {
        setTimeout(() => {
            document.body.style.cursor = "default";
            window.scrollTo(0, 0);

            if (preloaderRef.current) {
                gsap.to(preloaderRef.current, {
                    top: "-100dvh",
                    duration: 0.6,
                    ease: "power2.inOut",
                    delay: 0.2,
                    onComplete: () => {
                        setIsLoading(false);
                    },
                });
            } else {
                setIsLoading(false);
            }
        }, 2000);
    }, { scope: pageRef })
    return (
        <div className={styles.page} ref={pageRef}>
            {isLoading && (
                <div ref={preloaderRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 99 }}>
                    <Preloader />
                </div>
            )}
            <Landing />
        </div>
    );
}
