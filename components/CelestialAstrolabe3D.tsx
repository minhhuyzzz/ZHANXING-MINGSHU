'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface StarNode extends Point3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  brightness: number;
  pulseSpeed: number;
  phase: number;
}

interface Meteor {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  alpha: number;
  life: number;
}

interface AstrolabeProps {
  /** If true, fills container rather than fixed full viewport */
  contained?: boolean;
}

export default function CelestialAstrolabe3D({ contained = false }: AstrolabeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isVisible = true;
    let animId: number;

    const parent = contained && containerRef.current ? containerRef.current : null;
    let width = (canvas.width = parent ? parent.clientWidth : window.innerWidth);
    let height = (canvas.height = parent ? parent.clientHeight : window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
      height = canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Pause rendering when scrolled out of view to maintain 60fps
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(render);
          }
        });
      },
      { threshold: 0.05 }
    );
    if (canvas) observer.observe(canvas);

    // Mouse parallax tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      const rect = canvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / height - 0.5) * 2;
      targetRotY = normX * 0.28;
      targetRotX = -normY * 0.2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── Generate Optimized 3D Star Nodes (Smooth 100 stars) ──
    const STAR_COUNT = isDark ? 110 : 70;
    const starField: StarNode[] = [];
    const sphereRadius = Math.min(width, height) * 0.6;

    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = sphereRadius * (0.35 + Math.random() * 0.65);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      starField.push({
        x, y, z,
        baseX: x, baseY: y, baseZ: z,
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.6 + 0.4,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const ZHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

    // ── Meteors ──
    const meteors: Meteor[] = [];
    const createMeteor = () => {
      if (meteors.length >= 1 || Math.random() > 0.02) return;
      meteors.push({
        x: Math.random() * width * 0.7 + width * 0.1,
        y: Math.random() * height * 0.25,
        len: Math.random() * 80 + 50,
        speed: Math.random() * 6 + 10,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.15,
        alpha: 1,
        life: 0,
      });
    };

    let time = 0;
    const fov = 600;

    const project = (p: Point3D): { x: number; y: number; scale: number; visible: boolean } => {
      const z = p.z + fov;
      if (z <= 20) return { x: 0, y: 0, scale: 0, visible: false };
      const scale = fov / z;
      return {
        x: width * 0.5 + p.x * scale,
        y: height * 0.48 + p.y * scale,
        scale,
        visible: true,
      };
    };

    const rotate3D = (p: Point3D, rotX: number, rotY: number, rotZ: number): Point3D => {
      let cos = Math.cos(rotY), sin = Math.sin(rotY);
      let x1 = p.x * cos + p.z * sin;
      let y1 = p.y;
      let z1 = -p.x * sin + p.z * cos;

      cos = Math.cos(rotX); sin = Math.sin(rotX);
      let x2 = x1;
      let y2 = y1 * cos - z1 * sin;
      let z2 = y1 * sin + z1 * cos;

      cos = Math.cos(rotZ); sin = Math.sin(rotZ);
      let x3 = x2 * cos - y2 * sin;
      let y3 = x2 * sin + y2 * cos;
      let z3 = z2;

      return { x: x3, y: y3, z: z3 };
    };

    const render = () => {
      if (!isVisible) return;
      time += 0.004;

      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Radial Astrological Glow
      const centerGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.48, 10,
        width * 0.5, height * 0.48, Math.min(width, height) * 0.65
      );
      if (isDark) {
        centerGrad.addColorStop(0, 'rgba(212, 168, 67, 0.14)');
        centerGrad.addColorStop(0.35, 'rgba(67, 24, 130, 0.08)');
        centerGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.03)');
        centerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        centerGrad.addColorStop(0, 'rgba(212, 168, 67, 0.16)');
        centerGrad.addColorStop(0.5, 'rgba(240, 220, 160, 0.06)');
        centerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, width, height);

      // ── Rotating Celestial Astrolabe Rings ──
      const ringRadius = Math.min(width, height) * 0.35;
      const ringSteps = 60; // optimized steps

      const draw3DRing = (
        tiltX: number,
        tiltY: number,
        tiltZ: number,
        color: string,
        lineWidth: number,
        dash: number[] = []
      ) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(dash);

        let first = true;
        for (let i = 0; i <= ringSteps; i++) {
          const angle = (i / ringSteps) * Math.PI * 2;
          const rawPoint = {
            x: ringRadius * Math.cos(angle),
            y: ringRadius * Math.sin(angle),
            z: 0,
          };
          const rotated = rotate3D(rawPoint, tiltX + currentRotX, tiltY + currentRotY, tiltZ);
          const proj = project(rotated);
          if (!proj.visible) continue;

          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);
      };

      // 1. Ecliptic Ring
      draw3DRing(
        0.4,
        time * 0.5,
        0.15,
        isDark ? 'rgba(212, 168, 67, 0.42)' : 'rgba(180, 120, 20, 0.35)',
        1.5
      );

      // 2. Celestial Equator Ring
      draw3DRing(
        0.08,
        -time * 0.35,
        0,
        isDark ? 'rgba(147, 197, 253, 0.22)' : 'rgba(100, 140, 200, 0.22)',
        1,
        [4, 6]
      );

      // 3. Meridian Polar Ring
      draw3DRing(
        Math.PI * 0.5,
        time * 0.2,
        0.25,
        isDark ? 'rgba(216, 180, 254, 0.2)' : 'rgba(160, 100, 200, 0.18)',
        0.8,
        [2, 4]
      );

      // ── Draw 12 Zhi & Zodiac Markers ──
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.5;
        const p = {
          x: ringRadius * Math.cos(angle),
          y: ringRadius * Math.sin(angle),
          z: 0,
        };
        const rotated = rotate3D(p, 0.4 + currentRotX, currentRotY, 0.15);
        const proj = project(rotated);
        if (proj.visible) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, 2.2 * proj.scale, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#fcd34d' : '#b45309';
          ctx.fill();

          ctx.font = `${Math.max(9, 11 * proj.scale)}px sans-serif`;
          ctx.fillStyle = isDark ? 'rgba(253, 230, 138, 0.85)' : 'rgba(120, 53, 15, 0.85)';
          ctx.textAlign = 'center';
          ctx.fillText(
            `${ZHI_NAMES[i]} ${ZODIAC_SYMBOLS[i]}`,
            proj.x,
            proj.y - 7 * proj.scale
          );
        }
      }

      // ── Stars & Constellation Connectors ──
      const projectedStars: { proj: ReturnType<typeof project>; star: StarNode }[] = [];

      starField.forEach((s) => {
        const rot = rotate3D(
          { x: s.baseX, y: s.baseY, z: s.baseZ },
          currentRotX + time * 0.08,
          currentRotY + time * 0.1,
          0
        );
        const proj = project(rot);
        if (proj.visible) {
          projectedStars.push({ proj, star: s });

          s.phase += s.pulseSpeed;
          const alpha = s.brightness * (0.6 + 0.4 * Math.sin(s.phase));

          ctx.beginPath();
          ctx.arc(proj.x, proj.y, s.size * proj.scale, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(255, 235, 180, ${alpha * 0.85})`
            : `rgba(140, 90, 10, ${alpha * 0.7})`;
          ctx.fill();
        }
      });

      // Thin constellation filaments
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedStars.length; i += 5) {
        const s1 = projectedStars[i];
        for (let j = i + 1; j < Math.min(i + 4, projectedStars.length); j++) {
          const s2 = projectedStars[j];
          const dist = Math.hypot(s1.proj.x - s2.proj.x, s1.proj.y - s2.proj.y);
          if (dist < 65) {
            const alpha = (1 - dist / 65) * 0.16;
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(212, 168, 67, ${alpha})`
              : `rgba(160, 100, 20, ${alpha})`;
            ctx.moveTo(s1.proj.x, s1.proj.y);
            ctx.lineTo(s2.proj.x, s2.proj.y);
            ctx.stroke();
          }
        }
      }

      // ── Meteors ──
      createMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.life += 1;
        m.alpha = Math.max(0, 1 - m.life / 30);

        const tailX = m.x - Math.cos(m.angle) * m.len;
        const tailY = m.y - Math.sin(m.angle) * m.len;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.8, isDark ? `rgba(251, 191, 36, ${m.alpha * 0.6})` : `rgba(217, 119, 6, ${m.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha})`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        if (m.alpha <= 0) {
          meteors.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDark, contained]);

  if (contained) {
    return (
      <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <canvas ref={canvasRef} className="w-full h-full block" style={{ opacity: isDark ? 0.95 : 0.65 }} />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: isDark ? 0.95 : 0.65 }}
    />
  );
}
