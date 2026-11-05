'use client';
import { motion } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';
import {
  STAR_VI_MAP,
  PALACE_VI_MAP,
  WUXINGJU_VI_MAP,
  SIHUA_VI_MAP,
  STEM_VI_MAP,
  BRANCH_VI_MAP,
  getPatternVi,
  getPatternDescVi,
  getPatternConditionVi,
  getPatternSourceVi,
  getPalaceVi,
} from '@/lib/ziwei/vietnamese';

interface ChartSummaryProps {
  chart: ZiweiChart;
}

const PatternLevelStyle = {
  excellent: { dot: 'bg-amber-400', label: 'text-amber-500', badge: 'text-amber-500 bg-amber-500/10 border-amber-500/25' },
  good: { dot: 'bg-sky-400', label: 'text-sky-500', badge: 'text-sky-500 bg-sky-500/10 border-sky-500/25' },
  neutral: { dot: 'bg-slate-400', label: 'text-slate-400', badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  caution: { dot: 'bg-orange-500', label: 'text-orange-500', badge: 'text-orange-500 bg-orange-500/10 border-orange-500/25' },
};

export default function ChartSummary({ chart }: ChartSummaryProps) {
  const patterns = detectPatterns(chart);
  const { stars: mingStars, keywords, nature } = getMingGongSummary(chart);
  const currentDx = chart.daXians[chart.currentDaXianIndex];

  const siHuaSummary: { name: string; siHua: string; palaceName: string }[] = [];
  for (const palace of chart.palaces) {
    for (const star of palace.stars) {
      if (star.siHua) {
        siHuaSummary.push({ name: star.name, siHua: star.siHua, palaceName: palace.name });
      }
    }
  }
  const siHuaOrder = ['禄', '权', '科', '忌'];
  siHuaSummary.sort((a, b) => siHuaOrder.indexOf(a.siHua) - siHuaOrder.indexOf(b.siHua));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="space-y-4"
    >
      {/* ── ✦ Tổng Quan Mệnh Cách (Tổng Quan Mệnh Cách) ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      >
      <div className="card-glass rounded-xl p-5">
        <div className="text-[10px] tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--t-faint)' }}>
          <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>✦</span>
          Tổng Quan Mệnh Cách (命格总览)
        </div>

        <div className="flex flex-wrap items-start gap-4">
          <div>
            <div className="text-[9px] mb-1.5" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>Chính tinh Cung Mệnh</div>
            <div className="flex items-center gap-1">
              {mingStars.length > 0 ? (
                mingStars.map(s => (
                  <span key={s} className="font-bold text-lg" style={{ color: 'var(--t-gold)' }}>
    {STAR_VI_MAP[s] || s} <span className="text-xs font-normal opacity-60">({s})</span>
  </span>
                ))
              ) : (
                <span className="text-sm font-medium" style={{ color: 'var(--t-faint)' }}>Vô Chính Diệu</span>
              )}
            </div>
            {nature && (
              <div className="text-[10px] mt-1" style={{ color: 'var(--t-gold)', opacity: 0.5 }}>{nature}</div>
            )}
          </div>

          {keywords.length > 0 && (
            <div>
              <div className="text-[9px] mb-1.5" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>Đặc chất tính cách</div>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map(k => (
                  <span key={k} className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      color: 'var(--t-gold)',
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.15)',
                    }}>
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="ml-auto text-right">
            <div className="text-[9px] mb-1" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>Cục · Đại Hạn hiện tại</div>
            <div className="text-[11px]" style={{ color: 'var(--t-text2)' }}>{WUXINGJU_VI_MAP[chart.wuxingJuName] || chart.wuxingJuName}</div>
            {currentDx && (
              <div className="text-[11px] text-purple-500 mt-0.5">
                {currentDx.startAge}~{currentDx.endAge} tuổi · {getPalaceVi(currentDx.palaceName)}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px]"
          style={{ borderTop: '1px solid var(--t-border)', color: 'var(--t-faint)' }}>
          <span>Dương lịch: {chart.birthInfo.year}-{chart.birthInfo.month}-{chart.birthInfo.day}</span>
          <span>
            Âm lịch: Năm {chart.lunarInfo.lunarYear} {chart.lunarInfo.isLeapMonth ? 'Nhuận ' : ''}
            Tháng {chart.lunarInfo.lunarMonth} Ngày {chart.lunarInfo.lunarDay}
          </span>
          <span>Năm Can Chi: {STEM_VI_MAP[STEMS[chart.lunarInfo.yearStem]] || STEMS[chart.lunarInfo.yearStem]} {BRANCH_VI_MAP[BRANCHES[chart.lunarInfo.yearBranch]] || BRANCHES[chart.lunarInfo.yearBranch]} ({STEMS[chart.lunarInfo.yearStem]}{BRANCHES[chart.lunarInfo.yearBranch]}) · Giờ {BRANCH_VI_MAP[BRANCHES[chart.birthInfo.hour]] || BRANCHES[chart.birthInfo.hour]} ({BRANCHES[chart.birthInfo.hour]})</span>
          <span>Mệnh Cung tại {BRANCH_VI_MAP[BRANCHES[chart.mingGongBranch]] || BRANCHES[chart.mingGongBranch]} ({BRANCHES[chart.mingGongBranch]}) · Thân Cung tại {BRANCH_VI_MAP[BRANCHES[chart.shenGongBranch]] || BRANCHES[chart.shenGongBranch]} ({BRANCHES[chart.shenGongBranch]})</span>
        </div>
      </div>
      </motion.div>

      {/* ── 本命四化 ── */}
      {siHuaSummary.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
        <div className="card-glass rounded-xl p-4">
          <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--t-faint)' }}>
            <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>◆</span>
            Bản Mệnh Tứ Hóa
          </div>
          <div className="grid grid-cols-2 gap-2">
            {siHuaSummary.map(({ name, siHua, palaceName }) => {
              const colors: Record<string, { text: string; bg: string; border: string }> = {
                '禄': { text: '#4ade80', bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.2)' },
                '权': { text: '#60a5fa', bg: 'rgba(96,165,250,0.06)', border: 'rgba(96,165,250,0.2)' },
                '科': { text: '#facc15', bg: 'rgba(250,204,21,0.06)', border: 'rgba(250,204,21,0.2)' },
                '忌': { text: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.2)' },
              };
              const c = colors[siHua] || colors['禄'];
              return (
                <div key={name + siHua}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[10px]"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                >
                  <span className="font-semibold">{STAR_VI_MAP[name] || name} <span className="opacity-60 font-normal">({name})</span></span>
                  <div className="flex items-center gap-1.5 text-right">
                    <span style={{ opacity: 0.7 }} className="text-[9px]">{getPalaceVi(palaceName).replace(' Cung', '')}</span>
                    <span className="font-bold">Hóa {SIHUA_VI_MAP[siHua] || siHua} <span className="text-[8px] opacity-60 font-normal">(化{siHua})</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </motion.div>
      )}

      {/* ── ✦ Nhận Diện Cách Cục ── */}
      {patterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
        <div className="card-glass rounded-xl p-4">
          <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--t-faint)' }}>
            <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>◉</span>
            Nhận Diện Cách Cục (格局识别)
            <span className="text-[9px] ml-auto" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>{patterns.length} cách cục</span>
          </div>
          <div className="space-y-2">
            {patterns.map((p, i) => {
              const st = PatternLevelStyle[p.level];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="card-inner rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                    <span className={`text-[11px] font-semibold ${st.label}`}>{getPatternVi(p.name)}</span>
                    <div className="flex gap-1 ml-auto">
                      {p.palaces.slice(0, 2).map(pa => (
                        <span key={pa} className={`text-[8px] px-1.5 py-px rounded-full border ${st.badge}`}>
                          {getPalaceVi(pa).replace(' Cung', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] leading-relaxed pl-3.5" style={{ color: 'var(--t-text2)' }}>
                    {getPatternDescVi(p.name, p.description)}
                  </p>

                  {p.conditions && (
                    <div className="mt-2 pl-3.5 space-y-0.5">
                      {p.conditions.required.length > 0 && (
                        <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                          <span className="font-semibold" style={{ color: 'var(--t-gold)' }}>Bắt buộc</span>
                          <span style={{ opacity: 0.6 }}> · </span>
                          {p.conditions.required.map(getPatternConditionVi).join(', ')}
                        </div>
                      )}
                      {p.conditions.bonus && p.conditions.bonus.length > 0 && (
                        <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                          <span className="font-semibold text-emerald-400">Cát hóa</span>
                          <span style={{ opacity: 0.6 }}> · </span>
                          {p.conditions.bonus.map(getPatternConditionVi).join(', ')}
                        </div>
                      )}
                      {p.conditions.breaking && p.conditions.breaking.length > 0 && (
                        <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                          <span className="font-semibold text-orange-400">Phá cách</span>
                          <span style={{ opacity: 0.6 }}> · </span>
                          {p.conditions.breaking.map(getPatternConditionVi).join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {p.source && (
                    <div className="text-[9px] mt-1.5 pl-3.5" style={{ color: 'var(--t-faint)', opacity: 0.5 }}>
                      Xuất xứ · {getPatternSourceVi(p.source)}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        </motion.div>
      )}

      {/* ── 大限运程 ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.88, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
      <div className="card-glass rounded-xl p-4">
        <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--t-faint)' }}>
          <span className="text-purple-500/60">◎</span>
          Đại Hạn Vận Trình
        </div>
        <div className="grid grid-cols-3 gap-2">
          {chart.daXians.slice(0, 9).map((dx, i) => {
            const isCurrent = i === chart.currentDaXianIndex;
            return (
              <div
                key={i}
                className="text-[10px] px-2 py-2 rounded-lg text-center transition-colors"
                style={{
                  border: isCurrent
                    ? '1px solid rgba(147,51,234,0.4)'
                    : '1px solid var(--t-border)',
                  background: isCurrent ? 'rgba(147,51,234,0.08)' : 'transparent',
                  color: isCurrent ? '#a78bfa' : 'var(--t-faint)',
                }}
              >
                <div className="font-mono tabular-nums">{dx.startAge}~{dx.endAge} tuổi</div>
                <div className="text-[9px] mt-0.5" style={{ opacity: 0.85 }}>{getPalaceVi(dx.palaceName).replace(' Cung', '')}</div>
              </div>
            );
          })}
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}
