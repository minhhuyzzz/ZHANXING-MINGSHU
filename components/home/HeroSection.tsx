'use client';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import CelestialAstrolabe3D from '@/components/CelestialAstrolabe3D';
import { STARS, type HomeColors } from './HomeShared';
import type { Theme } from '@/components/ThemeProvider';

interface HeroSectionProps {
  colors: HomeColors;
  theme: Theme;
}

export default function HeroSection({ colors: c, theme }: HeroSectionProps) {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={heroRef} className="relative min-h-[92svh] flex flex-col items-center justify-center px-6 z-10 pb-20 pt-28 overflow-hidden">
      {/* Nền 3D Tinh Thể Vũ Trụ: Chạy gói gọn trong Hero, tự động dừng khi cuộn xuống dưới */}
      <CelestialAstrolabe3D contained={true} />

      <motion.div style={{ y: heroY, opacity: heroOpacity, maxWidth: '980px' }} className="relative text-center w-full mx-auto z-10">
        {/* Nhãn truyền thừa */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-5 px-2">
          <div className="h-px w-6 sm:w-16 flex-shrink-0" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
          <span className="text-[9px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.35em] uppercase font-semibold text-center" style={{ color: c.tagText }}>
            TỬ VI ĐẨU SỐ · NGHÊ HẢI HÀ 《THIÊN KỶ》 CHÍNH TÔNG
          </span>
          <div className="h-px w-6 sm:w-16 flex-shrink-0" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
        </motion.div>

        {/* Tiêu đề chính trang web: ZHANXING MINGSHU */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ position: 'relative', display: 'inline-block' }}>
          <h1
            className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-black leading-none mb-3`}
            style={{
              fontSize: 'clamp(32px, 8.5vw, 108px)',
              letterSpacing: '0.04em',
              textShadow: theme === 'dark' ? '0 0 50px rgba(212,168,67,0.35)' : 'none',
            }}>
            ZHANXING MINGSHU
          </h1>
          <div className="text-[11px] sm:text-sm tracking-[0.25em] sm:tracking-[0.55em] mb-6 font-semibold" style={{ color: c.goldSolid, opacity: 0.95 }}>
            占星明舒 · CỖ MÁY CHIÊM TINH TỬ VI
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-base sm:text-lg tracking-[0.12em] mb-2"
          style={{ color: c.textSecond, fontWeight: 500 }}>
          Tử Vi là Cửa · Thiên Địa Nhân là Đường · Nghê Hải Hà là Thầy
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-xs sm:text-sm tracking-[0.25em] mb-5 uppercase"
          style={{ color: c.goldSolid, opacity: 0.85 }}>
          ✦ Tri Khí Thời Vận · Định Cục Nhân Sinh · Tri Hành Hợp Nhất ✦
        </motion.p>

        {/* Cặp Nút Hành Động (CTA) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="flex flex-wrap items-center justify-center gap-4">
          <motion.button
            whileHover={{ y: -2, scale: 1.03, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-10 sm:px-14 py-3.5 sm:py-4 font-bold text-sm sm:text-base tracking-[0.15em] rounded-full cursor-pointer shadow-2xl"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            LẬP LÁ SỐ TỬ VI NGAY
          </motion.button>
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/heming')}
            className="px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-sm sm:text-base tracking-[0.12em] rounded-full cursor-pointer backdrop-blur-md"
            style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid, background: 'rgba(212,168,67,0.1)' }}>
            ☯ HỢP BÀN DUYÊN PHẬN
          </motion.button>
        </motion.div>

        {/* 14 Chính Tinh Thiên Bàn */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="mt-11 grid grid-cols-2 sm:grid-cols-7 gap-1.5 max-w-[700px] mx-auto">
          {STARS.map((star, i) => (
            <motion.div key={star.name}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
              className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full"
              style={{ background: c.starBg, border: `1px solid ${c.starBorder}` }}>
              <span className="text-[11px] font-medium" style={{ color: c.starText }}>{star.name}</span>
              <span className="text-[9px] opacity-50" style={{ color: c.starText }}>{star.cn}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Thẻ Chứng Thực Học Thuật Nổi Bật Bên Phải (Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 30, rotate: 0 }}
        animate={{ opacity: 1, x: 0, rotate: -2 }}
        transition={{ delay: 1.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute hidden lg:block pointer-events-none"
        style={{
          right: 'clamp(2%, 4vw, 6%)',
          top: '50%',
          maxWidth: '260px',
          zIndex: 15,
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,168,67,0.18) 0%, rgba(212,168,67,0.06) 100%)',
          border: '1.5px dashed rgba(212,168,67,0.5)',
          borderRadius: '20px',
          padding: '18px 22px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(212,168,67,0.15)',
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ fontSize: '20px', marginBottom: '6px' }}>✦</div>
          <div style={{ fontSize: '13px', lineHeight: 1.6, color: c.goldSolid, fontWeight: 700 }}>
            ZHANXING MINGSHU
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.6, color: c.textSecond, marginTop: '4px' }}>
            Trọn bộ an sao + Hợp Bàn + Luận giải bằng AI + Kinh lạc tạng phủ <strong style={{ color: c.goldSolid }}>hoàn toàn miễn phí</strong>
          </div>
        </div>
      </motion.div>

      {/* Chỉ báo cuộn trang */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-10">
        <span className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: c.scrollText }}>Khám phá chiều sâu học thuật</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${c.scrollLine}, transparent)` }} />
      </motion.div>
    </section>
  );
}
