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

const PALACE_ROLES_MAP: Record<string, string> = {
  '命宫':   'Bản thân, tính cách, tiên thiên mệnh cách',
  '兄弟':   'Quan hệ anh em, đồng sự, đối tác làm ăn',
  '兄弟宫': 'Quan hệ anh em, đồng sự, đối tác làm ăn',
  '夫妻':   'Duyên nợ tình cảm, hôn nhân, phối ngẫu',
  '夫妻宫': 'Duyên nợ tình cảm, hôn nhân, phối ngẫu',
  '子女':   'Duyên phận con cái, hậu bối, học trò',
  '子女宫': 'Duyên phận con cái, hậu bối, học trò',
  '财帛':   'Dòng tiền, phương thức tạo ra của cải',
  '财帛宫': 'Dòng tiền, phương thức tạo ra của cải',
  '疾厄':   'Thể chất sức khỏe, kinh lạc tạng phủ',
  '疾厄宫': 'Thể chất sức khỏe, kinh lạc tạng phủ',
  '迁移':   'Cơ hội đi xa, giao thiệp đối ngoại, xuất ngoại',
  '迁移宫': 'Cơ hội đi xa, giao thiệp đối ngoại, xuất ngoại',
  '交友':   'Bạn bè xã hội, quý nhân, nhân viên cấp dưới',
  '交友宫': 'Bạn bè xã hội, quý nhân, nhân viên cấp dưới',
  '仆役':   'Bạn bè xã hội, quý nhân, nhân viên cấp dưới',
  '仆役宫': 'Bạn bè xã hội, quý nhân, nhân viên cấp dưới',
  '官禄':   'Công danh sự nghiệp, địa vị xã hội, thực quyền',
  '官禄宫': 'Công danh sự nghiệp, địa vị xã hội, thực quyền',
  '田宅':   'Bất động sản, điền sản, gia đạo, kho của',
  '田宅宫': 'Bất động sản, điền sản, gia đạo, kho của',
  '福德':   'Đời sống tinh thần, phúc ấm tổ tiên, thọ khang',
  '福德宫': 'Đời sống tinh thần, phúc ấm tổ tiên, thọ khang',
  '父母':   'Quan hệ phụ mẫu, trưởng bối, văn thư bằng cấp',
  '父母宫': 'Quan hệ phụ mẫu, trưởng bối, văn thư bằng cấp',
};

function getPalaceRoleVi(name: string): string {
  return PALACE_ROLES_MAP[name] || PALACE_ROLES_MAP[name.replace('宫', '')] || 'Cung vị trọng yếu trên tinh bàn';
}

function interpretPalaceDeep(chart: ZiweiChart, palaceName: string): string {
  const cleanName = palaceName.replace('宫', '');
  const pal = findPalace(chart, cleanName) || findPalace(chart, palaceName);
  const palaceVi = getPalaceVi(cleanName);
  const branchName = pal?.branch !== undefined ? BRANCHES[pal.branch] : '';
  const starDesc = formatStarsVi(pal);
  const role = getPalaceRoleVi(cleanName);
  const majorStars = pal?.stars.filter(s => s.type === 'major') || [];
  const satStars = pal?.stars.filter(s => ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫', '化忌'].includes(s.name) || s.siHua === '忌') || [];
  const catStars = pal?.stars.filter(s => ['左辅', '右弼', '文昌', '文曲', '天魁', '天钺', '禄存', '天马', '化禄', '化权', '化科'].includes(s.name) || (s.siHua && s.siHua !== '忌')) || [];

  const palBranch = pal?.branch ?? 0;
  const triBranches = [palBranch, (palBranch + 4) % 12, (palBranch + 8) % 12, (palBranch + 6) % 12];
  const sanFangPalaces = chart.palaces.filter(p => triBranches.includes(p.branch) && p.name !== pal?.name);
  const sanFangSummary = sanFangPalaces.map(p => `cung **${getPalaceVi(p.name)}** (${formatStarsVi(p)})`).join(', ');

  let specificAdvice = '';
  if (cleanName === '田宅') {
    specificAdvice = `Điền Trạch là kho cất giữ gia tài, bất động sản và sự an ổn của gia trạch. Thầy Nghê Hải Hà dạy: "Tài Bạch là dòng tiền lưu động bên ngoài, còn Điền Trạch mới là kho báu giữ tiền thực sự." Cung này có ${catStars.length > 0 ? `các cát tinh (${catStars.map(s => getStarVi(s.name)).join(', ')}) chủ về dễ tích lũy bất động sản vững chắc.` : `tinh diệu bình hòa, nên ưu tiên tích lũy an toàn, chuyển tiền mặt thành tài sản kiên cố.`}`;
  } else if (cleanName === '福德') {
    specificAdvice = `Phúc Đức là nguồn mạch tâm linh, tư tưởng sâu kín và phúc báo của tổ tiên. Người xưa nói: "Phúc Đức tốt thì hoạn nạn hóa lành, Phúc Đức suy thì dù giàu sang tâm trí vẫn bất an." Cung này phản ánh mức độ thư thái nội tâm và khả năng tự chữa lành của bạn trước áp lực cuộc sống.`;
  } else if (cleanName === '兄弟') {
    specificAdvice = `Cung Huynh Đệ chủ về tình cảm anh chị em ruột thịt kiêm đối tác cùng chung chí hướng. ${satStars.length > 0 ? 'Có sát tinh hội tụ, trong công việc hợp tác làm ăn nên rõ ràng về tài chính, văn bản minh bạch để tránh tổn hại tình nghĩa.' : 'Anh em thuận hòa, có thể tương trợ lẫn nhau khi đứng trước các bước ngoặt cuộc đời.'}`;
  } else if (cleanName === '父母') {
    specificAdvice = `Cung Phụ Mẫu chủ về phúc ấm của song thân, trưởng bối và liên quan trực tiếp đến hồ sơ, bằng cấp, thủ tục pháp lý. Cung vị này nhắc nhở mệnh chủ giữ trọn đạo hiếu và cẩn trọng khi ký kết các giấy tờ quan trọng.`;
  } else if (cleanName === '子女') {
    specificAdvice = `Cung Tử Tức chủ về duyên phận con cái, học trò và thế hệ nối nghiệp. Gia đạo lấy tình thương và sự tôn trọng tính cách độc lập của con trẻ làm kim chỉ nam để vun vén tình cảm gia đình.`;
  } else if (cleanName === '交友' || cleanName === '仆役') {
    specificAdvice = `Cung Nô Bộc (Giao Hữu) chủ về bạn bè xã giao, cấp dưới và trợ lực từ tập thể. ${satStars.length > 0 ? 'Cần cẩn trọng trong việc chọn bạn mà chơi, không nên quá tin tưởng giao phó tài chính bí mật cho người ngoài.' : 'Được bạn bè và cấp dưới tôn trọng, dễ xây dựng mạng lưới quan hệ xã hội lành mạnh.'}`;
  } else if (cleanName === '迁移') {
    specificAdvice = `Cung Thiên Di đại diện cho môi trường đối ngoại, cơ hội xuất ngoại và quý nhân phương xa. Cung vị này đối diện trực tiếp Cung Mệnh, mở ra cánh cửa giao thiệp và tầm nhìn rộng lớn. Càng bước ra ngoài cọ xát bạn càng tích lũy được nhiều kinh nghiệm quý báu.`;
  } else {
    specificAdvice = `Mỗi cung vị đều là một trường năng lượng bổ trợ cho bản mệnh. Hiểu rõ ưu thế của cát tinh và cảnh giác trước các thử thách sát tinh để luôn chủ động trong vận trình.`;
  }

  return `**【Cung Vị Định Tính】**
Cung **${palaceVi}** (${palaceName}) tọa tại địa chi **${branchName}**, chủ quản: **${role}**.
Tinh diệu tọa thủ bản cung: ${starDesc}.
${majorStars.length > 0 ? `Chính tinh nắm quyền chi phối: **${majorStars.map(s => getStarVi(s.name)).join(', ')}**.` : 'Cung Vô Chính Diệu, mượn tinh diệu từ cung xung chiếu để định hình năng lượng.'}

**【Chính Tinh & Tứ Hóa Luận Giải】**
- **Trạng thái tinh diệu:** ${catStars.length > 0 ? `Hội tụ cát diệu (${catStars.map(s => getStarVi(s.name)).join(', ')}) mang lại nguồn trợ lực cát lành và hanh thông.` : 'Tinh diệu bình hòa, mang tính tự lực bồi đắp.'} ${satStars.length > 0 ? `Có sự hiện diện của sát tinh/kỵ tinh (${satStars.map(s => getStarVi(s.name)).join(', ')}), cần lưu tâm để hóa giải xung đột và giữ gìn nội lực.` : ''}
- **Khẩu quyết Thầy Nghê Hải Hà (*Thiên Kỷ*):** "Cát tinh nhập cung là thời cơ, sát tinh nhập cung là bài học tôi rèn phẩm hạnh. Đạt được tâm thế bình thản trước biến động thì nơi nào cũng là đất phúc."

**【Tam Phương Tứ Chính Liên Động】**
Cung **${palaceVi}** tương tác mật thiết với tam phương tứ chính gồm: ${sanFangSummary || 'các cung vị củng chiếu'}. Thế liên hoàn này phản ánh sự cộng hưởng giữa năng lượng cá nhân và hoàn cảnh ngoại cảnh.

**【Lời Khuyên Ứng Dụng Thực Tiễn】**
${specificAdvice}
Luôn nhớ lời dạy của Thầy Nghê Sư: *"Tiên thiên Mệnh chiếm 1/3, Nhân sự nỗ lực chiếm 1/3, Địa lý phong thủy chiếm 1/3. Biết thiên cơ để tự mình hành xử đúng đắn, đó mới là chân lý."*`;
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

/** Giải đáp thắc mắc chuyên biệt do người dùng tự đặt câu hỏi trong khung chat */
export function answerIndividualUserQuery(chart: ZiweiChart, query: string): string {
  const q = query.trim();
  const lowerQ = q.toLowerCase();

  const mingPalace = chart.palaces.find(p => p.branch === chart.mingGongBranch);
  const shenPalace = chart.palaces.find(p => p.branch === chart.shenGongBranch);
  const careerPalace = findPalace(chart, '官禄');
  const wealthPalace = findPalace(chart, '财帛');
  const travelPalace = findPalace(chart, '迁移');
  const spousePalace = findPalace(chart, '夫妻');
  const fudePalace = findPalace(chart, '福德');
  const healthPalace = findPalace(chart, '疾厄');
  const propertyPalace = findPalace(chart, '田宅');
  const childrenPalace = findPalace(chart, '子女');
  const parentsPalace = findPalace(chart, '父母');

  const mingMajorStars = mingPalace?.stars.filter(s => s.type === 'major') || [];
  const primaryStar = mingMajorStars[0]?.name || '';
  const starNameVi = primaryStar ? getStarVi(primaryStar) : 'Vô Chính Diệu';
  const shenNameClean = (shenPalace?.name || 'Mệnh').replace('宫', '');
  const shenMeaning = SHEN_GONG_DESC[shenNameClean] || `Thân cư ${getPalaceVi(shenPalace?.name || '')}: Nửa đời sau tập trung phát triển cung vị này.`;

  // 1. TÌNH DUYÊN & KẾT HÔN
  if (
    lowerQ.includes('kết hôn') || lowerQ.includes('cưới') || lowerQ.includes('tình duyên') ||
    lowerQ.includes('người yêu') || lowerQ.includes('lập gia đình') || lowerQ.includes('lấy chồng') ||
    lowerQ.includes('lấy vợ') || lowerQ.includes('hôn nhân') || lowerQ.includes('bạn đời')
  ) {
    const spouseStars = formatStarsVi(spousePalace);
    const fudeStars = formatStarsVi(fudePalace);
    const mainSpouseStar = spousePalace?.stars.find(s => s.type === 'major')?.name || '';
    const fuqiInfo = STAR_IN_FUQI_GU[mainSpouseStar];

    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Cung Phu Thê & Cung Phúc Đức:**
- **Cung Phu Thê tọa thủ:** Hội tụ tinh diệu: ${spouseStars}.
- **Cung Phúc Đức (gốc rễ nghiệp duyên trường cửu):** Hội tụ: ${fudeStars}.
- **Đặc trưng duyên phối ngẫu:** ${fuqiInfo?.summary || 'Tình duyên cần sự đồng điệu tâm hồn và kiên nhẫn bồi đắp. Cung vị này cho thấy người bạn đời có năng lực độc lập và cá tính riêng biệt.'}

**2. Thời điểm cát lợi & Định hướng hôn nhân:**
- Thầy Nghê Hải Hà dạy: *"Hôn nhân là việc trọng đại đời người, xem đại hạn và lưu niên khi cung Phu Thê hoặc Mệnh gặp Đào Hoa, Hồng Loan, Thiên Hỷ hoặc Hóa Lộc, Hóa Khoa củng chiếu là lúc duyên lành nở rộ."*
- ${spousePalace?.stars.some(s => ['七杀', '破军', '贪狼', '巨门', '擎羊', '陀罗', '火星', '铃星'].includes(s.name))
  ? 'Cung Phu Thê có sát tinh hoặc biến tinh tọa thủ, mệnh chủ nên kết hôn muộn (sau 28 - 30 tuổi) khi sự nghiệp đã vững vàng và tâm tính trầm ổn, như vậy hôn nhân sẽ tránh được sóng gió và hạnh phúc trọn vẹn.'
  : 'Cung Phu Thê tọa cát tinh hiền hòa, duyên lành đến tự nhiên trong các năm tam hợp Hợi - Mão - Mùi hoặc Dần - Ngọ - Tuất theo lưu niên đào hoa.'}

**3. Khẩu quyết Thầy Nghê Hải Hà (*Thiên Kỷ*):**
*"Hôn nhân thành bại 1/3 do mệnh, 1/3 do sự bao dung nhường nhịn, 1/3 do phong thủy phòng ngủ. Đặt phòng ngủ vợ chồng tại Tây Bắc (quẻ Địa Thiên Thái) để gia đạo luôn thuận hòa, êm ấm trường cửu."*`;
  }

  // 2. CÔNG VIỆC, NGHỀ NGHIỆP & THĂNG TIẾN
  if (
    lowerQ.includes('công việc') || lowerQ.includes('sự nghiệp') || lowerQ.includes('đổi việc') ||
    lowerQ.includes('nhảy việc') || lowerQ.includes('thăng tiến') || lowerQ.includes('làm ăn') ||
    lowerQ.includes('kinh doanh') || lowerQ.includes('nghề') || lowerQ.includes('quan lộc')
  ) {
    const careerStars = formatStarsVi(careerPalace);
    const wealthStars = formatStarsVi(wealthPalace);

    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Định vị Cung Quan Lộc (Sự Nghiệp) & Cung Mệnh:**
- **Cung Quan Lộc hội tụ:** ${careerStars}.
- **Mệnh chủ tọa tinh:** **${starNameVi}** — chủ về ${STAR_NATURE_VI[primaryStar]?.role || 'năng lực thích ứng và quyền biến theo thời thế'}.
- **Thế sự nghiệp:** ${careerPalace?.stars.some(s => ['七杀', '破军', '贪狼', '武曲'].includes(s.name))
  ? 'Thích hợp vai trò tiên phong, tự chủ lập nghiệp, thương trường kinh doanh hoặc các lĩnh vực đột phá, sáng tạo đổi mới.'
  : 'Thích hợp phát triển chuyên môn sâu sắc, quản lý dự án, cố vấn chiến lược, công chức hoặc các tổ chức quy mô lớn.'}

**2. Đánh giá thời cơ & Quyết định biến động (Đổi việc / Khởi sự):**
- Thầy Nghê Hải Hà dạy: *"Muốn biết có nên chuyển đổi công việc hay không, hãy nhìn xem cung Quan Lộc và Mệnh có Hóa Quyền (nắm thực quyền), Hóa Lộc (tài nguyên tăng) hay Hóa Kỵ (trở ngại, áp lực). Gặp cát tinh thì mạnh dạn xuất kích, gặp Kỵ tinh thì án binh bất động, lấy việc trau dồi nội lực làm gốc."*
- Cung Quan Lộc phối chiếu với Cung Tài Bạch (${wealthStars}) tạo thế hỗ trợ: Thực tài của bạn sẽ chuyển hóa thành danh tiếng và thu nhập xứng đáng khi bạn tập trung phát huy tối đa thế mạnh cốt lõi.

**3. Lời khuyên định hướng:**
- Khi đứng trước ngã rẽ chuyển việc: Ưu tiên môi trường cho phép bạn phát huy sự chủ động và tự do tư duy. Tránh vội vã đưa ra quyết định khi tâm trí đang căng thẳng.`;
  }

  // 3. TÀI CHÍNH, TIỀN TÀI & ĐẦU TƯ
  if (
    lowerQ.includes('tài chính') || lowerQ.includes('tiền') || lowerQ.includes('tài lộc') ||
    lowerQ.includes('giàu') || lowerQ.includes('đầu tư') || lowerQ.includes('nhà đất') ||
    lowerQ.includes('bất động sản') || lowerQ.includes('tài bạch')
  ) {
    const wealthStars = formatStarsVi(wealthPalace);
    const propStars = formatStarsVi(propertyPalace);

    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Cung Tài Bạch (Dòng tiền) & Cung Điền Trạch (Kho tích lũy):**
- **Cung Tài Bạch:** Hội tụ tinh diệu: ${wealthStars}. Thể hiện năng lực tạo dòng tiền lưu động và cơ hội gia tăng thu nhập.
- **Cung Điền Trạch:** Hội tụ tinh diệu: ${propStars}. Thể hiện khả năng giữ tiền, bất động sản và tài sản thừa kế.
- **Y pháp Nghê Sư:** *"Tài Bạch vi ngọc, Điền Trạch vi khố. Kiếm được nhiều tiền ở Tài Bạch mà Điền Trạch rỗng thì như giỏ tre múc nước. Người có trí tuệ luôn chuyển dòng tiền lưu động thành đất đai, nhà cửa và tài sản thực."*

**2. Chiến lược tích lũy & Đầu tư tài chính:**
- Khả năng tạo ra của cải của bạn gắn liền với phẩm chất của sao **${starNameVi}**. Khi nguồn thu dồi dào, hãy ưu tiên trích lập quỹ dự phòng và chuyển đổi vào các tài sản kiên cố.
- Cảnh giác với các hình thức đầu cơ may rủi ngắn hạn, đặc biệt khi các cung vị tài chính gặp sát tinh như Địa Không, Địa Kiếp hay Kình Dương. Hãy đầu tư vào giá trị thực chất và chuyên môn bản thân.`;
  }

  // 4. SỨC KHỎE, TẠNG PHỦ & DƯỠNG SINH
  if (
    lowerQ.includes('sức khỏe') || lowerQ.includes('bệnh') || lowerQ.includes('tật ách') ||
    lowerQ.includes('ngủ') || lowerQ.includes('thuốc') || lowerQ.includes('y tế') ||
    lowerQ.includes('tạng phủ') || lowerQ.includes('kinh lạc')
  ) {
    const healthStars = formatStarsVi(healthPalace);
    const branchIdx = healthPalace?.branch ?? 0;
    const organInfo = BRANCH_ORGAN_MAP[branchIdx] || { organ: 'Hệ tiêu hóa và ngũ tạng', note: 'Cần chú ý điều độ sinh hoạt và giữ nhịp thở sâu.' };

    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Cung Tật Ách theo Y Đạo Nghê Hải Hà:**
- **Cung Tật Ách tọa tại địa chi:** ${BRANCHES[branchIdx]} (${healthPalace?.name ? getPalaceVi(healthPalace.name) : 'Tật Ách'}).
- **Tinh diệu hội tụ:** ${healthStars}.
- **Tạng phủ tương ứng tiên thiên:** **${organInfo.organ}**.
- **Kinh lạc vận hành:** ${organInfo.note}.

**2. Lời khuyên dưỡng sinh Thầy Nghê Hải Hà (*Thiên Kỷ - Hoàng Đế Nội Kinh*):**
- *"Bách bệnh sinh ra do khí huyết ứ trệ và thức khuya tổn Can Đởm. Muốn dưỡng mệnh trường thọ, tiên quyết phải ngủ say trước 23h đêm (giờ Tý) để kinh Đởm lọc máu sinh tủy mới."*
- Giữ tinh thần thanh tịnh, vận động điều độ hàng ngày để dương khí lưu thông khắp cơ thể, bách tà bất xâm.`;
  }

  // 5. XUẤT NGOẠI, ĐI XA & ĐỊNH CƯ
  if (
    lowerQ.includes('xuất ngoại') || lowerQ.includes('đi xa') || lowerQ.includes('nước ngoài') ||
    lowerQ.includes('định cư') || lowerQ.includes('du học') || lowerQ.includes('thiên di')
  ) {
    const travelStars = formatStarsVi(travelPalace);

    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Cung Thiên Di (Đối ngoại & Môi trường phương xa):**
- **Cung Thiên Di hội tụ:** ${travelStars}.
- **Thế tương quan Mệnh - Di:** Mệnh tọa ${starNameVi}, đối diện là Cung Thiên Di. 
- ${travelPalace?.stars.some(s => ['天马', '太阳', '太阴', '七杀', '破军', '贪狼'].includes(s.name))
  ? 'Lá số có duyên nợ lớn với phương xa. Càng đi ra ngoài môi trường rộng lớn, bạn càng dễ gặp quý nhân trợ lực và mở rộng tầm nhìn sự nghiệp.'
  : 'Môi trường quen thuộc hoặc quê hương là bệ phóng an toàn, nếu đi xa làm ăn nên chuẩn bị kế hoạch chu đáo và tìm kiếm đối tác đáng tin cậy.'}

**2. Lời khuyên hành trình:**
- Đi xa cần chú ý giấy tờ pháp lý và phương tiện di chuyển. Luôn giữ thái độ hòa nhã, khiêm tốn khi tiếp xúc với môi trường văn hóa mới.`;
  }

  // 6. CON CÁI & HẬU DUỆ
  if (lowerQ.includes('con cái') || lowerQ.includes('sinh con') || lowerQ.includes('tử tức')) {
    const childrenStars = formatStarsVi(childrenPalace);
    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Cung Tử Tức:**
- **Cung Tử Tức hội tụ:** ${childrenStars}.
- Thế cung phản ánh con cái là người thông minh, có chí tiến thủ và mang lại niềm vui cho gia đình.

**2. Lời khuyên theo Thiên Kỷ:**
- Chú trọng giáo dục nhân cách từ nhỏ, tạo môi trường gia đình ấm áp, yêu thương để các con phát triển toàn diện cả trí tuệ lẫn đạo đức.`;
  }

  // 7. VẬN HẠN, ĐẠI HẠN, LƯU NIÊN & THỜI VẬN
  const currentDx = chart.daXians[chart.currentDaXianIndex];
  if (
    lowerQ.includes('vận hạn') || lowerQ.includes('năm nay') || lowerQ.includes('lưu niên') ||
    lowerQ.includes('đại hạn') || lowerQ.includes('thời vận') || lowerQ.includes('tương lai') ||
    lowerQ.includes('may mắn') || lowerQ.includes('xui xẻo') || lowerQ.includes('khi nào') ||
    lowerQ.includes('vận may') || lowerQ.includes('vận')
  ) {
    const dxPalace = chart.palaces.find(p => p.name === currentDx?.palaceName || p.name.replace('宫', '') === currentDx?.palaceName?.replace('宫', ''));
    const dxStars = formatStarsVi(dxPalace);
    const dxPalaceVi = dxPalace ? getPalaceVi(dxPalace.name) : 'Cung Vị Đại Hạn';

    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Vận Trình Đại Hạn Hiện Tại (${currentDx?.startAge ?? 0} - ${currentDx?.endAge ?? 0} tuổi):**
- **Đại Hạn chuyển dịch tới:** Cung **${dxPalaceVi}** (${currentDx?.palaceName || ''}), hội tụ tinh diệu: ${dxStars}.
- **Xu hướng năng lượng 10 năm:** Đây là giai đoạn trọng yếu kích hoạt các cơ hội và thử thách liên quan đến cung ${dxPalaceVi}. Các tinh diệu tọa thủ tại đây định hình môi trường thực tế và phương hướng hành động của bạn.

**2. Nhận định Thời Vận & Lưu Niên theo Thầy Nghê Hải Hà (*Thiên Kỷ*):**
- *"Đại đạo chí giản — biết vận để thuận thời ứng biến. Khi đại hạn gặp cát tinh củng chiếu thì chủ động nắm bắt thời cơ, dốc sức kiến tạo; khi gặp sát kỵ xung phá thì củng cố nội lực, tu tâm dưỡng tính, lấy thận trọng làm đầu."*
- Cung vị Đại Hạn có sự tương tác sâu sắc với tam phương tứ chính bản mệnh, mở ra giai đoạn tích lũy kinh nghiệm và chuyển hóa nội tâm quý giá.

**3. Kim chỉ nam hành động:**
- Giữ tinh thần vững vàng, không nóng vội trước những chậm trễ tạm thời. Tập trung vào những mục tiêu dài hạn có tính thực chất thay vì chạy theo các trào lưu ngắn hạn.`;
  }

  // 8. BẤT ĐỘNG SẢN, NHÀ ĐẤT & GIA ĐẠO
  if (lowerQ.includes('nhà đất') || lowerQ.includes('bất động sản') || lowerQ.includes('mua nhà') || lowerQ.includes('đất đai') || lowerQ.includes('nhà cửa') || lowerQ.includes('điền trạch')) {
    const propStars = formatStarsVi(propertyPalace);
    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Cung Điền Trạch (Kho của & Bất động sản):**
- **Cung Điền Trạch hội tụ tinh diệu:** ${propStars}.
- **Ý pháp Thầy Nghê Hải Hà (*Thiên Kỷ*):** *"Tài Bạch vi ngọc, Điền Trạch vi khố. Người có trí tuệ luôn chuyển dòng tiền lưu động thành đất đai, nhà cửa vững chắc để tích phúc lưu truyền cho hậu thế."*

**2. Chiến lược tích lũy & Bố trí gia trạch:**
- Xem xét kỹ pháp lý và hướng nhà phù hợp phong thủy trước khi quyết định giao dịch lớn. Khi tài chính dư dả, chuyển tiền vào các tài sản kiên cố sẽ giúp bạn tụ tài bền vững.
- Giữ gìn không gian sống sạch sẽ, thoáng đãng, hướng Tây Bắc và Trung Cung hài hòa để vượng khí gia đạo hưng long.`;
  }

  // 9. BẠN BÈ, ĐỒNG NGHIỆP, CẤP DƯỚI & HỢP TÁC
  const friendsPalace = findPalace(chart, '交友') || findPalace(chart, '仆役');
  const brotherPalace = findPalace(chart, '兄弟');
  if (lowerQ.includes('bạn bè') || lowerQ.includes('đồng nghiệp') || lowerQ.includes('cấp dưới') || lowerQ.includes('nô bộc') || lowerQ.includes('giao hữu') || lowerQ.includes('nhân sự') || lowerQ.includes('hợp tác')) {
    const friendsStars = formatStarsVi(friendsPalace);
    const brotherStars = formatStarsVi(brotherPalace);
    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Cung Nô Bộc (Giao Hữu) & Cung Huynh Đệ:**
- **Cung Nô Bộc (Bạn bè, cấp dưới):** Hội tụ: ${friendsStars}.
- **Cung Huynh Đệ (Anh em, đối tác ruột thịt):** Hội tụ: ${brotherStars}.
- **Ý nghĩa quan hệ nhân sự:** Phản ánh mức độ tin cậy của bạn bè xã giao, năng lực điều hành nhân sự và sự hỗ trợ từ các mối quan hệ xã hội.

**2. Lời khuyên đối nhân xử thế theo Thầy Nghê Hải Hà:**
- "Chọn bạn mà chơi, chọn đối tác mà hợp tác". Rõ ràng về mặt tài chính và trách nhiệm sẽ giúp bạn giữ gìn được tình bạn chân thành và bền chặt dài lâu, tránh bị thị phi lôi kéo.`;
  }

  // 10. CHA MẸ, TRƯỞNG BỐI, HỌC VẤN & THI CỬ
  if (lowerQ.includes('cha mẹ') || lowerQ.includes('bố mẹ') || lowerQ.includes('phụ mẫu') || lowerQ.includes('học vấn') || lowerQ.includes('thi cử') || lowerQ.includes('bằng cấp') || lowerQ.includes('học hành')) {
    const parentsStars = formatStarsVi(parentsPalace);
    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Cung Phụ Mẫu & Văn Thư Ấn Tín:**
- **Cung Phụ Mẫu hội tụ tinh diệu:** ${parentsStars}.
- **Ý nghĩa tiên thiên:** Chi phối mối quan hệ với trưởng bối, phúc ấm gia đình và khả năng học tập, thi cử, đỗ đạt giấy tờ bằng cấp.

**2. Lời khuyên theo Thiên Kỷ Nghê Hải Hà:**
- Lấy hiếu đạo làm gốc rễ sinh phúc lành. Trong học tập và thi cử, chuẩn bị kiến thức bài bản, tôn trọng quy trình pháp lý để luôn hanh thông, tránh sai sót giấy tờ.`;
  }

  // 11. ĐỜI SỐNG TINH THẦN & PHÚC ĐỨC
  if (lowerQ.includes('phúc đức') || lowerQ.includes('tâm linh') || lowerQ.includes('tổ tiên') || lowerQ.includes('thanh thản') || lowerQ.includes('tâm an')) {
    const fudeStars = formatStarsVi(fudePalace);
    return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Khảo sát Cung Phúc Đức (Nghiệp Quả & Đời Sống Nội Tâm):**
- **Cung Phúc Đức hội tụ tinh diệu:** ${fudeStars}.
- **Ý pháp Thầy Nghê Hải Hà (*Thiên Kỷ*):** *"Cung Phúc Đức là gốc rễ quyết định sự bình an trọn đời. Phúc dày thì hoạn nạn hóa lành, phúc mỏng thì dù giàu sang tâm trí vẫn muộn phiền."*

**2. Bài học bồi đắp phúc báo:**
- Thường xuyên tu tâm dưỡng tính, làm việc thiện lành không màng báo đáp và giữ lòng từ bi bao dung để gia tăng phúc khí cho bản thân và dòng họ.`;
  }

  // 12. CÂU HỎI TÙY BIẾN KHÁC
  return `**【Giải Đáp Thắc Mắc: "${q}"】**

**1. Chiếu rọi từ Tinh Bàn Mệnh Chủ:**
- **Bản mệnh tọa tinh:** **${starNameVi}** (${primaryStar || 'Vô Chính Diệu'}), nạp âm Cục số **${getWuXingJuVi(chart.wuxingJuName)}**.
- **Thân Cung:** An tại **${getPalaceVi(shenPalace?.name || '')}** (${shenNameClean}) — ${shenMeaning}
- Đối với vấn đề bạn đang băn khoăn (*"${q}"*), cấu trúc tinh bàn cho thấy nội lực của sao **${starNameVi}** kết hợp vị thế Thân Cung sẽ là điểm tựa vững chắc giúp bạn tìm ra hướng đi thấu đáo nhất.

**2. Kim chỉ nam hành động theo Thầy Nghê Hải Hà (*Thiên Kỷ*):**
- *"Đại đạo chí giản — việc gì trong đời cũng quy về chữ Tâm và chữ Nhẫn. Hiểu mệnh để nắm bắt thiên thời, sửa đổi thói quen để làm chủ nhân sự, và đặt mình đúng phong thủy địa lý thì mọi gian khó đều chuyển thành đại phúc."*`;
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
  let starRole = '';
  let starDesc = '';
  let starQuote = '';
  let starPersonality = '';

  if (mingMajorStars.length === 0) {
    const travelStars = travelPalace?.stars.filter(s => s.type === 'major') || [];
    const travelNamesVi = travelStars.map(s => `${getStarVi(s.name)} (${s.name})`).join(' và ');
    starRole = 'Mệnh Cách Đặc Thù (Vô Chính Diệu)';
    starDesc = travelStars.length > 0
      ? `Mệnh không có chính tinh tọa thủ, đắc cách mượn tinh diệu đối cung là **${travelNamesVi}** tại Cung Thiên Di củng chiếu để khai mở vận trình.`
      : 'Lá số có thế cục uyển chuyển, mượn tinh diệu cung xung chiếu để khai mở vận trình, phản ứng nhạy bén theo thời cuộc.';
    starQuote = 'Thầy Nghê Hải Hà dạy: "Mệnh vô chính diệu phải xem kỹ thế tam phương tứ chính và cung Thiên Di đối chiếu. Biết mượn lực người khác thì tiền đồ vô lượng."';
    starPersonality = 'Khả năng thích ứng cao, uyển chuyển đa tài, thông minh linh hoạt nhưng cần xác lập mục tiêu rõ ràng để tránh phân tán năng lượng.';
  } else if (mingMajorStars.length === 1) {
    const s = mingMajorStars[0].name;
    const info = STAR_NATURE_VI[s] || { role: s, desc: '', niQuote: '', personality: '' };
    starRole = info.role;
    starDesc = info.desc;
    starQuote = info.niQuote;
    starPersonality = info.personality;
  } else {
    const s1 = mingMajorStars[0].name;
    const s2 = mingMajorStars[1].name;
    const info1 = STAR_NATURE_VI[s1];
    const info2 = STAR_NATURE_VI[s2];
    const n1 = getStarVi(s1);
    const n2 = getStarVi(s2);
    starRole = `Song Tinh Đồng Cung: ${n1} & ${n2} (${s1} - ${s2})`;
    starDesc = `Thế tinh diệu tương hội giữa ${n1} (${info1?.role || s1}) và ${n2} (${info2?.role || s2}). Cốt cách mang năng lượng: ${info1?.desc || ''} Đồng thời phối hợp cùng: ${info2?.desc || ''}`;
    starQuote = `Thầy Nghê Hải Hà dạy: "Song tinh đồng cung tại Mệnh tạo nên sự hòa quyện giữa hai trường năng lượng. Cần biết phát huy ưu điểm của từng tinh diệu để tạo bước đột phá phi thường." (${info1?.niQuote || ''} ${info2?.niQuote || ''})`;
    starPersonality = `Tính cách đa chiều, kết hợp hài hòa giữa ${info1?.personality || ''} và ${info2?.personality || ''}`;
  }

  const mingStarsLabel = mingMajorStars.length > 0
    ? mingMajorStars.map(s => `${getStarVi(s.name)} (${s.name})`).join(' và ')
    : 'Vô Chính Diệu';

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

  // ── Xử lý khi người dùng trực tiếp đặt câu hỏi tùy biến trong khung chat ──
  const isDirectQuestion = ctx.userQuery && !ctx.userQuery.includes('theo cấu trúc sau:') && ctx.userQuery.trim().length > 0;
  if (isDirectQuestion) {
    return answerIndividualUserQuery(chart, ctx.userQuery!.trim());
  }

  // ── XỬ LÝ THEO CHỦ ĐỀ & CUNG VỊ ĐƯỢC CHỌN ──
  // 1. Tình duyên / Cung Phu Thê
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

  // 2. Sự nghiệp / Cung Quan Lộc
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

  // 3. Tài lộc / Cung Tài Bạch
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

  // 4. Sức khỏe / Cung Tật Ách
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

  // 5. Tính cách
  if (topic === 'personality') {
    return `**【Khí chất chủ đạo】**
Cốt cách tâm hồn được định hình bởi chính tinh thủ Mệnh: **${mingStarsLabel}**.
- Đặc tính cốt lõi: ${starPersonality}
- Phong cách tư duy: Luôn có xu hướng chủ động, có chiều sâu nội tâm và ý thức tự tôn cao trong mọi hoàn cảnh.

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

  // 6. Cung vị chuyên biệt khi người dùng click vào cung bất kỳ (Huynh Đệ, Điền Trạch, Phúc Đức, Phụ Mẫu, Tử Tức, Nô Bộc, Thiên Di...)
  if (selectedPalaceName && !['命宫', '命'].includes(selectedPalaceName) && topic !== 'overview') {
    return interpretPalaceDeep(chart, selectedPalaceName);
  }

  // 7. Mặc định: Tổng quan Mệnh Cách
  return `**【Mệnh cách định tính】**
Lá số sinh năm **${STEMS[chart.lunarInfo?.yearStem ?? 0]}${BRANCHES[chart.lunarInfo?.yearBranch ?? 0]}** (${chart.yinYangGender === '阳男' ? 'Dương Nam' : chart.yinYangGender === '阳女' ? 'Dương Nữ' : chart.yinYangGender === '阴男' ? 'Âm Nam' : 'Âm Nữ'}), Nạp âm Cục số: **${getWuXingJuVi(chart.wuxingJuName)}**.
Mệnh Cung an tại **${getPalaceVi(mingPalace?.name || '')}** (${BRANCHES[chart.mingGongBranch]}), Thân Cung an tại **${getPalaceVi(shenPalace?.name || '')}** (${BRANCHES[chart.shenGongBranch]}).
Tinh diệu tọa thủ bản cung: ${formatStarsVi(mingPalace)}.
Bản mệnh thuộc dạng cách **${starRole}**. Cốt cách mang khí chất: ${starDesc}

**【Ý nghĩa Thân Cung & Hậu vận】**
${shenMeaning}

**【Chính tinh giải đoán】**
Chính tinh thủ Mệnh: **${mingStarsLabel}**
- Khí chất cốt tủy: ${starDesc}
- Khẩu quyết Thầy Nghê Hải Hà (*Thiên Kỷ*): "*${starQuote}*"

**【Tam phương tứ chính】**
Thế tam giác Mệnh - Quan - Tài - Di tạo thành thế chân vạc định hình đời người:
- **Cung Quan Lộc (Sự nghiệp):** Tọa tại ${careerPalace?.name ? getPalaceVi(careerPalace.name) : 'Quan Lộc'}, hội tụ: ${formatStarsVi(careerPalace)}.
- **Cung Tài Bạch (Tài chính):** Tọa tại ${wealthPalace?.name ? getPalaceVi(wealthPalace.name) : 'Tài Bạch'}, hội tụ: ${formatStarsVi(wealthPalace)}.
- **Cung Thiên Di (Đối ngoại):** Tọa tại ${travelPalace?.name ? getPalaceVi(travelPalace.name) : 'Thiên Di'}, hội tụ: ${formatStarsVi(travelPalace)}.
${patterns.length > 0 ? `Các cách cục đắc định trong cổ thư:\n${patternHighlights}` : 'Tam phương hội tụ tinh diệu bình hòa, thuộc mẫu hình tích lũy trung hậu, càng về hậu vận càng vững chãi.'}

**【Đại Hạn hiện tại】**
Bản mệnh đang tại đại hạn chuyển biến của cuộc đời, luân chuyển theo chiều vòng vận. Năng lượng đại hạn kích hoạt các cung vị then chốt, đòi hỏi sự linh hoạt và nắm bắt thời cơ.

**【Ưu thế & Lưu ý】**
- **Ưu thế thiên bẩm:** ${mingMajorStars.length > 0 ? `Nội lực vững chắc từ tinh diệu ${mingStarsLabel}, tư duy độc lập và năng lực kiên trì vượt khó.` : 'Thích nghi uyển chuyển, khéo nắm bắt thời cơ nhờ mượn lực tinh diệu xung chiếu.'}
- **Lời răn Thầy Nghê Hải Hà (*Thiên Kỷ*):** "Tiên thiên Mệnh chiếm 1/3, Phong thủy Địa lý chiếm 1/3, Nhân sự nỗ lực chiếm 1/3. Nếu ta biết mệnh, sửa đổi thói quen và đặt mình đúng phong thủy thì 2/3 chắc chắn thắng 1/3 mệnh trời!"`;

  return `**【Tổng luận ZHANXING MINGSHU】**\nLá số cấu trúc cân đối, tinh diệu phát huy đúng vị trí. Hãy vững tâm tiến bước và tự tin làm chủ vận mệnh của mình!`;
}
