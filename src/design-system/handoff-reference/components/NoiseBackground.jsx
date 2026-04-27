// NoiseBackground.jsx — 1:1 port of CV/src/components/NoiseBackground.tsx.
// 3D simplex noise (Ashima/Stegu), thresholded into organic lava-lamp blobs.
// Color and bg read from canvas CSS (currentColor / background-color).
const { useEffect, useRef, useState } = React;

function NoiseBackground() {
  const canvasRef = useRef(null);
  const primaryRgb = useRef({ r: 255, g: 255, b: 255 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const targetScrollOffset = useRef(0);
  const currentScrollOffset = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const parseRgb = (rgbStr) => {
    const m = rgbStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    return m ? { r: +m[1], g: +m[2], b: +m[3] } : { r: 0, g: 0, b: 0 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    primaryRgb.current = parseRgb(getComputedStyle(canvas).color);
    const bgStr = getComputedStyle(canvas).backgroundColor || 'rgba(0,0,0,0)';
    const bgM = bgStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/);
    const bg = bgM ? {
      r: +bgM[1] / 255, g: +bgM[2] / 255, b: +bgM[3] / 255,
      a: bgM[4] !== undefined ? +bgM[4] : 0,
    } : { r: 0, g: 0, b: 0, a: 0 };

    // Parallax config — copied from source
    const parallaxIntensity = 0.1;
    const scrollParallaxIntensity = 0.1;
    const lerpFactor = 0.08;
    const scrollEaseFactor = 0.2;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) {
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      setIsReady(true);
      return () => {};
    }

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: false });
    if (!gl) return () => {};

    let width = 0, height = 0, dpr = 1, toScreen = 1;
    let raf = 0;
    let time = Math.random() * 1000; // random starting slice on the time axis
    let hasShown = false;

    const vertexSrc = `#version 300 es
precision highp float;
const vec2 pos[3] = vec2[3](
  vec2(-1.0, -1.0),
  vec2( 3.0, -1.0),
  vec2(-1.0,  3.0)
);
void main(){ gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0); }`;

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
uniform vec3  u_cursor;           // xy = position in canvas-local CSS px (GL bottom-left), z = active 0/1
uniform float u_cursorRadius;     // radius of the always-on head cut, in CSS px
#define MAX_CUTS 192
uniform int   u_cutCount;
uniform vec3  u_cuts[MAX_CUTS];   // xy = position in CSS px (canvas-local), z = strength 0..1
uniform float u_cutRadius;        // radius in CSS px

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
  float n = snoise(vec3(pos * u_noiseScale, u_time));
  float v = 0.5 * (n + 1.0);

  // Cursor cuts: pixels close to a recent cursor sample are pushed AWAY from the
  // threshold — if they were lit, they go dark; if dark, they stay dark.
  // The cut radius scales with strength (= freshness), so the head of the trail
  // has a wide radius and the tail tapers down to ~1/3 of it.
  float cut = 0.0;
  for (int k = 0; k < MAX_CUTS; ++k) {
    if (k >= u_cutCount) break;
    vec3 c = u_cuts[k];
    float radiusFactor = mix(0.25, 1.0, pow(c.z, 2.0));
    float r = u_cutRadius * radiusFactor;
    float invR2 = 1.0 / max(r * r, 1.0);
    vec2 d = screenPx - c.xy;
    float falloff = exp(-dot(d, d) * invR2);
    // Cube the strength on contribution so faint old points fully vanish
    // instead of leaving black specks at the very end of the trail.
    cut += c.z * c.z * c.z * falloff;
  }

  // Always-on cursor orb — disabled (kept stub so uniforms stay valid).
  float orbA = 0.0;
  // Cancel cuts under the orb so the head of the trail doesn't dig through it.
  // Always-fresh head cut at the cursor position: same shape as a buffer cut
  // but with fixed strength = 1, so the head is always full-radius and never
  // fades. Disabled when cursor isn't active.
  if (u_cursor.z > 0.5) {
    vec2 dh = screenPx - u_cursor.xy;
    float invR2h = 1.0 / max(u_cursorRadius * u_cursorRadius, 1.0);
    float falloffH = exp(-dot(dh, dh) * invR2h);
    // Boost the head so its depth matches the accumulated tail (multiple
    // overlapping gaussians) — without this the head looks thinner than the
    // body even though the radius is the same.
    cut += falloffH * 1.5;
  }
  v -= 0.45 * clamp(cut, 0.0, 1.5);

  if (v < u_threshold) discard;
  outColor = vec4(u_color, 1.0);
}`;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh); return null;
      }
      return sh;
    };
    const vsh = compile(gl.VERTEX_SHADER, vertexSrc);
    const fsh = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vsh || !fsh) return () => {};
    const prog = gl.createProgram();
    gl.attachShader(prog, vsh); gl.attachShader(prog, fsh); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog)); return () => {};
    }
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const u_time = gl.getUniformLocation(prog, 'u_time');
    const u_color = gl.getUniformLocation(prog, 'u_color');
    const u_toScreen = gl.getUniformLocation(prog, 'u_toScreen');
    const u_offset = gl.getUniformLocation(prog, 'u_offset');
    const u_scroll = gl.getUniformLocation(prog, 'u_scroll');
    const u_noiseScale = gl.getUniformLocation(prog, 'u_noiseScale');
    const u_threshold = gl.getUniformLocation(prog, 'u_threshold');
    const u_cursor = gl.getUniformLocation(prog, 'u_cursor');
    const u_cursorRadius = gl.getUniformLocation(prog, 'u_cursorRadius');
    const u_cutCount = gl.getUniformLocation(prog, 'u_cutCount');
    const u_cutRadius = gl.getUniformLocation(prog, 'u_cutRadius');
    const u_cuts = gl.getUniformLocation(prog, 'u_cuts[0]');

    // Cursor position state — lerp toward target so the orb moves smoothly.
    const cursor = { tx: -1000, ty: -1000, x: -1000, y: -1000, active: 0 };
    const onCursorMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      cursor.tx = e.clientX - rect.left;
      cursor.ty = rect.height - (e.clientY - rect.top);
      cursor.active = 1;
    };
    const onCursorLeave = (e) => { if (!e.relatedTarget) cursor.active = 0; };
    const MAX_CUTS = 192;
    const CUT_LIFETIME_MS = 1200;       // total decay time
    const CUT_SPACING_PX = 2;           // min distance between samples (in CSS px)
    const cuts = [];                    // array of [xCss, yCss, t0]
    let lastCutPos = null;
    let pendingMouse = null;
    // Smoothed cursor position — we track an eased pointer that lags behind
    // the raw mouse, then drop cuts along THAT, so the trail flows like ink
    // instead of snapping pixel-by-pixel to mouse events.
    const easedPtr = { x: null, y: null };
    const EASE = 0.35; // 0..1 — higher = follows raw mouse more closely
    const pushCut = (x, y, t) => {
      cuts.push([x, y, t]);
      if (cuts.length > MAX_CUTS) cuts.shift();
    };
    const onMouseCut = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top); // GL origin = bottom-left
      pendingMouse = { x, y };
    };
    const drainCuts = (now) => {
      if (!pendingMouse) return;
      // Ease the working position toward the raw cursor target — this softens
      // jitter from high-poll mice and makes slow movement feel buttery.
      if (easedPtr.x === null) {
        easedPtr.x = pendingMouse.x;
        easedPtr.y = pendingMouse.y;
      } else {
        easedPtr.x += (pendingMouse.x - easedPtr.x) * EASE;
        easedPtr.y += (pendingMouse.y - easedPtr.y) * EASE;
      }
      const x = easedPtr.x, y = easedPtr.y;
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
      const lw = window.innerWidth, lh = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      const nw = Math.max(1, Math.floor(lw * dpr));
      const nh = Math.max(1, Math.floor(lh * dpr));
      if (canvas.width !== nw || canvas.height !== nh) {
        canvas.width = nw; canvas.height = nh;
      }
      canvas.style.width = lw + 'px';
      canvas.style.height = lh + 'px';
      width = canvas.width; height = canvas.height;
      toScreen = 1 / dpr;
      gl.viewport(0, 0, width, height);
      gl.clearColor(bg.r, bg.g, bg.b, 1.0);
    };

    const onMouseMove = (e) => {
      const cx = window.innerWidth * 0.5;
      const cy = window.innerHeight * 0.5;
      targetOffset.current = {
        x: (e.clientX - cx) * parallaxIntensity,
        y: (e.clientY - cy) * parallaxIntensity,
      };
    };
    const onScroll = () => {
      targetScrollOffset.current = window.scrollY * scrollParallaxIntensity;
    };

    const draw = () => {
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * lerpFactor;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * lerpFactor;
      const scrollDiff = targetScrollOffset.current - currentScrollOffset.current;
      const easedStep = scrollDiff * scrollEaseFactor;
      const easedProgress = easeOut(Math.min(Math.abs(easedStep) / Math.abs(scrollDiff || 1), 1));
      currentScrollOffset.current += scrollDiff * easedProgress * scrollEaseFactor;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindVertexArray(vao);
      gl.uniform1f(u_time, time);
      gl.uniform3f(u_color,
        primaryRgb.current.r / 255,
        primaryRgb.current.g / 255,
        primaryRgb.current.b / 255);
      gl.uniform1f(u_toScreen, toScreen);
      gl.uniform2f(u_offset, currentOffset.current.x, currentOffset.current.y);
      gl.uniform1f(u_scroll, currentScrollOffset.current);
      gl.uniform1f(u_noiseScale, 0.002);
      gl.uniform1f(u_threshold, 0.62);

      // Pack the live cuts into a flat Float32Array of vec3s (x, y, strength).
      const now = performance.now();
      drainCuts(now);
      // Smooth cursor toward target for the orb.
      cursor.x += (cursor.tx - cursor.x) * 0.35;
      cursor.y += (cursor.ty - cursor.y) * 0.35;
      gl.uniform3f(u_cursor, cursor.x, cursor.y, cursor.active);
      gl.uniform1f(u_cursorRadius, 40.0); // size of the head cut in CSS px (matches u_cutRadius)
      // GC expired
      while (cuts.length && now - cuts[0][2] > CUT_LIFETIME_MS) cuts.shift();
      const packed = new Float32Array(MAX_CUTS * 3);
      for (let k = 0; k < cuts.length; ++k) {
        const [cx, cy, t0] = cuts[k];
        const age = now - t0;
        const linear = Math.max(0, 1 - age / CUT_LIFETIME_MS);
        // Soft ease-in (quadratic): gentler decay early, still steep at the very end.
        const s = linear * linear;
        packed[k * 3 + 0] = cx;
        packed[k * 3 + 1] = cy;
        packed[k * 3 + 2] = s;
      }
      gl.uniform3fv(u_cuts, packed);
      gl.uniform1i(u_cutCount, cuts.length);
      gl.uniform1f(u_cutRadius, 40.0); // radius of the "cut" gaussian, in CSS px
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!hasShown) { setIsReady(true); hasShown = true; }
      time = (time + 0.0005) % 100000.0;
      raf = requestAnimationFrame(draw);
    };

    resize();
    const onVis = () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); }
      else { raf = requestAnimationFrame(draw); }
    };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousemove', onMouseCut);
    window.addEventListener('mousemove', onCursorMove);
    window.addEventListener('mouseout', onCursorLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(draw);

    // React to parent's lava-mode toggling — re-read current canvas CSS color.
    const mo = new MutationObserver(() => {
      primaryRgb.current = parseRgb(getComputedStyle(canvas).color);
    });
    mo.observe(canvas, { attributes: true, attributeFilter: ['class', 'style'] });
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', onMouseCut);
      window.removeEventListener('mousemove', onCursorMove);
      window.removeEventListener('mouseout', onCursorLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
      if (raf) cancelAnimationFrame(raf);
      mo.disconnect();
      gl.bindVertexArray(null);
      gl.useProgram(null);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(prog);
      gl.deleteShader(vsh);
      gl.deleteShader(fsh);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={"noise-canvas " + (isReady ? "is-ready" : "")}
      aria-hidden="true"
    />
  );
}

window.NoiseBackground = NoiseBackground;
