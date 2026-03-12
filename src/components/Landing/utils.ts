// utils/index.ts
import { PerspectiveCamera, WebGLRenderer } from 'three';
import { EffectComposer } from 'three-stdlib';

interface ResizeParams {
    camera: PerspectiveCamera;
    fov?: number | null;
    renderer: WebGLRenderer;
    effectComposer?: EffectComposer | null;
}

export const resizeThreeCanvas = ({
                                      camera,
                                      fov = null,
                                      renderer,
                                      effectComposer = null
                                  }: ResizeParams): void => {
    if (camera instanceof PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        if (fov) {
            camera.fov = fov;
        }
    }
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (effectComposer) {
        effectComposer.setSize(window.innerWidth, window.innerHeight);
    }
};

export const calcFov = (CAMERA_POS: number): number => {
    return 2 * Math.atan((window.innerHeight / 2) / CAMERA_POS) * 180 / Math.PI;
};

export const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    timeout = 300
): ((...args: Parameters<T>) => void) => {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func(...args); }, timeout);
    };
};

export const lerp = (start: number, end: number, damping: number): number => {
    return start * (1 - damping) + end * damping;
};