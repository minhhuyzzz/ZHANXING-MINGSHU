'use client';
import { FadeIn, WeakBoundary, type HomeColors } from './HomeShared';
import type { Theme } from '@/components/ThemeProvider';

interface MasterNiSectionProps {
  colors: HomeColors;
  theme: Theme;
}

export default function MasterNiSection({ colors: c, theme }: MasterNiSectionProps) {
  return (
    <section className="relative z-10 flex items-center px-6 md:px-10 lg:px-14 py-20" style={{ minHeight: '80svh' }}>
      <WeakBoundary line={c.navBorder} />
      <div className="mx-auto w-full" style={{ maxWidth: '1280px' }}>
        <FadeIn>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
              <span className="text-[10px] tracking-[0.4em] uppercase font-semibold" style={{ color: c.tagText }}>TÔN SƯ ĐẠI DANH · 1954 – 2012</span>
              <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
            </div>
            <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-extrabold mb-4 tracking-tight`}
              style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              Thầy Nghê Hải Hà (Ni Haisha)
            </h2>
            <p className="max-w-2xl mx-auto leading-relaxed text-sm" style={{ color: c.textSecond }}>
              Bậc kỳ nhân đương đại tinh thông cả năm thuật: Mệnh, Tướng, Bốc, Sơn, Y.<br />
              Nhà sáng lập Học viện Trung Y Hán Đường Hoa Kỳ · Truyền thế hai đại hệ thống 《Nhân Kỷ》 và 《Thiên Kỷ》.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl p-8 md:p-10 mb-8"
            style={{ border: `1px solid ${c.cardBorder}`, background: c.cardBg, boxShadow: c.cardShadow }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'NĂM SINH', value: '1954', sub: 'Đài Bắc, nguyên quán Chiết Giang' },
                { label: 'TẠ THẾ', value: '2012', sub: 'Hưởng dương 59 tuổi' },
                { label: 'TRUYỀN THỪA', value: 'Tử Vi & Y Đạo', sub: 'Tam Hợp Phái · Kinh Phương Y Học' },
              ].map(item => (
                <div key={item.label} className="text-center rounded-xl px-4 py-3"
                  style={{ border: `1px solid ${c.goldLine}`, background: 'rgba(212,168,67,0.03)' }}>
                  <div className="text-[10px] tracking-[0.25em] mb-1 font-semibold" style={{ color: c.textMuted }}>{item.label}</div>
                  <div className="text-2xl font-bold mb-0.5" style={{ color: c.goldSolid }}>{item.value}</div>
                  <div className="text-[11px]" style={{ color: c.textSecond }}>{item.sub}</div>
                </div>
              ))}
            </div>
            <div className="h-px mb-8" style={{ background: c.cardBorder }} />
            <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: c.textSecond }}>
              <p>
                <strong style={{ color: c.goldSolid }}>Thân thế & Sự nghiệp</strong>: Thầy Nghê Hải Hà (1954–2012) là danh sư Trung Y kiệt xuất tại Hoa Kỳ và Đài Loan. Thầy dành trọn cuộc đời phục hưng y học cổ truyền kinh phương và làm sáng tỏ đạo lý thuật số chân truyền của phương Đông.
              </p>
              <p>
                <strong style={{ color: c.goldSolid }}>Hai Đại Hệ Thống</strong>: <strong>《Thiên Kỷ》</strong> (Thượng tri thiên văn) đúc kết trọn vẹn Tử Vi Đẩu Số Tam Hợp Phái và Chu Dịch 64 Quẻ; <strong>《Nhân Kỷ》</strong> (Trung tri nhân sự) đúc kết Hoàng Đế Nội Kinh, Thương Hàn Luận, Kim Quỹ Yếu Lược, Châm Cứu và Bản Thảo.
              </p>
              <p>
                <strong style={{ color: c.goldSolid }}>Quan Điểm Tử Vi</strong>: Thầy chủ trương <em>«Đại đạo chí giản»</em>, phản đối việc phi tinh bay lượn phức tạp gây rối trí, lấy Mệnh cung làm gốc, Tam phương làm dụng và Tứ hóa làm cương lĩnh. Luận mệnh để tích đức hướng thiện và xoay chuyển cuộc đời.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
