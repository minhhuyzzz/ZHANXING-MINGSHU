'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MERIDIANS, FadeIn, type HomeColors } from './HomeShared';
import type { Theme } from '@/components/ThemeProvider';

interface MeridianSectionProps {
  colors: HomeColors;
  theme: Theme;
}

export default function MeridianSection({ colors: c, theme }: MeridianSectionProps) {
  const [activeOrganIndex, setActiveOrganIndex] = useState(6); // Default: Ngọ (Tâm)

  return (
    <section className="relative z-10 py-20 px-6"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(180deg, rgba(4,7,14,1) 0%, rgba(10,20,40,0.7) 50%, rgba(4,7,14,1) 100%)'
          : 'linear-gradient(180deg, #f7f2e7 0%, #efe5d0 50%, #f7f2e7 100%)',
        borderTop: `1px solid ${c.navBorder}`,
        borderBottom: `1px solid ${c.navBorder}`,
      }}>
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.35em] uppercase font-semibold" style={{ color: c.goldSolid }}>
              NHÂN KỶ & THIÊN KỶ TƯƠNG THÔNG
            </span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <h2 className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} text-2xl lg:text-4xl font-extrabold mb-3`}>
            Tử Ngọ Lưu Chú & Y Lý Đẩu Số
          </h2>
          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Khẩu quyết Thầy Nghê Hải Hà: «Người tầm thường xem Tật Ách chỉ để hỏi bệnh vặt; Y gia xem Tử Vi là để nắm trọn 12 kinh lạc tạng phủ, nhìn cung hội tụ Sát tinh để phòng bệnh chí mạng trước 3 năm.»
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Vòng chọn 12 Địa Chi */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MERIDIANS.map((item, idx) => {
              const active = activeOrganIndex === idx;
              return (
                <motion.div
                  key={item.branch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveOrganIndex(idx)}
                  className="p-3.5 rounded-2xl cursor-pointer transition-all duration-200"
                  style={{
                    background: active ? `${c.goldSolid}20` : c.cardBg,
                    border: `1px solid ${active ? c.goldSolid : c.cardBorder}`,
                    boxShadow: active ? `0 0 20px ${c.goldSolid}33` : 'none',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: active ? c.goldSolid : c.textPrimary }}>
                      {item.branch}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full"
                      style={{ background: active ? c.goldSolid : 'rgba(255,255,255,0.06)', color: active ? '#08080a' : c.textMuted }}>
                      {item.time}
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold" style={{ color: active ? c.goldSolid : c.textSecond }}>
                    {item.organ}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Chi tiết tạng phủ được chọn */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeOrganIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl p-6 lg:p-8"
                style={{
                  background: c.cardBg,
                  border: `1.5px solid ${c.goldSolid}`,
                  boxShadow: c.cardShadow,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] tracking-[0.2em] font-semibold uppercase" style={{ color: c.goldSolid }}>
                    ĐỊA CHI TẠNG PHỦ KHẢO CỨU
                  </span>
                  <span className="text-xl">☯</span>
                </div>

                <div className="text-2xl font-bold mb-1" style={{ color: c.textPrimary }}>
                  {MERIDIANS[activeOrganIndex].organ}
                </div>
                <div className="text-xs font-medium mb-4" style={{ color: c.textMuted }}>
                  Giờ Lưu Chú: {MERIDIANS[activeOrganIndex].time} · Cung Vị: {MERIDIANS[activeOrganIndex].branch}
                </div>

                <div className="h-px w-full mb-4" style={{ background: c.cardBorder }} />

                <p className="text-sm leading-relaxed mb-4" style={{ color: c.textSecond }}>
                  {MERIDIANS[activeOrganIndex].note}
                </p>

                <div className="p-3.5 rounded-xl text-xs leading-relaxed"
                  style={{ background: 'rgba(212,168,67,0.08)', border: `1px solid ${c.goldLine}`, color: c.goldSolid }}>
                  <strong>Ứng dụng luận mệnh:</strong> Nếu địa chi {MERIDIANS[activeOrganIndex].branch.split(' ')[0]} gặp Kình Dương, Đà La hoặc Hóa Kỵ đồng cung/xung chiếu, cần chủ động điều dưỡng kinh lạc tạng {MERIDIANS[activeOrganIndex].organ.split(' ')[0]} khi bước vào Đại Hạn hay Lưu Niên liên đới.
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
