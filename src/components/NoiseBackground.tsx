import React, { useEffect, useRef, useState } from 'react';

const NoiseBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const primaryRgb = useRef({ r: 255, g: 255, b: 255 });
    const targetOffset = useRef({ x: 0, y: 0 });
    const currentOffset = useRef({ x: 0, y: 0 });
    const targetScrollOffset = useRef(0);
    const currentScrollOffset = useRef(0);

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

        // Resolve colors from CSS for consistency
        primaryRgb.current = parseRgb(getComputedStyle(canvas).color);
        const bgColorStr = getComputedStyle(canvas).backgroundColor || 'rgba(0,0,0,0)';
        const bgMatch = bgColorStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/);
        const bg = bgMatch ? {
            r: parseInt(bgMatch[1], 10) / 255,
            g: parseInt(bgMatch[2], 10) / 255,
            b: parseInt(bgMatch[3], 10) / 255,
            a: bgMatch[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(bgMatch[4]))) : 0
        } : { r: 0, g: 0, b: 0, a: 0 };

        // Parallax configuration
        const parallaxIntensity = 0.1;
        const scrollParallaxIntensity = 0.3;
        const lerpFactor = 0.08;
        const scrollEaseFactor = 0.2;
        // No DPR/pixel cap in WebGL path

        // Respect prefers-reduced-motion with a static frame
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            const logicalWidth = window.innerWidth;
            const logicalHeight = window.innerHeight;
            canvas.style.width = logicalWidth + 'px';
            canvas.style.height = logicalHeight + 'px';
            const ctx2d = canvas.getContext('2d');
            if (ctx2d) {
                ctx2d.clearRect(0, 0, logicalWidth, logicalHeight);
                ctx2d.fillStyle = getComputedStyle(canvas).backgroundColor || 'transparent';
                ctx2d.fillRect(0, 0, logicalWidth, logicalHeight);
            }
            return () => {};
        }

        const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: false });
        if (!gl) {
            // Graceful no-WebGL2 fallback: do nothing, leave CSS background visible
            return () => {};
        }

        let width = 0, height = 0, dpr = 1, toScreen = 1;
        let animationFrame = 0;
        let time = 0;

        // Shaders
        const vertexSrc = `#version 300 es\nprecision highp float;\nconst vec2 pos[3] = vec2[3](\n  vec2(-1.0, -1.0),\n  vec2( 3.0, -1.0),\n  vec2(-1.0,  3.0)\n);\nvoid main(){\n  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);\n}`;

        // 3D simplex noise (Ashima/Stegu, adapted for ES 3.00)
        const fragmentSrc = `#version 300 es\nprecision highp float;\n
out vec4 outColor;\n
uniform vec2 u_resolution;\nuniform float u_time;\nuniform vec3 u_color;\nuniform float u_toScreen;\nuniform vec2 u_offset;\nuniform float u_scroll;\nuniform float u_noiseScale;\nuniform float u_threshold;\n
// Simplex noise helpers\nvec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }\nvec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }\nvec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }\nvec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }\n
float snoise(vec3 v){\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0);\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n  // First corner\n  vec3 i  = floor(v + dot(v, C.yyy));\n  vec3 x0 = v - i + dot(i, C.xxx);\n\n  // Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  // x0 = x0 - 0.0 + 0.0 * C.xxx;\n  // x1 = x0 - i1 + 1.0 * C.xxx;\n  // x2 = x0 - i2 + 2.0 * C.xxx;\n  // x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0 + 3.0*C.x = -0.5 = -D.y\n\n  // Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n  // Gradients: 7x7 points over a square, mapped onto an octahedron.\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);   // mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n  // Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n  // Mix contributions from the four corners\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n}\n
void main(){\n  // Map pixel to screen space (CSS px) using u_toScreen\n  vec2 screenPx = gl_FragCoord.xy * u_toScreen;\n  vec2 pos = screenPx + u_offset + vec2(0.0, u_scroll);\n  float n = snoise(vec3(pos * u_noiseScale, u_time));\n  // Map to 0..1
  float v = 0.5 * (n + 1.0);\n  float mask = step(u_threshold, v);\n  outColor = vec4(u_color, mask);\n}`;

        const createShader = (type: number, src: string) => {
            const sh = gl.createShader(type)!;
            gl.shaderSource(sh, src);
            gl.compileShader(sh);
            if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(sh) || 'shader compile error');
                gl.deleteShader(sh);
                return null;
            }
            return sh;
        };

        const vsh = createShader(gl.VERTEX_SHADER, vertexSrc);
        const fsh = createShader(gl.FRAGMENT_SHADER, fragmentSrc);
        if (!vsh || !fsh) {
            return () => {
                if (vsh) gl.deleteShader(vsh);
                if (fsh) gl.deleteShader(fsh);
            };
        }
        const prog = gl.createProgram()!;
        gl.attachShader(prog, vsh);
        gl.attachShader(prog, fsh);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(prog) || 'program link error');
            gl.deleteProgram(prog);
            gl.deleteShader(vsh);
            gl.deleteShader(fsh);
            return () => {};
        }

        // Fullscreen triangle (no VBO needed in this pattern)
        const vao = gl.createVertexArray()!;
        gl.bindVertexArray(vao);

        const u_resolution = gl.getUniformLocation(prog, 'u_resolution');
        const u_time = gl.getUniformLocation(prog, 'u_time');
        const u_color = gl.getUniformLocation(prog, 'u_color');
        const u_toScreen = gl.getUniformLocation(prog, 'u_toScreen');
        const u_offset = gl.getUniformLocation(prog, 'u_offset');
        const u_scroll = gl.getUniformLocation(prog, 'u_scroll');
        const u_noiseScale = gl.getUniformLocation(prog, 'u_noiseScale');
        const u_threshold = gl.getUniformLocation(prog, 'u_threshold');

        const resize = () => {
            const logicalWidth = window.innerWidth;
            const logicalHeight = window.innerHeight;

            dpr = window.devicePixelRatio || 1;

            const newWidth = Math.max(1, Math.floor(logicalWidth * dpr));
            const newHeight = Math.max(1, Math.floor(logicalHeight * dpr));
            if (canvas.width !== newWidth || canvas.height !== newHeight) {
                canvas.width = newWidth;
                canvas.height = newHeight;
            }
            canvas.style.width = logicalWidth + 'px';
            canvas.style.height = logicalHeight + 'px';

            width = canvas.width;
            height = canvas.height;
            toScreen = 1 / dpr;

            gl.viewport(0, 0, width, height);
            gl.clearColor(bg.r, bg.g, bg.b, 0.0); // keep transparent to let CSS bg show
        };

        const handleMouseMove = (e: MouseEvent) => {
            const centerX = (window.innerWidth) * 0.5;
            const centerY = (window.innerHeight) * 0.5;
            const offsetX = (e.clientX - centerX) * parallaxIntensity;
            const offsetY = (e.clientY - centerY) * parallaxIntensity;
            targetOffset.current = { x: offsetX, y: offsetY };
        };

        const handleScroll = () => {
            targetScrollOffset.current = window.scrollY * scrollParallaxIntensity;
        };

        const draw = () => {
            // Easing offsets
            currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * lerpFactor;
            currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * lerpFactor;

            const scrollDiff = targetScrollOffset.current - currentScrollOffset.current;
            const easedStep = scrollDiff * scrollEaseFactor;
            const easedProgress = easeOut(Math.min(Math.abs(easedStep) / Math.abs(scrollDiff || 1), 1));
            currentScrollOffset.current += scrollDiff * easedProgress * scrollEaseFactor;

            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(prog);
            gl.bindVertexArray(vao);

            // Uniforms
            gl.uniform2f(u_resolution, width, height);
            gl.uniform1f(u_time, time);
            gl.uniform3f(u_color, primaryRgb.current.r / 255, primaryRgb.current.g / 255, primaryRgb.current.b / 255);
            gl.uniform1f(u_toScreen, toScreen);
            gl.uniform2f(u_offset, currentOffset.current.x, currentOffset.current.y);
            gl.uniform1f(u_scroll, currentScrollOffset.current);
            gl.uniform1f(u_noiseScale, 0.002);
            gl.uniform1f(u_threshold, 0.62);

            gl.drawArrays(gl.TRIANGLES, 0, 3);

            time = (time + 0.0005) % 100000.0;
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

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('visibilitychange', handleVisibility);
        animationFrame = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('visibilitychange', handleVisibility);
            if (animationFrame) cancelAnimationFrame(animationFrame);
            gl.bindVertexArray(null);
            gl.useProgram(null);
            gl.deleteVertexArray(vao);
            gl.deleteProgram(prog);
            gl.deleteShader(vsh);
            gl.deleteShader(fsh);
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
        <canvas ref={canvasRef} className={`block fixed left-0 top-0 w-full h-full print:hidden text-noise-primary bg-noise-secondary ${lavaOn ? '' : ''}`} aria-hidden="true" />
    );
};

export default NoiseBackground; 