'use client';
import { useLayoutEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import AnnouncementModal from '@/components/AnnouncementModal';
import { useColors } from '@/components/home/HomeShared';
import HomeNavbar from '@/components/home/HomeNavbar';
import HeroSection from '@/components/home/HeroSection';
import MeridianSection from '@/components/home/MeridianSection';
import PhilosophySection from '@/components/home/PhilosophySection';
import KnowledgePillarsSection from '@/components/home/KnowledgePillarsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import SanTaiSection from '@/components/home/SanTaiSection';
import MasterNiSection from '@/components/home/MasterNiSection';
import CtaFooterSection from '@/components/home/CtaFooterSection';

/**
 * TRANG CHỦ ZHANXING MINGSHU (占星明舒)
 * Kiến trúc module hóa tách biệt từng Section theo yêu cầu tối ưu hóa hiệu năng
 */
export default function HomePage() {
  const { theme } = useTheme();
  const c = useColors(theme);

  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden min-h-screen">
      {/* Thông điệp kính gửi người dùng */}
      <AnnouncementModal />

      {/* Quầng sáng vũ trụ huyền ảo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      {/* ── 1. THANH ĐIỀU HƯỚNG TRÊN CÙNG ── */}
      <HomeNavbar colors={c} />

      {/* ── 2. HERO BANNER (CONTAINED 3D CELESTIAL ASTROLABE) ── */}
      <HeroSection colors={c} theme={theme} />

      {/* ── 3. Y LÝ TỬ VI & TỬ NGỌ LƯU CHÚ (KINH LẠC TẠNG PHỦ) ── */}
      <MeridianSection colors={c} theme={theme} />

      {/* ── 4. TRIẾT LÝ MỆNH VẬN QUAN (THIÊN BÀN CHỮ MỆNH) ── */}
      <PhilosophySection colors={c} theme={theme} />

      {/* ── 5. BỐN KHỐI TRI THỨC LỚN (TỬ VI - THIÊN - ĐỊA - NHÂN) ── */}
      <KnowledgePillarsSection colors={c} theme={theme} />

      {/* ── 6. CHI TIẾT 4 TÍNH NĂNG & MINH HỌA TƯƠNG TÁC ── */}
      <FeaturesSection colors={c} theme={theme} />

      {/* ── 7. THUYẾT THIÊN - ĐỊA - NHÂN (TAM TÀI CHUYỂN MỆNH ĐỒ) ── */}
      <SanTaiSection colors={c} theme={theme} />

      {/* ── 8. GIỚI THIỆU TÔN SƯ NGHÊ HẢI HÀ (NI HAISHA) ── */}
      <MasterNiSection colors={c} theme={theme} />

      {/* ── 9. CUỐI TRANG & NÚT KHỞI TẠO LÁ SỐ ── */}
      <CtaFooterSection colors={c} theme={theme} />
    </div>
  );
}
