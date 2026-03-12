"use client";

import styles from "./page.module.css";
import dynamic from "next/dynamic";
const Landing = dynamic(() =>
    import("@/components/Landing"), {
    ssr: false
});
import { useEffect } from "react";
import Lenis from "lenis";

export default function Home() {

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
    return (
        <div className={styles.page}>
            <Landing />
        </div>
    );
}
