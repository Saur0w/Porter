"use client";

import styles from "./style.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function Landing() {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useGSAP(() => {
        if (!preloaderRef.current || !pathRef.current) return;

        const tl = gsap.timeline();

        const midPath = "M 0 0 L 100 0 Q 50 100 0 0 Z";
        const endPath = "M 0 0 L 100 0 Q 50 0 0 0 Z";

        tl.to(preloaderRef.current, {
            height: "0vh",
            duration: 0.8,
            ease: "power3.inOut",
        }, "start");

        tl.to(pathRef.current, {
            attr: { d: midPath },
            duration: 0.4,
            ease: "power2.in",
        }, "start")
            .to(pathRef.current, {
                attr: { d: endPath },
                duration: 0.4,
                ease: "power2.out",
            }, "start+=0.4");

    })
    return (
      <section className={styles.preloader} ref={preloaderRef}>
          <svg className={styles.curve} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path ref={pathRef} d="M 0 0 L 100 0 Q 50 0 0 0 Z" fill="#131313" />
          </svg>
      </section>
    );
}