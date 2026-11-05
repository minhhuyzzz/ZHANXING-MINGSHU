/**
 * lib/ziwei/interpret-engine.ts
 * Cỗ máy luận giải Tử Vi Đẩu Số chuyên sâu chuẩn hệ thống Nghê Hải Hà (Thiên Kỷ)
 * Hoạt động độc lập, không cần bất kỳ API key bên ngoài nào, tự động phân tích toàn diện lá số.
 */

import type { ZiweiChart, Palace, Star } from './types';
import { detectPatterns } from './patterns';
import { STEMS, BRANCHES } from './constants';
import {
  STAR_VI_MAP,
  PALACE_VI_MAP,
  BRIGHTNESS_VI_MAP,
  BRANCH_ORGAN_MAP,
  getStarVi,
  getPalaceVi,
  getBrightnessVi,
  getWuXingJuVi,
  getPatternVi,
  getPatternDescVi,
} from './vietnamese';
import { STAR_IN_FUQI_GU } from './heming-knowledge';

export interface InterpretContext {
  chart: ZiweiChart;
  topic?: string;
  selectedPalaceName?: string;
  selectedStarName?: string;
  selectedSiHua?: { starName: string; siHua: string; view?: string };
  userQuery?: string;
  lang?: 'vi' | 'zh';
}

const STAR_NATURE_VI: Record<string, { role: string; desc: string; niQuote: string; personality: string }> = {
  '紫微': {
    role: 'Đế Vương Chi Tinh (Bắc Đẩu Đệ Nhất Tinh, Thổ)',
    desc: 'Chủ quan lộc, uy quyền, quý khí, có tài lãnh đạo tổ chức. Khí chất cao ngạo, tự tôn, thích tự chủ tác chiến.',
    niQuote: 'Tử Vi là vua, tối hỷ Tả Phụ Hữu Bật củng chiếu. Nếu Tử Vi độc tọa mà không có quần thần phò tá thì gọi là quân vương cô đơn, tự thân phải gánh vác nặng nề.',
    personality: 'Khí phách hiên ngang, lòng tự trọng rất lớn, có phong thái người đứng đầu, ghét bị áp đặt và luôn mưu cầu sự hoàn mỹ.',
  },
  '天机': {
    role: 'Trí Huệ Chi Tinh (Nam Đẩu Đệ Nhất Tinh, Mộc)',
    desc: 'Chủ mưu lược, trí tuệ, biến hóa linh hoạt, phản ứng cực nhanh. Hợp nghiên cứu, cố vấn, công nghệ và hoạch định chiến lược.',
    niQuote: 'Thiên Cơ là sao thiện mưu, chủ biến động, tính tình linh hoạt nhưng dễ đứng núi này trông núi nọ. Khéo quyền biến nhưng cần có sự kiên định bền bỉ.',
    personality: 'Thông minh mẫn tiệp, óc quan sát vi tế, nhiều ý tưởng đột phá, tính tình nhân hậu nhưng đôi khi suy nghĩ quá nhiều sinh lo âu.',
  },
  '太阳': {
    role: 'Quang Minh Chi Tinh (Nam Đẩu Đệ Nhị Tinh, Hỏa)',
    desc: 'Chủ quan quý, danh vọng, khẳng khái, quang minh chính đại. Miếu vượng thì hiển đạt rực rỡ, hãm địa thì lao tâm khổ tứ vì tha nhân.',
    niQuote: 'Thái Dương chủ quý, ưa miếu vượng từ Dần đến Ngọ. Như ánh thái dương chiếu rọi muôn loài, cho đi mà không đòi hỏi đền đáp, tâm hồn quang minh lỗi lạc.',
    personality: 'Nhiệt tình, bộc trực, thích giúp đỡ người khác, có tinh thần trượng nghĩa, không giấu giếm toan tính, coi trọng danh dự hơn tiền tài.',
  },
  '武曲': {
    role: 'Tài Bạch Chi Tinh (Bắc Đẩu Đệ Lục Tinh, Kim)',
    desc: 'Tài tinh cương nghị, quyết đoán, thực tế, hành động dứt khoát. Thích hợp tài chính ngân hàng, quân đội, cơ khí, kinh doanh độc lập.',
    niQuote: 'Vũ Khúc là tài tinh kiêm võ tướng, tính tình cương trực bộc trực. Vũ Khúc kỵ nhất gặp Hóa Kỵ vì biến thành phá tài và cô quả.',
    personality: 'Cương nghị, kiên trì, làm việc kỷ luật cao, nói ít làm nhiều, coi trọng hiệu quả thực tế và có nguyên tắc tài chính rõ ràng.',
  },
  '天同': {
    role: 'Phúc Đức Chi Tinh (Nam Đẩu Đệ Tứ Tinh, Thủy)',
    desc: 'Chủ phúc thọ, ôn hòa, nhân hậu, thong thả hưởng thụ. Có khiếu nghệ thuật, tâm hồn thuần khiết, bao dung với cuộc đời.',
    niQuote: 'Thiên Đồng là sao hưởng phúc, tính tình rộng rãi không tranh với đời. Người có Thiên Đồng thì tâm hồn trẻ trung, hữu phúc túc an nhàn.',
    personality: 'Hiền lành, dễ gần, thích hòa khí, có duyên ngầm, ghét xung đột tranh chấp, đôi khi thiếu chút quyết đoán khi đứng trước áp lực lớn.',
  },
  '廉贞': {
    role: 'Thứ Đào Hoa & Tù Tinh (Bắc Đẩu Đệ Ngũ Tinh, Hỏa)',
    desc: 'Đa tài đa nghệ, cá tính mạnh mẽ, liều lĩnh, cảm xúc mãnh liệt. Vừa chủ quan trường quyền biến vừa chủ duyên phận phong lưu.',
    niQuote: 'Liêm Trinh là sao biến hóa khôn lường, ở quan lộc miếu vượng là quyền biến mưu lược, rơi vào cung phu thê hay hãm địa thì tình cảm đa đoan trắc trở.',
    personality: 'Mẫn cảm, khí khái, phân biệt yêu ghét rạch ròi, trực giác nhạy bén, giàu tham vọng nhưng nội tâm chứa đựng nhiều xung đột cảm xúc.',
  },
  '天府': {
    role: 'Lệnh Tinh & Tài Khố (Nam Đẩu Chủ Tinh, Thổ)',
    desc: 'Kho trời tích lũy, tính tình cẩn trọng, điềm đạm, bao dung, quản lý tài chính xuất sắc, giữ chữ tín hàng đầu.',
    niQuote: 'Thiên Phủ là kho tiền của trời, cùng Tử Vi là cặp bài trùng đế khố. Thiên Phủ thủ mệnh thì cả đời bình ổn, tài lộc tích lũy vững chãi.',
    personality: 'Đĩnh đạc, ung dung, điềm tĩnh trước mọi biến cố, giỏi tích lũy và quản trị nguồn lực, phong thái hòa nhã nhưng có ranh giới rõ ràng.',
  },
  '太阴': {
    role: 'Phú Tinh & Điền Trạch Chủ (Bắc Đẩu Tinh, Thủy)',
    desc: 'Chủ về tài phú âm thầm, bất động sản, sự dịu dàng, tinh tế, nội tâm sâu sắc, có duyên đặc biệt với nghệ thuật và tài sản.',
    niQuote: 'Thái Âm chủ phú, hợp nhất cung Tật ách, Điền trạch hoặc Tài bạch. Miếu vượng ban đêm (từ Dậu đến Sửu) thì cực kỳ đắc cách phát tài.',
    personality: 'Nhẹ nhàng, chu đáo, tinh tế, giàu trí tưởng tượng, thích cuộc sống thanh tao yên tĩnh, có khả năng thấu cảm tâm lý sâu sắc.',
  },
  '贪狼': {
    role: 'Chính Đào Hoa & Dục Vọng Chi Tinh (Bắc Đẩu Đệ Nhất Tinh, Thủy/Mộc)',
    desc: 'Hùng tâm tráng chí, ngoại giao giỏi, ham học hỏi điều mới, nghệ thuật, kinh doanh, tâm linh huyền học.',
    niQuote: 'Tham Lang ngộ Hỏa Tinh hoặc Linh Tinh là Hỏa Tham, Linh Tham cách chủ bạo phát tài phú nhanh chóng. Ngộ Không Kiếp thì quy hướng triết đạo.',
    personality: 'Linh hoạt, khéo ăn khéo nói, tính cách quảng giao, nhiều đam mê, không chịu trói buộc trong khuôn mẫu cứng nhắc, giàu sức quyến rũ.',
  },
  '巨门': {
    role: 'Ám Tinh & Khẩu Tài Chi Tinh (Bắc Đẩu Đệ Nhị Tinh, Thủy)',
    desc: 'Chủ về hùng biện, ngôn ngữ, quan sát sâu sắc, tư duy phản biện. Rất hợp luật sư, giảng dạy, truyền thông, y dược học thuật.',
    niQuote: 'Cự Môn là sao thị phi khẩu thiệt, nhưng nếu có Thái Dương miếu vượng quang chiếu thì chuyển hóa thành tài ăn nói xuất chúng, uy chấn thiên hạ.',
    personality: 'Tư duy logic sắc bén, hay hoài nghi để tìm chân lý, cẩn trọng trong từng lời nói, nội tâm độc lập và luôn tìm tòi bản chất sự việc.',
  },
  '天相': {
    role: 'Ấn Tinh & Tướng Tinh (Nam Đẩu Đệ Ngũ Tinh, Thủy)',
    desc: 'Chủ về ấn tín, trợ tá, công chính, hòa nhã, coi trọng hình tượng, làm việc chu toàn, tận tụy phụng sự tập thể.',
    niQuote: 'Thiên Tướng là tể tướng trợ tá, rất chú trọng thế giáp cung. Giáp Lộc giáp Quý thì hiển vinh, giáp Kỵ giáp Kình thì thành Hình Kỵ Giáp Ấn.',
    personality: 'Đoan chính, lịch thiệp, giữ lời hứa, có tinh thần trách nhiệm cao, thích làm việc trật tự minh bạch, đáng tin cậy trong mắt bạn bè.',
  },
  '天梁': {
    role: 'Ấm Tinh & Dược Tinh (Nam Đẩu Đệ Tam Tinh, Thổ)',
    desc: 'Chủ về thanh cao, che chở, trường thọ, duyên với y học huyền học, có phong thái tiền bối che chở cho hậu bối.',
    niQuote: 'Thiên Lương là sao che chở giải ách, gặp nạn hóa lành. Người có Thiên Lương thường có tâm hướng thiện, hợp nghề giáo, y, pháp luật, cố vấn.',
    personality: 'Đạo mạo, già dặn trước tuổi, chuộng lẽ phải, thích bảo bọc người yếu thế, coi trọng thanh danh hơn tiền bạc, tâm hướng về đạo lý.',
  },
  '七杀': {
    role: 'Tướng Tinh & Cô Khắc Chi Tinh (Nam Đẩu Đệ Lục Tinh, Kim/Hỏa)',
    desc: 'Dũng mãnh, quyết đoán, độc lập tác chiến, dám nghĩ dám làm, không ngại gian khổ hiểm nguy để kiến tạo sự nghiệp lớn.',
    niQuote: 'Thất Sát là đại tướng tiên phong trên chiến trường, lâm cung Mệnh chủ thăng trầm lập nghiệp lớn. Thất Sát triều đẩu tước lộc vinh hoa.',
    personality: 'Khí khái anh dũng, dứt khoát, không sợ cường quyền, tự lực cánh sinh, ghét sự vòng vo do dự, luôn tiên phong trong mọi thử thách.',
  },
  '破军': {
    role: 'Tiên Phong & Hao Tinh (Bắc Đẩu Đệ Thất Tinh, Thủy)',
    desc: 'Chủ phá cũ lập mới, tiên phong khai phá, không cam chịu bình thường, sẵn sàng đập đi xây lại cuộc đời để đạt tầm cao mới.',
    niQuote: 'Phá Quân là dũng tướng phá trận, chủ biến động to lớn. Phá Quân hóa Lộc hay hóa Quyền là cách mạng đổi mới thành công vang dội.',
    personality: 'Sáng tạo, táo bạo, cá tính độc đáo, không đi theo lối mòn của người khác, kiên định với lý tưởng riêng dù gặp muôn trùng sóng gió.',
  },
};

const SHEN_GONG_DESC: Record<string, string> = {
  '命宫': 'Thân cư Mệnh: Tự lập tự chủ, nhất quán từ trẻ đến già, mọi quyết định đều xuất phát từ bản lĩnh và sự tự giác cá nhân.',
  '夫妻': 'Thân cư Phu Thê: Coi trọng tình cảm gia đạo, sau khi kết hôn cuộc sống có bước ngoặt lớn, bạn đời ảnh hưởng sâu sắc đến sự nghiệp.',
  '官禄': 'Thân cư Quan Lộc: Sự nghiệp là kim chỉ nam cuộc đời, sau 30 tuổi dồn toàn bộ tâm huyết cho công danh địa vị và thành tựu xã hội.',
  '财帛': 'Thân cư Tài Bạch: Thực tế, nhạy bén với cơ hội tài chính, hướng tới sự độc lập về kinh tế và tạo dựng của cải vững bền.',
  '迁移': 'Thân cư Thiên Di: Duyên nợ với phương xa, thích xê dịch, môi trường bên ngoài đem lại nhiều cơ hội thăng tiến hơn nơi chôn rau cắt rốn.',
  '福德': 'Thân cư Phúc Đức: Hướng về đời sống tinh thần, tâm linh triết học, sau 30 tuổi luôn tìm kiếm sự thanh tịnh an nhiên trong tâm hồn.',
};

/** Tìm cung theo tên */
function findPalace(chart: ZiweiChart, name: string): Palace | undefined {
  return chart.palaces.find(p => p.name === name || (p.name + '宫') === name);
}

/** Tìm cung theo chi */
function getPalaceByBranch(chart: ZiweiChart, branch: number): Palace | undefined {
  return chart.palaces.find(p => p.branch === ((branch % 12) + 12) % 12);
}

/** Lấy thông tin sao miếu hãm tứ hóa */
function formatStarsVi(palace?: Palace): string {
  if (!palace || palace.stars.length === 0) return 'Vô chính diệu (Không có chính tinh, mượn cung xung đối)';
  const majorStars = palace.stars.filter(s => s.type === 'major');
  if (majorStars.length === 0) {
    return 'Vô chính diệu (Không có chính tinh tọa thủ, mượn tinh diệu từ đối cung)';
  }
  return majorStars.map(s => {
    const nameVi = getStarVi(s.name);
    const brightVi = getBrightnessVi(s.brightnessRaw);
    const sihuaVi = s.siHua ? ` [Hóa ${s.siHua}]` : '';
    return `**${nameVi}** (${s.name})` + (brightVi ? ` [${brightVi}]` : '') + sihuaVi;
  }).join(' và ');
}

export function generateInterpretStream(ctx: InterpretContext): string {
  const { chart, topic = 'overview', selectedPalaceName, selectedStarName, selectedSiHua } = ctx;
  const patterns = detectPatterns(chart);
  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const shenPalace = chart.palaces.find(p => p.branch === chart.shenGongBranch);
  const careerPalace = findPalace(chart, '官禄');
  const wealthPalace = findPalace(chart, '财帛');
  const travelPalace = findPalace(chart, '迁移');
  const spousePalace = findPalace(chart, '夫妻');
  const healthPalace = findPalace(chart, '疾厄');
  const propertyPalace = findPalace(chart, '田宅');

  const mingMajorStars = mingPalace?.stars.filter(s => s.type === 'major') || [];
  const primaryStar = mingMajorStars[0]?.name || '';
  const starInfo = STAR_NATURE_VI[primaryStar] || {
    role: 'Mệnh Cách Đặc Thù (Vô Chính Diệu)',
    desc: 'Lá số có thế cục uyển chuyển, mượn tinh diệu cung xung chiếu để khai mở vận trình, phản ứng nhạy bén theo thời cuộc.',
    niQuote: 'Mệnh vô chính diệu phải xem kỹ thế tam phương tứ chính và cung Thiên Di đối chiếu. Biết mượn lực người khác thì tiền đồ vô lượng.',
    personality: 'Khả năng thích ứng cao, uyển chuyển đa tài, thông minh linh hoạt nhưng cần xác lập mục tiêu rõ ràng để tránh phân tán năng lượng.',
  };

  const shenNameClean = (shenPalace?.name || 'Mệnh').replace('宫', '');
  const shenMeaning = SHEN_GONG_DESC[shenNameClean] || `Thân cư ${getPalaceVi(shenPalace?.name || '')}: Nửa đời sau tập trung phát triển cung vị này.`;

  const patternHighlights = patterns.slice(0, 3).map(p => {
    return `• **${getPatternVi(p.name)}** (${p.level === 'excellent' ? 'Thượng cát cách' : p.level === 'good' ? 'Cát cách' : 'Biến cách'}): ${getPatternDescVi(p.name, p.description)}`;
  }).join('\n');

  // ── Xử lý khi nhấn vào Hóa Lộc / Quyền / Khoa / Kỵ ──
  if (selectedSiHua) {
    const { starName, siHua } = selectedSiHua;
    const starVi = getStarVi(starName);
    return `**【Ý nghĩa cốt lõi Hóa ${siHua}】**
Sao **${starVi} (${starName})** đắc Hóa ${siHua}:
- Năng lượng chuyển biến: ${siHua === 'Lộc' || siHua === '禄' ? 'Tài nguyên gia tăng, cơ hội hanh thông, đón nhận lộc trời ban.' : siHua === 'Quyền' || siHua === '权' ? 'Nắm quyền chỉ huy, gia tăng ảnh hưởng, quyết đoán và chịu trách nhiệm.' : siHua === 'Khoa' || siHua === '科' ? 'Danh tiếng vang xa, thi cử đỗ đạt, gặp hung hóa cát nhờ quý nhân phù trợ.' : 'Tập trung bài học nghiệp lực, điểm vướng mắc cần dùng trí tuệ và sự kiên nhẫn để hóa giải.'}

**【Tác động tại cung tọa thủ】**
Khi Hóa ${siHua} đóng tại đây, tính chất tự nhiên của ${starVi} được kích hoạt mạnh mẽ. ${siHua === 'Kỵ' || siHua === '忌' ? 'Cần bình tĩnh đối diện, không nên cưỡng cầu, lấy tu tâm dưỡng tính làm gốc.' : 'Nên chủ động nắm bắt cơ hội để phát huy năng lượng cát lành tối đa.'}

**【Khẩu quyết Nghê Hải Hà (*Thiên Kỷ*)】**
"Tứ Hóa là linh hồn chuyển dịch của toàn bộ mệnh bàn. Lộc sinh Tài, Quyền lập Thân, Khoa giải Ách, Kỵ tàng Đạo. Gặp Kỵ đừng sợ, Kỵ chính là nơi vũ trụ trao gửi bài học để ta tôi luyện thành tựu lớn!"`;
  }

  // ── XỬ LÝ THEO CHỦ ĐỀ ──
  if (topic === 'overview' || (!selectedPalaceName && !selectedStarName)) {
    return `**【Mệnh cách định tính】**
Lá số sinh năm **${STEMS[chart.lunarInfo?.yearStem ?? 0]}${BRANCHES[chart.lunarInfo?.yearBranch ?? 0]}** (${chart.yinYangGender === '阳男' ? 'Dương Nam' : chart.yinYangGender === '阳女' ? 'Dương Nữ' : chart.yinYangGender === '阴男' ? 'Âm Nam' : 'Âm Nữ'}), Nạp âm Cục số: **${getWuXingJuVi(chart.wuxingJuName)}**.
Mệnh Cung an tại **${getPalaceVi(mingPalace?.name || '')}** (${BRANCHES[chart.mingGongBranch]}), Thân Cung an tại **${getPalaceVi(shenPalace?.name || '')}** (${BRANCHES[chart.shenGongBranch]}).
Tinh diệu tọa thủ bản cung: ${formatStarsVi(mingPalace)}.
${primaryStar ? `Bản mệnh thuộc dạng cách **${starInfo.role}**. Cốt cách mang khí chất: ${starInfo.desc}` : 'Mệnh Vô Chính Diệu, mượn tinh diệu đối cung định hình tính cách, linh hoạt quyền biến.'}

**【Ý nghĩa Thân Cung & Hậu vận】**
${shenMeaning}

**【Chính tinh giải đoán】**
${primaryStar ? `Chính tinh **${getStarVi(primaryStar)} (${primaryStar})** thủ Mệnh:
- Khí chất cốt tủy: ${starInfo.desc}
- Khẩu quyết Thầy Nghê Hải Hà (*Thiên Kỷ*): "*${starInfo.niQuote}*"` : 'Mệnh Vô Chính Diệu xem cung Thiên Di xung chiếu để định hình tài năng, ra ngoài càng giao thiệp rộng càng sớm đắc lợi.'}

**【Tam phương tứ chính】**
Thế tam giác Mệnh - Quan - Tài - Di tạo thành thế chân vạc định hình đời người:
- **Cung Quan Lộc (Sự nghiệp):** Tọa tại ${careerPalace?.name ? getPalaceVi(careerPalace.name) : 'Quan Lộc'}, hội tụ: ${formatStarsVi(careerPalace)}.
- **Cung Tài Bạch (Tài chính):** Tọa tại ${wealthPalace?.name ? getPalaceVi(wealthPalace.name) : 'Tài Bạch'}, hội tụ: ${formatStarsVi(wealthPalace)}.
- **Cung Thiên Di (Đối ngoại):** Tọa tại ${travelPalace?.name ? getPalaceVi(travelPalace.name) : 'Thiên Di'}, hội tụ: ${formatStarsVi(travelPalace)}.
${patterns.length > 0 ? `Các cách cục đắc định trong cổ thư:\n${patternHighlights}` : 'Tam phương hội tụ tinh diệu bình hòa, thuộc mẫu hình tích lũy trung hậu, càng về hậu vận càng vững chãi.'}

**【Đại Hạn hiện tại】**
Bản mệnh đang tại đại hạn chuyển biến của cuộc đời, luân chuyển theo chiều vòng vận. Năng lượng đại hạn kích hoạt các cung vị then chốt, đòi hỏi sự linh hoạt và nắm bắt thời cơ.

**【Ưu thế & Lưu ý】**
- **Ưu thế thiên bẩm:** ${primaryStar ? `Nội lực vững chắc từ sao ${getStarVi(primaryStar)}, tư duy độc lập và năng lực kiên trì vượt khó.` : 'Thích nghi uyển chuyển, khéo nắm bắt thời cơ.'}
- **Lời răn Thầy Nghê Hải Hà (*Thiên Kỷ*):** "Tiên thiên Mệnh chiếm 1/3, Phong thủy Địa lý chiếm 1/3, Nhân sự nỗ lực chiếm 1/3. Nếu ta biết mệnh, sửa đổi thói quen và đặt mình đúng phong thủy thì 2/3 chắc chắn thắng 1/3 mệnh trời!"`;
  }

  if (topic === 'personality') {
    return `**【Khí chất chủ đạo】**
Cốt cách tâm hồn được định hình bởi chính tinh thủ Mệnh: **${primaryStar ? getStarVi(primaryStar) : 'Vô Chính Diệu'}**.
- Đặc tính cốt lõi: ${starInfo.personality}
- Phong cách tư duy: Luôn có xu hướng chủ động, có chiều sâu nội tâm và yêu cầu cao với bản thân.

**【Tâm lý đa chiều】**
Sự kết hợp giữa Mệnh Cung (tiên thiên) và Thân Cung (${getPalaceVi(shenPalace?.name || '')}):
- Thời trẻ: Thể hiện rõ cá tính và lý tưởng của Mệnh cung.
- Sau 30 tuổi: Chuyển dịch mạnh mẽ về phong cách của Thân cung, ngày càng chín chắn, thực tế và có định hướng vững vàng.

**【Phong cách giao tiếp & Xã hội】**
Cung Thiên Di và Nô Bộc hội tụ tinh diệu phản ánh mẫu người coi trọng chữ tín, phân biệt rõ bạn bè và đối tác, luôn giữ thái độ tôn trọng nhưng không dễ dãi để người khác thao túng.

**【Ưu điểm & Bài học tu thân】**
- **Ưu điểm lớn:** Trực giác nhạy bén, khả năng nhìn người và năng lực tự học hỏi không ngừng.
- **Bài học tu dưỡng:** Tránh cố chấp trong những việc nhỏ, học cách buông bỏ điều không thể thay đổi để tâm trí luôn an nhiên tự tại.`;
  }

  if (topic === 'love' || selectedPalaceName === '夫妻' || selectedPalaceName === '夫妻宫') {
    const spouseStars = spousePalace?.stars.filter(s => s.type === 'major') || [];
    const mainSpouseStar = spouseStars[0]?.name || '';
    const fuqiInfo = STAR_IN_FUQI_GU[mainSpouseStar];

    return `**【Tình cảm cách cục】**
Cung Phu Thê đóng tại cung **${getPalaceVi(spousePalace?.name || '')}**, hội tụ các tinh diệu: ${formatStarsVi(spousePalace)}.
Định tính duyên phận hôn nhân: ${fuqiInfo?.summary || 'Tình cảm phát triển trên nền tảng thấu hiểu và tôn trọng lập trường của nhau, cần thời gian bồi đắp chân tình.'}

**【Cung Phu Thê tường giải】**
- **Khí chất & Hình mẫu bạn đời:** ${fuqiInfo?.spouse_traits || 'Người phối ngẫu có cá tính rõ nét, có năng lực tự lập và lòng tự trọng cao.'}
- **Điểm cát lợi:** ${fuqiInfo?.good || 'Hai bên có thể tương trợ nhau về tư tưởng, công việc hoặc quản lý gia đình nếu giữ được sự nhường nhịn.'}
- **Khẩu quyết Thầy Nghê Hải Hà (*Thiên Kỷ*):** "${fuqiInfo?.ni_quote || 'Hôn nhân quý nhất ở sự thấu hiểu. Bố trí phong thủy phòng ngủ hợp hướng và nhường nhịn lời nói là chìa khóa giữ gìn hạnh phúc vĩnh cửu.'}"

**【Tam phương liên đới】**
Cung Phu Thê hội chiếu trực tiếp cùng Cung Thiên Di, Cung Quan Lộc và Cung Phúc Đức. Hôn nhân hòa thuận sẽ là hậu phương vững chắc nâng đỡ công danh sự nghiệp thăng hoa.

**【Lời khuyên phối ngẫu】**
${fuqiInfo?.timing || 'Nên kết hôn khi sự nghiệp và tâm lý đã chín chắn. Trong đời sống lứa đôi, lắng nghe nhiều hơn phán xét để giữ trọn vẹn hòa khí gia đạo.'}`;
  }

  if (topic === 'career' || selectedPalaceName === '官禄' || selectedPalaceName === '官禄宫') {
    return `**【Sự nghiệp cách cục】**
Cung Quan Lộc đóng tại cung **${careerPalace?.name ? getPalaceVi(careerPalace.name) : 'Quan Lộc'}**, hội tụ các tinh diệu: ${formatStarsVi(careerPalace)}.
Định tính phương hướng: ${careerPalace?.stars.some(s => s.name === '七杀' || s.name === '破军' || s.name === '贪狼') ? 'Tiên phong khai phá, thích hợp tự chủ lập nghiệp hoặc làm các công việc mang tính đổi mới, sáng tạo bứt phá.' : 'Phát triển chuyên môn sâu sắc, thăng tiến ổn định nhờ năng lực quản lý và uy tín thực chất.'}

**【Cung Quan Lộc tường giải】**
- Lĩnh vực tương hợp: Quản trị chiến lược, cố vấn chuyên sâu, công nghệ, tài chính hoặc các ngành nghề đòi hỏi tư duy phân tích cao.
- Năng lực cạnh tranh: Khả năng nhìn xa trông rộng, kiên trì và chịu được áp lực công việc dài hạn.
- Khẩu quyết Thầy Nghê Hải Hà: "Cung Quan Lộc tối hỷ Hóa Quyền hoặc cát tinh hội chiếu. Có thực quyền, thực lực thì đi đến đâu cũng xây dựng được cơ đồ."

**【Liên đới Tài Bạch】**
Cung Quan Lộc tam hợp với Cung Tài Bạch và Cung Mệnh. Thực lực công việc chuyển hóa trực tiếp thành nguồn thu tài chính dồi dào, danh tiếng đi đôi với thực lợi.

**【Lời khuyên hành động】**
Không ngừng nâng cao giá trị độc bản của bản thân. Khi gặp vận hạn thử thách, lấy việc bồi dưỡng tri thức làm gốc, chờ đón thời cơ để xuất kích bứt phá.`;
  }

  if (topic === 'wealth' || selectedPalaceName === '财帛' || selectedPalaceName === '财帛宫') {
    return `**【Tài lộc cách cục】**
Cung Tài Bạch đóng tại cung **${wealthPalace?.name ? getPalaceVi(wealthPalace.name) : 'Tài Bạch'}**, hội tụ: ${formatStarsVi(wealthPalace)}.
Phương thức tạo ra của cải: ${wealthPalace?.stars.some(s => s.name === '武曲' || s.name === '太阴' || s.name === '天府' || s.siHua === '禄') ? 'Có duyên tự nhiên với tiền tài, nguồn thu tích lũy đều đặn, nhạy bén nắm bắt cơ hội kinh doanh.' : 'Kiếm tiền từ tài năng thực tế, trí tuệ chuyên môn và sự cống hiến bền bỉ theo năm tháng.'}

**【Cung Điền Trạch (Kho của)】**
Tài lộc kiếm được có giữ vững hay không phụ thuộc mật thiết vào Cung Điền Trạch (Két sắt chứa tài sản). Cung Điền Trạch hội tụ: ${formatStarsVi(propertyPalace)}.
Thầy Nghê Hải Hà dạy: "Tài Bạch là dòng tiền lưu động bên ngoài, còn Điền Trạch mới là kho báu giữ tiền thực sự. Người khôn ngoan kiếm được tiền nên chuyển hóa thành bất động sản hoặc tư liệu sản xuất vững bền."

**【Vận trình tài vận hiện tại】**
- Thời cơ gặt hái: Tích lũy và đầu tư trung dài hạn khi bước vào các đại hạn cát hóa.
- Lưu ý then chốt: Tránh các kênh đầu cơ may rủi nếu cung vị tài chính gặp sát tinh như Không Kiếp hay Kình Đà.

**【Lời khuyên quản trị tài chính】**
Xây dựng quỹ dự phòng an toàn, không bỏ tất cả trứng vào một giỏ và luôn duy trì thói quen tích lũy tài sản thực.`;
  }

  if (topic === 'health' || selectedPalaceName === '疾厄' || selectedPalaceName === '疾厄宫') {
    const branchIdx = healthPalace?.branch ?? 0;
    const organInfo = BRANCH_ORGAN_MAP[branchIdx] || { organ: 'Hệ tiêu hóa và ngũ tạng', note: 'Cần chú ý điều độ sinh hoạt và giữ nhịp thở sâu.' };

    return `**【Cung Tật Ách chủ tinh】**
Cung Tật Ách đóng tại địa chi **${BRANCHES[branchIdx]}**, hội tụ: ${formatStarsVi(healthPalace)}.

**【Tạng phủ & Tử Ngọ Lưu Chú (Y Đạo Nghê Hải Hà)】**
Thầy Nghê Hải Hà là bậc thầy y học truyền thống, áp dụng *Hoàng Đế Nội Kinh* và *Thương Hàn Luận* vào Tử Vi:
- **Tạng phủ tương ứng bản cung:** **${organInfo.organ}**.
- **Kinh lạc & Giờ vận hành khí huyết:** ${organInfo.note}.
- **Y lý Nghê Sư:** "Bệnh tật phát sinh do khí huyết mất cân bằng và tà khí thừa cơ xâm nhập. Xem Tật Ách kết hợp cung vị tập trung sát tinh để phòng bệnh từ lúc chưa phát (Trị vị bệnh)."

**【Đại Hạn sức khỏe】**
Lưu ý các giai đoạn chuyển mùa và những năm gặp sát tinh hội tụ để bồi bổ nguyên khí, tránh làm việc quá sức làm hao tổn tạng tỳ và thận.

**【Lời khuyên dưỡng sinh】**
- Đi ngủ trước 23h (giờ Tý) để kinh Đởm và Can thải độc, phục hồi tủy sống và mắt.
- Rèn luyện thể thao điều độ, giữ tâm thế an nhiên thanh tịnh để chính khí dồi dào, bách bệnh bất xâm.`;
  }

  // ── Luận giải riêng cho từng cung vị cụ thể khi người dùng click vào cung ──
  if (selectedPalaceName) {
    const pal = findPalace(chart, selectedPalaceName);
    return `**【Vị trí & Khái quát cung】**
Cung **${getPalaceVi(selectedPalaceName)}** (${selectedPalaceName}) tọa tại địa chi **${pal?.branch !== undefined ? BRANCHES[pal.branch] : ''}**, hội tụ các tinh diệu: ${formatStarsVi(pal)}.
Ý nghĩa trong toàn bộ lá số: Chi phối trực tiếp năng lượng và các mối quan hệ nhân duyên tương ứng của mệnh chủ.

**【Tổ hợp tinh diệu】**
Sự phối chiếu của các sao tọa thủ phản ánh rõ nét những thuận lợi cũng như thách thức mà bạn cần trải qua trong phương diện này.

**【Khẩu quyết Thầy Nghê Hải Hà】**
"Mỗi cung vị là một thao trường rèn luyện bản thân. Sao tốt giúp ta có đà tiến, sao xấu nhắc ta phải cẩn trọng tu thân. Biết trước thiên cơ để chủ động chuyển bại thành thắng!"

**【Lời khuyên ứng xử】**
Phát huy tối đa thế mạnh của các cát tinh, hóa giải sát tinh bằng sự kiên nhẫn, khiêm tốn và hành động thực tế.`;
  }

  return `**【Tổng luận ZHANXING MINGSHU】**\nLá số cấu trúc cân đối, tinh diệu phát huy đúng vị trí. Hãy vững tâm tiến bước và tự tin làm chủ vận mệnh của mình!`;
}
