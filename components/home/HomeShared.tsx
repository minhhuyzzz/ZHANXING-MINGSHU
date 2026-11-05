'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme, type Theme } from '@/components/ThemeProvider';

// ─── Wrapper hiệu ứng cuộn mượt ───────────────────────────
export function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function WeakBoundary({ line }: { line: string }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
      style={{ background: `linear-gradient(to bottom, ${line}, transparent)`, opacity: 0.45 }} />
  );
}

// ─── Nút chuyển đổi Giao diện Sáng / Tối ──────────────────
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}
    >
      <div className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}>
        {isDark ? 'Tối' : 'Sáng'}
      </span>
    </motion.button>
  );
}

// ─── Danh sách 14 Chính Tinh (Việt - Hán - Ngũ Hành) ─────
export const STARS = [
  { name: 'Tử Vi', cn: '紫微', element: 'Thổ', role: 'Đế Tinh' },
  { name: 'Thiên Cơ', cn: '天机', element: 'Mộc', role: 'Thiện Tinh' },
  { name: 'Thái Dương', cn: '太阳', element: 'Hỏa', role: 'Quý Tinh' },
  { name: 'Vũ Khúc', cn: '武曲', element: 'Kim', role: 'Tài Tinh' },
  { name: 'Thiên Đồng', cn: '天同', element: 'Thủy', role: 'Phúc Tinh' },
  { name: 'Liêm Trinh', cn: '廉贞', element: 'Hỏa', role: 'Tù Tinh' },
  { name: 'Thiên Phủ', cn: '天府', element: 'Thổ', role: 'Lệnh Tinh' },
  { name: 'Thái Âm', cn: '太阴', element: 'Thủy', role: 'Phú Tinh' },
  { name: 'Tham Lang', cn: '贪狼', element: 'Thủy/Mộc', role: 'Đào Hoa' },
  { name: 'Cự Môn', cn: '巨门', element: 'Thủy', role: 'Ám Tinh' },
  { name: 'Thiên Tướng', cn: '天相', element: 'Thủy', role: 'Ấn Tinh' },
  { name: 'Thiên Lương', cn: '天梁', element: 'Thổ', role: 'Ấm Tinh' },
  { name: 'Thất Sát', cn: '七杀', element: 'Kim', role: 'Tướng Tinh' },
  { name: 'Phá Quân', cn: '破军', element: 'Thủy', role: 'Hao Tinh' },
];

// ─── 12 Địa Chi & Kinh Lạc Tạng Phủ (Tử Ngọ Lưu Chú) ────
export const MERIDIANS = [
  { branch: 'Tý (子)', organ: 'Đảm (Túi Mật)', time: '23:00 - 01:00', note: 'Chủ quyết đoán, giấc ngủ dưỡng đảm' },
  { branch: 'Sửu (丑)', organ: 'Can (Gan)', time: '01:00 - 03:00', note: 'Tàng huyết, thải độc, kiêng thức khuya' },
  { branch: 'Dần (寅)', organ: 'Phế (Phổi)', time: '03:00 - 05:00', note: 'Phân phối khí huyết toàn thân' },
  { branch: 'Mão (卯)', organ: 'Đại Trường (Ruột Già)', time: '05:00 - 07:00', note: 'Bài tiết cặn bã, uống nước ấm' },
  { branch: 'Thìn (辰)', organ: 'Vị (Dạ Dày)', time: '07:00 - 09:00', note: 'Hấp thụ dinh dưỡng, cần ăn sáng' },
  { branch: 'Tỵ (巳)', organ: 'Tỳ (Lách & Tiêu Hóa)', time: '09:00 - 11:00', note: 'Vận hóa thủy cốc, sinh huyết' },
  { branch: 'Ngọ (午)', organ: 'Tâm (Tim & Mạch)', time: '11:00 - 13:00', note: 'Chủ thần minh, nên chợp mắt tịnh tâm' },
  { branch: 'Mùi (未)', organ: 'Tiểu Trường (Ruột Non)', time: '13:00 - 15:00', note: 'Chắt lọc tinh chất dinh dưỡng' },
  { branch: 'Thân (申)', organ: 'Bàng Quang', time: '15:00 - 17:00', note: 'Khai thông đường nước, tăng cường trao đổi' },
  { branch: 'Dậu (酉)', organ: 'Thận (Thận & Tinh Khí)', time: '17:00 - 19:00', note: 'Tàng tinh tiên thiên, cội nguồn sinh mệnh' },
  { branch: 'Tuất (戌)', organ: 'Tâm Bào (Màng Tim)', time: '19:00 - 21:00', note: 'Bảo vệ tâm, giữ tâm trạng vui tươi' },
  { branch: 'Hợi (亥)', organ: 'Tam Tiêu (Hệ Thống Trao Đổi)', time: '21:00 - 23:00', note: 'Thông suốt bách mạch, chuẩn bị an giấc' },
];

// ─── Các Trụ Cột Tính Năng ───────────────────────────────
export const FEATURES = [
  {
    tag: 'AN SAO CHÍNH TÔNG',
    title: 'Hệ Thống Tử Vi\nNghê Hải Hà 《Thiên Kỷ》',
    subtitle: 'Nghiêm cẩn theo truyền thừa chính tông, không cắt xén hay giản lược',
    points: [
      'Nạp âm Ngũ Hành Cục chuẩn xác (Thủy Nhị Cục, Mộc Tam Cục, Kim Tứ Cục, Thổ Ngũ Cục, Hỏa Lục Cục), không dùng thuật toán đơn giản hóa.',
      'An Mệnh nghịch sinh thời, Thân thuận sinh thời, bám sát từng nguyên lý của Thiên Kỷ.',
      'Thập tứ chính tinh và Tứ hóa phi tinh suy diễn đúng phép tắc, minh bạch và có thể đối chiếu.',
      'Hiệu chỉnh Chân Thái Dương Thời theo kinh độ thực tế của toàn bộ 63 tỉnh thành Việt Nam.',
    ],
  },
  {
    tag: 'MỆNH BÀN TOÀN DIỆN',
    title: 'Trọn Vẹn 14 Chính Tinh\nVà Tứ Hóa Phi Tinh',
    subtitle: 'Bố cục sáng sủa, vừa mắt, nắm bắt ngay trục Mệnh và cung vị then chốt',
    points: [
      '14 Chính tinh an đúng địa bàn, hiển thị mối quan hệ tương sinh tương khắc rõ ràng.',
      'Hội tụ đầy đủ Lục Cát Tinh (Tả Hữu, Xương Khúc, Khôi Việt) và Lục Sát Tinh (Kình Đà, Hỏa Linh, Không Kiếp).',
      'Độ sáng miếu, vượng, đắc, lợi, bình, bất, hãm được phân loại chi tiết theo 《Tử Vi Đẩu Số Toàn Thư》.',
      'Nhấp chọn từng cung hoặc từng sao để xem luận giải chuyên sâu theo hệ thống Nghê Hải Hà.',
    ],
  },
  {
    tag: 'LUẬN GIẢI ĐA TẦNG AI',
    title: 'Luận Giải Chuyên Sâu\nVượt Xa Việc Bói Toán',
    subtitle: 'Tri thức cổ học kinh điển kết hợp mô hình AI phân tích mạch lạc',
    points: [
      'Định tính Mệnh cách: Phân tích thấu đáo Mệnh cung, Thân cung và thế Tam Phương Tứ Chính (Quan - Tài - Di).',
      'Luận giải 6 phương diện trọng yếu: Sự nghiệp & Công danh, Tình cảm & Hôn nhân, Tài lộc & Tiền của, Sức khỏe tạng phủ kinh lạc, Tính cách & Phúc đức.',
      'Theo dõi Đại Hạn 10 năm & Lưu Niên từng năm: Nhận diện thời điểm chuyển vận và bài học cuộc đời.',
      'Đối thoại tự nhiên: Hỏi đáp trực tiếp về lá số («Năm nay đổi việc được không?», «Khi nào kết hôn thì thuận lợi?»).',
    ],
  },
  {
    tag: 'NHẬN DIỆN CÁCH CỤC',
    title: 'Tự Động Phát Hiện\nCác Cách Cục Kinh Điển',
    subtitle: 'Đối chiếu hơn 1100 dòng quy tắc để tìm ra điểm sáng độc bản trong lá số của bạn',
    points: [
      'Tự động quét và nhận diện các đại cách cục: Tử Phủ Đồng Cung, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Nhật Nguyệt Tịnh Minh, Vũ Khúc Thất Sát...',
      'Nhận diện chuẩn xác các cách phụ tinh đặc thù: Tả Hữu Giáp Mệnh, Nhật Nguyệt Chiếu Bích, Kình Đà Hiệp Kỵ, Hỏa Tham Bạo Phát...',
      'Phân tầng cách cục theo cấp độ (Thượng Cách, Cát Cách, Biến Cách, Phá Cách) đi kèm trích dẫn nguyên văn cổ tịch.',
      'Hiểu rõ cả ưu thế vượt trội lẫn thử thách ngầm để chủ động tu dưỡng và ứng biến.',
    ],
  },
];

// ─── 4 Khối Tri Thức Lớn ─────────────────────────────────
export const SECTIONS = [
  {
    key: 'ziwei',
    name: 'Tử Vi',
    cn: '紫微',
    desc: '14 Chính Tinh · 12 Cung Chức · Tam Hợp Phái Chính Tông',
    status: 'ready' as const,
    when: 'Hiện có',
    icon: '◉',
  },
  {
    key: 'tianji',
    name: 'Thiên Kỷ',
    cn: '天纪',
    desc: 'Tử Vi Đẩu Số · Chu Dịch 64 Quẻ · Khảo Cứu Thiên Văn Thời Vận',
    status: 'ready' as const,
    when: 'Tích hợp',
    icon: '⊙',
  },
  {
    key: 'diji',
    name: 'Địa Kỷ',
    cn: '地纪',
    desc: 'Dương Trạch Phong Thủy · Bố Trí Càn Khôn · Phương Vị Nhà Ở',
    status: 'ready' as const,
    when: 'Tích hợp',
    icon: '⊞',
  },
  {
    key: 'renji',
    name: 'Nhân Kỷ',
    cn: '人纪',
    desc: 'Nội Kinh · Thương Hàn · Tử Ngọ Lưu Chú · Phòng Tránh Bệnh Tật',
    status: 'ready' as const,
    when: 'Tích hợp',
    icon: '⊕',
  },
];

export const STAR_VI_INFO: Record<string, { attr: string; brief: string }> = {
  'Tử Vi': { attr: 'Thổ · Đế Vương Chi Tinh', brief: 'Bắc Đẩu Chủ Tinh, khí chất tôn quý, có tài lãnh đạo tổ chức, phong thái quân vương, độc lập tự chủ.' },
  'Thiên Cơ': { attr: 'Mộc · Trí Huệ Chi Tinh', brief: 'Chủ mưu lược, quyền biến, phản ứng nhạy bén, tâm tính linh hoạt, hợp nghiên cứu, cố vấn, kỹ thuật cao.' },
  'Thái Dương': { attr: 'Hỏa · Quang Minh Chi Tinh', brief: 'Quang minh chính đại, khẳng khái, quang chiếu muôn phương, chủ quý khí và danh vọng, thích phụng sự xã hội.' },
  'Vũ Khúc': { attr: 'Kim · Tài Bạch Chi Tinh', brief: 'Tài tinh cương trực, quyết đoán, thực tế và hành động dứt khoát, hợp tài chính, quân đội, kinh doanh độc lập.' },
  'Thiên Đồng': { attr: 'Thủy · Phúc Đức Chi Tinh', brief: 'Chủ phúc thọ, tính tình ôn hòa, nhân ái, có khiếu thẩm mỹ, hưởng thụ an nhàn, biết dung hòa đối nhân xử thế.' },
  'Liêm Trinh': { attr: 'Hỏa · Thứ Đào Hoa & Quyền Tinh', brief: 'Đa tài đa nghệ, cá tính kiên cường, liêm khiết chính trực nhưng cảm xúc mãnh liệt, vừa chủ quan lộc vừa chủ nghệ thuật.' },
  'Thiên Phủ': { attr: 'Thổ · Lệnh Tinh & Tài Khố', brief: 'Kho tiền của trời, tính tình điềm đạm, cẩn trọng, tích lũy vững vàng, giữ chữ tín, là chỗ dựa đáng tin cậy.' },
  'Thái Âm': { attr: 'Thủy · Phú Tinh & Điền Trạch', brief: 'Chủ phú quý, dịu dàng, nội tâm sâu sắc, có duyên với đất đai nhà cửa, ưa yên tĩnh và nghệ thuật tinh tế.' },
  'Tham Lang': { attr: 'Thủy/Mộc · Chính Đào Hoa', brief: 'Đam mê khám phá, hùng tâm tráng chí, ngoại giao xuất sắc, tài hoa đa năng, có duyên đặc biệt với huyền học tâm linh.' },
  'Cự Môn': { attr: 'Thủy · Ám Tinh & Khẩu Tài', brief: 'Chủ về tài hùng biện, tư duy phản biện sắc bén, có năng lực nhìn thấu bản chất vấn đề, hợp nghề luật sư, giáo dục.' },
  'Thiên Tướng': { attr: 'Thủy · Ấn Tinh & Tướng Tinh', brief: 'Chủ công chính, trợ tá đắc lực, biết người biết ta, phong thái tao nhã, hợp công tác quản lý hành chính, ngoại giao.' },
  'Thiên Lương': { attr: 'Thổ · Ấm Tinh & Dược Tinh', brief: 'Chủ che chở, giải ách trừ nguy, tính tình thanh cao, có phong thái tiền bối, duyên sâu với y học và giáo dục.' },
  'Thất Sát': { attr: 'Kim/Hỏa · Tướng Tinh Tiên Phong', brief: 'Dũng cảm, quyết đoán, dám nghĩ dám làm, không ngại gian khổ, có khả năng khai phá thị trường và lập nên nghiệp lớn.' },
  'Phá Quân': { attr: 'Thủy · Tiên Phong Khai Phá', brief: 'Chủ phá cũ lập mới, tiên phong đột phá, can đảm thay đổi cục diện, có sức sáng tạo mạnh mẽ và ý chí kiên cường.' },
};

// ─── Màu sắc giao diện ───────────────────────────────────
export function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase: d ? '#04070e' : '#f7f2e7',
    navBg: d ? '#04070e' : '#f7f2e7',
    navBorder: d ? 'rgba(212,168,67,0.18)' : 'rgba(160,120,30,0.2)',
    goldGrad: d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
      : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    goldSolid: d ? '#d4a843' : '#8b6410',
    goldLine: d ? 'rgba(212,168,67,0.35)' : 'rgba(140,100,20,0.35)',
    tagText: d ? 'rgba(212,168,67,0.75)' : 'rgba(120,80,10,0.75)',
    textPrimary: d ? '#e8eef6' : '#1a1d24',
    textSecond: d ? '#b8c6df' : '#3a3f4a',
    textMuted: d ? '#9db0d0' : '#5a6275',
    textFaint: d ? 'rgba(240,246,255,0.56)' : '#9da4b3',
    accent: d ? '#3a78d4' : '#3a5a82',
    accentSoft: d ? 'rgba(58,120,212,0.18)' : 'rgba(58,90,130,0.10)',
    cardBg: d ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.88)',
    cardBorder: d ? 'rgba(212,168,67,0.18)' : 'rgba(200,160,60,0.25)',
    cardShadow: d ? '0 4px 32px rgba(0,0,0,0.5)' : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg: d ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.75)',
    featureBord: d ? 'rgba(212,168,67,0.15)' : 'rgba(200,160,60,0.2)',
    glowTint: d ? 'rgba(212,168,67,0.08)' : 'rgba(180,140,40,0.06)',
    glowBlue: d ? 'rgba(40,80,160,0.12)' : 'rgba(58,90,130,0.06)',
    glowPurple: d ? 'rgba(120,50,180,0.08)' : 'rgba(96,80,140,0.04)',
    starBg: d ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
    starBorder: d ? 'rgba(212,168,67,0.25)' : 'rgba(160,120,30,0.3)',
    starText: d ? 'rgba(212,168,67,0.85)' : 'rgba(120,80,10,0.85)',
    ctaBg: d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
      : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText: d ? '#08080a' : '#f8f3e8',
    scrollLine: d ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.3)',
    scrollText: d ? 'rgba(255,255,255,0.2)' : '#c0a870',
    altSection: d ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.4)',
  };
}
export type HomeColors = ReturnType<typeof useColors>;
