'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiAstrolabeScanningModalProps {
  onComplete: () => void;
  personName?: string;
}

const SCAN_STEPS = [
  {
    phase: 'GIAI ĐOẠN 01',
    code: 'CALIBRATING_SOLAR_TIME',
    title: 'Hiệu Chỉnh Chân Thái Dương Thời',
    detail: 'AI ZHANXING MINGSHU đang kết nối tọa độ địa lý, bù trừ phương trình thời gian (Equation of Time) theo kinh độ chuẩn xác...',
  },
  {
    phase: 'GIAI ĐOẠN 02',
    code: 'MAPPING_14_MAJOR_STARS',
    title: 'Khảo Sát 14 Chính Tinh & Thập Nhị Cung',
    detail: 'Thiết lập địa bàn 12 cung chức, định vị Tử Vi, Thiên Phủ, Thất Sát, Tham Lang cùng Lục Cát Tinh & Lục Sát Tinh...',
  },
  {
    phase: 'GIAI ĐOẠN 03',
    code: 'PATTERN_RECOGNITION_1100',
    title: 'Quét 1100+ Cách Cục Cổ Thư & Tứ Hóa Phi Tinh',
    detail: 'Đối chiếu các đại cách cục kinh điển (Tử Phủ Triều Viên, Sát Phá Tham, Hỏa Tham, Dương Lương Xương Lộc) theo 《Thiên Kỷ》...',
  },
  {
    phase: 'GIAI ĐOẠN 04',
    code: 'INTEGRATING_MERIDIAN_MEDICINE',
    title: 'Kích Hoạt Ma Trận Y Lý Tử Ngọ Lưu Chú',
    detail: 'Tổng hợp ngũ hành nạp âm, phân tích 12 kinh lạc tạng phủ và chuẩn bị luận giải đa tầng AI. Hoàn tất khởi tạo mệnh bàn!',
  },
];

export default function AiAstrolabeScanningModal({ onComplete, personName }: AiAstrolabeScanningModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(12);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── Canvas Galaxy Starfield Animation ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars & celestial particles
    const stars = Array.from({ length: 180 }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 800 + 100,
      size: Math.random() * 1.8 + 0.6,
      color: Math.random() > 0.4 ? '#d4a843' : Math.random() > 0.5 ? '#60a5fa' : '#ffffff',
      alpha: Math.random() * 0.8 + 0.2,
    }));

    let angle = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(4, 7, 14, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      angle += 0.003;

      // Draw rotating celestial orbit rings
      ctx.save();
      ctx.translate(cx, cy);

      // Orbital Ring 1
      ctx.beginPath();
      ctx.arc(0, 0, 160, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 168, 67, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();

      // Orbital Ring 2 (Tilted)
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 240, 190, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 168, 67, 0.28)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([12, 12]);
      ctx.stroke();

      // Star markers on ring 2
      for (let i = 0; i < 4; i++) {
        const rad = (Math.PI / 2) * i + angle;
        const sx = Math.cos(rad) * 240;
        const sy = Math.sin(rad) * 190;
        ctx.fillStyle = '#f0d070';
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = '#d4a843';
        ctx.shadowBlur = 10;
      }
      ctx.restore();

      // Orbital Ring 3 (Outer)
      ctx.save();
      ctx.rotate(-angle * 0.7);
      ctx.beginPath();
      ctx.arc(0, 0, 310, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 14]);
      ctx.stroke();
      ctx.restore();

      // 3D Starfield Projection
      for (const s of stars) {
        s.z -= 1.5;
        if (s.z <= 1) s.z = 800;

        const k = 380 / s.z;
        const px = s.x * k;
        const py = s.y * k;

        if (px >= -cx && px <= cx && py >= -cy && py <= cy) {
          ctx.beginPath();
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.min(1, (1 - s.z / 800) * s.alpha);
          ctx.arc(px, py, s.size * k * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ── Step timer logic (total ~2.8s) ──
  useEffect(() => {
    const t1 = setTimeout(() => { setCurrentStep(1); setProgress(38); }, 680);
    const t2 = setTimeout(() => { setCurrentStep(2); setProgress(68); }, 1360);
    const t3 = setTimeout(() => { setCurrentStep(3); setProgress(92); }, 2040);
    const t4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2720);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const step = SCAN_STEPS[currentStep];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#04070e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e8eef6',
        overflow: 'hidden',
      }}
    >
      {/* Background Galaxy Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Radial glow in center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,67,0.18) 0%, rgba(58,120,212,0.08) 45%, transparent 70%)',
          filter: 'blur(32px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '680px',
          width: '90%',
          padding: '36px 28px',
          borderRadius: '24px',
          background: 'rgba(8, 14, 30, 0.72)',
          border: '1px solid rgba(212, 168, 67, 0.35)',
          boxShadow: '0 12px 64px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212,168,67,0.15)',
          backdropFilter: 'blur(20px)',
          textAlign: 'center',
        }}
      >
        {/* Top Tech Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 16px', borderRadius: '999px', background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.35)', color: '#d4a843', fontSize: '11px', letterSpacing: '0.2em', fontWeight: 600, marginBottom: '22px' }}>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            style={{ display: 'inline-block' }}
          >
            ✦
          </motion.span>
          <span>AI ZHANXING MINGSHU · MÔ HÌNH LÝ SỐ NGHÊ HẢI HÀ</span>
        </div>

        {/* Central Pulse Symbol */}
        <div style={{ position: 'relative', width: '84px', height: '84px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.75, 0.35] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid rgba(212, 168, 67, 0.6)',
              boxShadow: '0 0 24px rgba(212, 168, 67, 0.4)',
            }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: '8px',
              borderRadius: '50%',
              border: '1.5px dashed rgba(96, 165, 250, 0.65)',
            }}
          />
          <span style={{ fontSize: '32px', color: '#f0d070', textShadow: '0 0 16px rgba(212,168,67,0.8)' }}>
            ☯
          </span>
        </div>

        {/* Headline */}
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f0d070', letterSpacing: '0.08em', marginBottom: '8px' }}>
          {personName ? `Đang Giải Mã Lá Số Của ${personName}...` : 'AI Đang Khởi Bàn & Phân Tích Mệnh Số...'}
        </h2>

        {/* Current Phase & Code */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(212,168,67,0.8)', marginBottom: '14px', fontFamily: 'monospace' }}>
          <span>[{step.phase}]</span>
          <span>•</span>
          <span style={{ color: '#93c5fd' }}>{step.code}</span>
        </div>

        {/* Dynamic Transition Text */}
        <div style={{ minHeight: '68px', marginBottom: '24px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
            >
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>
                {step.title}
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(180, 200, 225, 0.85)', lineHeight: 1.6, maxWidth: '540px', margin: '0 auto' }}>
                {step.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar & Percentage */}
        <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(212,168,67,0.9)', marginBottom: '6px', fontFamily: 'monospace' }}>
            <span>ĐỘ CHUẨN XÁC THUẬT TOÁN</span>
            <span>{progress}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              border: '1px solid rgba(212, 168, 67, 0.25)',
            }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #b8892a 0%, #f0d070 60%, #93c5fd 100%)',
                boxShadow: '0 0 12px rgba(212, 168, 67, 0.8)',
              }}
            />
          </div>
        </div>

        {/* 4 Step Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', maxWidth: '520px', margin: '18px auto 0' }}>
          {SCAN_STEPS.map((s, idx) => {
            const isDone = idx < currentStep;
            const isCurr = idx === currentStep;
            return (
              <div
                key={s.code}
                style={{
                  padding: '6px 4px',
                  borderRadius: '8px',
                  background: isCurr ? 'rgba(212,168,67,0.18)' : isDone ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                  border: isCurr ? '1px solid rgba(212,168,67,0.5)' : isDone ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  fontSize: '9px',
                  color: isCurr ? '#f0d070' : isDone ? '#4ade80' : 'rgba(255,255,255,0.35)',
                  fontWeight: isCurr ? 600 : 400,
                  transition: 'all 0.3s ease',
                }}
              >
                {isDone ? '✓ ' : ''}{s.phase.replace('GIAI ĐOẠN ', 'BƯỚC ')}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
