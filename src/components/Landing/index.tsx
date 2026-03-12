// src/components/LandingPage/LandingPage.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { resizeThreeCanvas, calcFov, debounce, lerp } from '@/utils';
import styles from './style.module.scss';
import Image from 'next/image';
import { effectVertexShader, effectFragmentShader } from '@/lib/Shader';

gsap.registerPlugin(CustomEase);

type MediaStoreItem = {
    media: HTMLImageElement;
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;
    width: number;
    height: number;
    top: number;
    left: number;
    isInView: boolean;
    mouseEnter: number;
    mouseOverPos: {
        current: { x: number; y: number };
        target: { x: number; y: number };
    };
};

export default function LandingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let rafId: number;
        let cursorRaf: number | null = null;
        let observer: IntersectionObserver;
        let mediaStore: MediaStoreItem[] = [];

        const CAMERA_POS = 500;

        // Scroll state tracking (independent of Lenis instance, just tracking window)
        const scroll = { scrollY: window.scrollY, scrollVelocity: 0 };
        let lastScrollY = window.scrollY;

        const cursorPos = {
            current: { x: 0.5, y: 0.5 },
            target: { x: 0.5, y: 0.5 },
        };

        // --- WebGL Setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 10, 1000);
        camera.position.z = CAMERA_POS;
        camera.fov = calcFov(CAMERA_POS);
        camera.updateProjectionMatrix();

        const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
        const materialTemplate = new THREE.ShaderMaterial({
            uniforms: {
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uTime: { value: 0 },
                uCursor: { value: new THREE.Vector2(0.5, 0.5) },
                uScrollVelocity: { value: 0 },
                uTexture: { value: null },
                uTextureSize: { value: new THREE.Vector2(100, 100) },
                uQuadSize: { value: new THREE.Vector2(100, 100) },
                uBorderRadius: { value: 0 },
                uMouseEnter: { value: 0 },
                uMouseOverPos: { value: new THREE.Vector2(0.5, 0.5) },
            },
            vertexShader: effectVertexShader,
            fragmentShader: effectFragmentShader,
            glslVersion: THREE.GLSL3,
        });

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- Event Handlers ---
        const lerpCursorPos = () => {
            cursorPos.current.x = lerp(cursorPos.current.x, cursorPos.target.x, 0.05);
            cursorPos.current.y = lerp(cursorPos.current.y, cursorPos.target.y, 0.05);

            const delta = Math.sqrt(
                (cursorPos.target.x - cursorPos.current.x) ** 2 +
                (cursorPos.target.y - cursorPos.current.y) ** 2
            );

            if (delta < 0.001 && cursorRaf) {
                cancelAnimationFrame(cursorRaf);
                cursorRaf = null;
                return;
            }
            cursorRaf = requestAnimationFrame(lerpCursorPos);
        };

        const onMouseMove = (event: MouseEvent) => {
            cursorPos.target.x = event.clientX / window.innerWidth;
            cursorPos.target.y = event.clientY / window.innerHeight;
            if (!cursorRaf) cursorRaf = requestAnimationFrame(lerpCursorPos);
        };

        // --- DOM Media to WebGL sync ---
        const setMediaStore = () => {
            const mediaElements = Array.from(document.querySelectorAll('[data-webgl-media]')) as HTMLImageElement[];

            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const indexStr = (entry.target as HTMLElement).dataset.index;
                        if (indexStr && mediaStore[parseInt(indexStr)]) {
                            mediaStore[parseInt(indexStr)].isInView = entry.isIntersecting;
                        }
                    });
                },
                { rootMargin: '500px 0px 500px 0px' }
            );

            mediaStore = mediaElements.map((media, i) => {
                observer.observe(media);
                media.dataset.index = String(i);

                // Hover handlers
                const onMouseEnter = () => {
                    gsap.to(mediaStore[i], {
                        mouseEnter: 1, duration: 0.6,
                        ease: CustomEase.create('custom', '0.4, 0, 0.2, 1'),
                    });
                };
                const onMousePos = (e: MouseEvent) => {
                    const bounds = mediaStore[i].media.getBoundingClientRect();
                    mediaStore[i].mouseOverPos.target.x = e.offsetX / bounds.width;
                    mediaStore[i].mouseOverPos.target.y = e.offsetY / bounds.height;
                };
                const onMouseLeave = () => {
                    gsap.to(mediaStore[i], {
                        mouseEnter: 0, duration: 0.6,
                        ease: CustomEase.create('custom', '0.4, 0, 0.2, 1'),
                    });
                    gsap.to(mediaStore[i].mouseOverPos.target, {
                        x: 0.5, y: 0.5, duration: 0.6,
                        ease: CustomEase.create('custom', '0.4, 0, 0.2, 1'),
                    });
                };

                media.addEventListener('mouseenter', onMouseEnter);
                media.addEventListener('mousemove', onMousePos);
                media.addEventListener('mouseleave', onMouseLeave);

                const bounds = media.getBoundingClientRect();
                const imageMaterial = materialTemplate.clone();
                const imageMesh = new THREE.Mesh(geometry, imageMaterial);

                const texture = new THREE.Texture(media);
                texture.needsUpdate = true;

                imageMaterial.uniforms.uTexture.value = texture;
                imageMaterial.uniforms.uTextureSize.value.x = media.naturalWidth || bounds.width;
                imageMaterial.uniforms.uTextureSize.value.y = media.naturalHeight || bounds.height;
                imageMaterial.uniforms.uQuadSize.value.x = bounds.width;
                imageMaterial.uniforms.uQuadSize.value.y = bounds.height;
                imageMaterial.uniforms.uBorderRadius.value = parseFloat(window.getComputedStyle(media).borderRadius) || 0;

                imageMesh.scale.set(bounds.width, bounds.height, 1);
                if (!(bounds.top >= 0 && bounds.top <= window.innerHeight)) {
                    imageMesh.position.y = 2 * window.innerHeight;
                }

                scene.add(imageMesh);

                return {
                    media,
                    material: imageMaterial,
                    mesh: imageMesh,
                    width: bounds.width,
                    height: bounds.height,
                    top: bounds.top + window.scrollY,
                    left: bounds.left,
                    isInView: bounds.top >= -500 && bounds.top <= window.innerHeight + 500,
                    mouseEnter: 0,
                    mouseOverPos: {
                        current: { x: 0.5, y: 0.5 },
                        target: { x: 0.5, y: 0.5 },
                    },
                };
            });
        };

        const setPositions = () => {
            mediaStore.forEach((obj) => {
                if (obj.isInView) {
                    obj.mesh.position.x = obj.left - window.innerWidth / 2 + obj.width / 2;
                    obj.mesh.position.y = -obj.top + window.innerHeight / 2 - obj.height / 2 + scroll.scrollY;
                }
            });
        };

        // --- Render Loop ---
        const render = (time: number) => {
            time /= 1000;

            // Calculate Scroll Velocity manually
            const currentScrollY = window.scrollY;
            scroll.scrollVelocity = currentScrollY - lastScrollY;
            scroll.scrollY = currentScrollY;
            lastScrollY = currentScrollY;

            mediaStore.forEach((obj) => {
                if (obj.isInView) {
                    obj.mouseOverPos.current.x = lerp(obj.mouseOverPos.current.x, obj.mouseOverPos.target.x, 0.05);
                    obj.mouseOverPos.current.y = lerp(obj.mouseOverPos.current.y, obj.mouseOverPos.target.y, 0.05);

                    obj.material.uniforms.uResolution.value.x = window.innerWidth;
                    obj.material.uniforms.uResolution.value.y = window.innerHeight;
                    obj.material.uniforms.uTime.value = time;
                    obj.material.uniforms.uCursor.value.x = cursorPos.current.x;
                    obj.material.uniforms.uCursor.value.y = cursorPos.current.y;
                    obj.material.uniforms.uScrollVelocity.value = scroll.scrollVelocity;
                    obj.material.uniforms.uMouseOverPos.value.x = obj.mouseOverPos.current.x;
                    obj.material.uniforms.uMouseOverPos.value.y = obj.mouseOverPos.current.y;
                    obj.material.uniforms.uMouseEnter.value = obj.mouseEnter;
                } else {
                    obj.mesh.position.y = 2 * window.innerHeight;
                }
            });

            setPositions();
            renderer.render(scene, camera);
            rafId = requestAnimationFrame(render);
        };

        const onResize = debounce(() => {
            const fov = calcFov(CAMERA_POS);
            resizeThreeCanvas({ camera, fov, renderer });

            mediaStore.forEach((obj) => {
                const bounds = obj.media.getBoundingClientRect();
                obj.mesh.scale.set(bounds.width, bounds.height, 1);
                obj.width = bounds.width;
                obj.height = bounds.height;
                obj.top = bounds.top + scroll.scrollY;
                obj.left = bounds.left;
                obj.isInView = bounds.top >= 0 && bounds.top <= window.innerHeight;

                obj.material.uniforms.uTextureSize.value.x = obj.media.naturalWidth;
                obj.material.uniforms.uTextureSize.value.y = obj.media.naturalHeight;
                obj.material.uniforms.uQuadSize.value.x = bounds.width;
                obj.material.uniforms.uQuadSize.value.y = bounds.height;
                obj.material.uniforms.uBorderRadius.value = parseFloat(window.getComputedStyle(obj.media).borderRadius) || 0;
            });
        });

        if (document.readyState === 'complete') {
            setMediaStore();
            document.body.classList.remove('loading');
            rafId = requestAnimationFrame(render);
        } else {
            window.addEventListener('load', () => {
                setMediaStore();
                document.body.classList.remove('loading');
                rafId = requestAnimationFrame(render);
            });
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            if (rafId) cancelAnimationFrame(rafId);
            if (cursorRaf) cancelAnimationFrame(cursorRaf);
            if (observer) observer.disconnect();
            // Clean up Three.js objects to prevent memory leaks in React
            scene.clear();
            geometry.dispose();
            materialTemplate.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Example Image HTML Layout */}
                    <figure className={`${styles.imgWrap} ${styles.imgWrap1}`}>
                        <Image data-webgl-media src="/images/look.jpg" alt="Demo" className={styles.webglMedia} width={500} height={400} />
                    </figure>
                    <figure className={`${styles.imgWrap} ${styles.imgWrap2}`}>
                        <Image data-webgl-media src="/images/blue.jpg" alt="Demo" className={styles.webglMedia} width={500} height={400} />
                    </figure>
                    <figure className={`${styles.imgWrap} ${styles.imgWrap3}`}>
                        <Image data-webgl-media src="/images/nurture.jpg" alt="Demo" className={styles.webglMedia} width={500} height={400} />
                    </figure>
                    <figure className={`${styles.imgWrap} ${styles.imgWrap4}`}>
                        <Image data-webgl-media src="/images/musician.jpg" alt="Demo" className={styles.webglMedia} width={500} height={400} />
                    </figure>
                </div>
            </div>
        </>
    );
}