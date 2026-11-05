'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FEATURES,
  STARS,
  STAR_VI_INFO,
  FadeIn,
  type HomeColors,
} from './HomeShared';
import type { Theme } from '@/components/ThemeProvider';

function FeatureVisual({ index, colors: c }: { index: number; colors: HomeColors }) {
  const [sel, setSel] = useState<string>('Tử Vi');

  if (index === 0) {
    const pal = ['Mệnh (Cung)', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'];
    return (
      <div className="grid grid-cols-4 gap-2 h-full content-center">
        {pal.map((p, i) => (
          <motion.div key={p}
            initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="rounded-xl p-2.5 text-center flex flex-col justify-center items-center"
            style={{
              background: i === 0 ? c.starBg : c.featureBg,
              border: `1px solid ${i === 0 ? c.goldSolid : c.cardBorder}`,
              minHeight: '72px',
            }}>
            <div className="text-[10px] opacity-50" style={{ color: c.textMuted }}>{String(i + 1).padStart(2, '0')}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: i === 0 ? c.goldSolid : c.textPrimary }}>{p}</div>
            {i === 0 && <span className="text-[9px] px-1.5 rounded-full mt-1 font-medium" style={{ background: `${c.goldSolid}25`, color: c.goldSolid }}>Bản Cung</span>}
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 1) {
    const selInfo = STAR_VI_INFO[sel];
    return (
      <div className="flex flex-col gap-3 justify-center h-full">
        <div className="text-[11px] font-medium tracking-wide" style={{ color: c.tagText }}>CHỌN CHÍNH TINH ĐỂ KHẢO CỨU:</div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
          {STARS.map(s => (
            <motion.button key={s.name}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSel(s.name)}
              className="px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-center"
              style={{
                border: `1px solid ${sel === s.name ? c.goldSolid : c.cardBorder}`,
                background: sel === s.name ? c.starBg : 'transparent',
                color: sel === s.name ? c.goldSolid : c.textSecond,
              }}>
              {s.name}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div key={sel}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="rounded-xl p-3.5 mt-1"
              style={{ border: `1px solid ${c.goldLine}`, background: c.featureBg }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold" style={{ color: c.goldSolid }}>{sel}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{selInfo.attr}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: c.textSecond }}>{selInfo.brief}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: 'Năm nay vận trình sự nghiệp của tôi như thế nào?' },
      { role: 'ai', text: 'Mệnh cung Thiên Cơ Hóa Lộc, lưu niên tiến vào cung Quan Lộc, tam phương có Tả Phụ tương trợ, công việc có quý nhân dẫn lối, rất thích hợp chủ động mở rộng quy mô…' },
      { role: 'user', text: 'Thời điểm nào tình duyên hôn nhân thuận lợi nhất?' },
    ];
    return (
      <div className="flex flex-col gap-2.5 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[88%] text-[11px] px-3.5 py-2.5 rounded-xl leading-relaxed"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: 'Sát Phá Tham Cách', desc: 'Mệnh cách khai phá dũng mãnh, đại nghiệp tiền phong', ok: true },
      { name: 'Tử Phủ Triều Viên', desc: 'Cách cục đế khố hội tụ, phú quý song toàn', ok: true },
      { name: 'Kình Đà Hiệp Kỵ', desc: 'Bài học kiên nhẫn, cần chú ý tu dưỡng tâm tính', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[12px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.9)' : 'rgba(253,186,116,0.9)' }}>{p.name}</div>
              <div className="text-[10px]" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[10px] mt-2 tracking-wider text-center" style={{ color: c.textFaint }}>
          ✦ Tự động đối chiếu hơn 1100 quy tắc cách cục cổ tịch ✦
        </div>
      </div>
    );
  }

  return null;
}

interface FeaturesSectionProps {
  colors: HomeColors;
  theme: Theme;
}

export default function FeaturesSection({ colors: c, theme }: FeaturesSectionProps) {
  return (
    <section className="relative z-10">
      {FEATURES.map((feature, i) => (
        <div key={i}
          className={`flex items-center px-6 md:px-10 lg:px-14 py-20 md:py-24 ${i <= 2 ? 'min-h-[80svh] lg:min-h-[88vh]' : ''}`}
          style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
          <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
            <div className={`grid grid-cols-1 ${i % 2 === 0 ? 'lg:grid-cols-[0.45fr_0.55fr]' : 'lg:grid-cols-[0.55fr_0.45fr]'} gap-10 lg:gap-16 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                <FadeIn delay={0}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8" style={{ background: c.goldLine }} />
                    <span className="text-[10px] tracking-[0.35em] uppercase font-semibold" style={{ color: c.tagText }}>{feature.tag}</span>
                  </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-extrabold leading-tight mb-4 tracking-tight`}
                    style={{
                      fontSize: i < 2 ? 'clamp(32px, 3.8vw, 52px)' : 'clamp(28px, 3.2vw, 44px)',
                      whiteSpace: 'pre-line',
                    }}>
                    {feature.title}
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-base mb-6 leading-relaxed" style={{ color: c.textSecond }}>{feature.subtitle}</p>
                </FadeIn>
                <div className="space-y-3.5">
                  {feature.points.map((point, j) => (
                    <FadeIn key={j} delay={0.25 + j * 0.08}>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full" style={{ background: c.goldSolid }} />
                        <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>{point}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
              <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <FadeIn delay={0.15}>
                  <div className="relative rounded-2xl overflow-hidden p-6 md:p-10"
                    style={{
                      border: `1px solid ${c.featureBord}`,
                      background: c.featureBg,
                      minHeight: i <= 1 ? '500px' : i === 2 ? '440px' : '320px',
                      boxShadow: c.cardShadow,
                    }}>
                    <FeatureVisual index={i} colors={c} />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
