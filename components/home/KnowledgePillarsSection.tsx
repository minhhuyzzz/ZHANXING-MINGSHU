'use client';
import { motion } from 'framer-motion';
import { SECTIONS, FadeIn, type HomeColors } from './HomeShared';
import type { Theme } from '@/components/ThemeProvider';

interface KnowledgePillarsSectionProps {
  colors: HomeColors;
  theme: Theme;
}

export default function KnowledgePillarsSection({ colors: c, theme }: KnowledgePillarsSectionProps) {
  return (
    <section className="relative z-10 py-20 lg:py-24 px-6"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(to bottom, transparent 0%, rgba(212,168,67,0.03) 50%, transparent 100%)'
          : 'linear-gradient(to bottom, transparent 0%, rgba(212,168,67,0.04) 50%, transparent 100%)',
      }}>
      <FadeIn className="text-center mb-14">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
          <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: c.goldSolid, opacity: 0.8 }}>HỆ THỐNG TRI THỨC</span>
          <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
        </div>
        <div className="text-2xl lg:text-3xl font-bold mb-2 tracking-[0.1em]" style={{ color: c.textPrimary }}>
          Phương Pháp Luận Nghê Hải Hà
        </div>
        <div className="text-xs lg:text-sm tracking-[0.05em]" style={{ color: c.textMuted }}>
          Khởi sự từ Tử Vi Đẩu Số, dung thông cùng Thiên Kỷ, Địa Kỷ và Nhân Kỷ
        </div>
      </FadeIn>

      <div className="max-w-sm lg:max-w-5xl mx-auto relative">
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-4 lg:gap-4">
          {SECTIONS.map((s, i) => {
            return (
              <motion.div key={s.key}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative flex flex-row lg:flex-col items-center text-left lg:text-center gap-4 lg:gap-0 p-5 rounded-2xl"
                style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}>
                <div className="relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center lg:mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${c.goldSolid} 0%, ${c.goldSolid}cc 100%)`,
                    color: '#08080a',
                    boxShadow: `0 4px 16px ${c.goldSolid}44`,
                  }}>
                  <span className="text-2xl font-bold">{s.icon}</span>
                </div>
                <div className="flex-1 lg:flex-none flex flex-col items-start lg:items-center min-w-0">
                  <div className="text-[10px] tracking-[0.2em] mb-1" style={{ color: '#10b981', fontWeight: 600 }}>
                    {s.when}
                  </div>
                  <div className="text-base lg:text-lg font-bold" style={{ color: c.textPrimary }}>
                    {s.name} <span className="text-xs opacity-60">({s.cn})</span>
                  </div>
                  <div className="text-[11px] leading-relaxed lg:max-w-[200px] mt-1" style={{ color: c.textSecond }}>
                    {s.desc}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
