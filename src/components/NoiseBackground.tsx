import React, { useEffect, useRef, useState } from 'react';
import { createNoise3D } from 'simplex-noise';

const NoiseBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const primaryRgb = useRef({ r: 255, g: 255, b: 255 });

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

        let width = 0, height = 0, animationFrame: number, time = 0;
        const noise3D = createNoise3D(Math.random);

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw background
            ctx.fillStyle = canvasRef.current?.style.backgroundColor || '#F5F5F5';
            ctx.fillRect(0, 0, width, height);

            // Parameters
            const timeStep = 0.002;
            const noiseScale = 0.002;

            // Setup image data
            const imageData = ctx.createImageData(width, height);
            const data = imageData.data;
            const threshold = 0.62;

            // Process pixels
            for (let y = 0; y < height; y++) {
                const scaledY = y * noiseScale;

                for (let x = 0; x < width; x++) {
                    // Get noise value
                    const noiseValue = noise3D(x * noiseScale, scaledY, time);

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
            time += timeStep;

            animationFrame = requestAnimationFrame(draw);
        };

        // Setup and run
        resize();
        window.addEventListener('resize', resize);
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, []);

    return (
        <canvas ref={canvasRef} className="block fixed left-0 top-0 w-full h-full print:hidden text-noise-primary bg-noise-secondary" aria-hidden="true" />
    );
};

export default NoiseBackground; 