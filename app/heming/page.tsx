'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import { formToBirthInfo } from '@/lib/ziwei/share';
import { generateChart as buildChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';
import { useTheme } from '@/components/ThemeProvider';
import { getStarVi, getPalaceVi } from '@/lib/ziwei/vietnamese';

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
    const t3 = setTimeout(() => setStepText('Giao hòa Âm Dương hoàn tất — Khởi tạo Tinh Đồ Hợp Bàn 3D!'), 2000);
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
      {/* Sóng chấn động ánh sáng (Shockwave pulses) */}
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
      <motion.div
        animate={{ scale: [0.6, 2.6], opacity: [0.6, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, delay: 0.6, ease: 'easeOut' }}
        style={{
          position: 'absolute', width: '360px', height: '360px', borderRadius: '50%',
          border: '2px solid rgba(96,165,250,0.5)',
          boxShadow: '0 0 80px rgba(96,165,250,0.3)',
          pointerEvents: 'none',
        }}
      />

      {/* Sân khấu 3D giao hòa */}
      <div style={{ position: 'relative', width: '360px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Tinh Cầu Bên A (Lam Ngọc - Dương Khí) */}
        <motion.div
          animate={{
            x: [-120, 0],
            rotate: [0, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(147,197,253,0.9), rgba(30,58,138,0.85))',
            boxShadow: '0 0 35px rgba(96,165,250,0.8), inset 0 0 15px rgba(255,255,255,0.6)',
            border: '2px solid rgba(191,219,254,0.7)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#fff', textAlign: 'center', padding: '8px', zIndex: 10,
          }}
        >
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', opacity: 0.85 }}>{yearA}</span>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>{nameA}</span>
          <span style={{ fontSize: '10px', color: '#bfdbfe', marginTop: '2px' }}>{starA}</span>
        </motion.div>

        {/* Tinh Cầu Bên B (Hoàng Kim - Âm Khí) */}
        <motion.div
          animate={{
            x: [120, 0],
            rotate: [0, -360],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(253,230,138,0.95), rgba(180,120,20,0.85))',
            boxShadow: '0 0 35px rgba(245,158,11,0.8), inset 0 0 15px rgba(255,255,255,0.6)',
            border: '2px solid rgba(254,240,138,0.8)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#08080a', textAlign: 'center', padding: '8px', zIndex: 11,
          }}
        >
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', opacity: 0.85 }}>{yearB}</span>
          <span style={{ fontSize: '13px', fontWeight: 800 }}>{nameB}</span>
          <span style={{ fontSize: '10px', color: '#78350f', marginTop: '2px', fontWeight: 700 }}>{starB}</span>
        </motion.div>

        {/* Trung tâm Thái Cực Âm Dương (manifests when they merge) */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0, 1], scale: [0, 0.5, 1.3] }}
          transition={{ duration: 2.4, times: [0, 0.6, 1], ease: 'easeOut' }}
          style={{
            position: 'absolute',
            fontSize: '48px',
            color: '#fef08a',
            textShadow: '0 0 30px #f59e0b',
            zIndex: 20,
          }}
        >
          ☯
        </motion.div>
      </div>

      {/* Dòng chữ trạng thái tiến trình */}
      <motion.div
        key={stepText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        style={{
          marginTop: '36px',
          textAlign: 'center',
          color: '#f5d77f',
          fontSize: '15px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textShadow: '0 0 12px rgba(212,168,67,0.5)',
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

  // ─── 双方命盘状态 ─────────────────────────────────────────
  const [chartA, setChartA] = useState<ZiweiChart | null>(null);
  const [chartB, setChartB] = useState<ZiweiChart | null>(null);
  const [formA, setFormA] = useState<BirthFormState | null>(null);
  const [formB, setFormB] = useState<BirthFormState | null>(null);

  // ─── Trạng thái phân tích & Hiệu ứng Fusion ───────────────
  const [isFusing, setIsFusing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [compatScore, setCompatScore] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [question, setQuestion] = useState('');
  const [analysisError, setAnalysisError] = useState(false);
  const [apiMissing, setApiMissing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
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
            if (parsed.delta?.text) {
              text += parsed.delta.text;
              setAnalysis(text);
            }
          } catch { /* skip */ }
        }
      }
      // scroll to analysis
      setTimeout(() => analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
        background: isDark ? 'rgba(4,7,14,0.9)' : 'rgba(250,245,235,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bdr)',
        display: 'flex', alignItems: 'center', padding: '0 24px', height: '56px', gap: '16px',
      }}>
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
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '13px', color: 'var(--ac)', letterSpacing: '0.15em', fontWeight: 700 }}>
          ZHANXING MINGSHU · HỢP BÀN TỬ VI
        </span>
        <div style={{ flex: 1 }} />
        <span className="hidden sm:inline" style={{ fontSize: '11px', color: 'var(--tx-3)' }}>
          Hệ Thống Nghê Hải Hà 《Thiên Kỷ》 · 占星明舒
        </span>
      </header>

      {/* ── THÂN TRANG ── */}
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '36px 20px 80px' }}>

        {/* Tiêu đề & Giới thiệu */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '32px', color: 'var(--ac)', opacity: 0.8, marginBottom: '8px' }}>☯</div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--tx-0)', marginBottom: '8px' }}>
            HỢP BÀN TỬ VI · ZHANXING MINGSHU
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--tx-2)', lineHeight: 1.7, maxWidth: '780px', margin: '0 auto' }}>
            Nhập thông tin sinh thần của hai người để phân tích tương hợp bản mệnh, khảo sát Cung Mệnh & Cung Phu Thê tương chiếu, Tứ Hóa Phi Nhập và lời khuyên Dương Trạch đổi vận theo Thầy Nghê Hải Hà.
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

        {/* ═══ KHU VỰC PHÂN TÍCH CHUYÊN SÂU 3D ══════════════════ */}
        <div ref={analysisRef} style={{
          ...cardStyle,
          minHeight: '360px',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: (!analysis && !analyzing) ? 'center' : 'flex-start',
        }}>
          {/* Tiêu đề Box */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (analysis || analyzing) ? '24px' : '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--ac)', fontSize: '15px' }}>✦</span>
              <span style={{ fontSize: '12px', letterSpacing: '0.3em', color: 'var(--tx-2)', fontWeight: 700 }}>
                KẾT QUẢ HỢP BÀN TỬ VI CHUYÊN SÂU
              </span>
            </div>
            {compatScore && (
              <span style={{
                fontSize: '12px', padding: '4px 14px', borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(212,168,67,0.25), rgba(212,168,67,0.1))',
                border: '1px solid var(--ac)', color: 'var(--ac)', fontWeight: 700,
              }}>
                Chỉ số hòa hợp: {compatScore}/100
              </span>
            )}
          </div>

          {/* 1. Trạng thái chờ khởi tạo */}
          {!analysis && !analyzing && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '14px', color: 'var(--tx-2)', marginBottom: '28px', lineHeight: 1.8 }}>
                Điền thông tin ngày giờ sinh của cả hai người rồi nhấn nút bên dưới.<br />
                Hệ thống <strong>ZHANXING MINGSHU</strong> sẽ kích hoạt thuật toán giao hòa âm dương và xuất kết quả luận giải chuyên sâu.
              </div>
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
                style={{
                  padding: '16px 48px', borderRadius: '9999px', border: 'none',
                  background: 'linear-gradient(135deg, #b8892a 0%, #f0d070 50%, #b8892a 100%)',
                  color: '#08080a', fontSize: '14.5px', fontWeight: 700,
                  letterSpacing: '0.15em', cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(212,168,67,0.3)',
                }}
              >
                ✦ BẮT ĐẦU PHÂN TÍCH HỢP BÀN ✦
              </motion.button>
              {formError && (
                <div style={{ marginTop: '20px', fontSize: '13px', color: '#ef4444', fontWeight: 500 }}>
                  ✕ {formError}
                </div>
              )}
            </div>
          )}

          {/* 2. Trạng thái đang phân tích */}
          {analyzing && !analysis && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '60px 0', color: 'var(--tx-2)', fontSize: '14px' }}>
              <div style={{
                width: '24px', height: '24px',
                border: '3px solid var(--bdr-med)', borderTopColor: 'var(--ac)',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
              }} />
              <span>Đang kết hợp Tinh Bàn và luận giải chuyên sâu theo hệ thống Nghê Hải Hà…</span>
            </div>
          )}

          {/* 3. Hiển thị Dashboard 3D & Nội dung luận giải khi đã có kết quả */}
          {analysis && (
            <div>
              {/* Dashboard 3D Tóm Tắt Tinh Đồ */}
              {chartA && chartB && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px', marginBottom: '28px',
                }}>
                  {/* Card Bên A */}
                  <div style={{
                    padding: '18px', borderRadius: '18px',
                    background: isDark ? 'rgba(30,58,138,0.12)' : 'rgba(219,234,254,0.5)',
                    border: '1px solid rgba(96,165,250,0.3)',
                  }}>
                    <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '4px' }}>
                      MỆNH BÀN {chartA.birthInfo?.name || 'BÊN A'}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--tx-0)', marginBottom: '4px' }}>
                      {getStarVi(starNameA)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--tx-2)' }}>
                      Năm sinh: {chartA.birthInfo?.year} · Cục: {chartA.wuxingJuName}
                    </div>
                  </div>

                  {/* Vòng Tròn Điểm Hòa Hợp */}
                  <div style={{
                    padding: '18px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(212,168,67,0.04) 100%)',
                    border: '1px solid rgba(212,168,67,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px',
                  }}>
                    <div style={{
                      width: '54px', height: '54px', borderRadius: '50%',
                      border: '3px solid var(--ac)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', fontWeight: 800, color: 'var(--ac)',
                      boxShadow: '0 0 16px rgba(212,168,67,0.3)',
                    }}>
                      {compatScore || 88}%
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ac)' }}>Thiên Tác Chi Hợp</div>
                      <div style={{ fontSize: '11px', color: 'var(--tx-2)', marginTop: '2px' }}>Âm Dương Cân Bằng</div>
                    </div>
                  </div>

                  {/* Card Bên B */}
                  <div style={{
                    padding: '18px', borderRadius: '18px',
                    background: isDark ? 'rgba(180,120,20,0.12)' : 'rgba(254,243,199,0.5)',
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}>
                    <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '4px' }}>
                      MỆNH BÀN {chartB.birthInfo?.name || 'BÊN B'}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--tx-0)', marginBottom: '4px' }}>
                      {getStarVi(starNameB)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--tx-2)' }}>
                      Năm sinh: {chartB.birthInfo?.year} · Cục: {chartB.wuxingJuName}
                    </div>
                  </div>
                </div>
              )}

              {/* Luận giải chi tiết */}
              <AiContent text={analysis} streaming={analyzing} />
            </div>
          )}

          {analysisError && (
            <div style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #ef4444', background: 'rgba(239,68,68,0.08)', fontSize: '13px', color: '#ef4444', marginTop: '16px' }}>
              {apiMissing
                ? 'Không thể kết nối máy chủ phân tích Hợp Bàn (/api/heming). Vui lòng thử lại sau.'
                : 'Hệ thống đang bận, vui lòng thử lại sau giây lát.'}
            </div>
          )}
        </div>

        {/* ═══ ĐẶT CÂU HỎI TIẾP NỐI ══════════════════════════════ */}
        {analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.15em', color: 'var(--tx-2)', fontWeight: 600 }}>
              Đặt câu hỏi làm rõ thêm về mối quan hệ này:
            </div>

            {/* Câu hỏi gợi ý nhanh */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                'Hai người kết hôn có hạnh phúc bền lâu không?',
                'Có thể hợp tác làm ăn kinh doanh chung không?',
                'Điểm nào dễ phát sinh xung đột quan điểm nhất?',
                'Cần lưu ý gì về phong thủy phòng ngủ sau khi cưới?',
                'Tài lộc đôi bên có tương trợ giúp nhau giàu có không?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { setQuestion(q); runAnalysis(q); }}
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
                onKeyDown={e => { if (e.key === 'Enter' && !analyzing) runAnalysis(question || undefined); }}
                placeholder="Nhập câu hỏi bạn muốn hỏi thêm (ví dụ: giai đoạn nào cần chú ý nhẫn nhịn nhất?)..."
                disabled={analyzing}
                className="input-base"
                style={{
                  fontSize: '13px', flex: 1, padding: '12px 18px', borderRadius: '14px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                  border: '1px solid var(--bdr-med)', color: 'var(--tx-0)',
                }}
              />
              <button
                onClick={() => runAnalysis(question || undefined)}
                disabled={analyzing}
                style={{
                  padding: '12px 24px', borderRadius: '14px', border: 'none',
                  background: analyzing ? 'var(--bg-2)' : 'linear-gradient(135deg, #b8892a, #f0d070)',
                  color: analyzing ? 'var(--tx-3)' : '#08080a',
                  fontSize: '13px', fontWeight: 700,
                  cursor: analyzing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >
                {analyzing ? 'Đang phân tích…' : 'Gửi câu hỏi'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 680px) {
          .heming-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
