import React, { useEffect, useRef, useState } from 'react';
import { createNoise3D } from 'simplex-noise';

const NoiseBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const primaryRgb = useRef({ r: 255, g: 255, b: 255 });
    const targetOffset = useRef({ x: 0, y: 0 });
    const currentOffset = useRef({ x: 0, y: 0 });
    const targetScrollOffset = useRef(0);
    const currentScrollOffset = useRef(0);
    const maxPixelsRef = useRef<number>(1000000);

    // Ease-out function (cubic-bezier equivalent of ease-out)
    const easeOut = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
    };

    // Parse RGB strings directly using regex
    const parseRgb = (rgbStr: string) => {
        const matches = rgbStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
        if (matches) {
            return {
                r: parseInt(matches[1], 10),
                g: parseInt(matches[2], 10),
                b: parseInt(matches[3], 10)
            };
        }
        return { r: 0, g: 0, b: 0 };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        primaryRgb.current = parseRgb(getComputedStyle(canvas).color);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0, height = 0, animationFrame: number, time = 0, dpr = 1, scale = 1, toScreen = 1;
        let imageData: ImageData | null = null;
        const noise3D = createNoise3D(Math.random);

        // Parallax configuration
        const parallaxIntensity = 0.05; // Adjust for stronger/weaker effect
        const scrollParallaxIntensity = 0.06; // Scroll parallax intensity
        const lerpFactor = 0.08; // Smooth interpolation factor
        const scrollEaseFactor = 0.2; // Ease-out factor for scroll (higher = faster easing)
        const MAX_DPR = 1.5; // cap DPR to avoid exploding pixel counts

        // Initialize pixel budget based on current lava mode
        maxPixelsRef.current = document.body.classList.contains('lava-mode') ? 1800000 : 1000000;

        const resize = () => {
            const logicalWidth = window.innerWidth;
            const logicalHeight = window.innerHeight;

            dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

            const targetPixels = logicalWidth * logicalHeight * dpr;
            const budgetScale = Math.min(1, Math.sqrt(maxPixelsRef.current / Math.max(targetPixels, 1)));
            scale = budgetScale;

            canvas.width = Math.max(1, Math.floor(logicalWidth * dpr * scale));
            canvas.height = Math.max(1, Math.floor(logicalHeight * dpr * scale));

            // Ensure canvas visually matches viewport while internal buffer is capped
            canvas.style.width = logicalWidth + 'px';
            canvas.style.height = logicalHeight + 'px';

            width = canvas.width;
            height = canvas.height;

            // Convert internal canvas pixels to screen pixels for stable noise scale
            toScreen = 1 / (dpr * scale);

            // Recreate buffer for new size
            const ctxLocal = canvas.getContext('2d');
            if (ctxLocal) {
                imageData = ctxLocal.createImageData(width, height);
            }
        };

        // Respect prefers-reduced-motion: render a static frame and skip animation
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            resize();
            // Fill background only to avoid motion
            ctx.fillStyle = canvasRef.current?.style.backgroundColor || '#F5F5F5';
            ctx.fillRect(0, 0, width, height);
            return () => {
                // No listeners or animation to clean up in reduced motion mode
            };
        }

        const handleMouseMove = (e: MouseEvent) => {
            const centerX = width * 0.5;
            const centerY = height * 0.5;
            
            // Calculate offset from center as percentage of screen size
            const offsetX = (e.clientX - centerX) * parallaxIntensity;
            const offsetY = (e.clientY - centerY) * parallaxIntensity;
            
            targetOffset.current = { x: offsetX, y: offsetY };
        };

        const handleScroll = () => {
            targetScrollOffset.current = window.scrollY * scrollParallaxIntensity;
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Smooth interpolation towards target offset
            currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * lerpFactor;
            currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * lerpFactor;

            // Ease-out interpolation for scroll offset
            const scrollDiff = targetScrollOffset.current - currentScrollOffset.current;
            const easedStep = scrollDiff * scrollEaseFactor;
            // Apply ease-out curve to the interpolation step
            const easedProgress = easeOut(Math.min(Math.abs(easedStep) / Math.abs(scrollDiff || 1), 1));
            currentScrollOffset.current += scrollDiff * easedProgress * scrollEaseFactor;

            // Draw background
            ctx.fillStyle = canvasRef.current?.style.backgroundColor || '#F5F5F5';
            ctx.fillRect(0, 0, width, height);

            // Parameters
            const timeStep = 0.002;
            const noiseScale = 0.002;

            // Setup or reuse image data buffer
            if (!imageData || imageData.width !== width || imageData.height !== height) {
                imageData = ctx.createImageData(width, height);
            }
            const data = imageData.data;
            const threshold = 0.62;

            // Clear buffer to fully transparent so non-threshold pixels don't ghost
            data.fill(0);

            // Process pixels with parallax offset
            for (let y = 0; y < height; y++) {
                // Convert internal pixel to screen space then apply parallax offsets
                const yScreen = (y * toScreen) + currentOffset.current.y + currentScrollOffset.current;
                const scaledY = yScreen * noiseScale;

                for (let x = 0; x < width; x++) {
                    const xScreen = (x * toScreen) + currentOffset.current.x;
                    // Get noise value with parallax offset applied in screen space
                    const noiseValue = noise3D(
                        xScreen * noiseScale,
                        scaledY,
                        time
                    );

                    // Check threshold
                    if ((noiseValue + 1) * 0.5 > threshold) {
                        const i = (y * width + x) << 2; // Faster than multiplying by 4
                        data[i] = primaryRgb.current.r;
                        data[i + 1] = primaryRgb.current.g;
                        data[i + 2] = primaryRgb.current.b;
                        data[i + 3] = 255;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            time = (time + timeStep) % 100000; // prevent unbounded growth

            animationFrame = requestAnimationFrame(draw);
        };

        // Setup and run
        resize();
        const handleVisibility = () => {
            if (document.hidden) {
                if (animationFrame) cancelAnimationFrame(animationFrame);
            } else {
                animationFrame = requestAnimationFrame(draw);
            }
        };

        const handleLavaModeResize = (e: Event) => {
            const detail = (e as CustomEvent).detail as { on?: boolean } | undefined;
            const isOn = typeof detail?.on === 'boolean' ? detail.on : document.body.classList.contains('lava-mode');
            maxPixelsRef.current = isOn ? 1800000 : 1000000;
            resize();
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('lava-mode-change', handleLavaModeResize as EventListener);
        document.addEventListener('visibilitychange', handleVisibility);
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('lava-mode-change', handleLavaModeResize as EventListener);
            document.removeEventListener('visibilitychange', handleVisibility);
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, []);

    const [lavaOn, setLavaOn] = useState<boolean>(false);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as { on?: boolean } | undefined;
            if (typeof detail?.on === 'boolean') setLavaOn(detail.on);
            else setLavaOn(document.body.classList.contains('lava-mode'));
        };
        window.addEventListener('lava-mode-change', handler as EventListener);
        // init sync
        setLavaOn(document.body.classList.contains('lava-mode'));
        return () => window.removeEventListener('lava-mode-change', handler as EventListener);
    }, []);

    return (
        <canvas ref={canvasRef} className={`block fixed left-0 top-0 w-full h-full print:hidden text-noise-primary bg-noise-secondary ${lavaOn ? '' : 'blur-[4px]'}`} aria-hidden="true" />
    );
};

export default NoiseBackground; 