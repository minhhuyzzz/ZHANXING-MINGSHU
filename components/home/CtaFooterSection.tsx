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
        <div className="text-[11px] leading-relaxed p-4 rounded-xl border text-left"
          style={{ background: 'rgba(212,168,67,0.04)', borderColor: 'rgba(212,168,67,0.2)', color: c.textSecond }}>
          <div className="font-semibold mb-1 flex items-center gap-2" style={{ color: c.goldSolid }}>
            <span>✦</span>
            <span>Kế Thừa &amp; Ghi Nhận Nguồn Mở (Open Source Attribution):</span>
          </div>
          <p className="mb-2">
            Hệ thống an sao và tri thức cốt lõi được kế thừa &amp; mở rộng từ dự án nguồn mở{' '}
            <a
              href="https://github.com/Renhuai123/ziwei-doushu"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-mono text-[11px] hover:text-amber-400 transition-colors"
              style={{ color: c.goldSolid }}
            >
              Renhuai123/ziwei-doushu
            </a>
            : <em>紫微斗数开源排盘引擎 — 基于倪海厦《天纪》体系，含完整排盘算法、四化系统、格局知识库、古籍原文数据</em>.
          </p>
          <p className="text-[10px]" style={{ color: c.textMuted }}>
            <strong>ZHANXING MINGSHU</strong> đã chuẩn hóa 100% bản địa hóa Tiếng Việt (chú giải chữ Hán kèm theo), tích hợp y đạo kinh lạc tạng phủ Nghê Hải Hà, hệ thống phân tích đa chiều thông tuệ bằng AI và giao diện Tinh Bàn 3D vũ trụ tối tân.
          </p>
        </div>
      </div>
    </section>
  );
}
