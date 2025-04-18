import React, { useEffect, useRef, useState } from 'react';
import { hexToRgb } from '../utils/color';
import { createNoise3D } from 'simplex-noise';

const NoiseBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile
        const checkMobile = () => {
            const mobileCheck = window.matchMedia('(max-width: 768px)');
            setIsMobile(mobileCheck.matches);
        };

        // Run check immediately
        checkMobile();

        // Add listener for screen size changes
        window.addEventListener('resize', checkMobile);

        const canvas = canvasRef.current;
        if (!canvas) return;

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

            // Get colors
            const root = document.documentElement;
            const style = getComputedStyle(root);
            const primaryColor = style.getPropertyValue('--color-noise').trim() || '#FBEC5D';
            const secondaryColor = style.getPropertyValue('--color-noiseSecondary').trim() || '#F5F5F5';
            const primaryRgb = hexToRgb(primaryColor);
            
            // Draw background
            ctx.fillStyle = secondaryColor;
            ctx.fillRect(0, 0, width, height);

            // Skip animation on mobile devices
            if (isMobile) {
                // For mobile: draw a static pattern or just leave the background color
                return;
            }

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
                        data[i] = primaryRgb.r;
                        data[i + 1] = primaryRgb.g;
                        data[i + 2] = primaryRgb.b;
                        data[i + 3] = 255;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            time += timeStep;
            
            // Only continue animation if not mobile
            if (!isMobile) {
                animationFrame = requestAnimationFrame(draw);
            }
        };

        // Setup and run
        resize();
        window.addEventListener('resize', resize);
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('resize', checkMobile);
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isMobile]); // Added isMobile as dependency

    // If mobile, just return a simple colored background
    if (isMobile) {
        return (
            <div className="block fixed left-0 top-0 w-full h-full bg-noiseSecondary" aria-hidden="true" />
        );
    }

    return (
        <canvas ref={canvasRef} className="block fixed left-0 top-0 w-full h-full" aria-hidden="true" />
    );
};

export default NoiseBackground; 