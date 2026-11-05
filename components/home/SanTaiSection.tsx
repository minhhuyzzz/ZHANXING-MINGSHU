'use client';
import { motion } from 'framer-motion';
import { FadeIn, WeakBoundary, type HomeColors } from './HomeShared';
import type { Theme } from '@/components/ThemeProvider';

interface SanTaiSectionProps {
  colors: HomeColors;
  theme: Theme;
}

export default function SanTaiSection({ colors: c, theme }: SanTaiSectionProps) {
  return (
    <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20"
      style={{ background: c.altSection, minHeight: '80svh' }}>
      <WeakBoundary line={c.navBorder} />
      <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
        <FadeIn>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
              <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: c.tagText }}>TAM TÀI CHUYỂN MỆNH ĐỒ</span>
              <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
            </div>
            <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-extrabold mb-4 tracking-tight`}
              style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              THIÊN · ĐỊA · NHÂN
            </h2>
            <p className="max-w-2xl mx-auto text-sm leading-relaxed" style={{ color: c.textSecond }}>
              Vận mệnh chưa bao giờ là một bản án đóng khung.<br />
              Thầy Nghê Hải Hà chỉ rõ: Địa lý (1/3) + Nhân tâm (1/3) = 2/3, hoàn toàn đủ sức xoay chuyển Tiên thiên (1/3)!
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { glyph: 'THIÊN', label: 'Tiên Thiên Vận Mệnh', pct: '⅓', color: c.goldSolid, borderColor: c.goldLine, desc: 'Lá số Tử Vi Đẩu Số phản ánh cung vị, chính tinh, ngũ hành nạp âm tại thời điểm cất tiếng khóc chào đời. Đây là màu nền của cuộc sống, chiếm 1/3, là cơ sở chứ không phải toàn bộ số phận.', sub: 'Mệnh Bàn · Tinh Diệu · Ngũ Hành' },
            { glyph: 'ĐỊA', label: 'Địa Lý Môi Trường', pct: '⅓', color: 'rgba(96,165,250,0.9)', borderColor: 'rgba(96,165,250,0.3)', desc: 'Nơi bạn sinh sống, thành phố, hướng phòng ngủ Càn - Khôn, phong thủy nhà ở, môi trường gia đình. Cùng một lá số nhưng ở vị trí hợp phong thủy sẽ bình an thăng tiến, sai vị trí sẽ gặp trắc trở.', sub: 'Phương Vị Càn Khôn · Dương Trạch' },
            { glyph: 'NHÂN', label: 'Nhân Tâm Ý Niệm', pct: '⅓', color: 'rgba(100,216,139,0.9)', borderColor: 'rgba(100,216,139,0.3)', desc: 'Ý chí, nỗ lực, sự lựa chọn, dưỡng sinh và thái độ sống của chính bạn là sức mạnh chủ động nhất. Học Tử Vi là để làm người sáng suốt hơn, chủ động nắm quyền sinh sát của cuộc đời mình.', sub: 'Ý Chí · Y Đạo · Tu Tâm Dưỡng Tính' },
          ].map((item, i) => (
            <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.1 }}
                className="rounded-2xl p-7 h-full flex flex-col"
                style={{ background: c.cardBg, border: `1px solid ${item.borderColor}`, boxShadow: c.cardShadow }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl font-extrabold leading-none" style={{ color: item.color }}>{item.glyph}</div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                    <div className="text-[9px] mt-0.5 tracking-widest" style={{ color: c.textMuted }}>cuộc đời</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-base font-bold mb-0.5" style={{ color: item.color }}>{item.label}</div>
                  <div className="text-[11px] tracking-wide" style={{ color: c.textMuted }}>{item.sub}</div>
                </div>
                <div className="h-px mb-4" style={{ background: item.borderColor }} />
                <p className="text-xs leading-relaxed flex-1" style={{ color: c.textSecond }}>{item.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.3}>
          <div className="mt-10 text-center">
            <p className="text-sm font-medium leading-relaxed italic" style={{ color: c.textPrimary }}>
              «Địa lý phong thủy (1/3) + Nhân sự nỗ lực (1/3) = 2/3, hoàn toàn làm chủ và chuyển hóa được Tiên thiên vận mệnh (1/3).»
            </p>
            <p className="mt-2 text-xs tracking-widest font-semibold" style={{ color: c.goldSolid }}>— Thầy Nghê Hải Hà (Ni Haisha)</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
