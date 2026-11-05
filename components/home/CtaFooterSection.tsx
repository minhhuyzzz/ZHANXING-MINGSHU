'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { HomeColors } from './HomeShared';
import type { Theme } from '@/components/ThemeProvider';

interface CtaFooterSectionProps {
  colors: HomeColors;
  theme: Theme;
}

export default function CtaFooterSection({ colors: c, theme }: CtaFooterSectionProps) {
  const router = useRouter();

  return (
    <section className="relative z-10 py-20 px-6 text-center"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(to top, rgba(212,168,67,0.08) 0%, transparent 100%)'
          : 'linear-gradient(to top, rgba(212,168,67,0.12) 0%, transparent 100%)',
        borderTop: `1px solid ${c.navBorder}`,
      }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ color: c.goldSolid }}>
          Sẵn Sàng Khám Phá Lá Số Của Bạn?
        </div>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: c.textSecond }}>
          Trải nghiệm cỗ máy coi Tử Vi chuẩn xác, thông tuệ, hoàn toàn miễn phí cùng ZHANXING MINGSHU.
        </p>
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/chart')}
          className="px-12 py-4 font-bold text-base tracking-[0.15em] rounded-full cursor-pointer shadow-2xl"
          style={{ background: c.ctaBg, color: c.ctaText }}>
          KHỞI TẠO LÁ SỐ TỬ VI NGAY
        </motion.button>
      </div>

      <div className="mt-16 pt-8 text-xs tracking-wider max-w-3xl mx-auto space-y-3" style={{ borderTop: `1px solid ${c.cardBorder}`, color: c.textMuted }}>
        <div>
          © 2026 <strong>ZHANXING MINGSHU (占星明舒)</strong> — Nền Tảng Chiêm Tinh &amp; Tử Vi Đẩu Số Chuyên Sâu
        </div>
      </div>
    </section>
  );
}
