import { PerspectiveCamera, WebGLRenderer } from 'three';

export const resizeThreeCanvas = ({
                                      camera,
                                      fov = null,
                                      renderer,
                                  }: {
    camera: PerspectiveCamera;
    fov?: number | null;
    renderer: WebGLRenderer;
}) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    if (fov) {
        camera.fov = fov;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

export const calcFov = (CAMERA_POS: number) =>
    (2 * Math.atan(window.innerHeight / 2 / CAMERA_POS) * 180) / Math.PI;

export const debounce = <T extends (...args: unknown[]) => unknown>(func: T, timeout = 300) => {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
};

export const lerp = (start: number, end: number, damping: number) => {
    return start * (1 - damping) + end * damping;
};