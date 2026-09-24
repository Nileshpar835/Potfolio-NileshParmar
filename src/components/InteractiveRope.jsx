import React, { useEffect, useRef, useState } from 'react';
import '../styles/Rope.css';

const DAMPING = 0.982;
const GRAVITY = 0.05;
const ITERATIONS = 14;
const SLACK_LOOSE = 1.13;
const SLACK_TAUT = 1.003;
const TOP_PAD = 16;
const MAX_STEP = 22;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const hash = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const catmullRomPath = (pts) => {
  if (!pts.length) return '';
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
};

const InteractiveRope = () => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  const [size, setSize] = useState({
    w: 120,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [isTablet, setIsTablet] = useState(
    () => window.innerWidth >= 768 && window.innerWidth < 1024
  );
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const shadowRef = useRef(null);
  const outlineRef = useRef(null);
  const bodyRef = useRef(null);
  const lightRef = useRef(null);
  const lighterRef = useRef(null);
  const weatherRef = useRef(null);
  const specRef = useRef(null);
  const lipRef = useRef(null);
  const grooveRef = useRef(null);
  const fiberRef = useRef(null);
  const flyRef = useRef(null);
  const glowRef = useRef(null);

  const pointsRef = useRef([]);
  const segLenRef = useRef(1);
  const ropeWRef = useRef(9);
  const pinDistanceRef = useRef(1);
  const nRef = useRef(1);
  const tightnessRef = useRef(0);
  const sizeRef = useRef(size);
  const hoveredRef = useRef(false);
  const velRef = useRef(0);
  const impRef = useRef(0);
  const lastScrollPRef = useRef(0);
  const lastScrollTRef = useRef(performance.now());
  const dragRef = useRef({ index: -1, x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const glowSmoothRef = useRef(0);
  const rafRef = useRef(0);

  sizeRef.current = size;
  hoveredRef.current = isHovered;

  const ropeW = isDesktop ? 9 : isTablet ? 7.5 : 6.5;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toLocal = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * sizeRef.current.w,
      y: ((clientY - rect.top) / rect.height) * sizeRef.current.h,
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      const now = performance.now();
      const dt = Math.max(16, now - lastScrollTRef.current);
      const delta = p - lastScrollPRef.current;
      velRef.current = clamp((delta / dt) * 1000, -1.5, 1.5);
      impRef.current = clamp(impRef.current + delta * 220, -30, 30);
      lastScrollPRef.current = p;
      lastScrollTRef.current = now;
    };

    const handlePointerDown = (e) => {
      const local = toLocal(e.clientX, e.clientY);
      const pts = pointsRef.current;
      if (!local || !pts.length) return;
      let best = -1;
      let bestD = 48 * 48;
      for (let i = 1; i < pts.length - 1; i++) {
        const dx = pts[i].x - local.x;
        const dy = pts[i].y - local.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD) {
          bestD = d2;
          best = i;
        }
      }
      if (best >= 0) {
        dragRef.current = { index: best, x: local.x, y: local.y };
        containerRef.current?.setPointerCapture?.(e.pointerId);
      }
    };

    const handlePointerMove = (e) => {
      const local = toLocal(e.clientX, e.clientY);
      if (!local) return;
      mouseRef.current = { x: local.x, y: local.y, active: true };
      if (dragRef.current.index >= 0) {
        dragRef.current.x = local.x;
        dragRef.current.y = local.y;
      }
    };

    const handlePointerUp = () => {
      dragRef.current.index = -1;
    };

    const handlePointerLeave = () => {
      dragRef.current.index = -1;
      mouseRef.current.active = false;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const el = containerRef.current;
    el?.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    el?.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      el?.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      el?.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  const initRope = () => {
    const { w, h } = sizeRef.current;
    if (w < 20 || h < 80) {
      pointsRef.current = [];
      return;
    }

    const n = clamp(Math.floor(h / 14), 32, 72);
    const cx = w / 2;
    const pinDistance = h - TOP_PAD * 2;
    pinDistanceRef.current = pinDistance;
    nRef.current = n;
    tightnessRef.current = 0;
    segLenRef.current = (pinDistance * SLACK_LOOSE) / (n - 1);
    ropeWRef.current = ropeW;

    const bowDir = hash(w + h) > 0.5 ? 1 : -1;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const frac = i / (n - 1);
      const y = TOP_PAD + pinDistance * frac;
      const bow =
        Math.sin(frac * Math.PI) * w * 0.22 * bowDir +
        Math.sin(frac * Math.PI * 2) * w * 0.06 * -bowDir;
      const x = cx + bow;
      pts.push({
        x,
        y,
        px: x,
        py: y,
        pinned: i === 0 || i === n - 1,
      });
    }
    pointsRef.current = pts;

    const setW = (ref, w2) => ref.current?.setAttribute('stroke-width', String(w2));
    setW(shadowRef, ropeW + 5);
    setW(outlineRef, ropeW + 1.6);
    setW(bodyRef, ropeW);
    setW(lightRef, ropeW - 2.4);
    setW(lighterRef, ropeW - 5);
    setW(weatherRef, Math.max(2, ropeW - 3));
    setW(specRef, 2.2);
    setW(glowRef, ropeW + 9);

    if (reducedMotion) {
      for (let k = 0; k < 320; k++) step(k * 16);
      render(0);
    }
  };

  const step = (t) => {
    const pts = pointsRef.current;
    if (!pts.length) return;
    const n = pts.length;
    const vel = velRef.current;
    velRef.current *= 0.94;
    const imp = impRef.current;
    impRef.current *= 0.84;

    const activity = clamp(
      Math.abs(vel) * 2.2 + Math.abs(imp) * 0.1,
      0,
      1
    );
    const tight = tightnessRef.current;
    tightnessRef.current =
      tight + (activity - tight) * (activity > tight ? 0.18 : 0.035);
    const tension = tightnessRef.current;

    const slack = SLACK_LOOSE + (SLACK_TAUT - SLACK_LOOSE) * tension;
    segLenRef.current = (pinDistanceRef.current * slack) / (nRef.current - 1);

    const looseness = 1 - tension;
    const windAmp = (0.03 + Math.abs(vel) * 0.25) * looseness + 0.004 * tension;
    const phase = t * 0.001;
    const drag = dragRef.current;
    const mouse = mouseRef.current;

    for (let i = 0; i < n; i++) {
      const p = pts[i];
      if (p.pinned) continue;
      const frac = i / (n - 1);
      const prof = Math.sin(Math.PI * frac);

      let ax =
        Math.sin(phase * 1.7 + frac * 4.4) * windAmp * prof +
        Math.sin(phase * 0.63 + 1.3) * 0.018 * looseness * prof;
      ax += imp * 0.04 * looseness * prof * Math.sin(frac * Math.PI * 1.5 + t * 0.004);

      let ay =
        GRAVITY * (0.7 + looseness * 0.6) +
        Math.cos(phase * 1.35 + frac * 3.2) * 0.01 * looseness * prof;

      if (mouse.active && drag.index < 0) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 70 * 70 && d2 > 1) {
          const d = Math.sqrt(d2);
          const f = (1 - d / 70) * 0.9;
          ax += (dx / d) * f;
          ay += (dy / d) * f * 0.5;
        }
      }

      const damp = DAMPING - tension * 0.012;
      let vx = (p.x - p.px) * damp;
      let vy = (p.y - p.py) * damp;
      vx = clamp(vx, -MAX_STEP, MAX_STEP);
      vy = clamp(vy, -MAX_STEP, MAX_STEP);
      p.px = p.x;
      p.py = p.y;
      p.x += vx + ax;
      p.y += vy + ay;
    }

    if (drag.index >= 0 && pts[drag.index]) {
      pts[drag.index].x = drag.x;
      pts[drag.index].y = drag.y;
    }

    const L = segLenRef.current;
    for (let k = 0; k < ITERATIONS; k++) {
      for (let i = 0; i < n - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        const diff = (dist - L) / dist;
        if (a.pinned && b.pinned) continue;
        if (a.pinned) {
          b.x -= dx * diff;
          b.y -= dy * diff;
        } else if (b.pinned) {
          a.x += dx * diff;
          a.y += dy * diff;
        } else {
          const hx = dx * diff * 0.5;
          const hy = dy * diff * 0.5;
          a.x += hx;
          a.y += hy;
          b.x -= hx;
          b.y -= hy;
        }
      }
      if (drag.index >= 0 && pts[drag.index] && !pts[drag.index].pinned) {
        pts[drag.index].x = drag.x;
        pts[drag.index].y = drag.y;
      }
    }
  };

  const sampleAt = (pts, lens, total, s) => {
    const target = clamp(s, 0, total);
    for (let i = 0; i < lens.length; i++) {
      if (target <= lens[i] || i === lens.length - 1) {
        const segStart = i === 0 ? 0 : lens[i - 1];
        const segLen = lens[i] - segStart || 1;
        const f = clamp((target - segStart) / segLen, 0, 1);
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        return {
          x: a.x + dx * f,
          y: a.y + dy * f,
          tx: dx / d,
          ty: dy / d,
        };
      }
    }
    const last = pts[pts.length - 1];
    return { x: last.x, y: last.y, tx: 0, ty: 1 };
  };

  const render = (t) => {
    const pts = pointsRef.current;
    const svgEls = [
      shadowRef, outlineRef, bodyRef, lightRef, lighterRef,
      weatherRef, specRef, lipRef, grooveRef, fiberRef, flyRef, glowRef,
    ];
    if (!pts.length) {
      svgEls.forEach((r) => r.current?.setAttribute('d', ''));
      return;
    }

    const d = catmullRomPath(pts);
    svgEls.forEach((r) => r.current?.setAttribute('d', d));

    const rw = ropeWRef.current;
    const lens = [];
    let total = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const dx = pts[i + 1].x - pts[i].x;
      const dy = pts[i + 1].y - pts[i].y;
      total += Math.sqrt(dx * dx + dy * dy);
      lens.push(total);
    }

    const groovePitch = rw * 1.35;
    const wrapZone = 30;
    let grooveD = '';
    let lipD = '';
    let fiberD = '';

    for (let s = 2; s < total; s += groovePitch) {
      const { x, y, tx, ty } = sampleAt(pts, lens, total, s);
      const nx = -ty;
      const ny = tx;
      const endDist = Math.min(s, total - s);
      const inWrap = endDist < wrapZone;
      const twist = inWrap ? 0.18 : 0.8;
      let gx = nx + tx * twist;
      let gy = ny + ty * twist;
      const gl = Math.sqrt(gx * gx + gy * gy) || 1;
      gx /= gl;
      gy /= gl;
      const half = rw * (inWrap ? 0.52 : 0.48);
      const x1 = x - gx * half;
      const y1 = y - gy * half;
      const x2 = x + gx * half;
      const y2 = y + gy * half;
      grooveD += `M ${x1.toFixed(2)} ${y1.toFixed(2)}L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
      const lo = 1.35;
      lipD += `M ${(x1 + tx * lo).toFixed(2)} ${(y1 + ty * lo).toFixed(2)}L ${(
        x2 + tx * lo
      ).toFixed(2)} ${(y2 + ty * lo).toFixed(2)}`;
    }

    for (let s = 3; s < total; s += 5.5) {
      const { x, y, tx, ty } = sampleAt(pts, lens, total, s);
      const nx = -ty;
      const ny = tx;
      const off = (hash(s) - 0.5) * rw * 0.72;
      const len = 3 + hash(s + 9) * 3.5;
      const ox = x + nx * off;
      const oy = y + ny * off;
      fiberD += `M ${ox.toFixed(2)} ${oy.toFixed(2)}L ${(ox + tx * len).toFixed(
        2
      )} ${(oy + ty * len).toFixed(2)}`;
    }

    const flyFracs = [0.14, 0.27, 0.39, 0.52, 0.64, 0.78, 0.88];
    let flyD = '';
    flyFracs.forEach((frac, i) => {
      const s = frac * total;
      const { x, y, tx, ty } = sampleAt(pts, lens, total, s);
      const side = i % 2 === 0 ? 1 : -1;
      const nx = -ty * side;
      const ny = tx * side;
      const baseAng = 0.5 + hash(i * 3.7) * 0.9;
      const dirX = nx * Math.cos(baseAng) + tx * Math.sin(baseAng) * side;
      const dirY = ny * Math.cos(baseAng) + ty * Math.sin(baseAng) * side;
      const dl = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
      const len = 7 + hash(i + 4) * 9;
      const ex = x + (dirX / dl) * len;
      const ey = y + (dirY / dl) * len;
      const cx = x + (dirX / dl) * len * 0.5 - ty * 2.2 * side;
      const cy = y + (dirY / dl) * len * 0.5 + tx * 2.2 * side;
      const sx = x + (nx * rw) / 2.6;
      const sy = y + (ny * rw) / 2.6;
      flyD += `M ${sx.toFixed(2)} ${sy.toFixed(2)}Q ${cx.toFixed(2)} ${cy.toFixed(
        2
      )} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
    });

    grooveRef.current?.setAttribute('d', grooveD);
    lipRef.current?.setAttribute('d', lipD);
    fiberRef.current?.setAttribute('d', fiberD);
    flyRef.current?.setAttribute('d', flyD);

    const targetGlow =
      clamp(Math.abs(velRef.current) * 2.4, 0, 0.65) +
      (hoveredRef.current ? 0.3 : 0);
    glowSmoothRef.current += (targetGlow - glowSmoothRef.current) * 0.12;
    if (glowRef.current) {
      glowRef.current.style.opacity = glowSmoothRef.current.toFixed(3);
    }
    if (t === 0 && reducedMotion && glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  useEffect(() => {
    initRope();
    if (!reducedMotion) render(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h, isDesktop, isTablet, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    let running = true;
    const loop = (t) => {
      if (!running) return;
      if (!document.hidden) {
        step(t);
        render(t);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const cx = size.w / 2;
  const topY = TOP_PAD;
  const botY = size.h - TOP_PAD;
  const er = isDesktop ? 11 : 9;

  return (
    <div
      ref={containerRef}
      className={`rope-container${isHovered ? ' is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        ref={svgRef}
        className="rope-svg"
        viewBox={`0 0 ${size.w} ${size.h}`}
      >
        <defs>
          <filter id="ropeBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" />
          </filter>
          <filter id="specBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" />
          </filter>
          <filter id="glowBlur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          <linearGradient id="eyeletMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3d998" />
            <stop offset="35%" stopColor="#b8860b" />
            <stop offset="70%" stopColor="#7a5216" />
            <stop offset="100%" stopColor="#3f2a0e" />
          </linearGradient>
          <radialGradient id="eyeletHole" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#0a0603" />
            <stop offset="100%" stopColor="#1c120a" />
          </radialGradient>
          <linearGradient id="ropeSheenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb84d" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ff9a3d" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffb84d" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <path ref={shadowRef} className="rope-layer rope-shadow" transform="translate(3.5 5)" />
        <path ref={outlineRef} className="rope-layer rope-outline" />
        <path ref={bodyRef} className="rope-layer rope-body" />
        <path ref={lightRef} className="rope-layer rope-light" transform="translate(-1.1 -0.5)" />
        <path ref={lighterRef} className="rope-layer rope-lighter" transform="translate(-2 -0.7)" />
        <path ref={weatherRef} className="rope-layer rope-weather" />
        <path ref={specRef} className="rope-layer rope-spec" transform="translate(-2.7 -0.9)" />
        <path ref={lipRef} className="rope-layer rope-groove-lip" />
        <path ref={grooveRef} className="rope-layer rope-groove" />
        <path ref={fiberRef} className="rope-layer rope-fiber" />
        <path ref={flyRef} className="rope-layer rope-fly" />
        <path ref={glowRef} className="rope-layer rope-glow" stroke="url(#ropeSheenGrad)" />

        <g className="rope-eyelet" transform={`translate(${cx} ${topY})`}>
          <circle r={er} className="eyelet-plate" />
          <circle r={er} fill="url(#eyeletMetal)" stroke="#241405" strokeWidth="1" />
          <circle r={er * 0.42} fill="url(#eyeletHole)" />
          <path
            className="eyelet-shine"
            d={`M ${-er * 0.66} ${-er * 0.4} A ${er * 0.8} ${er * 0.8} 0 0 1 ${er * 0.25} ${-er * 0.74}`}
          />
          <circle cx={-er * 0.42} cy={-er * 0.42} r={1.6} fill="rgba(255,244,214,0.7)" />
        </g>
        <g className="rope-eyelet" transform={`translate(${cx} ${botY})`}>
          <circle r={er} className="eyelet-plate" />
          <circle r={er} fill="url(#eyeletMetal)" stroke="#241405" strokeWidth="1" />
          <circle r={er * 0.42} fill="url(#eyeletHole)" />
          <path
            className="eyelet-shine"
            d={`M ${-er * 0.66} ${-er * 0.4} A ${er * 0.8} ${er * 0.8} 0 0 1 ${er * 0.25} ${-er * 0.74}`}
          />
          <circle cx={-er * 0.42} cy={-er * 0.42} r={1.6} fill="rgba(255,244,214,0.7)" />
        </g>
      </svg>
    </div>
  );
};

export default InteractiveRope;
