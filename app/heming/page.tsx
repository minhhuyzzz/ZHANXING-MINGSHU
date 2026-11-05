'use client';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import { formToBirthInfo } from '@/lib/ziwei/share';
import { generateChart as buildChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';
import { useTheme } from '@/components/ThemeProvider';
import { getStarVi, getPalaceVi, getGanZhiVi, getWuXingJuVi } from '@/lib/ziwei/vietnamese';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import {
  calculateCompatibility,
  compare12Palaces,
  type CompatibilityResult,
  type PalaceComparison,
  type RadarScores,
  GAN_SIHUA,
  STEM_VI_MAP,
  BRANCH_VI_MAP,
} from '@/lib/ziwei/heming-engine';

// ─── Hiển Thị Nội Dung Luận Giải Markdown Chuyên Sâu ────────
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} style={{ paddingTop: i === 0 ? 0 : '20px', paddingBottom: '8px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(184,146,42,0.08) 100%)',
                border: '1px solid rgba(212,168,67,0.4)',
                color: 'var(--ac)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em',
                boxShadow: '0 2px 10px rgba(212,168,67,0.15)',
              }}>
                <span style={{ fontSize: '12px' }}>✦</span>
                <span>{sectionMatch[1]}</span>
              </div>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} style={{ height: '6px' }} />;
        if (line.trim() === '---') {
          return <div key={i} style={{ height: '1px', background: 'var(--bdr-med)', margin: '14px 0', opacity: 0.5 }} />;
        }
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} style={{ fontSize: '13.5px', lineHeight: 1.8, color: 'var(--tx-1)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} style={{ fontWeight: 600, color: 'var(--tx-0)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span style={{
          display: 'inline-block', width: '8px', height: '15px',
          background: 'var(--ac)', opacity: 0.6, borderRadius: '2px',
          animation: 'pulse 1s ease-in-out infinite',
          verticalAlign: 'middle', marginLeft: '3px',
        }} />
      )}
    </div>
  );
}

// ─── BIỂU ĐỒ RADAR TINH ĐỒ 6 CHIỀU (CELESTIAL RADAR SVG) ─────
function CelestialRadarChart({
  scores,
  isDark,
}: {
  scores: RadarScores;
  isDark: boolean;
}) {
  const axes = useMemo(() => [
    { key: 'tamTinh', label: 'Tâm Tính', icon: '✦', val: scores.tamTinh, angle: -90 },
    { key: 'suNghiep', label: 'Sự Nghiệp', icon: '💼', val: scores.suNghiep, angle: -30 },
    { key: 'taiVan', label: 'Tài Vận', icon: '💰', val: scores.taiVan, angle: 30 },
    { key: 'phucDuc', label: 'Phúc Đức', icon: '☯', val: scores.phucDuc, angle: 90 },
    { key: 'phongThuy', label: 'Phong Thủy', icon: '🏡', val: scores.phongThuy, angle: 150 },
    { key: 'tinhDuyen', label: 'Tình Duyên', icon: '❤', val: scores.tinhDuyen, angle: 210 },
  ], [scores]);

  const cx = 175;
  const cy = 175;
  const maxR = 105;

  const getCoord = (angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const levels = [0.25, 0.5, 0.75, 1.0];

  const polygonPoints = axes.map(a => {
    const r = (a.val / 100) * maxR;
    const pt = getCoord(a.angle, r);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="350" height="350" viewBox="0 0 350 350" style={{ overflow: 'visible', maxWidth: '100%' }}>
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.15" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Mạng nhện đồng tâm */}
        {levels.map((lvl, idx) => {
          const pts = axes.map(a => {
            const pt = getCoord(a.angle, maxR * lvl);
            return `${pt.x},${pt.y}`;
          }).join(' ');
          return (
            <polygon
              key={idx}
              points={pts}
              fill="none"
              stroke={isDark ? 'rgba(212,168,67,0.18)' : 'rgba(180,120,20,0.18)'}
              strokeWidth={idx === 3 ? '1.5' : '1'}
              strokeDasharray={idx < 3 ? '3 3' : undefined}
            />
          );
        })}

        {/* Các tia trục */}
        {axes.map((a, i) => {
          const pt = getCoord(a.angle, maxR);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={pt.x}
              y2={pt.y}
              stroke={isDark ? 'rgba(212,168,67,0.25)' : 'rgba(180,120,20,0.25)'}
              strokeWidth="1"
            />
          );
        })}

        {/* Vùng đa giác điểm số hợp bàn */}
        <polygon
          points={polygonPoints}
          fill="url(#radarFill)"
          stroke="#f59e0b"
          strokeWidth="2.5"
          filter="url(#glow)"
        />

        {/* Các điểm chốt & nhãn chỉ số */}
        {axes.map((a, i) => {
          const r = (a.val / 100) * maxR;
          const pt = getCoord(a.angle, r);
          const labelPt = getCoord(a.angle, maxR + 26);

          return (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#fbbf24"
                stroke="#78350f"
                strokeWidth="1.5"
              />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--tx-0)"
                fontSize="11"
                fontWeight="700"
              >
                {a.icon} {a.label}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 13}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--ac)"
                fontSize="10.5"
                fontWeight="800"
              >
                {a.val}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── CẦU NỐI ĐỐI CHIẾU CUNG VỊ SONG TINH (SYNASTRY BRIDGE) ────
function SynastryPalaceBridge({
  pal,
  nameA,
  nameB,
  isDark,
}: {
  pal: PalaceComparison;
  nameA: string;
  nameB: string;
  isDark: boolean;
}) {
  const statusColor = pal.status === 'synergy' ? '#10b981' : pal.status === 'complement' ? '#0ea5e9' : '#f59e0b';
  const statusBg = pal.status === 'synergy'
    ? (isDark ? 'rgba(16,185,129,0.12)' : 'rgba(209,250,229,0.7)')
    : pal.status === 'complement'
    ? (isDark ? 'rgba(14,165,233,0.12)' : 'rgba(224,242,254,0.7)')
    : (isDark ? 'rgba(245,158,11,0.12)' : 'rgba(254,243,199,0.7)');

  return (
    <div style={{
      borderRadius: '16px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      background: isDark ? 'rgba(20,24,36,0.6)' : 'rgba(255,255,255,0.85)',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'all 0.2s',
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.05)',
    }}>
      {/* Header cung vị & Điểm hòa hợp */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--tx-0)' }}>
            {pal.nameVi} <span style={{ fontSize: '12px', color: 'var(--tx-2)', fontWeight: 500 }}>({pal.nameCn})</span>
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
            background: statusBg, color: statusColor, border: `1px solid ${statusColor}40`,
          }}>
            ✦ {pal.statusText}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--tx-2)' }}>Độ tương hợp:</span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: statusColor }}>{pal.score}%</span>
        </div>
      </div>

      {/* Cầu Nối Năng Lượng Hai Bên */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px',
        padding: '12px 14px', borderRadius: '12px',
        background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.02)',
      }}>
        {/* Bên A */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.05em' }}>
            {nameA} ({pal.branchA || 'Cung vị'})
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '2px' }}>
            {pal.starsA.slice(0, 3).join(' · ')}
          </div>
        </div>

        {/* Trục Giao Thoa */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '0 8px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(212,168,67,0.3), rgba(212,168,67,0.05))',
            border: '1px solid var(--ac)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: 'var(--ac)',
          }}>
            ⇄
          </div>
          <div style={{ fontSize: '9.5px', color: 'var(--tx-2)', marginTop: '2px', whiteSpace: 'nowrap' }}>
            {pal.synergyTitle}
          </div>
        </div>

        {/* Bên B */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, letterSpacing: '0.05em' }}>
            {nameB} ({pal.branchB || 'Cung vị'})
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '2px' }}>
            {pal.starsB.slice(0, 3).join(' · ')}
          </div>
        </div>
      </div>

      {/* Lời Bình Luận Cung Vị Nghê Hải Hà */}
      <div style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--tx-1)', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)', padding: '10px 14px', borderRadius: '10px' }}>
        {pal.insight}
      </div>
    </div>
  );
}

// ─── HIỆU ỨNG GIAO HÒA THIÊN HÀ 3D (CELESTIAL FUSION) ──────
function CelestialFusionModal({
  nameA, nameB, starA, starB, yearA, yearB,
}: {
  nameA: string; nameB: string; starA: string; starB: string; yearA: string; yearB: string;
}) {
  const [stepText, setStepText] = useState('Khởi động Thiên Cung Tinh Bàn Bên A & Bên B…');

  useEffect(() => {
    const t1 = setTimeout(() => setStepText('Chiếu rọi Cung Mệnh & Cung Phu Thê hai bên…'), 600);
    const t2 = setTimeout(() => setStepText('Tương giao Tứ Hóa Phi Nhập & Phúc Đức nghiệp duyên…'), 1300);
    const t3 = setTimeout(() => setStepText('Giao hòa Âm Dương hoàn tất — Chuyển sang Tinh Đồ Hợp Bàn Chuyên Sâu!'), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'radial-gradient(ellipse at center, rgba(12,24,56,0.96) 0%, rgba(4,8,18,0.98) 100%)',
        backdropFilter: 'blur(16px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px', overflow: 'hidden',
      }}
    >
      {/* Sóng chấn động ánh sáng */}
      <motion.div
        animate={{ scale: [0.8, 2.2], opacity: [0.8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
        style={{
          position: 'absolute', width: '320px', height: '320px', borderRadius: '50%',
          border: '2px solid rgba(212,168,67,0.6)',
          boxShadow: '0 0 60px rgba(212,168,67,0.4)',
          pointerEvents: 'none',
        }}
      />

      {/* Hai Quả Cầu Tinh Vân Lao Vào Nhau */}
      <div style={{ position: 'relative', width: '360px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Tinh Cầu Bên A */}
        <motion.div
          animate={{ x: [-120, -20, -10], scale: [0.85, 1.1, 1] }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: '110px', height: '110px', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #93c5fd, #1d4ed8, #030712)',
            boxShadow: '0 0 35px rgba(59,130,246,0.8), inset 0 0 20px rgba(255,255,255,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#fff', textAlign: 'center', padding: '8px', zIndex: 2,
          }}
        >
          <div style={{ fontSize: '10px', letterSpacing: '0.1em', opacity: 0.8 }}>MỆNH A</div>
          <div style={{ fontSize: '13px', fontWeight: 800 }}>{starA}</div>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>{yearA}</div>
        </motion.div>

        {/* Lõi Hợp Nhất */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.9] }}
          transition={{ delay: 1.1, duration: 0.8 }}
          style={{
            position: 'absolute', width: '70px', height: '70px', borderRadius: '50%',
            background: 'radial-gradient(circle, #fff 0%, #fef08a 40%, #eab308 100%)',
            boxShadow: '0 0 50px #eab308, 0 0 100px rgba(234,179,8,0.6)',
            zIndex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#713f12', fontSize: '20px', fontWeight: 900,
          }}
        >
          ☯
        </motion.div>

        {/* Tinh Cầu Bên B */}
        <motion.div
          animate={{ x: [120, 20, 10], scale: [0.85, 1.1, 1] }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: '110px', height: '110px', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #fde047, #b45309, #030712)',
            boxShadow: '0 0 35px rgba(234,179,8,0.8), inset 0 0 20px rgba(255,255,255,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#fff', textAlign: 'center', padding: '8px', zIndex: 2,
          }}
        >
          <div style={{ fontSize: '10px', letterSpacing: '0.1em', opacity: 0.8 }}>MỆNH B</div>
          <div style={{ fontSize: '13px', fontWeight: 800 }}>{starB}</div>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>{yearB}</div>
        </motion.div>
      </div>

      {/* Thông điệp diễn tiến */}
      <motion.div
        key={stepText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginTop: '32px', color: '#fef08a', fontSize: '15px', fontWeight: 600,
          letterSpacing: '0.08em', textShadow: '0 0 12px rgba(212,168,67,0.5)',
        }}
      >
        ✦ {stepText}
      </motion.div>
      <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(212,180,100,0.6)', letterSpacing: '0.25em' }}>
        ZHANXING MINGSHU · 占星明舒
      </div>
    </motion.div>
  );
}

export default function HemingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // ─── Chế độ hiển thị: 'form' (Điền thông tin) | 'result' (Trang kết quả riêng biệt) ───
  const [viewMode, setViewMode] = useState<'form' | 'result'>('form');

  // ─── 双方命盘状态 ─────────────────────────────────────────
  const [chartA, setChartA] = useState<ZiweiChart | null>(null);
  const [chartB, setChartB] = useState<ZiweiChart | null>(null);
  const [formA, setFormA] = useState<BirthFormState | null>(null);
  const [formB, setFormB] = useState<BirthFormState | null>(null);

  // ─── Trạng thái phân tích & Hiệu ứng Fusion ───────────────
  const [isFusing, setIsFusing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [compatScore, setCompatScore] = useState<number | null>(null);
  const [compatResult, setCompatResult] = useState<CompatibilityResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [question, setQuestion] = useState('');
  const [analysisError, setAnalysisError] = useState(false);
  const [apiMissing, setApiMissing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [palaceFilter, setPalaceFilter] = useState<'key' | 'all' | 'career' | 'family'>('key');
  const [copied, setCopied] = useState(false);
  const analysisRef = useRef<HTMLDivElement>(null);

  const generateChart = useCallback(async (info: BirthInfo): Promise<ZiweiChart | null> => {
    try {
      return buildChart(info);
    } catch {
      return null;
    }
  }, []);

  // 表单是否填齐
  const isFormReady = (f: BirthFormState | null): boolean =>
    !!(f && f.year && f.month && f.day && f.gender && (f.unknownTime || (f.clockHour !== '' && f.clockMinute !== '')));

  // ─── 统一入口：起盘 + 合盘分析 ─────────────────────────────
  const runAnalysis = useCallback(async (q?: string) => {
    setFormError(null);
    if (!isFormReady(formA) || !isFormReady(formB)) {
      setFormError('Vui lòng điền đầy đủ ngày giờ sinh của cả hai người');
      return;
    }
    if (typeof setActiveQuestion === 'function') {
      setActiveQuestion(q || null);
    }
    setAnalyzing(true);
    setAnalysis('');
    setAnalysisError(false);

    try {
      // 每次按当前表单起盘，避免编辑出生信息后复用旧盘。
      const [cA, cB] = await Promise.all([
        generateChart(formToBirthInfo(formA!)),
        generateChart(formToBirthInfo(formB!)),
      ]);
      if (!cA || !cB) {
        setAnalysisError(true);
        setAnalyzing(false);
        return;
      }
      setChartA(cA);
      setChartB(cB);

      // Tính trước chỉ số tương hợp cục bộ
      if (typeof setCompatResult === 'function') {
        const localCompat = calculateCompatibility(cA, cB);
        setCompatResult(localCompat);
        if (typeof setCompatScore === 'function') {
          setCompatScore(localCompat.totalScore);
        }
      }

      // Kích hoạt giao diện trang kết quả riêng biệt
      if (typeof setViewMode === 'function') {
        setViewMode('result');
      }

      const res = await fetch('/api/heming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartA: cA, chartB: cB, question: q ?? undefined }),
      });
      if (res.status === 404) { setApiMissing(true); throw new Error('api-missing'); }
      if (!res.ok || !res.body) throw new Error();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      let pendingLine = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        pendingLine += decoder.decode(value, { stream: true });
        const lines = pendingLine.split('\n');
        pendingLine = lines.pop() ?? '';
        for (const rawLine of lines) {
          const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine;
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (typeof setCompatScore === 'function' && parsed.meta?.score) {
              setCompatScore(parsed.meta.score);
            }
            if (typeof setCompatResult === 'function' && parsed.meta?.compatResult) {
              setCompatResult(parsed.meta.compatResult);
            }
            if (parsed.delta?.text) {
              text += parsed.delta.text;
              setAnalysis(text);
            }
          } catch { /* skip */ }
        }
      }
      // scroll to analysis
      setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    } catch {
      setAnalysisError(true);
    } finally {
      setAnalyzing(false);
    }
  }, [formA, formB, generateChart]);

  const cardStyle = {
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.92)',
    border: `1px solid ${isDark ? 'rgba(212,168,67,0.2)' : 'rgba(200,160,60,0.25)'}`,
    borderRadius: '24px',
    padding: '24px',
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 20px rgba(140,100,20,0.1)',
  };

  const labelStyle = {
    fontSize: '11px', letterSpacing: '0.3em', color: 'var(--ac)', fontWeight: 600,
    marginBottom: '16px', display: 'block', textTransform: 'uppercase' as const,
  };

  const starNameA = chartA ? (chartA.palaces.find(p => p.branch === chartA.mingGongBranch)?.stars.find(s => s.type === 'major')?.name || 'Vô Chính Diệu') : 'Chính Tinh A';
  const starNameB = chartB ? (chartB.palaces.find(p => p.branch === chartB.mingGongBranch)?.stars.find(s => s.type === 'major')?.name || 'Vô Chính Diệu') : 'Chính Tinh B';

  // Tính toán 12 Cung So Sánh khi có 2 lá số
  const palaceComparisons = useMemo(() => {
    if (!chartA || !chartB) return [];
    return compare12Palaces(chartA, chartB);
  }, [chartA, chartB]);

  // Lọc 12 Cung theo Tab
  const filteredPalaces = useMemo(() => {
    if (palaceFilter === 'all') return palaceComparisons;
    if (palaceFilter === 'key') {
      return palaceComparisons.filter(p => ['ming', 'fuqi', 'fude', 'cai'].includes(p.id));
    }
    if (palaceFilter === 'career') {
      return palaceComparisons.filter(p => ['quan', 'cai', 'dian', 'nu'].includes(p.id));
    }
    return palaceComparisons.filter(p => ['zi', 'fumu', 'xiong', 'jie'].includes(p.id));
  }, [palaceComparisons, palaceFilter]);

  // Xử lý sao chép tóm tắt
  const handleCopySummary = () => {
    if (!chartA || !chartB || !compatScore) return;
    const text = `ZHANXING MINGSHU — Kết Quả Hợp Bàn Song Tinh:\n${chartA.birthInfo?.name || 'Bên A'} & ${chartB.birthInfo?.name || 'Bên B'}\nChỉ số hòa hợp: ${compatScore}%\nCấp bậc: ${compatResult?.level || 'Thiên Tác Chi Hợp'}\nXem chi tiết tại: https://zhanxingmingshu.vercel.app/heming`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)', position: 'relative' }}>
      {/* Hiệu Ứng Giao Hòa Toàn Màn Hình Khi Bấm Hợp Bàn */}
      <AnimatePresence>
        {isFusing && (
          <CelestialFusionModal
            nameA={formA?.name || 'Mệnh Chủ A'}
            nameB={formB?.name || 'Mệnh Chủ B'}
            starA={getStarVi(starNameA)}
            starB={getStarVi(starNameB)}
            yearA={formA?.year || '1995'}
            yearB={formB?.year || '1998'}
          />
        )}
      </AnimatePresence>

      {/* ── THANH ĐIỀU HƯỚNG TRÊN CÙNG ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: isDark ? 'rgba(4,7,14,0.92)' : 'rgba(250,245,235,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bdr)',
        display: 'flex', alignItems: 'center', padding: '0 24px', height: '58px', gap: '16px',
      }}>
        {viewMode === 'result' ? (
          <button
            onClick={() => setViewMode('form')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
              color: 'var(--ac)', background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.3)',
              padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <span>‹</span>
            <span>Chỉnh sửa thông tin / Hợp bàn khác</span>
          </button>
        ) : (
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px',
              color: 'var(--tx-2)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500,
            }}
          >
            <span style={{ fontSize: '16px' }}>‹</span>
            <span>Trang chủ</span>
          </button>
        )}

        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '13.5px', color: 'var(--ac)', letterSpacing: '0.12em', fontWeight: 800 }}>
          ZHANXING MINGSHU · SONG TINH BÀN
        </span>

        <div style={{ flex: 1 }} />

        {viewMode === 'result' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleCopySummary}
              style={{
                fontSize: '12px', padding: '5px 12px', borderRadius: '8px',
                border: '1px solid var(--bdr-med)', background: 'var(--bg-1)',
                color: 'var(--tx-1)', cursor: 'pointer',
              }}
            >
              {copied ? '✓ Đã sao chép' : '📋 Chia sẻ'}
            </button>
            <button
              onClick={() => runAnalysis()}
              disabled={analyzing}
              style={{
                fontSize: '12px', padding: '5px 14px', borderRadius: '8px',
                border: 'none', background: 'linear-gradient(135deg, #b8892a, #f0d070)',
                color: '#08080a', fontWeight: 700, cursor: analyzing ? 'not-allowed' : 'pointer',
              }}
            >
              {analyzing ? 'Đang phân tích…' : '↺ Luận giải lại'}
            </button>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════
          CHẾ ĐỘ 1: FORM NHẬP THÔNG TIN (KHI VIEWMODE === 'FORM')
      ══════════════════════════════════════════════════════════ */}
      {viewMode === 'form' && (
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '36px 20px 80px' }}>
          {/* Banner quay lại kết quả nếu đã có */}
          {chartA && chartB && analysis && (
            <div style={{
              marginBottom: '24px', padding: '14px 20px', borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(212,168,67,0.18) 0%, rgba(212,168,67,0.06) 100%)',
              border: '1px solid rgba(212,168,67,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px', color: 'var(--ac)' }}>✦</span>
                <span style={{ fontSize: '13.5px', color: 'var(--tx-0)', fontWeight: 600 }}>
                  Đã có kết quả hợp bàn giữa <strong>{chartA.birthInfo?.name || 'Bên A'}</strong> và <strong>{chartB.birthInfo?.name || 'Bên B'}</strong> ({compatScore}%)
                </span>
              </div>
              <button
                onClick={() => setViewMode('result')}
                style={{
                  padding: '7px 18px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #b8892a, #f0d070)',
                  color: '#08080a', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer',
                }}
              >
                Xem Trang Kết Quả ➔
              </button>
            </div>
          )}

          {/* Tiêu đề & Giới thiệu */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '32px', color: 'var(--ac)', opacity: 0.8, marginBottom: '8px' }}>☯</div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--tx-0)', marginBottom: '8px' }}>
              HỢP BÀN TỬ VI · ZHANXING MINGSHU
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--tx-2)', lineHeight: 1.7, maxWidth: '780px', margin: '0 auto' }}>
              Nhập ngày giờ sinh chuẩn xác của hai người. Hệ thống sẽ tính toán toàn diện ngũ hành nạp âm, địa chi tam hợp, thiên can hóa hợp, đối chiếu 12 cung vị và lập Tinh Đồ Hợp Bàn độc bản.
            </p>
          </div>

          {/* Khối Nhập Liệu Hai Bên A & B */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}
            className="heming-grid">
            {/* Bên A */}
            <div style={cardStyle}>
              <span style={labelStyle}>Mệnh Chủ A (Bên Thứ Nhất)</span>
              <BirthForm
                hideSubmit
                onSubmit={() => {}}
                onFormSave={setFormA}
              />
            </div>

            {/* Bên B */}
            <div style={cardStyle}>
              <span style={labelStyle}>Mệnh Chủ B (Bên Thứ Hai)</span>
              <BirthForm
                hideSubmit
                onSubmit={() => {}}
                onFormSave={setFormB}
              />
            </div>
          </div>

          {/* Nút Bắt Đầu Hợp Bàn */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (isFormReady(formA) && isFormReady(formB)) {
                  setIsFusing(true);
                  setTimeout(() => setIsFusing(false), 2400);
                }
                runAnalysis();
              }}
              disabled={analyzing}
              style={{
                padding: '16px 52px', borderRadius: '9999px', border: 'none',
                background: 'linear-gradient(135deg, #b8892a 0%, #f0d070 50%, #b8892a 100%)',
                color: '#08080a', fontSize: '15px', fontWeight: 800,
                letterSpacing: '0.15em', cursor: analyzing ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 30px rgba(212,168,67,0.35)',
              }}
            >
              {analyzing ? '✦ ĐANG KHỞI TẠO TINH BÀN…' : '✦ BẮT ĐẦU PHÂN TÍCH HỢP BÀN ✦'}
            </motion.button>
            {formError && (
              <div style={{ marginTop: '16px', fontSize: '13px', color: '#ef4444', fontWeight: 500 }}>
                ✕ {formError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          CHẾ ĐỘ 2: TRANG KẾT QUẢ RIÊNG BIỆT (KHI VIEWMODE === 'RESULT')
      ══════════════════════════════════════════════════════════ */}
      {viewMode === 'result' && (
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 20px 80px' }}>

          {/* ── 1. HERO SYNTHESIS HEADER (SONG TINH GIAO THOA 3D) ── */}
          <div style={{
            ...cardStyle,
            marginBottom: '28px',
            background: isDark
              ? 'radial-gradient(ellipse at 50% 0%, rgba(30,58,138,0.2) 0%, rgba(10,14,26,0.95) 75%)'
              : 'radial-gradient(ellipse at 50% 0%, rgba(254,243,199,0.7) 0%, rgba(255,255,255,0.98) 75%)',
            border: `1px solid ${compatResult?.levelColor || 'var(--ac)'}50`,
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto minmax(200px, 1fr)',
              alignItems: 'center', gap: '24px',
            }} className="heming-hero-grid">

              {/* Card Bên A */}
              <div style={{
                padding: '20px', borderRadius: '18px',
                background: isDark ? 'rgba(30,58,138,0.2)' : 'rgba(219,234,254,0.6)',
                border: '1px solid rgba(96,165,250,0.4)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  MỆNH BÀN A
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--tx-0)', margin: '6px 0 2px' }}>
                  {chartA?.birthInfo?.name || 'Bên A'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>
                  {getStarVi(starNameA)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--tx-2)', marginTop: '4px' }}>
                  {chartA?.birthInfo?.gender === 'male' ? 'Nam' : 'Nữ'} · Năm {chartA?.birthInfo?.year} · {chartA?.wuxingJuName}
                </div>
              </div>

              {/* Vòng Tròn Điểm Hòa Hợp Trung Tâm */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(212,168,67,0.3) 0%, rgba(212,168,67,0.05) 100%)',
                  border: `3px solid ${compatResult?.levelColor || 'var(--ac)'}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 25px ${compatResult?.levelColor || 'var(--ac)'}40`,
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: compatResult?.levelColor || 'var(--ac)', lineHeight: 1 }}>
                    {compatScore || 85}%
                  </div>
                  <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--tx-2)', marginTop: '2px', letterSpacing: '0.05em' }}>
                    Tương Hợp
                  </div>
                </div>

                <div style={{
                  marginTop: '10px', fontSize: '13px', fontWeight: 800,
                  color: compatResult?.levelColor || 'var(--ac)', letterSpacing: '0.05em', textAlign: 'center',
                }}>
                  {compatResult?.level || 'Thiên Tác Chi Hợp'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--tx-2)', marginTop: '2px', textAlign: 'center', maxWidth: '220px' }}>
                  {compatResult?.levelDesc || 'Âm Dương Cân Bằng · Duyên Nghiệp Tương Trợ'}
                </div>
              </div>

              {/* Card Bên B */}
              <div style={{
                padding: '20px', borderRadius: '18px',
                background: isDark ? 'rgba(180,120,20,0.2)' : 'rgba(254,243,199,0.6)',
                border: '1px solid rgba(245,158,11,0.4)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  MỆNH BÀN B
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--tx-0)', margin: '6px 0 2px' }}>
                  {chartB?.birthInfo?.name || 'Bên B'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fbbf24' }}>
                  {getStarVi(starNameB)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--tx-2)', marginTop: '4px' }}>
                  {chartB?.birthInfo?.gender === 'male' ? 'Nam' : 'Nữ'} · Năm {chartB?.birthInfo?.year} · {chartB?.wuxingJuName}
                </div>
              </div>

            </div>
          </div>

          {/* ── 2. BIỂU ĐỒ RADAR TINH ĐỒ 6 CHIỀU & 6 YẾU TỐ CHIÊM TINH ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr',
            gap: '24px', marginBottom: '28px',
          }} className="heming-radar-grid">
            {/* Cột Radar */}
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ac)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                ✦ RADAR HÒA HỢP 6 TRỤC
              </div>
              {compatResult?.radarScores && (
                <CelestialRadarChart scores={compatResult.radarScores} isDark={isDark} />
              )}
            </div>

            {/* Cột 6 Yếu Tố Chi Tiết */}
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ac)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
                ✦ 6 YẾU TỐ ĐÁNH GIÁ CHIÊM TINH HỌC
              </div>

              {compatResult?.factors && Object.entries(compatResult.factors).map(([key, f]) => {
                const badgeColor = f.status === 'good' ? '#10b981' : f.status === 'neutral' ? '#0ea5e9' : '#f59e0b';
                const badgeBg = f.status === 'good' ? 'rgba(16,185,129,0.1)' : f.status === 'neutral' ? 'rgba(14,165,233,0.1)' : 'rgba(245,158,11,0.1)';
                return (
                  <div key={key} style={{
                    padding: '10px 14px', borderRadius: '12px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                    background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.015)',
                    display: 'flex', flexDirection: 'column', gap: '3px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--tx-0)' }}>
                        {f.title}
                      </span>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                        background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}30`,
                      }}>
                        {f.score > 0 ? `+${f.score}đ` : `${f.score}đ`}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--tx-2)' }}>
                      {f.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 3. BẢN ĐỒ ĐỐI CHIẾU 12 CUNG VỊ SONG TINH ĐỘC BẢN ── */}
          <div style={{ ...cardStyle, marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ac)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  ✦ BẢN ĐỒ TƯƠNG TÁC 12 CUNG VỊ SONG TINH
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--tx-2)', marginTop: '2px' }}>
                  Khảo sát sự tương tác năng lượng giữa từng cung đối ứng của hai lá số
                </div>
              </div>

              {/* Bộ lọc tabs */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'key', label: 'Tam Giác Cốt Lõi' },
                  { key: 'career', label: 'Tài Lộc & Sự Nghiệp' },
                  { key: 'family', label: 'Gia Đạo & Tình Thân' },
                  { key: 'all', label: 'Xem Cả 12 Cung' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setPalaceFilter(t.key as any)}
                    style={{
                      fontSize: '11.5px', padding: '5px 12px', borderRadius: '8px',
                      border: palaceFilter === t.key ? '1px solid var(--ac)' : '1px solid var(--bdr-med)',
                      background: palaceFilter === t.key ? 'rgba(212,168,67,0.15)' : 'var(--bg-1)',
                      color: palaceFilter === t.key ? 'var(--ac)' : 'var(--tx-2)',
                      fontWeight: palaceFilter === t.key ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Danh sách các Cầu Nối Cung Vị */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredPalaces.map(pal => (
                <SynastryPalaceBridge
                  key={pal.id}
                  pal={pal}
                  nameA={chartA?.birthInfo?.name || 'Bên A'}
                  nameB={chartB?.birthInfo?.name || 'Bên B'}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* ── 4. BẢNG DÒNG CHẢY TỨ HÓA PHI NHẬP ── */}
          {chartA && chartB && (
            <div style={{ ...cardStyle, marginBottom: '28px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ac)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px' }}>
                ✦ DÒNG CHẢY TỨ HÓA PHI TINH (PHI LỘC & PHI KỴ)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="heming-grid">
                {/* A sang B */}
                <div style={{
                  padding: '16px', borderRadius: '14px',
                  background: isDark ? 'rgba(30,58,138,0.1)' : 'rgba(239,246,255,0.7)',
                  border: '1px solid rgba(96,165,250,0.3)',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#60a5fa', marginBottom: '8px' }}>
                    {chartA.birthInfo?.name || 'Bên A'} Phóng Tứ Hóa Sang {chartB.birthInfo?.name || 'Bên B'}
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: 1.7, color: 'var(--tx-1)' }}>
                    • <strong>Phi Hóa Lộc:</strong> Mang phúc khí và may mắn tài lộc chiếu vào tinh bàn của đối phương.<br />
                    • <strong>Phi Hóa Kỵ:</strong> Cung vị nhạy cảm đòi hỏi {chartA.birthInfo?.name || 'Bên A'} cần bao dung và kiên nhẫn.
                  </div>
                </div>

                {/* B sang A */}
                <div style={{
                  padding: '16px', borderRadius: '14px',
                  background: isDark ? 'rgba(180,120,20,0.1)' : 'rgba(254,243,199,0.7)',
                  border: '1px solid rgba(245,158,11,0.3)',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', marginBottom: '8px' }}>
                    {chartB.birthInfo?.name || 'Bên B'} Phóng Tứ Hóa Sang {chartA.birthInfo?.name || 'Bên A'}
                  </div>
                  <div style={{ fontSize: '12.5px', lineHeight: 1.7, color: 'var(--tx-1)' }}>
                    • <strong>Phi Hóa Lộc:</strong> Vượng phát gia đạo, làm hậu phương vững vàng cho đối phương.<br />
                    • <strong>Phi Hóa Kỵ:</strong> Điểm cần lắng nghe, tránh đôi co lời nói khi xảy ra bất đồng.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 5. NỘI DUNG LUẬN GIẢI CHI TIẾT AI ── */}
          <div ref={analysisRef} style={{ ...cardStyle, marginBottom: '28px' }}>
            {/* Banner hiển thị câu hỏi đang được phân tích */}
            {activeQuestion && (
              <div style={{
                marginBottom: '20px',
                padding: '14px 18px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 100%)',
                border: '1px solid rgba(212,168,67,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px', color: 'var(--ac)' }}>✦</span>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ac)', fontWeight: 700 }}>
                      Đang Phân Tích Chuyên Sâu Theo Câu Hỏi:
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '2px' }}>
                      &quot;{activeQuestion}&quot;
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (typeof setActiveQuestion === 'function') setActiveQuestion(null);
                    setQuestion('');
                    runAnalysis();
                  }}
                  disabled={analyzing}
                  style={{
                    fontSize: '11.5px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--bdr-med)',
                    background: 'var(--bg-1)',
                    color: 'var(--tx-1)',
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  title="Quay lại phân tích tổng quan toàn diện"
                >
                  ↺ Xem Luận Giải Tổng Thể
                </button>
              </div>
            )}

            {/* Luận giải chi tiết */}
            <AiContent text={analysis} streaming={analyzing} />

            {analysisError && (
              <div style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.08)', fontSize: '13px', color: '#ef4444', marginTop: '16px' }}>
                {apiMissing
                  ? 'Không thể kết nối máy chủ phân tích Hợp Bàn (/api/heming). Vui lòng thử lại sau.'
                  : 'Hệ thống đang bận, vui lòng thử lại sau giây lát.'}
              </div>
            )}
          </div>

          {/* ── 6. ĐẶT CÂU HỎI TIẾP NỐI TOÀN NĂNG (UNIVERSAL Q&A) ── */}
          <div style={{ ...cardStyle }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.15em', color: 'var(--ac)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              ✦ ĐẶT CÂU HỎI LÀM RÕ THÊM VỀ MỐI QUAN HỆ NÀY:
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--tx-2)', marginBottom: '14px' }}>
              Bạn có thể bấm vào các câu hỏi gợi ý nhanh hoặc tự nhập bất kỳ câu hỏi nào bạn băn khoăn (ví dụ: mẹ chồng nàng dâu, ai nên giữ tiền, sinh con năm nào...):
            </div>

            {/* Câu hỏi gợi ý nhanh */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                'Hai người kết hôn có hạnh phúc bền lâu không?',
                'Có thể hợp tác làm ăn kinh doanh chung không?',
                'Điểm nào dễ phát sinh xung đột quan điểm nhất?',
                'Cần lưu ý gì về phong thủy phòng ngủ sau khi cưới?',
                'Tài lộc đôi bên có tương trợ giúp nhau giàu có không?',
                'Mẹ chồng nàng dâu / gia đình hai bên có hòa thuận không?',
                'Ai là người nên giữ tay hòm chìa khóa trong nhà?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => {
                    setQuestion(q);
                    runAnalysis(q);
                    setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                  }}
                  disabled={analyzing}
                  style={{
                    fontSize: '12px', padding: '7px 16px',
                    borderRadius: '9999px',
                    border: '1px solid var(--bdr-med)',
                    background: 'var(--bg-1)', color: 'var(--tx-1)',
                    cursor: analyzing ? 'not-allowed' : 'pointer',
                    opacity: analyzing ? 0.5 : 1,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (!analyzing) (e.currentTarget as HTMLElement).style.borderColor = 'var(--ac)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bdr-med)'; }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input câu hỏi riêng */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !analyzing && question.trim()) {
                    runAnalysis(question.trim());
                    setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                  }
                }}
                placeholder="Nhập bất kỳ câu hỏi nào bạn muốn hỏi (ví dụ: giai đoạn nào cần chú ý nhẫn nhịn nhất?)..."
                disabled={analyzing}
                className="input-base"
                style={{
                  fontSize: '13px', flex: 1, padding: '12px 18px', borderRadius: '14px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: '1px solid var(--bdr-med)', color: 'var(--tx-0)',
                }}
              />
              <button
                onClick={() => {
                  if (question.trim()) {
                    runAnalysis(question.trim());
                    setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                  }
                }}
                disabled={analyzing || !question.trim()}
                style={{
                  padding: '12px 24px', borderRadius: '14px', border: 'none',
                  background: (analyzing || !question.trim()) ? 'var(--bg-2)' : 'linear-gradient(135deg, #b8892a, #f0d070)',
                  color: (analyzing || !question.trim()) ? 'var(--tx-3)' : '#08080a',
                  fontSize: '13px', fontWeight: 700,
                  cursor: (analyzing || !question.trim()) ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Gửi câu hỏi
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--bdr)', padding: '24px 20px',
        textAlign: 'center', fontSize: '12px', color: 'var(--tx-3)',
      }}>
        <div>ZHANXING MINGSHU · 占星明舒 — Cỗ máy Tử Vi Đẩu Số & Hợp Bàn Chiêm Tinh Học</div>
        <div style={{ marginTop: '4px', opacity: 0.7 }}>
          Hệ thống luận giải độc lập chuẩn Nghê Hải Hà 《Thiên Kỷ》
        </div>
      </footer>
    </div>
  );
}
