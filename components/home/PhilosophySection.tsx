'use client';
import { motion } from 'framer-motion';
import { FadeIn, WeakBoundary, type HomeColors } from './HomeShared';
import type { Theme } from '@/components/ThemeProvider';

interface PhilosophySectionProps {
  colors: HomeColors;
  theme: Theme;
}

export default function PhilosophySection({ colors: c, theme }: PhilosophySectionProps) {
  return (
    <section className="relative z-10 overflow-hidden min-h-[70svh] flex items-center" style={{ padding: '72px 24px' }}>
      <WeakBoundary line={c.navBorder} />
      <div className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(to bottom, #04070e 0%, #030a18 25%, #0d0820 50%, #030a18 75%, #04070e 100%)'
            : 'linear-gradient(to bottom, #f7f2e7 0%, #f0e6d2 30%, #e2d2b5 50%, #f0e6d2 75%, #f7f2e7 100%)',
          transition: 'background 0.4s ease',
        }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-bold opacity-10" style={{ fontSize: 'clamp(220px, 38vw, 460px)', color: c.goldSolid, lineHeight: 1 }}>命</span>
      </div>
      <FadeIn className="relative mx-auto text-center w-full" y={20}>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
          <span className="text-[11px] tracking-[0.45em] uppercase font-semibold" style={{ color: c.goldSolid }}>
            MỆNH · VẬN · QUAN
          </span>
          <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
        </div>
        <div className="space-y-4" style={{ maxWidth: '860px', margin: '0 auto' }}>
          {[
            { text: 'Thấu suốt vận mệnh từ sớm...', size: 'clamp(18px, 2.2vw, 28px)', color: c.textSecond, delay: 0.1 },
            { text: 'Không phải để cam chịu một tương lai đã định sẵn,', size: 'clamp(20px, 2.6vw, 32px)', color: c.textSecond, delay: 0.25 },
            { text: 'Mà là để không ngừng thấu hiểu và hoàn thiện chính mình,', size: 'clamp(22px, 3vw, 38px)', color: c.textPrimary, delay: 0.35 },
          ].map((line, i) => (
            <motion.p key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: line.delay }}
              className="tracking-wider" style={{ fontSize: line.size, color: line.color, fontWeight: 400 }}>
              {line.text}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold pt-2`}
            style={{ fontSize: 'clamp(24px, 3.4vw, 48px)', letterSpacing: '0.04em', lineHeight: 1.35 }}>
            Và tự tay làm chủ cuộc đời thông tuệ nhất!
          </motion.p>
        </div>
      </FadeIn>
    </section>
  );
}
