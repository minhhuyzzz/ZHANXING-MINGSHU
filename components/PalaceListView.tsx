'use client';
import { motion } from 'framer-motion';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import {
  STAR_VI_MAP,
  getPalaceVi,
  getStarVi,
  getBrightnessVi,
  getSiHuaShortVi,
  STEM_VI_MAP,
  BRANCH_VI_MAP,
} from '@/lib/ziwei/vietnamese';

interface PalaceListViewProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  onPalaceSelect?: (palace: Palace) => void;
}

const PALACE_ROLES_SHORT: Record<string, string> = {
  '命宫':   'Cốt cách, bản tính, tiên thiên vận',
  '兄弟':   'Anh em, đồng sự, bạn tri kỷ',
  '夫妻':   'Tình cảm hôn nhân, bạn đời',
  '子女':   'Con cái, học trò, hậu bối',
  '财帛':   'Dòng tiền, của cải, cách kiếm tiền',
  '疾厄':   'Thể chất, tạng phủ, kinh lạc',
  '迁移':   'Đối ngoại, đi xa, giao thiệp phương xa',
  '交友':   'Bạn bè, cấp dưới, người trợ lực',
  '仆役':   'Bạn bè, cấp dưới, người trợ lực',
  '官禄':   'Sự nghiệp, danh vị, công việc',
  '田宅':   'Nhà cửa, đất đai, két sắt gia sản',
  '福德':   'Đời sống tinh thần, phúc ấm tổ tiên',
  '父母':   'Cha mẹ, trưởng bối, bằng cấp văn thư',
};

const SIHUA_BADGE_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  '禄': { bg: 'rgba(74,222,128,0.12)', text: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  '权': { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.3)' },
  '科': { bg: 'rgba(250,204,21,0.12)', text: '#facc15', border: 'rgba(250,204,21,0.3)' },
  '忌': { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.3)' },
};

const BRIGHTNESS_STYLE: Record<string, string> = {
  'bright': 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  'normal': 'text-slate-300 bg-slate-300/10 border-slate-300/20',
  'dim':    'text-slate-500 bg-slate-500/10 border-slate-500/20',
};

export default function PalaceListView({ chart, selectedPalace, onPalaceSelect }: PalaceListViewProps) {
  // Thứ tự hiển thị ưu tiên: Mệnh Cung lên đầu, kế đến Tam Phương Tứ Chính, rồi các cung còn lại
  const mingBranch = chart.mingGongBranch;
  const sanFangBranches = [mingBranch, (mingBranch + 4) % 12, (mingBranch + 8) % 12, (mingBranch + 6) % 12];

  // Sắp xếp cung: Mệnh -> Quan -> Tài -> Di -> Phu Thê -> Phúc Đức -> Điền Trạch -> Tật Ách -> Tử Tức -> Huynh Đệ -> Nô Bộc -> Phụ Mẫu
  const PALACE_SORT_ORDER = ['命宫', '官禄', '财帛', '迁移', '夫妻', '福德', '田宅', '疾厄', '子女', '兄弟', '交友', '父母'];
  
  const sortedPalaces = [...chart.palaces].sort((a, b) => {
    const aClean = a.name.replace('宫', '');
    const bClean = b.name.replace('宫', '');
    const idxA = PALACE_SORT_ORDER.indexOf(aClean) !== -1 ? PALACE_SORT_ORDER.indexOf(aClean) : PALACE_SORT_ORDER.indexOf(a.name);
    const idxB = PALACE_SORT_ORDER.indexOf(bClean) !== -1 ? PALACE_SORT_ORDER.indexOf(bClean) : PALACE_SORT_ORDER.indexOf(b.name);
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
  });

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-[11px] px-1" style={{ color: 'var(--t-faint)' }}>
        <span>Danh sách 12 Cung Vị (Click để xem chi tiết)</span>
        <span className="text-[10px]">Đã sắp theo trọng tâm mệnh bàn</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {sortedPalaces.map((pal, idx) => {
          const isSelected = selectedPalace?.branch === pal.branch;
          const isSanFang = sanFangBranches.includes(pal.branch);
          const majorStars = pal.stars.filter(s => s.type === 'major');
          const luckyStars = pal.stars.filter(s => s.type === 'lucky');
          const shaStars = pal.stars.filter(s => s.type === 'sha');
          const cleanName = pal.name.replace('宫', '');
          const roleDesc = PALACE_ROLES_SHORT[cleanName] || PALACE_ROLES_SHORT[pal.name] || 'Cung vị trọng yếu';

          const stemName = STEMS[pal.stem] || '';
          const branchName = BRANCHES[pal.branch] || '';
          const stemVi = STEM_VI_MAP[stemName] || stemName;
          const branchVi = BRANCH_VI_MAP[branchName] || branchName;

          return (
            <motion.div
              key={pal.branch}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onPalaceSelect?.(pal)}
              className="p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(37,99,235,0.06) 100%)'
                  : pal.isCurrentDaXian
                  ? 'rgba(147,51,234,0.08)'
                  : pal.isMingGong
                  ? 'rgba(212,168,67,0.08)'
                  : 'var(--t-card)',
                borderColor: isSelected
                  ? 'rgba(37,99,235,0.5)'
                  : pal.isMingGong
                  ? 'rgba(212,168,67,0.35)'
                  : 'var(--t-border)',
                boxShadow: isSelected ? '0 0 15px rgba(37,99,235,0.15)' : 'none',
              }}
            >
              {/* Header Cung */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[13px]" style={{ color: pal.isMingGong ? 'var(--t-gold)' : 'var(--t-text)' }}>
                    {getPalaceVi(pal.name)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--t-surface)', color: 'var(--t-faint)' }}>
                    {stemVi} {branchVi} ({stemName}{branchName})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {pal.isMingGong && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(212,168,67,0.18)', color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.3)' }}>
                      Mệnh
                    </span>
                  )}
                  {pal.isShenGong && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)' }}>
                      Thân
                    </span>
                  )}
                  {pal.isCurrentDaXian && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)' }}>
                      Đại Hạn ({pal.daXianAge})
                    </span>
                  )}
                  {isSanFang && !pal.isMingGong && (
                    <span className="text-[9px] px-1 py-0.5 rounded text-blue-400 opacity-70">
                      Tam phương
                    </span>
                  )}
                </div>
              </div>

              {/* Tóm tắt vai trò cung */}
              <div className="text-[10px] mb-2.5 line-clamp-1" style={{ color: 'var(--t-faint)' }}>
                {roleDesc}
              </div>

              {/* Danh sách Chính Tinh */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {majorStars.length > 0 ? (
                  majorStars.map(s => {
                    const brightVi = getBrightnessVi(s.brightnessRaw);
                    const bStyle = BRIGHTNESS_STYLE[s.brightness || 'normal'];
                    const sihuaStyle = s.siHua ? SIHUA_BADGE_STYLE[s.siHua] : null;

                    return (
                      <div
                        key={s.name}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium"
                        style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)' }}
                      >
                        <span className="font-semibold text-amber-300">{getStarVi(s.name)}</span>
                        {brightVi && (
                          <span className={`text-[8px] px-1 py-px rounded border ${bStyle}`}>
                            {brightVi}
                          </span>
                        )}
                        {s.siHua && sihuaStyle && (
                          <span
                            className="text-[8px] font-bold px-1 py-px rounded border"
                            style={{ background: sihuaStyle.bg, color: sihuaStyle.text, borderColor: sihuaStyle.border }}
                          >
                            Hóa {getSiHuaShortVi(s.siHua)}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-[11px] italic" style={{ color: 'var(--t-faint)' }}>
                    Vô Chính Diệu (mượn tinh diệu đối cung)
                  </span>
                )}
              </div>

              {/* Phụ tinh Cát & Sát */}
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] pt-2 border-t" style={{ borderColor: 'var(--t-border)' }}>
                {luckyStars.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] opacity-60 text-emerald-400">Cát:</span>
                    <span className="text-emerald-300 font-medium">
                      {luckyStars.map(s => getStarVi(s.name)).join(', ')}
                    </span>
                  </div>
                )}
                {shaStars.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] opacity-60 text-red-400">Sát:</span>
                    <span className="text-red-300 font-medium">
                      {shaStars.map(s => getStarVi(s.name)).join(', ')}
                    </span>
                  </div>
                )}
                {luckyStars.length === 0 && shaStars.length === 0 && (
                  <span className="text-[9px]" style={{ color: 'var(--t-faint)' }}>Không có phụ tinh trọng yếu</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
