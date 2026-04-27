import React, { useEffect, useRef, useState } from 'react';

interface NoiseBackgroundProps {
  /** Period in seconds for a seamless noise loop. When set, the shader uses
   *  the looping noise math (two snoise samples cross-faded by phase) so
   *  noise(t) === noise(t + loopSeconds). Used by the OG APNG generator to
   *  produce a perfectly cyclic preview. */
  loopSeconds?: number;
  /** How far the noise field "travels" along its z-axis in one full cycle.
   *  Decoupled from `loopSeconds` so you can have a SHORT loop with SUBTLE
   *  motion (small travel) — gives a calm lava-lamp pace independent of
   *  cycle length. Live site moves ~0.0005 units per rAF frame; a 4-second
   *  loop at site-pace would need travel ≈ 0.12. Smaller = slower visual
   *  motion. Defaults to 1.0 (one full unit, the original behaviour). */
  loopTravel?: number;
  /** When true, the rAF loop is suppressed and a global window.__noiseFrame(t)
   *  helper is exposed that renders ONE deterministic frame at time t.
   *  Used by the capture script (Puppeteer steps t externally and screenshots
   *  each frame). Requires `loopSeconds` to be set. */
  captureMode?: boolean;
}

const NoiseBackground: React.FC<NoiseBackgroundProps> = ({ loopSeconds, loopTravel = 1.0, captureMode: captureModeProp }) => {
  // Capture mode can also be enabled at runtime via ?capture=1 in the URL —
  // needed because Astro pages are static-built, so a SSR-time prop like
  // {isCapture} from Astro.url always evaluates to false at build time.
  // Reading window.location.search inside the island sidesteps that.
  const captureMode = captureModeProp || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('capture') === '1');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const primaryRgb = useRef({ r: 255, g: 255, b: 255 });
    const targetOffset = useRef({ x: 0, y: 0 });
    const currentOffset = useRef({ x: 0, y: 0 });
    const targetScrollOffset = useRef(0);
    const currentScrollOffset = useRef(0);
    const [isReady, setIsReady] = useState(false);

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
        let idleId: number | null = null;
        let timeoutId: number | null = null;

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
        const scrollParallaxIntensity = 0.1;
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
            setIsReady(true);
            return () => {};
        }

        // preserveDrawingBuffer is needed so Puppeteer screenshots see the
        // last-rendered pixels (otherwise the GL surface may be cleared between
        // the rAF tick and the screenshot capture). Negligible cost in capture
        // mode where we render on demand.
        const gl = canvas.getContext('webgl2', {
            antialias: false,
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: !!captureMode,
        });
        if (!gl) {
            // Graceful no-WebGL2 fallback: do nothing, leave CSS background visible
            return () => {};
        }

        let width = 0, height = 0, dpr = 1, toScreen = 1;
        let animationFrame = 0;
        // Random per-visit seed: shifts the 3D noise field along the time axis
        // so each visit starts from a different "slice" — no two visits look identical.
        // In loop/capture mode we start from 0 so the cycle is deterministic.
        let time = loopSeconds ? 0 : Math.random() * 1000;
        let hasShown = false;

        // Shaders
        const vertexSrc = `#version 300 es\nprecision highp float;\nconst vec2 pos[3] = vec2[3](\n  vec2(-1.0, -1.0),\n  vec2( 3.0, -1.0),\n  vec2(-1.0,  3.0)\n);\nvoid main(){\n  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);\n}`;

        // 3D simplex noise (Ashima/Stegu, adapted for ES 3.00) + cursor cuts/trail
        const fragmentSrc = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2  u_resolution;
uniform float u_time;
uniform vec3  u_color;
uniform float u_toScreen;
uniform vec2  u_offset;
uniform float u_scroll;
uniform float u_noiseScale;
uniform float u_threshold;
uniform float u_loopPeriod;      // > 0 → enables seamless loop math (used for OG APNG capture)
uniform float u_loopTravel;      // how far along the noise z-axis one cycle covers (smaller = subtler motion)
uniform vec3  u_cursor;          // xy = position in canvas-local CSS px (GL bottom-left), z = active 0/1
uniform float u_cursorRadius;    // radius of the always-on head cut, in CSS px
#define MAX_CUTS 384
uniform int   u_cutCount;
uniform vec3  u_cuts[MAX_CUTS];  // xy = position in CSS px (canvas-local), z = strength 0..1
uniform float u_cutRadius;       // radius in CSS px

vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main(){
  vec2 screenPx = gl_FragCoord.xy * u_toScreen;
  vec2 pos = screenPx + u_offset + vec2(0.0, u_scroll);
  // Looping noise: sample at phase ∈ [0,1) and at (phase-1), cross-fade by
  // phase. At phase=0 → n=N(pos,0); at phase→1 → n→N(pos,0). Seamless cycle.
  // Falls back to plain forward-time noise when u_loopPeriod == 0 (live site).
  vec2 noisePos = pos * u_noiseScale;
  float n;
  if (u_loopPeriod > 0.0) {
    float phase = mod(u_time / u_loopPeriod, 1.0);
    float u = phase * u_loopTravel;
    float n1 = snoise(vec3(noisePos, u));
    float n2 = snoise(vec3(noisePos, u - u_loopTravel));
    n = mix(n1, n2, phase);
  } else {
    n = snoise(vec3(noisePos, u_time));
  }
  float v = 0.5 * (n + 1.0);

  // Cursor cuts: pixels close to a recent cursor sample are pushed AWAY from
  // the threshold — if they were lit, they go dark; if dark, they stay dark.
  // Radius scales with strength so the head of the trail is wide; tail tapers
  // down to ~1/3 of it.
  float cut = 0.0;
  for (int k = 0; k < MAX_CUTS; ++k) {
    if (k >= u_cutCount) break;
    vec3 c = u_cuts[k];
    float radiusFactor = mix(0.25, 1.0, pow(c.z, 2.0));
    float r = u_cutRadius * radiusFactor;
    float invR2 = 1.0 / max(r * r, 1.0);
    vec2 d = screenPx - c.xy;
    float falloff = exp(-dot(d, d) * invR2);
    // Cube the strength so faint old points fully vanish (no leftover specks).
    cut += c.z * c.z * c.z * falloff;
  }

  // Always-fresh head cut at the cursor position — fixed strength = 1, full
  // radius, never fades. Disabled when cursor isn't active.
  if (u_cursor.z > 0.5) {
    vec2 dh = screenPx - u_cursor.xy;
    float invR2h = 1.0 / max(u_cursorRadius * u_cursorRadius, 1.0);
    float falloffH = exp(-dot(dh, dh) * invR2h);
    // Boost the head so its depth matches the accumulated tail (multiple
    // overlapping gaussians) — without this the head looks thinner than the body.
    cut += falloffH * 1.5;
  }
  v -= 0.45 * clamp(cut, 0.0, 1.5);

  if (v < u_threshold) { discard; }
  outColor = vec4(u_color, 1.0);
}`;

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
        const u_loopPeriod = gl.getUniformLocation(prog, 'u_loopPeriod');
        const u_loopTravel = gl.getUniformLocation(prog, 'u_loopTravel');
        const u_cursor = gl.getUniformLocation(prog, 'u_cursor');
        const u_cursorRadius = gl.getUniformLocation(prog, 'u_cursorRadius');
        const u_cutCount = gl.getUniformLocation(prog, 'u_cutCount');
        const u_cutRadius = gl.getUniformLocation(prog, 'u_cutRadius');
        const u_cuts = gl.getUniformLocation(prog, 'u_cuts[0]');

        // === Cursor cut/trail state ===
        // The "head" follows the raw cursor; trail samples ('cuts') are dropped
        // along an EASED pointer so the trail flows smoothly like ink.
        const cursor = { tx: -1000, ty: -1000, x: -1000, y: -1000, active: 0 };
        // Trail config: fine-grained 1px spacing keeps the snake smooth (no
        // visible jitter between cuts). MAX_CUTS × CUT_SPACING_PX caps the
        // spatial tail length; LIFETIME caps the temporal fade.
        const MAX_CUTS_JS = 240;
        const CUT_LIFETIME_MS = 900;
        const CUT_SPACING_PX = 1;
        const CUT_RADIUS_CSS = 40.0;
        const cuts: Array<[number, number, number]> = [];
        let lastCutPos: [number, number] | null = null;
        let pendingMouse: { x: number; y: number } | null = null;
        const easedPtr = { x: null as number | null, y: null as number | null };
        const EASE = 0.35;

        // The pointer/touch interactivity should only fire when the user is
        // actually on the noise field — NOT on top of the resume card or the
        // mobile menu. In lava-mode the card is hidden, so the whole screen
        // is the noise field — re-enable everywhere.
        const isOnInteractiveSurface = (e: { clientX: number; clientY: number; target?: EventTarget | null }): boolean => {
          if (document.body.classList.contains('lava-mode')) return true;
          let el: Element | null = null;
          if (e.target instanceof Element) {
            el = e.target;
          } else {
            el = document.elementFromPoint(e.clientX, e.clientY);
          }
          if (!el) return true;
          // Card body, mobile menu, and floating chrome all sit ON TOP of the
          // noise — pointer over them shouldn't drive cuts.
          return !el.closest('.cv-card, .cv-menu-overlay, #cv-chrome, #cv-burger, #lava-toggle');
        };

        const onCursorMove = (e: MouseEvent) => {
          if (!isOnInteractiveSurface(e)) {
            cursor.active = 0;
            return;
          }
          const rect = canvas.getBoundingClientRect();
          cursor.tx = e.clientX - rect.left;
          cursor.ty = rect.height - (e.clientY - rect.top);
          cursor.active = 1;
        };
        const onCursorLeave = (e: MouseEvent) => {
          if (!(e as any).relatedTarget) cursor.active = 0;
        };
        const onMouseCut = (e: MouseEvent) => {
          if (!isOnInteractiveSurface(e)) return;
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = rect.height - (e.clientY - rect.top); // GL origin = bottom-left
          pendingMouse = { x, y };
        };
        const pushCut = (x: number, y: number, t: number) => {
          cuts.push([x, y, t]);
          if (cuts.length > MAX_CUTS_JS) cuts.shift();
        };
        const drainCuts = (now: number) => {
          if (!pendingMouse) return;
          if (easedPtr.x === null) {
            easedPtr.x = pendingMouse.x;
            easedPtr.y = pendingMouse.y;
          } else {
            easedPtr.x += (pendingMouse.x - easedPtr.x) * EASE;
            easedPtr.y! += (pendingMouse.y - easedPtr.y!) * EASE;
          }
          const x = easedPtr.x!, y = easedPtr.y!;
          if (!lastCutPos) {
            pushCut(x, y, now);
            lastCutPos = [x, y];
            return;
          }
          const dx = x - lastCutPos[0], dy = y - lastCutPos[1];
          const dist = Math.hypot(dx, dy);
          if (dist < CUT_SPACING_PX) return;
          const steps = Math.min(20, Math.ceil(dist / CUT_SPACING_PX));
          for (let s = 1; s <= steps; ++s) {
            const t = s / steps;
            const px = lastCutPos[0] + dx * t;
            const py = lastCutPos[1] + dy * t;
            const ts = now - (1 - t) * 8;
            pushCut(px, py, ts);
          }
          lastCutPos = [x, y];
        };

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
            gl.clearColor(bg.r, bg.g, bg.b, 1.0); // opaque clear helps on iOS compositing
        };

        const handleMouseMove = (e: MouseEvent) => {
            const centerX = (window.innerWidth) * 0.5;
            const centerY = (window.innerHeight) * 0.5;
            const offsetX = (e.clientX - centerX) * parallaxIntensity;
            const offsetY = (e.clientY - centerY) * parallaxIntensity;
            targetOffset.current = { x: offsetX, y: offsetY };
        };

        // Touch path — mirror the three mouse handlers (parallax / cut / cursor)
        // for one-finger drags on mobile so the noise reacts to taps and
        // swipes the same way it does to a mouse. Passive listeners — don't
        // block native scrolling.
        const onTouch = (e: TouchEvent) => {
            // Mobile noise is interactive ONLY in lava mode. Outside lava
            // mode, touch events are just regular scroll — adding a trail
            // every time the user pans the resume is noisy AND costs CPU
            // on phones. Cheap early-bail keeps the rAF lean.
            if (!document.body.classList.contains('lava-mode')) {
                cursor.active = 0;
                return;
            }
            if (e.touches.length === 0) return;
            const t = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            // parallax
            const centerX = window.innerWidth * 0.5;
            const centerY = window.innerHeight * 0.5;
            targetOffset.current = {
                x: (t.clientX - centerX) * parallaxIntensity,
                y: (t.clientY - centerY) * parallaxIntensity,
            };
            // cut + cursor head (GL origin = bottom-left)
            const x = t.clientX - rect.left;
            const y = rect.height - (t.clientY - rect.top);
            cursor.tx = x;
            cursor.ty = y;
            cursor.active = 1;
            pendingMouse = { x, y };
        };
        const onTouchEnd = () => {
            // Drop the cursor head when the finger lifts; trail decays naturally
            cursor.active = 0;
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
            gl.uniform1f(u_loopPeriod, loopSeconds || 0);
            gl.uniform1f(u_loopTravel, loopTravel);

            // Cursor cuts/trail packing
            const now = performance.now();
            drainCuts(now);
            cursor.x += (cursor.tx - cursor.x) * 0.35;
            cursor.y += (cursor.ty - cursor.y) * 0.35;
            gl.uniform3f(u_cursor, cursor.x, cursor.y, cursor.active);
            gl.uniform1f(u_cursorRadius, CUT_RADIUS_CSS);
            // GC expired cuts
            while (cuts.length && now - cuts[0][2] > CUT_LIFETIME_MS) cuts.shift();
            const packed = new Float32Array(MAX_CUTS_JS * 3);
            for (let k = 0; k < cuts.length; ++k) {
              const [cx, cy, t0] = cuts[k];
              const age = now - t0;
              const linear = Math.max(0, 1 - age / CUT_LIFETIME_MS);
              // Quadratic ease-in: gentler decay early, steep at the end.
              const s = linear * linear;
              packed[k * 3 + 0] = cx;
              packed[k * 3 + 1] = cy;
              packed[k * 3 + 2] = s;
            }
            gl.uniform3fv(u_cuts, packed);
            gl.uniform1i(u_cutCount, cuts.length);
            gl.uniform1f(u_cutRadius, CUT_RADIUS_CSS);

            gl.drawArrays(gl.TRIANGLES, 0, 3);

            if (!hasShown) { setIsReady(true); hasShown = true; }

            time = (time + 0.0005) % 100000.0;
            animationFrame = requestAnimationFrame(draw);
        };

        // Setup and run
        resize();

        // === Capture mode short-circuit ===
        // When the OG APNG generator drives the noise, it sets t externally
        // and screenshots after each frame. No rAF, no listeners.
        if (captureMode) {
            (window as any).__noiseFrame = (t: number) => {
                time = t;
                // Inline a one-shot draw without rAF advancement. Replicates
                // draw() up to gl.drawArrays, with t fixed by caller.
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.useProgram(prog);
                gl.bindVertexArray(vao);
                gl.uniform2f(u_resolution, width, height);
                gl.uniform1f(u_time, time);
                gl.uniform3f(u_color, primaryRgb.current.r / 255, primaryRgb.current.g / 255, primaryRgb.current.b / 255);
                gl.uniform1f(u_toScreen, toScreen);
                gl.uniform2f(u_offset, 0, 0);
                gl.uniform1f(u_scroll, 0);
                gl.uniform1f(u_noiseScale, 0.002);
                gl.uniform1f(u_threshold, 0.62);
                gl.uniform1f(u_loopPeriod, loopSeconds || 0);
            gl.uniform1f(u_loopTravel, loopTravel);
                gl.uniform3f(u_cursor, -1000, -1000, 0);
                gl.uniform1f(u_cursorRadius, CUT_RADIUS_CSS);
                gl.uniform3fv(u_cuts, new Float32Array(MAX_CUTS_JS * 3));
                gl.uniform1i(u_cutCount, 0);
                gl.uniform1f(u_cutRadius, CUT_RADIUS_CSS);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                gl.flush();
                gl.finish();
            };
            (window as any).__noiseReady = true;
            // Render initial frame so screenshots before the first __noiseFrame
            // call still have content.
            (window as any).__noiseFrame(0);
            setIsReady(true);
            return () => {
                delete (window as any).__noiseFrame;
                delete (window as any).__noiseReady;
            };
        }

        const handleVisibility = () => {
            if (document.hidden) {
                if (animationFrame) cancelAnimationFrame(animationFrame);
            } else {
                animationFrame = requestAnimationFrame(draw);
            }
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousemove', onMouseCut);
        window.addEventListener('mousemove', onCursorMove);
        document.addEventListener('mouseleave', onCursorLeave);
        // Touch: passive so scroll isn't blocked. start+move drive the
        // single-finger trail; end clears the cursor head.
        window.addEventListener('touchstart', onTouch, { passive: true });
        window.addEventListener('touchmove', onTouch, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('touchcancel', onTouchEnd, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('visibilitychange', handleVisibility);
        const ric: any = (window as any).requestIdleCallback;
        if (typeof ric === 'function') {
            idleId = ric(() => { animationFrame = requestAnimationFrame(draw); }, { timeout: 1200 });
        } else {
            timeoutId = window.setTimeout(() => { animationFrame = requestAnimationFrame(draw); }, 0);
        }

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousemove', onMouseCut);
            window.removeEventListener('mousemove', onCursorMove);
            document.removeEventListener('mouseleave', onCursorLeave);
            window.removeEventListener('touchstart', onTouch);
            window.removeEventListener('touchmove', onTouch);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchcancel', onTouchEnd);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('visibilitychange', handleVisibility);
            if (animationFrame) cancelAnimationFrame(animationFrame);
            const cic: any = (window as any).cancelIdleCallback;
            if (idleId && typeof cic === 'function') cic(idleId);
            if (timeoutId) clearTimeout(timeoutId);
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
        <canvas ref={canvasRef} className={`block fixed left-0 top-0 w-full h-full print:hidden text-noise-primary bg-noise-secondary transition-opacity duration-700 ${isReady ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
    );
};

export default NoiseBackground; 