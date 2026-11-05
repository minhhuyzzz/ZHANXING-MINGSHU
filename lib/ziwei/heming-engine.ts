/**
 * lib/ziwei/heming-engine.ts
 * Động Cơ Tính Toán & Phân Tích Song Tinh Bàn Hợp Mệnh ZHANXING MINGSHU
 * Hệ thống chiêm tinh toàn diện dựa trên:
 * - Thuyết Âm Dương Ngũ Hành Nạp Âm & Can Chi Tương Khảo
 * - Cung Mệnh - Phu Thê - Phúc Đức Tam Giác Trọng Yếu
 * - Tứ Hóa Phi Nhập Tương Hỗ (Phi Lộc, Phi Quyền, Phi Khoa, Phi Kỵ)
 * - Y Đạo & Dương Trạch Phong Thủy Nghê Hải Hà (Thiên Kỷ)
 */

import type { ZiweiChart, Palace, Star } from './types';
import { STEMS, BRANCHES } from './constants';
import { getStarVi, getPalaceVi, getBrightnessVi, getWuXingJuVi } from './vietnamese';
import { STAR_IN_FUQI_GU } from './heming-knowledge';

export interface RadarScores {
  tamTinh: number;    // Tâm Tính & Khí Chất (0-100)
  taiVan: number;     // Tài Vận & Điền Trạch (0-100)
  tinhDuyen: number;  // Tình Cảm & Duyên Nợ (0-100)
  phucDuc: number;    // Phúc Đức & Nghiệp Duyên (0-100)
  suNghiep: number;   // Sự Nghiệp & Hợp Tác (0-100)
  phongThuy: number;  // Phong Thủy & Hòa Hợp (0-100)
}

export interface CompatibilityFactor {
  title: string;
  score: number;
  maxScore: number;
  status: 'good' | 'neutral' | 'warn';
  summary: string;
  detail: string;
}

export interface CompatibilityResult {
  totalScore: number;
  level: string;
  levelColor: string;
  levelDesc: string;
  radarScores: RadarScores;
  factors: {
    napAm: CompatibilityFactor;
    diaChi: CompatibilityFactor;
    thienCan: CompatibilityFactor;
    phuTheMing: CompatibilityFactor;
    tuHoaPhiTinh: CompatibilityFactor;
    phucDuc: CompatibilityFactor;
  };
}

export interface PalaceComparison {
  id: string;
  nameVi: string;
  nameCn: string;
  palaceA: Palace | undefined;
  palaceB: Palace | undefined;
  starsA: string[];
  starsB: string[];
  branchA: string;
  branchB: string;
  status: 'synergy' | 'complement' | 'caution';
  statusText: string;
  score: number;
  synergyTitle: string;
  insight: string;
}

// ── BẢNG TỨ HÓA THEO THIÊN CAN ──
export const GAN_SIHUA: Record<string, { lu: string; quan: string; ke: string; ji: string }> = {
  'Giáp': { lu: 'Liêm Trinh', quan: 'Phá Quân', ke: 'Vũ Khúc', ji: 'Thái Dương' },
  'Ất': { lu: 'Thiên Cơ', quan: 'Thiên Lương', ke: 'Tử Vi', ji: 'Thái Âm' },
  'Bính': { lu: 'Thiên Đồng', quan: 'Thiên Cơ', ke: 'Văn Xương', ji: 'Liêm Trinh' },
  'Đinh': { lu: 'Thái Âm', quan: 'Thiên Đồng', ke: 'Thiên Cơ', ji: 'Cự Môn' },
  'Mậu': { lu: 'Tham Lang', quan: 'Thái Âm', ke: 'Hữu Bật', ji: 'Thiên Cơ' },
  'Kỷ': { lu: 'Vũ Khúc', quan: 'Tham Lang', ke: 'Thiên Lương', ji: 'Văn Khúc' },
  'Canh': { lu: 'Thái Dương', quan: 'Vũ Khúc', ke: 'Thái Âm', ji: 'Thiên Đồng' },
  'Tân': { lu: 'Cự Môn', quan: 'Thái Dương', ke: 'Văn Khúc', ji: 'Văn Xương' },
  'Nhâm': { lu: 'Thiên Lương', quan: 'Tử Vi', ke: 'Tả Phụ', ji: 'Vũ Khúc' },
  'Quý': { lu: 'Phá Quân', quan: 'Cự Môn', ke: 'Thái Âm', ji: 'Tham Lang' },
};

export const STEM_VI_MAP: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
};

export const BRANCH_VI_MAP: Record<string, string> = {
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão',
  '辰': 'Thìn', '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi',
  '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
};

// ── QUY TẮC NGŨ HÀNH CỤC SỐ / NẠP ÂM ──
const ELEMENT_MAP: Record<string, 'Kim' | 'Moc' | 'Thuy' | 'Hoa' | 'Tho'> = {
  '金': 'Kim', '金四局': 'Kim',
  '木': 'Moc', '木三局': 'Moc',
  '水': 'Thuy', '水二局': 'Thuy',
  '火': 'Hoa', '火六局': 'Hoa',
  '土': 'Tho', '土五局': 'Tho',
};

function getElementRelation(elA: string, elB: string): { relation: 'sinh' | 'dong' | 'khac'; score: number; text: string } {
  const a = ELEMENT_MAP[elA[0]] || 'Thuy';
  const b = ELEMENT_MAP[elB[0]] || 'Thuy';

  if (a === b) {
    return { relation: 'dong', score: 8, text: `Đồng hành (${a} hòa ${b}) — Tính khí tương đồng, dễ đồng cảm nhưng cần bổ trợ sự linh hoạt.` };
  }

  const sinhPairs: Record<string, string> = {
    'Kim': 'Thuy', 'Thuy': 'Moc', 'Moc': 'Hoa', 'Hoa': 'Tho', 'Tho': 'Kim',
  };

  if (sinhPairs[a] === b || sinhPairs[b] === a) {
    const whoSinhWho = sinhPairs[a] === b ? `${a} sinh ${b}` : `${b} sinh ${a}`;
    return { relation: 'sinh', score: 14, text: `Tương sinh (${whoSinhWho}) — Đại cát! Một bên nuôi dưỡng, trợ lực đắc lực cho khí vận của đối phương.` };
  }

  return { relation: 'khac', score: -6, text: `Tương khắc (${a} khắc ${b}) — Thử thách! Hai bên cần dùng sự nhường nhịn và phong thủy phòng ngủ để hóa giải.` };
}

// ── QUY TẮC ĐỊA CHI (12 CON GIÁP) ──
const TAM_HOP: number[][] = [
  [8, 0, 4],   // Thân (8) - Tý (0) - Thìn (4): Thủy cục
  [2, 6, 10],  // Dần (2) - Ngọ (6) - Tuất (10): Hỏa cục
  [5, 9, 1],   // Tỵ (5) - Dậu (9) - Sửu (1): Kim cục
  [11, 3, 7],  // Hợi (11) - Mão (3) - Mùi (7): Mộc cục
];

const LUC_HOP: [number, number][] = [
  [0, 1],   // Tý - Sửu
  [2, 11],  // Dần - Hợi
  [3, 10],  // Mão - Tuất
  [4, 9],   // Thìn - Dậu
  [5, 8],   // Tỵ - Thân
  [6, 7],   // Ngọ - Mùi
];

const LUC_XUNG: [number, number][] = [
  [0, 6],   // Tý - Ngọ
  [1, 7],   // Sửu - Mùi
  [2, 8],   // Dần - Thân
  [3, 9],   // Mão - Dậu
  [4, 10],  // Thìn - Tuất
  [5, 11],  // Tỵ - Hợi
];

const LUC_HAI: [number, number][] = [
  [0, 7],   // Tý - Mùi
  [1, 6],   // Sửu - Ngọ
  [2, 5],   // Dần - Tỵ
  [3, 4],   // Mão - Thìn
  [8, 11],  // Thân - Hợi
  [9, 10],  // Dậu - Tuất
];

function getBranchRelation(brA: number, brB: number): { status: 'tam_hop' | 'luc_hop' | 'luc_xung' | 'luc_hai' | 'binh'; score: number; text: string } {
  const nameA = BRANCH_VI_MAP[BRANCHES[brA]] || 'Chi A';
  const nameB = BRANCH_VI_MAP[BRANCHES[brB]] || 'Chi B';

  for (const group of TAM_HOP) {
    if (group.includes(brA) && group.includes(brB)) {
      return { status: 'tam_hop', score: 14, text: `Tam Hợp (${nameA} - ${nameB}) — Đắc thiên thời chi phối, tư tưởng và lối sống hòa hợp tự nhiên.` };
    }
  }

  for (const [x, y] of LUC_HOP) {
    if ((brA === x && brB === y) || (brA === y && brB === x)) {
      return { status: 'luc_hop', score: 12, text: `Lục Hợp (${nameA} - ${nameB}) — Quý nhân tương hợp, tình cảm gắn bó khăng khít, bổ trợ gia đạo.` };
    }
  }

  for (const [x, y] of LUC_XUNG) {
    if ((brA === x && brB === y) || (brA === y && brB === x)) {
      return { status: 'luc_xung', score: -10, text: `Lục Xung (${nameA} xung ${nameB}) — Trực xung đối lập! Dễ nảy sinh bất đồng trong cách hành xử, cần học cách lắng nghe.` };
    }
  }

  for (const [x, y] of LUC_HAI) {
    if ((brA === x && brB === y) || (brA === y && brB === x)) {
      return { status: 'luc_hai', score: -7, text: `Lục Hại (${nameA} hại ${nameB}) — Dễ sinh hiểu lầm âm thầm, cần thẳng thắn chia sẻ mọi băn khoăn.` };
    }
  }

  return { status: 'binh', score: 5, text: `Bình hòa (${nameA} và ${nameB}) — Không xung không hại, nền tảng do hai người chủ động bồi đắp.` };
}

// ── QUY TẮC THIÊN CAN ──
const CAN_NGU_HOP: [number, number][] = [
  [0, 5], // Giáp (0) - Kỷ (5) hợp Thổ
  [1, 6], // Ất (1) - Canh (6) hợp Kim
  [2, 7], // Bính (2) - Tân (7) hợp Thủy
  [3, 8], // Đinh (3) - Nhâm (8) hợp Mộc
  [4, 9], // Mậu (4) - Quý (9) hợp Hỏa
];

function getStemRelation(stemA: number, stemB: number): { status: 'ngu_hop' | 'tuong_khac' | 'binh'; score: number; text: string } {
  const nameA = STEM_VI_MAP[STEMS[stemA]] || 'Can A';
  const nameB = STEM_VI_MAP[STEMS[stemB]] || 'Can B';

  for (const [x, y] of CAN_NGU_HOP) {
    if ((stemA === x && stemB === y) || (stemA === y && stemB === x)) {
      return { status: 'ngu_hop', score: 10, text: `Thiên Can Ngũ Hợp (${nameA} hợp ${nameB}) — Tinh thần hòa hợp, ý chí đồng lòng, cùng nhìn về một mục tiêu.` };
    }
  }

  // Tương khắc thiên can (cách nhau 4 hoặc 6)
  const diff = Math.abs(stemA - stemB);
  if (diff === 4 || diff === 6) {
    return { status: 'tuong_khac', score: -5, text: `Thiên Can Tương Khắc (${nameA} khắc ${nameB}) — Đôi khi chí hướng có điểm bất đồng, cần tôn trọng không gian riêng.` };
  }

  return { status: 'binh', score: 4, text: `Thiên Can Bình Hòa (${nameA} và ${nameB}) — Hợp tác thuận lợi, bình ổn phát triển.` };
}

// ── TÍNH TOÁN ĐẦY ĐỦ CHỈ SỐ HÒA HỢP & 6 TRỤC RADAR ──
export function calculateCompatibility(chartA: ZiweiChart, chartB: ZiweiChart): CompatibilityResult {
  const juA = chartA.wuxingJuName;
  const juB = chartB.wuxingJuName;
  const stemIdxA = chartA.lunarInfo.yearStem;
  const stemIdxB = chartB.lunarInfo.yearStem;
  const branchIdxA = chartA.lunarInfo.yearBranch;
  const branchIdxB = chartB.lunarInfo.yearBranch;

  const yearA = chartA.birthInfo?.year || 1990;
  const yearB = chartB.birthInfo?.year || 1990;
  const ageDiff = Math.abs(yearA - yearB);

  // 1. Nạp Âm Ngũ Hành
  const napAmRel = getElementRelation(juA, juB);

  // 2. Địa Chi
  const branchRel = getBranchRelation(branchIdxA, branchIdxB);

  // 3. Thiên Can
  const stemRel = getStemRelation(stemIdxA, stemIdxB);

  // 4. Cung Mệnh & Phu Thê
  const mingA = chartA.palaces.find(p => p.branch === chartA.mingGongBranch);
  const mingB = chartB.palaces.find(p => p.branch === chartB.mingGongBranch);
  const fuqiA = chartA.palaces.find(p => p.name === '夫妻');
  const fuqiB = chartB.palaces.find(p => p.name === '夫妻');

  const starNameA = mingA?.stars.find(s => s.type === 'major')?.name || 'Vô Chính Diệu';
  const starNameB = mingB?.stars.find(s => s.type === 'major')?.name || 'Vô Chính Diệu';
  const fuqiStarA = fuqiA?.stars.find(s => s.type === 'major')?.name || '';
  const fuqiStarB = fuqiB?.stars.find(s => s.type === 'major')?.name || '';

  let phuTheScore = 6;
  let phuTheSummary = 'Mệnh & Phu Thê phối hợp tương dung, kỳ vọng lứa đôi thực tế.';
  if (fuqiStarA && (starNameB.includes(fuqiStarA) || fuqiStarA.includes(starNameB))) {
    phuTheScore += 6;
    phuTheSummary = `Trúng ý tương hợp: Hình mẫu bạn đời trong cung Phu Thê tương hợp trực tiếp với khí chất bản mệnh đối phương!`;
  }
  const hasBadStarsInFuqi = (p?: Palace) => p?.stars.some(s => ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'].includes(s.name));
  if (hasBadStarsInFuqi(fuqiA) || hasBadStarsInFuqi(fuqiB)) {
    phuTheScore -= 4;
    phuTheSummary += ' (Cung Phu Thê có sát tinh, nên kết hôn muộn để tôi luyện tình cảm vững bền).';
  }

  // 5. Tứ Hóa Phi Nhập
  const stemNameA = STEMS[stemIdxA] || '甲';
  const stemNameB = STEMS[stemIdxB] || '甲';
  const ganA = STEM_VI_MAP[stemNameA] || 'Giáp';
  const ganB = STEM_VI_MAP[stemNameB] || 'Giáp';
  const sihuaA = GAN_SIHUA[ganA] || GAN_SIHUA['Giáp'];
  const sihuaB = GAN_SIHUA[ganB] || GAN_SIHUA['Giáp'];

  const palaceWithStarInB = (starName: string) => {
    const p = chartB.palaces.find(pal => pal.stars.some(s => s.name === starName || getStarVi(s.name) === starName));
    return p ? getPalaceVi(p.name) : 'Cung Vị Khác';
  };
  const palaceWithStarInA = (starName: string) => {
    const p = chartA.palaces.find(pal => pal.stars.some(s => s.name === starName || getStarVi(s.name) === starName));
    return p ? getPalaceVi(p.name) : 'Cung Vị Khác';
  };

  const aLuInB = palaceWithStarInB(sihuaA.lu);
  const aJiInB = palaceWithStarInB(sihuaA.ji);
  const bLuInA = palaceWithStarInA(sihuaB.lu);
  const bJiInA = palaceWithStarInA(sihuaB.ji);

  let tuHoaScore = 8;
  let tuHoaSummary = `Tứ Hóa giao thoa tương hỗ, Lộc Kỵ phân minh.`;
  if (aLuInB.includes('Mệnh') || aLuInB.includes('Tài') || aLuInB.includes('Quan') || aLuInB.includes('Điền')) {
    tuHoaScore += 4;
    tuHoaSummary = `Bên A phóng Phi Lộc vào ${aLuInB} của Bên B: Trợ lực tài lộc và phúc thọ cực lớn. `;
  }
  if (bLuInA.includes('Mệnh') || bLuInA.includes('Tài') || bLuInA.includes('Quan') || bLuInA.includes('Điền')) {
    tuHoaScore += 4;
    tuHoaSummary += `Bên B phóng Phi Lộc vào ${bLuInA} của Bên A: Hậu phương vượng phát gia đạo.`;
  }
  if (aJiInB.includes('Mệnh') || bJiInA.includes('Mệnh')) {
    tuHoaScore -= 4;
    tuHoaSummary += ` (Có Phi Kỵ nhập cung vị trọng yếu, cần nhẫn nại hóa giải).`;
  }

  // 6. Phúc Đức
  const fudeA = chartA.palaces.find(p => p.name === '福德');
  const fudeB = chartB.palaces.find(p => p.name === '福德');
  let phucDucScore = 8;
  let phucDucSummary = 'Nền tảng Phúc Đức gia đạo hai bên vững chãi, trọng đạo lý.';
  if (ageDiff >= 7) {
    phucDucScore += 4;
    phucDucSummary += ' (Đặc cách chênh lệch từ 7 tuổi trở lên: Dương số chuyển hóa, tâm lý nhường nhịn bao dung).';
  }

  // TỔNG ĐIỂM
  // Điểm cơ bản là 55, cộng trừ theo các tiêu chí thực tế
  let rawScore = 55 + napAmRel.score + branchRel.score + stemRel.score + phuTheScore + tuHoaScore + phucDucScore;
  if (rawScore > 96) rawScore = 96;
  if (rawScore < 45) rawScore = 45;

  // Xác định Cấp bậc
  let level = 'Thiên Tác Chi Hợp';
  let levelColor = '#eab308'; // Vàng kim rực rỡ
  let levelDesc = 'Duyên số trời định, âm dương cân bằng, tương trợ cùng nhau kiến tạo sự nghiệp và gia tài hưng thịnh.';

  if (rawScore < 65) {
    level = 'Nghịch Duyên Tu Dưỡng';
    levelColor = '#f97316'; // Cam cảnh báo
    levelDesc = 'Duyên nợ chứa đựng nhiều thử thách tôi luyện. Cần tu dưỡng tính nhẫn nại, chia sẻ cởi mở và bố trí phong thủy phòng ngủ Tây Bắc để chuyển hung thành cát.';
  } else if (rawScore < 78) {
    level = 'Bình Hòa Tương Bổ';
    levelColor = '#38bdf8'; // Xanh lam thanh nhã
    levelDesc = 'Tương sinh tương khắc đan xen. Hai bạn có thể đồng hành lâu dài nhờ sự nhường nhịn, tôn trọng cá tính và hỗ trợ nhau bù đắp khuyết điểm.';
  } else if (rawScore < 88) {
    level = 'Mỹ Mãn Hòa Mục';
    levelColor = '#10b981'; // Xanh ngọc cát lợi
    levelDesc = 'Tam phương tứ chính hội tụ nhiều cát lành, gia đạo yên vui, tài lộc tích lũy đều đặn, con cái ngoan ngoãn hiếu thuận.';
  }

  // Tính toán 6 Trục Radar (0 - 100)
  const clamp = (val: number) => Math.min(98, Math.max(48, Math.round(val)));
  const radarScores: RadarScores = {
    tamTinh: clamp(55 + branchRel.score * 1.8 + stemRel.score * 1.5),
    taiVan: clamp(58 + (aLuInB.includes('Tài') || bLuInA.includes('Tài') ? 16 : 6) + (napAmRel.relation === 'sinh' ? 12 : 2)),
    tinhDuyen: clamp(52 + phuTheScore * 2.5 + (ageDiff >= 7 ? 8 : 2)),
    phucDuc: clamp(60 + phucDucScore * 2.2 + (branchRel.status === 'tam_hop' ? 10 : 0)),
    suNghiep: clamp(54 + (aLuInB.includes('Quan') || bLuInA.includes('Quan') ? 16 : 6) + stemRel.score * 1.6),
    phongThuy: clamp(65 + (ageDiff >= 7 ? 12 : 4) + (napAmRel.relation === 'sinh' ? 10 : -4)),
  };

  return {
    totalScore: rawScore,
    level,
    levelColor,
    levelDesc,
    radarScores,
    factors: {
      napAm: {
        title: 'Nạp Âm Ngũ Hành',
        score: napAmRel.score,
        maxScore: 14,
        status: napAmRel.relation === 'sinh' ? 'good' : napAmRel.relation === 'dong' ? 'neutral' : 'warn',
        summary: `${getWuXingJuVi(juA)} (${chartA.birthInfo?.name || 'A'}) vs ${getWuXingJuVi(juB)} (${chartB.birthInfo?.name || 'B'})`,
        detail: napAmRel.text,
      },
      diaChi: {
        title: 'Địa Chi 12 Con Giáp',
        score: branchRel.score,
        maxScore: 14,
        status: branchRel.status === 'tam_hop' || branchRel.status === 'luc_hop' ? 'good' : branchRel.status === 'binh' ? 'neutral' : 'warn',
        summary: `${BRANCH_VI_MAP[BRANCHES[branchIdxA]] || ''} (${yearA}) vs ${BRANCH_VI_MAP[BRANCHES[branchIdxB]] || ''} (${yearB})`,
        detail: branchRel.text,
      },
      thienCan: {
        title: 'Thiên Can Năm Sinh',
        score: stemRel.score,
        maxScore: 10,
        status: stemRel.status === 'ngu_hop' ? 'good' : stemRel.status === 'binh' ? 'neutral' : 'warn',
        summary: `${ganA} vs ${ganB}`,
        detail: stemRel.text,
      },
      phuTheMing: {
        title: 'Cung Mệnh & Cung Phu Thê',
        score: phuTheScore,
        maxScore: 12,
        status: phuTheScore >= 8 ? 'good' : phuTheScore >= 5 ? 'neutral' : 'warn',
        summary: `Mệnh: ${getStarVi(starNameA)} & ${getStarVi(starNameB)}`,
        detail: phuTheSummary,
      },
      tuHoaPhiTinh: {
        title: 'Tứ Hóa Phi Nhập',
        score: tuHoaScore,
        maxScore: 16,
        status: tuHoaScore >= 10 ? 'good' : 'neutral',
        summary: `Phi Lộc ➔ ${aLuInB} / ${bLuInA}`,
        detail: tuHoaSummary,
      },
      phucDuc: {
        title: 'Cung Phúc Đức & Tuổi Tác',
        score: phucDucScore,
        maxScore: 12,
        status: phucDucScore >= 8 ? 'good' : 'neutral',
        summary: `Chênh lệch ${ageDiff} tuổi · Phúc trạch song hành`,
        detail: phucDucSummary,
      },
    },
  };
}

// ── BẢN ĐỒ SO SÁNH 12 CUNG VỊ SONG TINH ĐỘC BẢN ──
export function compare12Palaces(chartA: ZiweiChart, chartB: ZiweiChart): PalaceComparison[] {
  const PALACE_ORDER = [
    { id: 'ming', cn: '命宫', vi: 'Cung Mệnh' },
    { id: 'fuqi', cn: '夫妻', vi: 'Cung Phu Thê' },
    { id: 'cai', cn: '财帛', vi: 'Cung Tài Bạch' },
    { id: 'quan', cn: '官禄', vi: 'Cung Quan Lộc' },
    { id: 'fude', cn: '福德', vi: 'Cung Phúc Đức' },
    { id: 'dian', cn: '田宅', vi: 'Cung Điền Trạch' },
    { id: 'jie', cn: '疾厄', vi: 'Cung Tật Ách' },
    { id: 'qian', cn: '迁移', vi: 'Cung Thiên Di' },
    { id: 'nu', cn: '仆役', vi: 'Cung Nô Bộc' },
    { id: 'zi', cn: '子女', vi: 'Cung Tử Tức' },
    { id: 'xiong', cn: '兄弟', vi: 'Cung Huynh Đệ' },
    { id: 'fumu', cn: '父母', vi: 'Cung Phụ Mẫu' },
  ];

  return PALACE_ORDER.map(item => {
    const palA = chartA.palaces.find(p => p.name === item.cn || p.name === item.cn + '宫');
    const palB = chartB.palaces.find(p => p.name === item.cn || p.name === item.cn + '宫');

    const starsA = palA?.stars.map(s => getStarVi(s.name)) || ['Vô Chính Diệu'];
    const starsB = palB?.stars.map(s => getStarVi(s.name)) || ['Vô Chính Diệu'];
    const branchA = palA ? (BRANCH_VI_MAP[BRANCHES[palA.branch]] || BRANCHES[palA.branch]) : '';
    const branchB = palB ? (BRANCH_VI_MAP[BRANCHES[palB.branch]] || BRANCHES[palB.branch]) : '';

    const hasSihuaLu = (p?: Palace) => p?.stars.some(s => s.siHua === '禄');
    const hasSihuaJi = (p?: Palace) => p?.stars.some(s => s.siHua === '忌');
    const hasSatTinh = (p?: Palace) => p?.stars.some(s => ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'].includes(s.name));

    let status: 'synergy' | 'complement' | 'caution' = 'complement';
    let statusText = 'Tương Bổ Bình Hòa';
    let score = 78;
    let synergyTitle = 'Khí Vận Bình Ổn';
    let insight = `Cung ${item.vi} của hai bên cùng tọa tinh bình hòa, phản ánh phương diện này đời sống hai bạn khá nhịp nhàng, có thể tự chủ điều chỉnh theo thực tế.`;

    if (item.id === 'ming') {
      const starA = starsA[0] || 'Vô Chính Diệu';
      const starB = starsB[0] || 'Vô Chính Diệu';
      status = 'synergy';
      statusText = 'Tâm Tính Tương Dung';
      score = 88;
      synergyTitle = 'Cương Nhu Tương Tế';
      insight = `Bên A mang khí chất **${starA}**, Bên B mang cốt cách **${starB}**. Sự kết hợp giữa hai chính tinh này tạo nên thế cân bằng động: một bên mở lối tiên phong, một bên giữ gìn nền tảng chu toàn.`;
    } else if (item.id === 'fuqi') {
      score = hasSatTinh(palA) || hasSatTinh(palB) ? 68 : 86;
      status = score > 80 ? 'synergy' : 'caution';
      statusText = score > 80 ? 'Duyên Phận Mỹ Mãn' : 'Cần Nhẫn Nại Bồi Đắp';
      synergyTitle = score > 80 ? 'Thiên Duyên Tiền Định' : 'Tôi Luyện Thấu Hiểu';
      insight = `Cung Phu Thê Bên A hội tụ: ${starsA.slice(0, 3).join(', ')}. Bên B hội tụ: ${starsB.slice(0, 3).join(', ')}. Thầy Nghê Hải Hà dạy: nhìn Phu Thê để biết hình mẫu ban đầu, quan trọng nhất là giữ lòng chung thủy và nhường nhịn lời nói khi bất đồng.`;
    } else if (item.id === 'cai') {
      score = (hasSihuaLu(palA) || hasSihuaLu(palB)) ? 92 : 82;
      status = score > 85 ? 'synergy' : 'complement';
      statusText = score > 85 ? 'Tài Lộc Đại Vượng' : 'Tài Vận Ổn Định';
      synergyTitle = 'Hòa Khí Sinh Tài';
      insight = `Cung Tài Bạch Bên A (${starsA.slice(0, 3).join(', ')}) kết hợp Bên B (${starsB.slice(0, 3).join(', ')}): Hai bạn có tư duy tạo dòng tiền thực tế, biết nương tựa nhau để gia tăng thu nhập và nắm bắt cơ hội kinh doanh.`;
    } else if (item.id === 'quan') {
      score = 84;
      statusText = 'Sự Nghiệp Đồng Hành';
      synergyTitle = 'Mưu Hành Hợp Nhất';
      insight = `Cung Quan Lộc đại diện công danh và chí hướng. Hai người có thể san sẻ gánh nặng công việc, một người làm hậu phương hoặc đàm phán chiến lược, một người thực thi dứt khoát.`;
    } else if (item.id === 'dian') {
      score = 86;
      status = 'synergy';
      statusText = 'Gia Khố Thịnh Vượng';
      synergyTitle = 'Tụ Khố Bất Động Sản';
      insight = `Điền Trạch là kho báu giữ của. Thầy Nghê Hải Hà dạy: "Tài Bạch vi ngọc, Điền Trạch vi khố". Tinh diệu Điền Trạch của hai bạn cho thấy sau khi kết hôn dễ tích lũy đất đai và tài sản kiên cố.`;
    } else if (item.id === 'fude') {
      score = (hasSatTinh(palA) || hasSatTinh(palB)) ? 72 : 90;
      status = score > 80 ? 'synergy' : 'caution';
      statusText = score > 80 ? 'Phúc Đức Trường Tồn' : 'Tu Tâm Hóa Giải';
      synergyTitle = 'Mỏ Neo Hôn Nhân';
      insight = `Cung Phúc Đức quyết định 7 phần hạnh phúc dài lâu. Nền tảng tâm đức của hai bên bổ trợ lẫn nhau, giúp vượt qua mọi sóng gió thăng trầm của đời người.`;
    } else if (item.id === 'jie') {
      score = 75;
      statusText = 'Thể Chất Cân Bằng';
      synergyTitle = 'Y Đạo Dưỡng Sinh';
      insight = `Cung Tật Ách đối chiếu tạng phủ theo Ngũ Hành. Hai vợ chồng nên cùng nhau rèn luyện thể thao, ngủ sớm trước 23h (giờ Tý) để kinh Đởm phục hồi nguyên khí.`;
    } else if (item.id === 'zi') {
      score = 88;
      status = 'synergy';
      statusText = 'Hậu Duệ Hiển Đạt';
      synergyTitle = 'Con Cái Hiếu Thuận';
      insight = `Cung Tử Tức phản ánh phúc duyên con cái. Con sinh ra có tư chất thông minh, hưởng phúc ấm từ cha mẹ và là sợi dây kết nối bền chặt gia đình.`;
    }

    return {
      id: item.id,
      nameVi: item.vi,
      nameCn: item.cn,
      palaceA: palA,
      palaceB: palB,
      starsA,
      starsB,
      branchA,
      branchB,
      status,
      statusText,
      score,
      synergyTitle,
      insight,
    };
  });
}

// ── GIẢI ĐÁP BẤT KỲ CÂU HỎI TÙY BIẾN NÀO TỪ NGƯỜI DÙNG ──
export function buildUniversalQuestionAnswer(
  question: string,
  chartA: ZiweiChart,
  chartB: ZiweiChart,
): string {
  const q = question.trim();
  const lowerQ = q.toLowerCase();

  const mingA = chartA.palaces.find(p => p.branch === chartA.mingGongBranch);
  const mingB = chartB.palaces.find(p => p.branch === chartB.mingGongBranch);
  const fuqiA = chartA.palaces.find(p => p.name === '夫妻');
  const fuqiB = chartB.palaces.find(p => p.name === '夫妻');
  const fudeA = chartA.palaces.find(p => p.name === '福德');
  const fudeB = chartB.palaces.find(p => p.name === '福德');
  const caiA = chartA.palaces.find(p => p.name === '财帛');
  const caiB = chartB.palaces.find(p => p.name === '财帛');
  const quanA = chartA.palaces.find(p => p.name === '官禄');
  const quanB = chartB.palaces.find(p => p.name === '官禄');
  const dienA = chartA.palaces.find(p => p.name === '田宅');
  const dienB = chartB.palaces.find(p => p.name === '田宅');
  const noA = chartA.palaces.find(p => p.name === '仆役');
  const noB = chartB.palaces.find(p => p.name === '仆役');
  const tuA = chartA.palaces.find(p => p.name === '子女');
  const tuB = chartB.palaces.find(p => p.name === '子女');
  const phuMauA = chartA.palaces.find(p => p.name === '父母');
  const phuMauB = chartB.palaces.find(p => p.name === '父母');
  const tatAchA = chartA.palaces.find(p => p.name === '疾厄');
  const tatAchB = chartB.palaces.find(p => p.name === '疾厄');

  const nameA = chartA.birthInfo?.name || 'Bên A';
  const nameB = chartB.birthInfo?.name || 'Bên B';
  const yearA = chartA.birthInfo?.year || 1990;
  const yearB = chartB.birthInfo?.year || 1990;
  const ageDiff = Math.abs(yearA - yearB);

  const starNameA = mingA?.stars.find(s => s.type === 'major')?.name || 'Vô Chính Diệu';
  const starNameB = mingB?.stars.find(s => s.type === 'major')?.name || 'Vô Chính Diệu';

  const formatStars = (p?: Palace) => p?.stars.map(s => getStarVi(s.name)).join(', ') || 'Thanh tĩnh';

  const stemNameA = STEMS[chartA.lunarInfo.yearStem] || '甲';
  const stemNameB = STEMS[chartB.lunarInfo.yearStem] || '甲';
  const ganA = STEM_VI_MAP[stemNameA] || 'Giáp';
  const ganB = STEM_VI_MAP[stemNameB] || 'Giáp';
  const sihuaA = GAN_SIHUA[ganA] || GAN_SIHUA['Giáp'];
  const sihuaB = GAN_SIHUA[ganB] || GAN_SIHUA['Giáp'];

  const palaceWithStar = (chart: ZiweiChart, starName: string) => {
    const p = chart.palaces.find(pal => pal.stars.some(s => s.name === starName || getStarVi(s.name) === starName));
    return p ? getPalaceVi(p.name) : 'Cung Vị Khác';
  };
  const aLuInB = palaceWithStar(chartB, sihuaA.lu);
  const aJiInB = palaceWithStar(chartB, sihuaA.ji);
  const bLuInA = palaceWithStar(chartA, sihuaB.lu);
  const bJiInA = palaceWithStar(chartA, sihuaB.ji);

  // 1. TÀI CHÍNH, TIỀN TÀI, AI GIỮ TIỀN, LÀM GIÀU, MUA ĐẤT
  if (
    lowerQ.includes('tài lộc') || lowerQ.includes('tiền') || lowerQ.includes('giàu') ||
    lowerQ.includes('tài chính') || lowerQ.includes('giữ tiền') || lowerQ.includes('tay hòm') ||
    lowerQ.includes('mua nhà') || lowerQ.includes('đất đai') || lowerQ.includes('bất động sản') ||
    lowerQ.includes('kinh tế') || lowerQ.includes('nghèo') || lowerQ.includes('nợ')
  ) {
    const starsCaiA = formatStars(caiA);
    const starsCaiB = formatStars(caiB);
    const starsDienA = formatStars(dienA);
    const starsDienB = formatStars(dienB);

    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Tài Lộc & Quản Trị Tài Chính Gia Đạo】**
*Câu hỏi của bạn: "${q}"*

**1. Khảo sát Cung Tài Bạch (Dòng tiền) & Cung Điền Trạch (Kho của) hai bên:**
- **${nameA}:** Cung Tài Bạch có: ${starsCaiA}. Cung Điền Trạch có: ${starsDienA}. Năng lực kiếm tiền chủ về sự chủ động, nhạy bén và có định hướng rõ ràng.
- **${nameB}:** Cung Tài Bạch có: ${starsCaiB}. Cung Điền Trạch có: ${starsDienB}. Khả năng quản lý tài chính mang tính tích lũy kiên cố và cẩn trọng.
- **Tứ Hóa Phi Lộc tương trợ:** Hóa Lộc của ${nameA} bay vào cung **${aLuInB}** của ${nameB}; Hóa Lộc của ${nameB} chiếu vào cung **${bLuInA}** của ${nameA}. Đôi bên có trường năng lượng kích hoạt vận may tài chính cho nhau cực kỳ tốt!

**2. Ai là người nên giữ tay hòm chìa khóa?**
- Theo Thầy Nghê Hải Hà (*Thiên Kỷ*): *"Tài Bạch vi ngọc, Điền Trạch vi khố. Người nào có Cung Điền Trạch vững chãi, tọa các sao giữ của như Vũ Khúc, Thiên Phủ, Thái Âm hoặc Hóa Lộc thì người đó nên quản lý quỹ tiết kiệm và tài sản bất động sản của gia đình."*
- Khuyến nghị: Người có năng lực đối ngoại nên phụ trách tạo dòng tiền kinh doanh bên ngoài; người có tính tích lũy chu toàn nên đứng tên quản lý các tài sản cố định dài hạn.

**3. Lời khuyên đầu tư & Tích lũy:**
- Tránh đầu cơ lướt sóng mạo hiểm khi đại hạn chạm vào cung có Hóa Kỵ. Hãy tập trung biến dòng tiền thặng dư thành bất động sản và tư liệu sản xuất vững bền.`;
  }

  // 2. KINH DOANH CHUNG, HỢP TÁC LÀM ĂN, GÓP VỐN, ĐỐI TÁC
  if (
    lowerQ.includes('hợp tác') || lowerQ.includes('làm ăn') || lowerQ.includes('kinh doanh') ||
    lowerQ.includes('góp vốn') || lowerQ.includes('mở công ty') || lowerQ.includes('buôn bán') ||
    lowerQ.includes('đối tác')
  ) {
    const starsQuanA = formatStars(quanA);
    const starsQuanB = formatStars(quanB);
    const starsNoA = formatStars(noA);
    const starsNoB = formatStars(noB);

    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Hợp Tác Làm Ăn & Kinh Doanh Chung】**
*Câu hỏi của bạn: "${q}"*

**1. Phối hợp giữa Cung Quan Lộc (Sự nghiệp) & Cung Nô Bộc (Cộng sự):**
- **${nameA}:** Cung Quan Lộc hội tụ: ${starsQuanA}. Cung Nô Bộc hội tụ: ${starsNoA}. Phong cách làm việc quyết đoán, dám nghĩ dám làm.
- **${nameB}:** Cung Quan Lộc hội tụ: ${starsQuanB}. Cung Nô Bộc hội tụ: ${starsNoB}. Phong cách thiên về mưu lược, vận hành quy trình và sự chu đáo.
- **Thế chân vạc:** Đây là thế phối hợp **"Một bên Mưu, một bên Hành"**. Một người lo chiến lược ngoại giao và phát triển thị trường, một người quản trị nội bộ và kiểm soát rủi ro.

**2. Điểm cảnh báo theo Thầy Nghê Hải Hà:**
- *"Hợp tác giữa vợ chồng hoặc người thân muốn bền vững thì 'Tiền bạc phải phân minh, trách nhiệm phải dứt khoát'. Không thể vì tình cảm mà bỏ qua nguyên tắc điều hành."*
- Cần lưu ý cung **${aJiInB}** và **${bJiInA}** chịu ảnh hưởng của Hóa Kỵ: Bắt buộc phải có một người đứng đầu giữ quyền quyết định chung thẩm, tránh tranh cãi về các chi tiết vụn vặt làm chậm trễ cơ hội.`;
  }

  // 3. MÂU THUẪN, XUNG ĐỘT, CÃI VÃ, BẤT ĐỒNG QUAN ĐIỂM
  if (
    lowerQ.includes('xung đột') || lowerQ.includes('mâu thuẫn') || lowerQ.includes('bất đồng') ||
    lowerQ.includes('cãi nhau') || lowerQ.includes('khắc') || lowerQ.includes('nóng tính') ||
    lowerQ.includes('khắc khẩu') || lowerQ.includes('cãi vã')
  ) {
    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Điểm Xung Đột & Bí Quyết Hóa Giải】**
*Câu hỏi của bạn: "${q}"*

**1. Điểm va chạm từ Tứ Hóa Phi Kỵ:**
- **Hóa Kỵ của ${nameA} (${sihuaA.ji})** rơi vào **cung ${aJiInB}** của ${nameB}: Mỗi khi ${nameA} can thiệp hoặc tỏ thái độ khắt khe đối với lĩnh vực của cung **${aJiInB}**, ${nameB} rất dễ cảm thấy bị áp đặt, gò bó và khó chịu.
- **Hóa Kỵ của ${nameB} (${sihuaB.ji})** rơi vào **cung ${bJiInA}** của ${nameA}: Ngược lại, những thói quen hoặc cách xử lý của ${nameB} chạm vào cung **${bJiInA}** sẽ là ngòi nổ khiến ${nameA} ưu tư, bực bội và phát sinh tranh cãi.

**2. Phương pháp hóa giải triệt để theo Y Đạo Nghê Hải Hà:**
- Khẩu quyết Thầy Nghê Hải Hà: *"Cơn giận bốc lên từ Can hỏa, lời nói nhiều ắt tổn hại nguyên khí. Khi có bất đồng, tuyệt đối không đôi co sau 23h đêm trong phòng ngủ."*
- Hãy chủ động dừng cuộc tranh cãi, uống một tách trà ấm để bình can hỏa, và ngồi lại trò chuyện khi cả hai đã lấy lại sự điềm tĩnh và thấu hiểu.`;
  }

  // 4. HÔN NHÂN TRƯỜNG CỬU, CHUNG THỦY, NGOẠI TÌNH, ĐÀO HOA
  if (
    lowerQ.includes('hạnh phúc') || lowerQ.includes('bền lâu') || lowerQ.includes('kết hôn') ||
    lowerQ.includes('ly hôn') || lowerQ.includes('ly dị') || lowerQ.includes('chung thủy') ||
    lowerQ.includes('ngoại tình') || lowerQ.includes('đào hoa') || lowerQ.includes('trăng hoa')
  ) {
    const starsFudeA = formatStars(fudeA);
    const starsFudeB = formatStars(fudeB);
    const starsFuqiA = formatStars(fuqiA);
    const starsFuqiB = formatStars(fuqiB);

    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Hôn Nhân Có Bền Lâu & Chung Thủy Không?】**
*Câu hỏi của bạn: "${q}"*

**1. Khảo sát Cung Phúc Đức — Chiếc mỏ neo quyết định độ bền hôn nhân:**
- Khẩu quyết Thầy Nghê Hải Hà: *"Cung Phu Thê chỉ thấy được 3 phần duyên nợ ban đầu, cung Phúc Đức mới thấy trọn 7 phần nghiệp quả trường cửu!"*
- **Cung Phúc Đức ${nameA}:** Hội tụ: ${starsFudeA}. Chủ về lòng bao dung và sự thiện lương.
- **Cung Phúc Đức ${nameB}:** Hội tụ: ${starsFudeB}. Bổ trợ sự điềm đạm và tinh thần trách nhiệm gia đình.
- **Đánh giá chung:** Cả hai bên đều có gốc rễ Phúc Đức vững vàng, ý thức vun đắp đạo vợ chồng cao.

**2. Quản trị đào hoa & Gìn giữ sự son sắt:**
- Phu Thê Bên A (${starsFuqiA}) và Bên B (${starsFuqiB}) cần sự thẳng thắn, tin tưởng và tôn trọng bạn đời. Tránh nghi ngờ vô căn cứ làm rạn nứt niềm tin.
- ${ageDiff >= 7 ? `✦ Đắc cách chênh lệch từ 7 tuổi trở lên: Tính tình nhường nhịn, tương trợ như bậc tiền bối dìu dắt, gia đạo càng thêm hòa mục.` : `Hai bạn cùng trang lứa, cần coi nhau như tri kỷ, lắng nghe nhiều hơn phán xét.`}`;
  }

  // 5. CON CÁI, SINH CON, HẬU DUỆ
  if (
    lowerQ.includes('con cái') || lowerQ.includes('sinh con') || lowerQ.includes('con trai') ||
    lowerQ.includes('con gái') || lowerQ.includes('hiếm muộn') || lowerQ.includes('mang thai') ||
    lowerQ.includes('sinh nở') || lowerQ.includes('dạy con')
  ) {
    const starsTuA = formatStars(tuA);
    const starsTuB = formatStars(tuB);

    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Duyên Phận Con Cái & Sinh Nở Hậu Duệ】**
*Câu hỏi của bạn: "${q}"*

**1. Khảo sát Cung Tử Tức hai bên:**
- **Cung Tử Tức của ${nameA}:** Hội tụ: ${starsTuA}.
- **Cung Tử Tức của ${nameB}:** Hội tụ: ${starsTuB}.
- **Nhận định tinh diệu:** Con cái thông minh, có tư chất tiến thủ và mang lại phúc khí cho gia đình.

**2. Lời khuyên dưỡng sinh thụ thai theo Y Đạo Nghê Hải Hà:**
- Thầy Nghê Hải Hà dạy: *"Con cái là kết tinh của khí huyết phụ mẫu. Muốn sinh con thông minh khỏe mạnh, hai vợ chồng nên điều dưỡng Can - Thận từ trước 6 tháng, đi ngủ trước 23h để kinh Đởm phục hồi tủy huyết."*
- Giữ tâm trạng hòa ái, tránh lo âu công việc trong thời kỳ mang thai để con sinh ra mang tính cách điềm đạm, an nhiên.`;
  }

  // 6. MẸ CHỒNG NÀNG DÂU, GIA ĐÌNH NỘI NGOẠI, BỐ MẸ HAI BÊN
  if (
    lowerQ.includes('mẹ chồng') || lowerQ.includes('mẹ vợ') || lowerQ.includes('bố mẹ') ||
    lowerQ.includes('cha mẹ') || lowerQ.includes('gia đình') || lowerQ.includes('nhà nội') ||
    lowerQ.includes('nhà ngoại') || lowerQ.includes('nàng dâu') || lowerQ.includes('ở chung')
  ) {
    const starsPhuMauA = formatStars(phuMauA);
    const starsPhuMauB = formatStars(phuMauB);

    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Mối Quan Hệ Gia Đình & Bố Mẹ Hai Bên】**
*Câu hỏi của bạn: "${q}"*

**1. Khảo sát Cung Phụ Mẫu hai bên:**
- **Cung Phụ Mẫu ${nameA}:** Hội tụ: ${starsPhuMauA}.
- **Cung Phụ Mẫu ${nameB}:** Hội tụ: ${starsPhuMauB}.
- Thế cung phản ánh bố mẹ hai bên đều là những người giàu tình cảm, có kỳ vọng nhất định vào hạnh phúc của con cái.

**2. Lời khuyên hòa hợp mẹ chồng - nàng dâu / nội ngoại:**
- Thầy Nghê Hải Hà dạy: *"Hiếu thuận là cội nguồn của phúc đức, nhưng khoảng cách sinh ra sự tôn trọng."*
- Nếu có điều kiện, sau khi kết hôn nên ở riêng hoặc tạo không gian sinh hoạt độc lập để giữ gìn sự hòa mục lâu dài. Thường xuyên thăm hỏi, biếu quà và giữ thái độ lễ độ, chu tất.`;
  }

  // 7. PHONG THỦY PHÒNG NGỦ, DƯƠNG TRẠCH, HƯỚNG NHÀ, BẾP
  if (
    lowerQ.includes('phong thủy') || lowerQ.includes('phòng ngủ') || lowerQ.includes('hướng nhà') ||
    lowerQ.includes('bếp') || lowerQ.includes('nhà vệ sinh') || lowerQ.includes('giường') ||
    lowerQ.includes('dương trạch')
  ) {
    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Cẩm Nang Phong Thủy Phòng Ngủ Sau Khi Cưới】**
*Câu hỏi của bạn: "${q}"*

**1. Phép bố trí phòng ngủ chính theo quẻ Địa Thiên Thái:**
- Sau khi kết hôn, hai vợ chồng **bắt buộc phải đặt phòng ngủ tại Phương Tây Bắc (Càn vị)** của ngôi nhà.
- Vợ (Khôn) ở vị trí của Chồng (Càn) tạo nên quẻ **Địa Thiên Thái** (Đất trên Trời, Âm giáng Dương thăng): Chồng đại phát sự nghiệp, vợ an khang trường thọ, gia tài hưng thịnh.

**2. Các cấm kỵ phong thủy tuyệt đối cần tránh:**
- **Tuyệt đối không đặt Nhà Bếp ở Tây Bắc:** Bếp tượng hỏa thiêu và mổ xẻ. Bếp ở Tây Bắc gọi là *"Hỏa thiêu Thiên Môn"*, cực kỳ nguy hiểm cho sự nghiệp và sinh mệnh người chồng.
- **Không làm Phòng Khách ở Tây Bắc:** Chủ người chồng coi nhà như trọ, thường xuyên đi vắng, dễ dẫn đến phu thê sinh ly.
- **Giữ trung tâm ngôi nhà (Trung Cung) sạch sẽ, thông thoáng:** Tránh đặt nhà vệ sinh hoặc hầm cầu giữa nhà làm xung phá tâm mạch.`;
  }

  // 8. SỨC KHỎE, TẬT ÁCH, DƯỠNG SINH
  if (
    lowerQ.includes('sức khỏe') || lowerQ.includes('bệnh') || lowerQ.includes('tật ách') ||
    lowerQ.includes('ốm') || lowerQ.includes('tai nạn') || lowerQ.includes('mổ xẻ') ||
    lowerQ.includes('dưỡng sinh')
  ) {
    const starsTatAchA = formatStars(tatAchA);
    const starsTatAchB = formatStars(tatAchB);

    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Sức Khỏe & Dưỡng Sinh Đôi Bên】**
*Câu hỏi của bạn: "${q}"*

**1. Khảo sát Cung Tật Ách hai bên:**
- **Cung Tật Ách ${nameA}:** Tọa tinh: ${starsTatAchA}.
- **Cung Tật Ách ${nameB}:** Tọa tinh: ${starsTatAchB}.
- Thế cung phản ánh các cơ quan nội tạng cần lưu ý điều dưỡng định kỳ, tránh làm việc quá sức gây hao tổn chân khí.

**2. Lời khuyên Y Đạo Thầy Nghê Hải Hà (*Hoàng Đế Nội Kinh*):**
- Bách bệnh phát sinh do khí huyết mất cân bằng và thức khuya tổn Can Đởm.
- Hai vợ chồng nên duy trì thói quen ngủ trước 23h đêm (giờ Tý) để kinh Đởm lọc máu và kinh Can tàng huyết, tập thể dục nhẹ nhàng buổi sáng để dương khí lưu thông.`;
  }

  // 9. NĂM CƯỚI, TUỔI TÁC, KHI NÀO KẾT HÔN, TAM TAI, KIM LÂU
  if (
    lowerQ.includes('năm cưới') || lowerQ.includes('khi nào cưới') || lowerQ.includes('khi nào kết hôn') ||
    lowerQ.includes('tam tai') || lowerQ.includes('kim lâu') || lowerQ.includes('hoàng ốc') ||
    lowerQ.includes('hợp tuổi') || lowerQ.includes('tuổi')
  ) {
    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Thời Điểm Kết Hôn & Hóa Giải Tuổi Tác】**
*Câu hỏi của bạn: "${q}"*

**1. Đánh giá về tuổi tác & năm cưới cát lợi:**
- Khoảng cách tuổi: ${nameA} (${yearA}) và ${nameB} (${yearB}) cách biệt ${ageDiff} tuổi.
- Thầy Nghê Hải Hà dạy: *"Hôn nhân cốt ở sự đồng lòng và chín chắn của tâm tính. Đừng để những nỗi sợ hãi về Kim Lâu hay Tam Tai cản trở duyên lành."*
- Thời điểm kết hôn cát lợi nhất là khi Lưu Niên hoặc Đại Hạn có các sao cát như **Hồng Loan, Thiên Hỷ, Hóa Lộc, Hóa Khoa** chiếu rọi vào Cung Mệnh hoặc Cung Phu Thê.

**2. Lời khuyên hành động:**
- Chọn ngày lành tháng tốt hòa hợp với bản mệnh cả hai bên. Bố trí phong thủy phòng ngủ đúng vị trí Tây Bắc sẽ hóa giải mọi xung khắc niên hạn.`;
  }

  // 10. BẤT KỲ CÂU HỎI TÙY BIẾN KHÁC
  return `**【Giải Đáp Chuyên Sâu Tinh Bàn: "${q}"】**

**1. Khảo sát liên đới giữa hai tinh bàn:**
Dựa trên cấu trúc Mệnh Cung (**${getStarVi(starNameA)}** của ${nameA} và **${getStarVi(starNameB)}** của ${nameB}) cùng thế tam phương tứ chính của hai lá số:
- Mối quan hệ giữa hai người chịu sự chi phối mạnh mẽ của Tứ Hóa Phi Tinh: Hóa Lộc của ${nameA} mang phúc khí sang cung **${aLuInB}** của ${nameB}, trong khi Hóa Lộc của ${nameB} chiếu rọi cung **${bLuInA}** của ${nameA}.
- Năng lượng tương hỗ này cho thấy đối với vấn đề bạn đang băn khoăn (*"${q}"*), sự phối hợp nhịp nhàng và chủ động chia sẻ của đôi bên sẽ chuyển hóa mọi khúc mắc thành cơ hội phát triển.

**2. Chỉ dẫn hành động thực tiễn theo trường phái Nghê Hải Hà (*Thiên Kỷ*):**
- Lấy sự thấu hiểu và chân thành làm kim chỉ nam. Khi đứng trước các quyết định quan trọng, hãy bình tâm suy xét từ góc nhìn của đối phương.
- Kết hợp phong thủy phòng ngủ Tây Bắc (quẻ Địa Thiên Thái) để gia tăng phúc khí, giúp tâm trí hanh thông và đưa ra những lựa chọn chuẩn xác nhất.`;
}
