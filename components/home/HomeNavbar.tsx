'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle, type HomeColors } from './HomeShared';

export default function HomeNavbar({ colors: c }: { colors: HomeColors }) {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 gap-2 backdrop-blur-md"
      style={{
        background: `${c.navBg}e6`,
        borderBottom: `1px solid ${c.navBorder}`,
      }}>
      <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
        <span style={{ color: c.goldSolid, fontSize: '16px' }}>✦</span>
        <div className="flex flex-col">
          <span className="text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-extrabold" style={{ color: c.goldSolid }}>
            ZHANXING MINGSHU
          </span>
          <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] opacity-75 font-medium hidden xs:inline" style={{ color: c.textMuted }}>
            占星明舒 · TỬ VI ĐẨU SỐ
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <ThemeToggle />
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/heming')}
          className="text-[11px] sm:text-xs px-2.5 sm:px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer font-medium whitespace-nowrap"
          style={{ border: `1px solid ${c.navBorder}`, color: c.textSecond, background: 'rgba(255,255,255,0.03)' }}>
          <span className="hidden sm:inline">Hợp Bàn Duyên Phận</span>
          <span className="sm:hidden">Hợp Bàn</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/chart')}
          className="text-[11px] sm:text-xs px-3 sm:px-5 py-1.5 rounded-full font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap"
          style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid, background: `${c.goldLine}25` }}>
          <span className="hidden sm:inline">Lập Lá Số Ngay</span>
          <span className="sm:hidden">Lập Lá Số</span>
        </motion.button>
      </div>
    </nav>
  );
}
