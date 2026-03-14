"use client";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import Lenis from "lenis";

const Landing = dynamic(() =>
    import("@/components/Landing"), {
    ssr: false
});

export default function Home() {
    useEffect(() => {
        const lenis = new Lenis();
        let rafId: number;

        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className={styles.page}>
            <Landing />
        </div>
    );
}