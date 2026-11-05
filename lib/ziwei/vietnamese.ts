/**
 * lib/ziwei/vietnamese.ts
 * Bảng quy chuẩn thuật ngữ Tử Vi Đẩu Số (Hán - Việt)
 * Dành cho hệ thống luận giải chuẩn theo trường phái Nghê Hải Hà (Thiên Kỷ)
 */

export const STAR_VI_MAP: Record<string, string> = {
  // Thập tứ chính tinh (14 Chính Tinh)
  '紫微': 'Tử Vi',
  '天机': 'Thiên Cơ',
  '太阳': 'Thái Dương',
  '武曲': 'Vũ Khúc',
  '天同': 'Thiên Đồng',
  '廉贞': 'Liêm Trinh',
  '天府': 'Thiên Phủ',
  '太阴': 'Thái Âm',
  '贪狼': 'Tham Lang',
  '巨门': 'Cự Môn',
  '天相': 'Thiên Tướng',
  '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát',
  '破军': 'Phá Quân',

  // Lục Cát Tinh & Phụ tinh cát lợi
  '左辅': 'Tả Phụ',
  '右弼': 'Hữu Bật',
  '文昌': 'Văn Xương',
  '文曲': 'Văn Khúc',
  '天魁': 'Thiên Khôi',
  '天钺': 'Thiên Việt',
  '禄存': 'Lộc Tồn',
  '天马': 'Thiên Mã',
  '化禄': 'Hóa Lộc',
  '化权': 'Hóa Quyền',
  '化科': 'Hóa Khoa',
  '化忌': 'Hóa Kỵ',

  // Lục Sát Tinh
  '擎羊': 'Kình Dương',
  '陀罗': 'Đà La',
  '火星': 'Hỏa Tinh',
  '铃星': 'Linh Tinh',
  '地空': 'Địa Không',
  '地劫': 'Địa Kiếp',

  // Tạp Diệu & Bác Sĩ / Tuế Tiền / Tướng Tinh
  '红鸾': 'Hồng Loan',
  '天喜': 'Thiên Hỷ',
  '天姚': 'Thiên Diêu',
  '天刑': 'Thiên Hình',
  '天哭': 'Thiên Khốc',
  '天虚': 'Thiên Hư',
  '天德': 'Thiên Đức',
  '月德': 'Nguyệt Đức',
  '解神': 'Giải Thần',
  '龙池': 'Long Trì',
  '凤阁': 'Phượng Các',
  '三台': 'Tam Thai',
  '八座': 'Bát Tọa',
  '恩光': 'Ân Quang',
  '天贵': 'Thiên Quý',
  '台辅': 'Đài Phụ',
  '封诰': 'Phong Cáo',
  '孤辰': 'Cô Thần',
  '寡宿': 'Quả Tú',
  '蜚廉': 'Phi Liêm',
  '破碎': 'Phá Toái',
  '华盖': 'Hoa Cái',
  '咸池': 'Hàm Trì',
  '大耗': 'Đại Hao',
  '小耗': 'Tiểu Hao',
  '截空': 'Triệt Không',
  '旬空': 'Tuần Không',
  '截路': 'Triệt Lộ',
  '空亡': 'Không Vong',
  '副截': 'Phó Triệt',
  '副旬': 'Phó Tuần',
  '阴煞': 'Âm Sát',
  '天月': 'Thiên Nguyệt',
  '天官': 'Thiên Quan',
  '天福': 'Thiên Phúc',
  '天才': 'Thiên Tài',
  '天寿': 'Thiên Thọ',
  '天伤': 'Thiên Thương',
  '天使': 'Thiên Sứ',
  '天巫': 'Thiên Vu',
  '天空': 'Thiên Không',
};

export const PALACE_VI_MAP: Record<string, string> = {
  '命宫': 'Mệnh Cung',
  '身宫': 'Thân Cung',
  '兄弟': 'Huynh Đệ',
  '夫妻': 'Phu Thê',
  '子女': 'Tử Tức',
  '财帛': 'Tài Bạch',
  '疾厄': 'Tật Ách',
  '迁移': 'Thiên Di',
  '仆役': 'Nô Bộc',
  '交友': 'Giao Hữu',
  '官禄': 'Quan Lộc',
  '田宅': 'Điền Trạch',
  '福德': 'Phúc Đức',
  '父母': 'Phụ Mẫu',
};

export const BRIGHTNESS_VI_MAP: Record<string, string> = {
  '庙': 'Miếu',
  '旺': 'Vượng',
  '得': 'Đắc',
  '利': 'Lợi',
  '平': 'Bình',
  '不': 'Bất',
  '闲': 'Nhàn',
  '陷': 'Hãm',
  '地': 'Địa',
};

export const STEM_VI_MAP: Record<string, string> = {
  '甲': 'Giáp',
  '乙': 'Ất',
  '丙': 'Bính',
  '丁': 'Đinh',
  '戊': 'Mậu',
  '己': 'Kỷ',
  '庚': 'Canh',
  '辛': 'Tân',
  '壬': 'Nhâm',
  '癸': 'Quý',
};

export const BRANCH_VI_MAP: Record<string, string> = {
  '子': 'Tý',
  '丑': 'Sửu',
  '寅': 'Dần',
  '卯': 'Mão',
  '辰': 'Thìn',
  '巳': 'Tỵ',
  '午': 'Ngọ',
  '未': 'Mùi',
  '申': 'Thân',
  '酉': 'Dậu',
  '戌': 'Tuất',
  '亥': 'Hợi',
};

export const WUXINGJU_VI_MAP: Record<string, string> = {
  '水二局': 'Thủy Nhị Cục (2)',
  '木三局': 'Mộc Tam Cục (3)',
  '金四局': 'Kim Tứ Cục (4)',
  '土五局': 'Thổ Ngũ Cục (5)',
  '火六局': 'Hỏa Lục Cục (6)',
};

export const SIHUA_VI_MAP: Record<string, string> = {
  '禄': 'Lộc',
  '权': 'Quyền',
  '科': 'Khoa',
  '忌': 'Kỵ',
};

export const SIHUA_FULL_VI_MAP: Record<string, string> = {
  '禄': 'Hóa Lộc (Tài phú, hanh thông, hưởng thụ)',
  '权': 'Hóa Quyền (Quyền lực, năng lực, kiểm soát)',
  '科': 'Hóa Khoa (Danh tiếng, quý nhân, văn chương)',
  '忌': 'Hóa Kỵ (Trở ngại, nợ nần, thị phi, bài học)',
};

/** Bảng dịch tên cách cục kinh điển (Hán - Việt) */
export const PATTERN_VI_MAP: Record<string, string> = {
  '君臣庆会': 'Quân Thần Khánh Hội',
  '紫府同宫': 'Tử Phủ Đồng Cung',
  '府相朝垣': 'Phủ Tướng Triều Viên',
  '阳梁昌禄': 'Dương Lương Xương Lộc',
  '日照雷门': 'Nhật Chiếu Lôi Môn',
  '月朗天门': 'Nguyệt Lãng Thiên Môn',
  '机月同梁': 'Cơ Nguyệt Đồng Lương',
  '机梁加会': 'Cơ Lương Gia Hội',
  '巨日同宫': 'Cự Nhật Đồng Cung',
  '金灿光辉': 'Kim Xán Quang Huy',
  '日丽中天': 'Nhật Lệ Trung Thiên',
  '寿星入庙': 'Thọ Tinh Nhập Miếu',
  '巨门入庙': 'Cự Môn Nhập Miếu',
  '英星入庙': 'Anh Tinh Nhập Miếu',
  '极向离明': 'Cực Hướng Ly Minh',
  '天府朝垣': 'Thiên Phủ Triều Viên',
  '天梁清秀': 'Thiên Lương Thanh Tú',
  '文桂文华': 'Văn Quế Văn Hoa',
  '文星拱命': 'Văn Tinh Củng Mệnh',
  '禄马交驰': 'Lộc Mã Giao Trì',
  '双禄朝垣': 'Song Lộc Triều Viên',
  '禄合鸳鸯': 'Lộc Hợp Uyên Ương',
  '三奇加会': 'Tam Kỳ Gia Hội',
  '权禄巡逢': 'Quyền Lộc Tuần Phùng',
  '科权禄夹': 'Khoa Quyền Lộc Hiệp',
  '左右同宫': 'Tả Hữu Đồng Cung',
  '辅弼拱命': 'Phụ Bật Củng Mệnh',
  '魁钺拱命': 'Khôi Việt Củng Mệnh',
  '坐贵向贵': 'Tọa Quý Hướng Quý',
  '七杀朝斗': 'Thất Sát Triều Đẩu',
  '雄宿朝元': 'Hùng Túc Triều Nguyên',
  '化星返贵': 'Hóa Tinh Phản Quý',
  '火贪格': 'Hỏa Tham Cách',
  '铃贪格': 'Linh Tham Cách',
  '武贪格': 'Vũ Tham Cách',
  '杀破狼': 'Sát Phá Tham',
  '石中隐玉': 'Thạch Trung Ẩn Ngọc',
  '明珠出海': 'Minh Châu Xuất Hải',
  '擎羊入庙': 'Kình Dương Nhập Miếu',
  '马头带剑': 'Mã Đầu Đới Kiếm',
  '马头带箭': 'Mã Đầu Đới Tiễn',
  '巨逢四煞': 'Cự Phùng Tứ Sát',
  '命里逢空格': 'Mệnh Lý Phùng Không',
  '命无正曜': 'Mệnh Vô Chính Diệu',
  '羊陀夹忌': 'Kình Đà Hiệp Kỵ',
  '火铃夹忌': 'Hỏa Linh Hiệp Kỵ',
  '空劫夹命': 'Không Kiếp Hiệp Mệnh',
  '火铃夹命': 'Hỏa Linh Hiệp Mệnh',
  '廉贞天相格': 'Liêm Trinh Thiên Tướng',
  '武曲七杀': 'Vũ Khúc Thất Sát',
  '天同天梁格': 'Thiên Đồng Thiên Lương',
  '日月同宫': 'Nhật Nguyệt Đồng Cung',
  '日月夹命': 'Nhật Nguyệt Hiệp Mệnh',
  '紫微入命': 'Tử Vi Nhập Mệnh',
  '辅弼夹命': 'Phụ Bật Hiệp Mệnh',
  '昌曲夹命': 'Xương Khúc Hiệp Mệnh',
  '魁钺夹命': 'Khôi Việt Hiệp Mệnh',
  '化禄入命': 'Hóa Lộc Nhập Mệnh',
  '化忌入命': 'Hóa Kỵ Nhập Mệnh',
  '化忌入迁': 'Hóa Kỵ Nhập Thiên Di',
  '化禄入财': 'Hóa Lộc Nhập Tài',
  '化权入官': 'Hóa Quyền Nhập Quan',
  '化科入命': 'Hóa Khoa Nhập Mệnh',
  '化科入身': 'Hóa Khoa Nhập Thân',
  '禄存守命': 'Lộc Tồn Thủ Mệnh',
  '禄存守身': 'Lộc Tồn Thủ Thân',
  '天马入命': 'Thiên Mã Nhập Mệnh',
  '天马在迁': 'Thiên Mã Nhập Thiên Di',
  '机月同梁三星会': 'Cơ Nguyệt Đồng Lương Tam Tinh Hội',
  '昌曲坐命': 'Xương Khúc Tọa Mệnh',
  '昌曲同会': 'Xương Khúc Đồng Hội',
  '辅弼同会': 'Phụ Bật Đồng Hội',
  '魁钺同会': 'Khôi Việt Đồng Hội',
  '科权双会': 'Khoa Quyền Song Hội',
  '廉杀羊': 'Liêm Sát Kình',
  '巨火羊': 'Cự Hỏa Kình',
  '铃昌陀武': 'Linh Xương Đà Vũ',
};

/** Diễn giải chuyên sâu tiếng Việt cho các cách cục */
export const PATTERN_DESC_VI_MAP: Record<string, string> = {
  '君臣庆会': 'Tử Vi nhập Mệnh, Tả Phụ Hữu Bật đồng hội, bậc đế vương đắc hiền thần phò tá, chủ đại phú đại quý, phong thái thống suất lãnh đạo. Cả đời quý nhân không ngớt, danh vọng vang xa.',
  '紫府同宫': 'Tử Vi Thiên Phủ đồng cung tại Mệnh (Dần hoặc Thân), đế tướng song toàn, tôn quý vô cùng. Chủ phẩm hạnh đoan chính, y thực phong túc, tài năng quản lý xuất chúng, thích hợp giữ vị trí trọng yếu.',
  '府相朝垣': 'Thiên Phủ Thiên Tướng phân thủ tam phương tứ chính củng chiếu bản mệnh, văn võ kiêm toàn, quyền ấn rạng ngời. Cổ thư ghi nhận: "Phủ Tướng triều viên thiên chung thực lộc", một đời giàu sang có uy thế.',
  '阳梁昌禄': 'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn tề tựu tam phương tứ chính. Đại quý cách về khoa bảng và công danh, thi cử đỗ đầu bảng vàng, học thuật uyên bác, bước vào con đường công quyền dễ thăng tiến.',
  '日照雷门': 'Thái Dương cư Mão (cung Chấn), ví như mặt trời buổi sáng tỏa ánh hào quang rực rỡ. Chủ thiếu niên đắc chí, tài hoa cái thế, sự nghiệp sớm thành danh và giàu lòng nghĩa khí.',
  '月朗天门': 'Thái Âm cư Hợi, ví như trăng sáng giữa trời đêm trong trẻo. Chủ phong thái thanh tao, trí tuệ mẫn tiệp, tiền tài điền sản dồi dào, hậu vận cực kỳ phú túc.',
  '机月同梁': 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương hội tụ tại Mệnh - Tài - Quan. Mẫu hình tham mưu chiến lược, công chức, chuyên gia kỹ thuật, tính tình cẩn trọng, phúc lộc trường thọ.',
  '机梁加会': 'Thiên Cơ và Thiên Lương đồng cung hoặc hội chiếu. Trí tuệ phi phàm, giỏi mưu lược quyền biến, có tài giải quyết khủng hoảng, phong thái quân sư hoặc học giả nổi tiếng.',
  '巨日同宫': 'Cự Môn Thái Dương đồng cung tại Dần hoặc Thân. Khẩu tài xuất chúng, tư duy phản biện sắc sảo, thích hợp với ngoại giao, luật pháp, truyền thông, càng về sau càng rạng rỡ.',
  '金灿光辉': 'Thái Dương cư Ngọ thủ Mệnh, mặt trời đứng bóng rực rỡ nhất trần gian. Khí phách hiên ngang, chí hướng cao xa, chủ địa vị tối thượng và sức ảnh hưởng sâu rộng trong xã hội.',
  '火贪格': 'Hỏa Tinh đồng cung hoặc hội tụ cùng Tham Lang, hóa thành Hỏa Tham Cách. Chủ phát đạt nhanh chóng bất ngờ, dám nghĩ dám làm, nắm bắt thời cơ buôn bán kinh doanh cực kỳ bén nhạy.',
  '铃贪格': 'Linh Tinh hội tụ cùng Tham Lang. Tương tự Hỏa Tham nhưng phát đạt bền bỉ, mưu lược sâu sắc, tiền tài tích tụ kín đáo và vững chắc.',
  '武贪格': 'Vũ Khúc Tham Lang đồng cung tại Sửu Mùi. Tiền bần hậu phú, thời trẻ bôn ba tích lũy, ngoài 30 tuổi bộc phát tài lộc công danh rực rỡ.',
  '杀破狼': 'Thất Sát, Phá Quân, Tham Lang chia nhau tọa thủ tam phương Mệnh - Tài - Quan. Mệnh cách khai phá tiên phong, không chịu an phận, dám xông pha sóng gió để dựng nên đại nghiệp.',
  '石中隐玉': 'Cự Môn thủ Mệnh tại Tý hoặc Ngọ, ví như ngọc quý ẩn giấu trong đá thô. Càng trải qua mài giũa thử thách càng tỏa sáng lấp lánh, hậu vận đại phú đại quý.',
  '明珠出海': 'Mệnh vô chính diệu an tại Mùi, Nhật Mão Nguyệt Hợi củng chiếu sáng rực. Nhân tài xuất chúng, gặp thời cơ thuận lợi sẽ thăng tiến như rồng bay lên biển.',
  '禄马交驰': 'Lộc Tồn (hoặc Hóa Lộc) đồng cung hay củng chiếu với Thiên Mã. Càng bôn ba di chuyển càng sinh tài lộc, thích hợp mở rộng kinh doanh viễn xứ, giao thương quốc tế.',
  '双禄朝垣': 'Lộc Tồn và Hóa Lộc tề tựu tại tam phương củng chiếu Mệnh Cung. Tài khố dồi dào, vạn sự hanh thông, đón lộc tứ phương.',
  '三奇加会': 'Hóa Lộc, Hóa Quyền, Hóa Khoa cùng hội tụ tại tam phương tứ chính. Cực phẩm cách cục, danh vọng, quyền lực và tài lộc đều trọn vẹn, xuất chúng phi thường.',
  '化科入身': 'Hóa Khoa nhập Thân Cung, chủ nửa đời sau danh tiếng vang xa, học vấn uyên thâm, thích hợp đi sâu vào giáo dục, văn chương, nghệ thuật, nghiên cứu học thuật.',
  '辅弼拱命': 'Tả Phụ Hữu Bật chia nhau trấn thủ hoặc củng chiếu Mệnh Cung. Cả đời quý nhân tương trợ, bạn bè chiến hữu tận tâm, làm việc gì cũng có người nâng đỡ.',
  '擎羊入庙': 'Kình Dương đắc địa nhập miếu tại Thìn, Tuất, Sửu, Mùi. Hóa sát vi quyền, dũng mãnh quả quyết, thích hợp quân đội, tư pháp, phẫu thuật ngoại khoa hoặc kinh doanh quyết liệt.',
  '马头带剑': 'Kình Dương thủ Mệnh tại cung Ngọ, cách cục hung trung hữu cát đặc biệt. Trải qua muôn vàn gian truân trắc trở thời trẻ, nếu kiên cường tôi luyện sẽ lập nên chiến công oanh liệt.',
  '马头带箭': 'Kình Dương thủ Mệnh tại cung Ngọ, cách cục hung trung hữu cát đặc biệt. Trải qua muôn vàn gian truân trắc trở thời trẻ, nếu kiên cường tôi luyện sẽ lập nên chiến công oanh liệt.',
  '羊陀夹忌': 'Kình Dương và Đà La giáp hai bên cung có Hóa Kỵ. Áp lực trùng trùng, cần giữ tâm định tĩnh, không tranh đua thị phi, chú ý phòng ngừa tiểu nhân quấy phá.',
  '火铃夹忌': 'Hỏa Tinh và Linh Tinh giáp cung Hóa Kỵ. Năng lượng nóng nảy dễ gây bức bối, bài học tu dưỡng lòng nhẫn nại và bảo toàn nguyên khí.',
  '空劫夹命': 'Địa Không và Địa Kiếp kẹp hai bên Mệnh Cung. Thăng trầm trắc trở buổi đầu, duyên sâu với huyền học, triết lý và sáng tạo nghệ thuật độc đáo.',
  '火铃夹命': 'Hỏa Tinh và Linh Tinh giáp hai bên Mệnh Cung. Năng lượng rèn luyện ý chí gang thép, trải qua thử thách trắc trở sẽ tôi luyện nên bản lĩnh phi thường.',
  '命里逢空格': 'Mệnh Cung gặp Địa Không hoặc Địa Kiếp tọa thủ. Tư duy phá cách, không đi theo lối mòn, nếu theo đuổi con đường công nghệ, sáng tạo hay tôn giáo sẽ có thành tựu riêng biệt.',
  '命无正曜': 'Mệnh Vô Chính Diệu, không có 14 chính tinh đóng giữ. Cần mượn tinh diệu đối cung để định hình, tính cách linh hoạt uyển chuyển, thích nghi cực tốt với mọi hoàn cảnh.',
  '廉贞天相格': 'Liêm Trinh Thiên Tướng đồng cung, thuộc cách ấn thụ đoan trang, chủ xử sự công minh, tính tình thanh liêm chính trực. Thích hợp làm công chức, quản lý hành chính, pháp luật, hoạch định chiến lược. Tối kỵ gặp Kình Dương Hóa Kỵ vì dễ vướng vào khẩu thiệt quan phi.',
  '武曲七杀': 'Vũ Khúc Thất Sát đồng cung, tướng tinh kết hợp cùng tài tinh. Chủ quả quyết cương nghị, năng lực quản trị tài chính xuất sắc, thích hợp tài chính ngân hàng, quân đội, cơ khí hoặc tự chủ khởi nghiệp. Cần chú ý tu tâm để hóa giải tính cô khắc.',
  '天同天梁格': 'Thiên Đồng Thiên Lương đồng cung, phúc tinh tao ngộ ấm tinh, chủ tâm tính khoan hậu thiện lương, thích giúp đỡ người khác. Thích hợp y tế, giáo dục, tâm lý, công tác xã hội thiện nguyện.',
  '日月同宫': 'Thái Dương Thái Âm đồng cung tại Sửu hoặc Mùi. Âm dương điều hòa, văn võ song toàn, chủ nhân duyên khác phái cực tốt, sự nghiệp hanh thông, danh tiếng vang xa. Đồng cung tại Mùi được cổ thư khen là Nhật Nguyệt song mỹ.',
  '日月夹命': 'Thái Dương và Thái Âm phân cư hai bên giáp Mệnh Cung. Ánh quang minh rực rỡ che chở bản mệnh, suốt đời quý nhân nâng đỡ, sự nghiệp thăng tiến vững vàng. Nam chủ hiển quý, nữ chủ vượng phu ích tử.',
  '紫微入命': 'Tử Vi độc tọa cung Mệnh, đế vương chi tinh, lòng tự tôn cao, phong thái chỉ huy đĩnh đạc. Cần có Tả Phụ Hữu Bật củng chiếu để phát huy tối đa uy lực quân thần, tránh thế cô quân đơn độc.',
  '辅弼夹命': 'Tả Phụ Hữu Bật phân cư hai bên giáp Mệnh Cung. Tượng trưng cho quý nhân phù trợ và phúc lộc dồi dào suốt đời. Rất thích hợp làm lãnh đạo quản lý trong các tổ chức lớn, giỏi điều phối nguồn lực.',
  '昌曲夹命': 'Văn Xương Văn Khúc giáp hai bên Mệnh Cung. Chủ thông minh tuấn tú, văn chương hoa mỹ, tư duy tinh tế. Cực kỳ có lợi cho thi cử, học vị, công danh khoa bảng.',
  '魁钺夹命': 'Thiên Khôi Thiên Việt giáp hai bên Mệnh Cung, đắc quý khí của Thiên Ất Quý Nhân. Những khúc quanh sinh tử hoặc thời khắc then chốt trong đời luôn có người quyền quý đưa tay nâng đỡ.',
  '廉杀羊': 'Liêm Trinh, Thất Sát, Kình Dương tương hội. Tính cách quá cương liệt, hành động quyết liệt thần tốc, cần kiềm chế nóng nảy và đề phòng va chạm tổn thương.',
  '巨火羊': 'Cự Môn, Hỏa Tinh, Kình Dương tương hội. Khẩu tài sắc bén nhưng dễ sinh tranh luận gay gắt, cần học cách nói lời hòa ái, dĩ hòa vi quý.',
  '铃昌陀武': 'Linh Tinh, Văn Xương, Đà La, Vũ Khúc hội tụ. Cần hết sức cẩn trọng trong các văn bản hợp đồng ký kết tài chính, giữ gìn chữ tín và minh bạch tiền bạc.',
  '禄存守命': 'Lộc Tồn tọa thủ Mệnh Cung. Cả đời y thực phong túc, tài lộc ổn định, tính cách cẩn trọng chắc chắn, giỏi tích lũy và bảo toàn tài sản.',
  '禄存守身': 'Lộc Tồn nhập Thân Cung. Hậu vận trung niên trở đi tài nguyên vững vàng, đắc lộc tự hưởng, người phối ngẫu hoặc sự nghiệp đem lại nguồn tài chính ổn định.',
  '天马入命': 'Thiên Mã thủ Mệnh. Cả đời bôn ba sôi nổi, làm ăn trong sự di chuyển đổi mới, hợp thương mại, công vụ ngoại giao, càng năng động càng phát triển.',
  '天马在迁': 'Thiên Mã tại Thiên Di. Thích hợp lập nghiệp phương xa, xuất ngoại phát tài, môi trường bên ngoài đem lại nhiều cơ hội rộng mở.',
  '化禄入财': 'Chính tinh Hóa Lộc nhập Cung Tài Bạch. Dòng tiền hanh thông dồi dào, thu nhập tài chính thuận lợi, kiếm tiền từ chính tài năng và đam mê cốt lõi.',
  '化权入官': 'Chính tinh Hóa Quyền nhập Cung Quan Lộc. Nắm thực quyền chỉ huy trong sự nghiệp, có năng lực lãnh đạo độc lập tác chiến, thích hợp vị trí quản lý then chốt.',
  '化科入命': 'Chính tinh Hóa Khoa nhập Mệnh Cung. Chủ về khoa danh học vấn, văn chương xuất chúng, được mọi người vị nể tôn trọng, danh tiếng đi trước tài lợi.',
  '机月同梁三星会': 'Bộ sao Cơ Nguyệt Đồng Lương hội tụ 3 trong 4 sao tại tam phương tứ chính. Tính cách mềm mỏng, chu đáo, làm việc có nguyên tắc, thích hợp công chức, giáo dục, tài chính, dịch vụ chuyên môn.',
  '昌曲坐命': 'Văn Xương Văn Khúc đồng tọa Mệnh Cung. Trí tuệ phi phàm, tài hoa cái thế, phong nhã thanh cao, rất có duyên với nghệ thuật, văn học và sáng tạo.',
  '昌曲同会': 'Văn Xương và Văn Khúc cùng hội tụ tam phương tứ chính. Tài năng biểu đạt xuất chúng, ăn nói lưu loát, dễ tạo dựng tên tuổi trong giới học thuật hoặc truyền thông.',
  '辅弼同会': 'Tả Phụ Hữu Bật cùng hội tụ tam phương tứ chính. Cả đời quý nhân không ngớt, nhân duyên sâu rộng, có tài quy tụ bạn bè đồng nghiệp cùng dựng xây sự nghiệp.',
  '魁钺同会': 'Thiên Khôi Thiên Việt cùng hội tụ tam phương tứ chính. Đắc phúc khí Thiên Ất quý nhân, khi hoạn nạn gặp người cứu giúp, công danh sự nghiệp dễ gặp minh sư chỉ đường.',
  '科权双会': 'Hóa Khoa và Hóa Quyền cùng hội chiếu tam phương tứ chính. Vừa có danh tiếng uy tín học thuật (Khoa), vừa có năng lực nắm quyền điều hành thực tế (Quyền), công danh vẹn toàn.',
};

/** Dịch các điều kiện cách cục sang tiếng Việt */
export function getPatternConditionVi(cond: string): string {
  const map: Record<string, string> = {
    '紫微入命': 'Tử Vi nhập Mệnh (紫微入命)',
    '左辅右弼同会三方四正': 'Tả Phụ Hữu Bật đồng hội Tam Phương Tứ Chính (左辅右弼)',
    '左辅、右弼同会命宫三方四正': 'Tả Phụ, Hữu Bật đồng hội Tam Phương Tứ Chính (左辅右弼)',
    '文昌、文曲同会命宫三方四正': 'Văn Xương, Văn Khúc đồng hội Tam Phương Tứ Chính (昌曲)',
    '天魁、天钺同会命宫三方四正': 'Thiên Khôi, Thiên Việt đồng hội Tam Phương Tứ Chính (魁钺)',
    '化科、化权同会命宫三方四正': 'Hóa Khoa, Hóa Quyền đồng hội Tam Phương Tứ Chính (科权)',
    '再会文昌或文曲': 'Hội thêm Văn Xương hoặc Văn Khúc (昌曲)',
    '魁钺贵人加照': 'Khôi Việt quý nhân củng chiếu (魁钺)',
    '紫微化权': 'Tử Vi Hóa Quyền (紫微化权)',
    '地空地劫双夹会照（紫微忌空劫）': 'Địa Không Địa Kiếp giáp/hội (Tử Vi kỵ Không Kiếp)',
    '紫微天府同入命宫': 'Tử Vi Thiên Phủ đồng cung nhập Mệnh (紫微天府同宫)',
    '紫微天府同宫（不在命宫，会照减力）': 'Tử Phủ đồng cung (hội chiếu)',
    '左辅右弼同会': 'Tả Phụ Hữu Bật đồng hội (左右同会)',
    '再会昌曲': 'Hội thêm Xương Khúc (再会昌曲)',
    '紫府宫坐空劫（破紫府之贵气）': 'Cung Tử Phủ ngộ Không Kiếp (phá quý khí)',
    '紫府宫见双煞同坐': 'Cung Tử Phủ ngộ song sát tọa thủ',
    '天府坐命三方': 'Thiên Phủ tọa Tam Phương (天府坐命三方)',
    '天相坐命三方': 'Thiên Tướng tọa Tam Phương (天相坐命三方)',
    '两星不同宫': 'Hai sao đóng khác cung',
    '命宫见禄': 'Mệnh Cung đắc Lộc (Lộc Tồn / Hóa Lộc)',
    '再会左辅': 'Hội thêm Tả Phụ (左辅)',
    '命宫坐煞星': 'Mệnh Cung ngộ Sát Tinh tọa thủ',
    '三方四正煞星过多': 'Tam Phương Tứ Chính hội tụ quá nhiều Sát Tinh',
    '七杀、破军、贪狼三星在命财官三方会照': 'Sát, Phá, Tham tam tinh hội tụ tại Mệnh - Tài - Quan',
    '三方有化禄或化权（动得有力）': 'Tam Phương có Hóa Lộc hoặc Hóa Quyền (đắc lực)',
    '见禄存或天马（化为禄马交驰）': 'Ngộ Lộc Tồn hoặc Thiên Mã (Lộc Mã Giao Trì)',
    '贪狼化禄或化权': 'Tham Lang Hóa Lộc hoặc Hóa Quyền',
    '见火星或铃星（爆发力强）': 'Ngộ Hỏa Tinh hoặc Linh Tinh (bộc phát lực)',
    '三方见空劫同会（破荡浮沉）': 'Tam Phương ngộ Không Kiếp hội chiếu (dễ thăng trầm)',
    '贪狼坐命，火星同宫': 'Tham Lang thủ Mệnh, Hỏa Tinh đồng cung',
    '火星同宫爆发力最强': 'Hỏa Tinh đồng cung (sức bộc phát mạnh nhất)',
    '三方四正火贪会照（力稍次）': 'Tam Phương Tứ Chính Hỏa Tham hội chiếu',
    '贪狼化禄（财气大盛）': 'Tham Lang Hóa Lộc (tài khí đại thịnh)',
    '贪狼化权（权势大增）': 'Tham Lang Hóa Quyền (quyền thế tăng tiến)',
    '见铃星同会': 'Ngộ Linh Tinh đồng hội',
    '贪狼化忌（贪多必失）': 'Tham Lang Hóa Kỵ (cần phòng hao tổn)',
    '见陀罗擎羊冲破': 'Ngộ Đà La Kình Dương xung phá',
    '化科入身宫': 'Hóa Khoa nhập Thân Cung (化科入身)',
    '身宫有化科星坐守': 'Thân Cung có sao Hóa Khoa tọa thủ',
    '身宫坐文昌化科': 'Thân Cung đắc Văn Xương Hóa Khoa',
    '身宫坐文曲化科': 'Thân Cung đắc Văn Khúc Hóa Khoa',
    '身宫坐天机化科': 'Thân Cung đắc Thiên Cơ Hóa Khoa',
    '左右辅弼拱照身宫': 'Tả Hữu Phụ Bật củng chiếu Thân Cung',
    '身宫见煞星冲破': 'Thân Cung ngộ Sát Tinh xung phá',
    '左辅右弼夹命宫或在三方拱照': 'Tả Phụ Hữu Bật giáp Mệnh hoặc tam phương củng chiếu',
    '左右同在三方四正': 'Tả Hữu cùng hội tụ Tam Phương Tứ Chính',
    '左右夹命宫': 'Tả Hữu giáp Mệnh Cung',
    '左右同宫坐命': 'Tả Hữu đồng cung thủ Mệnh',
    '再会魁钺': 'Hội thêm Khôi Việt (魁钺)',
    '廉贞天相同宫': 'Liêm Trinh Thiên Tướng đồng cung (廉贞天相)',
    '见禄存或廉贞化禄': 'Kiến Lộc Tồn hoặc Liêm Trinh Hóa Lộc',
    '左辅会照': 'Tả Phụ hội chiếu',
    '廉相宫坐擎羊（廉杀羊倾向）': 'Cung Liêm Tướng ngộ Kình Dương (hướng Liêm Sát Kình)',
    '廉贞化忌': 'Liêm Trinh Hóa Kỵ',
    '武曲七杀同宫': 'Vũ Khúc Thất Sát đồng cung (武曲七杀)',
    '武曲化权': 'Vũ Khúc Hóa Quyền',
    '武曲化禄': 'Vũ Khúc Hóa Lộc',
    '武曲化忌（武曲化忌为财劫之兆）': 'Vũ Khúc Hóa Kỵ (điềm báo hao tán tài lộc)',
    '武杀宫煞星过多': 'Cung Vũ Sát hội quá nhiều Sát Tinh',
    '天同天梁同宫': 'Thiên Đồng Thiên Lương đồng cung (天同天梁)',
    '文昌会照': 'Văn Xương hội chiếu',
    '天同化禄': 'Thiên Đồng Hóa Lộc',
    '煞星同坐': 'Sát Tinh đồng cung',
    '太阳太阴同入丑宫': 'Thái Dương Thái Âm đồng nhập Sửu Cung',
    '太阳太阴同入未宫': 'Thái Dương Thái Âm đồng nhập Mùi Cung',
    '未宫日月同辉（古书云未宫日月双美）': 'Cung Mùi Nhật Nguyệt đồng huy (Nhật Nguyệt song mỹ)',
    '昌曲会照': 'Xương Khúc hội chiếu',
    '日月宫煞星同坐': 'Cung Nhật Nguyệt ngộ Sát Tinh đồng cung',
    '太阳太阴分居命宫前后两宫': 'Thái Dương Thái Âm phân cư hai bên giáp Mệnh Cung',
    '太阳庙旺': 'Thái Dương Miếu Vượng',
    '太阴庙旺': 'Thái Âm Miếu Vượng',
    '日月落陷（夹命无光）': 'Nhật Nguyệt lạc hãm (giáp Mệnh vô quang)',
    '巨门太阳同入寅宫': 'Cự Môn Thái Dương đồng nhập Dần Cung',
    '巨门太阳同入申宫': 'Cự Môn Thái Dương đồng nhập Thân Cung',
    '寅宫太阳庙旺，巨门得日光化解是非': 'Cung Dần Thái Dương miếu vượng, Cự Môn đắc ánh thái dương hóa giải thị phi',
    '巨门化禄/化权（口才生财）': 'Cự Môn Hóa Lộc / Hóa Quyền (khẩu tài sinh tài lộc)',
    '巨门化忌（口舌官非）': 'Cự Môn Hóa Kỵ (khẩu thiệt thị phi)',
    '申宫太阳偏西，巨门暗曜更显': 'Cung Thân Thái Dương xế bóng, Cự Môn ám diệu rõ rệt hơn',
    '巨门入命于子宫': 'Cự Môn nhập Mệnh tại Tý Cung',
    '巨门入命于午宫': 'Cự Môn nhập Mệnh tại Ngọ Cung',
    '文昌会照（石中隐玉得明）': 'Văn Xương hội chiếu (Thạch trung ẩn ngọc tỏa sáng)',
    '巨门化忌（玉藏深泥）': 'Cự Môn Hóa Kỵ (ngọc vùi bùn sâu)',
    '命坐煞星': 'Mệnh Cung ngộ Sát Tinh tọa thủ',
    '命宫在未为空宫': 'Mệnh Cung tại Mùi là Vô Chính Diệu',
    '对宫丑宫为太阳太阴同度': 'Đối cung Sửu là Thái Dương Thái Âm đồng độ',
    '辅弼相助': 'Phụ Bật tương trợ',
    '煞星会照（珠光黯淡）': 'Sát tinh hội chiếu (ngọc châu ảm đạm)',
    '紫微独坐命宫（无天府同坐）': 'Tử Vi độc tọa Mệnh Cung (không có Thiên Phủ đồng tọa)',
    '文昌文曲同会': 'Văn Xương Văn Khúc đồng hội',
    '无辅弼（孤君无臣）': 'Thiếu Tả Phụ Hữu Bật (quân vương cô đơn)',
    '紫微遇空劫（古书最忌）': 'Tử Vi ngộ Không Kiếp (cổ thư tối kỵ)',
    '左辅右弼分居命宫前后两宫': 'Tả Phụ Hữu Bật phân cư hai bên giáp Mệnh Cung',
    '文昌文曲分居命宫前后两宫': 'Văn Xương Văn Khúc phân cư hai bên giáp Mệnh Cung',
    '天魁天钺分居命宫前后两宫': 'Thiên Khôi Thiên Việt phân cư hai bên giáp Mệnh Cung',
    '化禄会照三方四正': 'Hóa Lộc hội chiếu Tam Phương Tứ Chính',
    '禄存会照三方四正': 'Lộc Tồn hội chiếu Tam Phương Tứ Chính',
    '命坐空劫（双禄遇空，财来财去）': 'Mệnh ngộ Không Kiếp (Song Lộc ngộ Không, tiền đến rồi đi)',
    '化禄、化权、化科三吉化齐会命宫三方四正': 'Hóa Lộc, Hóa Quyền, Hóa Khoa tam cát hóa tề tựu Tam Phương Tứ Chính',
    '擎羊陀罗分居命宫前后两宫': 'Kình Dương Đà La phân cư hai bên giáp Mệnh Cung',
    '化忌坐命': 'Hóa Kỵ tọa Mệnh Cung',
    '火星铃星分居命宫前后两宫': 'Hỏa Tinh Linh Tinh phân cư hai bên giáp Mệnh Cung',
    '地空地劫分居命宫前后两宫': 'Địa Không Địa Kiếp phân cư hai bên giáp Mệnh Cung',
    '廉贞七杀擎羊同宫': 'Liêm Trinh Thất Sát Kình Dương đồng cung',
    '巨门火星擎羊同宫': 'Cự Môn Hỏa Tinh Kình Dương đồng cung',
    '铃星文昌陀罗武曲交会': 'Linh Tinh Văn Xương Đà La Vũ Khúc giao hội',
    '擎羊独坐午宫命宫': 'Kình Dương độc tọa Mệnh Cung tại Ngọ',
    '禄存入命宫': 'Lộc Tồn nhập Mệnh Cung',
    '禄存入身宫': 'Lộc Tồn nhập Thân Cung',
    '天马入命宫': 'Thiên Mã nhập Mệnh Cung',
    '天马入迁移宫': 'Thiên Mã nhập Thiên Di Cung',
  };

  if (map[cond]) return map[cond];

  let res = cond;
  for (const [zh, vi] of Object.entries(STAR_VI_MAP)) {
    res = res.split(zh).join(vi);
  }
  for (const [zh, vi] of Object.entries(PALACE_VI_MAP)) {
    res = res.split(zh).join(vi);
  }
  res = res
    .replace(/同入([A-Za-zÀ-ỹs]+)宫/g, 'đồng nhập cung $1')
    .replace(/入命于([A-Za-zÀ-ỹs]+)宫/g, 'nhập Mệnh tại cung $1')
    .replace(/分居命宫前后两宫/g, 'phân cư hai bên giáp Mệnh Cung')
    .replace(/同会命宫三方四正/g, 'đồng hội Tam Phương Tứ Chính')
    .replace(/三方四正会/g, 'Tam phương tứ chính hội ')
    .replace(/三方四正/g, 'Tam Phương Tứ Chính')
    .replace(/同会/g, 'đồng hội')
    .replace(/同宫/g, 'đồng cung')
    .replace(/会照/g, 'hội chiếu')
    .replace(/化禄/g, 'Hóa Lộc')
    .replace(/化权/g, 'Hóa Quyền')
    .replace(/化科/g, 'Hóa Khoa')
    .replace(/化忌/g, 'Hóa Kỵ')
    .replace(/坐命宫/g, 'tọa Mệnh Cung')
    .replace(/坐命/g, 'tọa Mệnh')
    .replace(/入命宫/g, 'nhập Mệnh Cung')
    .replace(/入身宫/g, 'nhập Thân Cung')
    .replace(/入迁移宫/g, 'nhập Thiên Di Cung')
    .replace(/入财帛宫/g, 'nhập Tài Bạch Cung')
    .replace(/入官禄宫/g, 'nhập Quan Lộc Cung')
    .replace(/庙旺/g, 'Miếu Vượng')
    .replace(/落陷/g, 'Lạc Hãm')
    .replace(/同坐/g, 'đồng tọa')
    .replace(/煞星/g, 'sát tinh')
    .replace(/空劫/g, 'Không Kiếp')
    .replace(/擎羊/g, 'Kình Dương')
    .replace(/陀罗/g, 'Đà La')
    .replace(/火星/g, 'Hỏa Tinh')
    .replace(/铃星/g, 'Linh Tinh')
    .replace(/再会/g, 'Hội thêm ')
    .replace(/缺/g, 'khuyết ')
    .replace(/未会/g, 'chưa hội');

  return res;
}

/** Dịch xuất xứ cổ tịch sang tiếng Việt */
export function getPatternSourceVi(src?: string): string {
  if (!src) return '';
  return src
    .replace(/【|】/g, '')
    .replace('《紫微斗数全书·', '《Tử Vi Đẩu Số Toàn Thư · ')
    .replace('《紫微斗数全书》', '《Tử Vi Đẩu Số Toàn Thư》')
    .replace('《紫微斗数全集·', '《Tử Vi Đẩu Số Toàn Tập · ')
    .replace('《紫微斗数全集》', '《Tử Vi Đẩu Số Toàn Tập》')
    .replace('《骨髓赋》', '《Cốt Tủy Phú》')
    .replace('《紫微斗数骨髓赋·', '《Tử Vi Đẩu Số Cốt Tủy Phú · ')
    .replace('《女命骨髓赋》', '《Nữ Mệnh Cốt Tủy Phú》')
    .replace('赋文', 'Phú Văn')
    .replace('禄存星', 'Lộc Tồn Tinh')
    .replace('天马星', 'Thiên Mã Tinh')
    .replace('四化论', 'Tứ Hóa Luận')
    .replace('四化会照', 'Tứ Hóa Hội Chiếu')
    .replace('机月同梁格', 'Cơ Nguyệt Đồng Lương Cách')
    .replace('文星论', 'Văn Tinh Luận')
    .replace('辅弼论', 'Phụ Bật Luận')
    .replace('魁钺论', 'Khôi Việt Luận')
    .replace('日月夹命', 'Nhật Nguyệt Hiệp Mệnh')
    .replace('巨日同宫', 'Cự Nhật Đồng Cung')
    .replace('石中隐玉', 'Thạch Trung Ẩn Ngọc')
    .replace('明珠出海', 'Minh Châu Xuất Hải')
    .replace('辅弼夹命', 'Phụ Bật Hiệp Mệnh')
    .replace('双禄朝垣', 'Song Lộc Triều Viên')
    .replace('三奇加会', 'Tam Kỳ Gia Hội')
    .replace('羊陀夹忌', 'Kình Đà Hiệp Kỵ')
    .replace('马头带箭', 'Mã Đầu Đới Tiễn')
    .replace('马头带剑', 'Mã Đầu Đới Kiếm')
    .replace('倪师《天纪》', 'Thầy Nghê Hải Hà 《Thiên Kỷ》');
}

/** Tên cách cục hiển thị song ngữ: Cách Quân Thần Khánh Hội (君臣庆会) */
export function getPatternVi(cnName: string): string {
  if (PATTERN_VI_MAP[cnName]) {
    return `Cách ${PATTERN_VI_MAP[cnName]} (${cnName})`;
  }
  const m = cnName.match(/^(.+?)化([禄权科忌])入(命|迁|身|财|官)$/);
  if (m) {
    const starVi = getStarVi(m[1]);
    const huaVi = m[2] === '禄' ? 'Lộc' : m[2] === '权' ? 'Quyền' : m[2] === '科' ? 'Khoa' : 'Kỵ';
    const palVi = m[3] === '命' ? 'Mệnh' : m[3] === '迁' ? 'Thiên Di' : m[3] === '身' ? 'Thân' : m[3] === '财' ? 'Tài Bạch' : 'Quan Lộc';
    return `Cách ${starVi} Hóa ${huaVi} Nhập ${palVi} (${cnName})`;
  }
  return `Cách ${cnName}`;
}

/** Lấy nội dung giải nghĩa cách cục bằng tiếng Việt chuẩn xác */
export function getPatternDescVi(name: string, fallbackDesc?: string): string {
  if (PATTERN_DESC_VI_MAP[name]) return PATTERN_DESC_VI_MAP[name];

  const m = name.match(/^(.+?)化([禄权科忌])入(命|迁|身|财|官)$/);
  if (m) {
    const starVi = getStarVi(m[1]);
    const huaVi = m[2] === '禄' ? 'Lộc' : m[2] === '权' ? 'Quyền' : m[2] === '科' ? 'Khoa' : 'Kỵ';
    const palVi = m[3] === '命' ? 'Mệnh Cung' : m[3] === '迁' ? 'Thiên Di Cung' : m[3] === '身' ? 'Thân Cung' : m[3] === '财' ? 'Tài Bạch Cung' : 'Quan Lộc Cung';
    if (m[2] === '禄') {
      return `Sao ${starVi} đắc Hóa Lộc tọa thủ ${palVi}. Chủ về nguồn tài nguyên hanh thông, đón nhận lộc trời ban, nhân duyên sâu sắc và nhiều cơ hội kinh doanh sinh lợi do chính đặc tính của ${starVi} đem lại.`;
    }
    if (m[2] === '权') {
      return `Sao ${starVi} đắc Hóa Quyền tọa thủ ${palVi}. Nắm quyền hành kiểm soát, có năng lực chỉ huy độc lập, gánh vác trách nhiệm lớn và dễ trở thành trụ cột trong công việc.`;
    }
    if (m[2] === '科') {
      return `Sao ${starVi} đắc Hóa Khoa tọa thủ ${palVi}. Khí chất thanh cao, học vấn uyên bác, có danh tiếng và uy tín học thuật lớn, thi cử đỗ đạt và luôn có quý nhân trợ lực.`;
    }
    if (m[2] === '忌') {
      return `Sao ${starVi} đắc Hóa Kỵ tọa thủ ${palVi}. Năng lượng bài học nghiệp lực cần tu dưỡng, nhắc nhở bản mệnh nên giữ tâm thái bình thản, kiên nhẫn thấu đáo, biến thử thách thành nấc thang hoàn thiện bản thân.`;
    }
  }

  if (!fallbackDesc || fallbackDesc.trim() === '') {
    return 'Cách cục đắc định trong cổ thư, phối chiếu cùng tinh diệu tam phương tứ chính khai mở vận trình cát tường.';
  }

  let viDesc = fallbackDesc;
  for (const [zh, vi] of Object.entries(STAR_VI_MAP)) {
    viDesc = viDesc.split(zh).join(vi);
  }
  for (const [zh, vi] of Object.entries(PALACE_VI_MAP)) {
    viDesc = viDesc.split(zh).join(vi);
  }
  viDesc = viDesc
    .replace(/化禄/g, 'Hóa Lộc')
    .replace(/化权/g, 'Hóa Quyền')
    .replace(/化科/g, 'Hóa Khoa')
    .replace(/化忌/g, 'Hóa Kỵ')
    .replace(/三方四正/g, 'Tam Phương Tứ Chính')
    .replace(/同宫/g, 'đồng cung')
    .replace(/会照/g, 'hội chiếu')
    .replace(/坐命/g, 'thủ Mệnh')
    .replace(/落陷/g, 'lạc hãm')
    .replace(/庙旺/g, 'miếu vượng')
    .replace(/吉星/g, 'cát tinh')
    .replace(/煞星/g, 'sát tinh')
    .replace(/倪师说/g, 'Thầy Nghê Hải Hà dạy:')
    .replace(/古书云/g, 'Cổ thư dạy:');

  if (/[\u4e00-\u9fa5]{4,}/.test(viDesc)) {
    return `Cách cục cổ thư ${name}, hội tụ tinh diệu then chốt tại bản cung và tam phương tứ chính, chủ về vận trình có nhiều điểm chuyển biến sâu sắc, tích lũy công đức để đón nhận cát lành.`;
  }
  return viDesc;
}

/** Chuyển tên sao sang tiếng Việt */
export function getStarVi(cnName: string): string {
  return STAR_VI_MAP[cnName] || cnName;
}

/** Chuyển tên cung sang tiếng Việt */
export function getPalaceVi(cnName: string): string {
  return PALACE_VI_MAP[cnName] || cnName;
}

/** Chuyển độ sáng miếu hãm */
export function getBrightnessVi(b?: string): string {
  if (!b) return '';
  return BRIGHTNESS_VI_MAP[b] || b;
}

/** Chuyển can chi sang tiếng Việt */
export function getGanZhiVi(gz: string): string {
  if (!gz || gz.length < 2) return gz;
  const g = STEM_VI_MAP[gz[0]] || gz[0];
  const z = BRANCH_VI_MAP[gz[1]] || gz[1];
  return `${g} ${z}`;
}

/** Tạng phủ kinh lạc theo địa chi (Theo Nghê Hải Hà - Thiên Kỷ) */
export const BRANCH_ORGAN_MAP: Record<number, { organ: string; note: string }> = {
  0: { organ: 'Đởm (Túi mật)', note: 'Giờ Tý (23h-01h), thiếu dương đởm kinh, liên quan giấc ngủ và quyết đoán' },
  1: { organ: 'Can (Gan)', note: 'Giờ Sửu (01h-03h), quyết âm can kinh, chủ tàng huyết, giải độc, mắt và gân' },
  2: { organ: 'Phế (Phổi)', note: 'Giờ Dần (03h-05h), thái âm phế kinh, chủ khí, hô hấp và bì mao' },
  3: { organ: 'Đại Trường (Ruột già)', note: 'Giờ Mão (05h-07h), dương minh đại trường kinh, bài tiết và da dẻ' },
  4: { organ: 'Vị (Dạ dày)', note: 'Giờ Thìn (07h-09h), dương minh vị kinh, tiêu hóa thức ăn, huyết khí' },
  5: { organ: 'Tỳ (Lách/Tụy)', note: 'Giờ Tỵ (09h-11h), thái âm tỳ kinh, thống nhiếp huyết dịch và cơ bắp' },
  6: { organ: 'Tâm (Tim)', note: 'Giờ Ngọ (11h-13h), thiếu âm tâm kinh, chủ thần minh và huyết mạch' },
  7: { organ: 'Tiểu Trường (Ruột non)', note: 'Giờ Mùi (13h-15h), thái dương tiểu trường kinh, hấp thụ dinh dưỡng' },
  8: { organ: 'Bàng Quang', note: 'Giờ Thân (15h-17h), thái dương bàng quang kinh, bài tiết nước tiểu, cột sống kinh lạc' },
  9: { organ: 'Thận', note: 'Giờ Dậu (17h-19h), thiếu âm thận kinh, chủ tàng tinh, cốt tủy, tai và sinh sản' },
  10: { organ: 'Tâm Bào', note: 'Giờ Tuất (19h-21h), quyết âm tâm bào kinh, bảo vệ tim, tuần hoàn ngoại vi' },
  11: { organ: 'Tam Tiêu', note: 'Giờ Hợi (21h-23h), thiếu dương tam tiêu kinh, điều hòa kinh mạch toàn thân và nội tiết' },
};

export function getWuXingJuVi(name: string): string {
  return WUXINGJU_VI_MAP[name] || name;
}

export function getSiHuaShortVi(sihua: string): string {
  switch (sihua) {
    case '禄': case 'Hóa Lộc': return 'Lộc';
    case '权': case 'Hóa Quyền': return 'Quyền';
    case '科': case 'Hóa Khoa': return 'Khoa';
    case '忌': case 'Hóa Kỵ': return 'Kỵ';
    default: return sihua;
  }
}

