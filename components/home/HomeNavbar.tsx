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
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
        <span style={{ color: c.goldSolid, fontSize: '17px' }}>✦</span>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm tracking-[0.2em] font-extrabold" style={{ color: c.goldSolid }}>
            ZHANXING MINGSHU
          </span>
          <span className="text-[9px] tracking-[0.3em] opacity-75 font-medium" style={{ color: c.textMuted }}>
            占星明舒 · TỬ VI ĐẨU SỐ
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <ThemeToggle />
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/heming')}
          className="text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer font-medium"
          style={{ border: `1px solid ${c.navBorder}`, color: c.textSecond, background: 'rgba(255,255,255,0.03)' }}>
          Hợp Bàn Duyên Phận
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/chart')}
          className="text-[11px] sm:text-xs px-3.5 sm:px-5 py-1.5 rounded-full font-semibold transition-all duration-300 cursor-pointer"
          style={{ border: `1px solid ${c.goldLine}`, color: c.goldSolid, background: `${c.goldLine}25` }}>
          Lập Lá Số Ngay
        </motion.button>
      </div>
    </nav>
  );
}
