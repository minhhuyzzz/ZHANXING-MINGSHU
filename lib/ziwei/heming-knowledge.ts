/**
 * 紫微斗数合盘知识库
 * 基于倪海厦《天纪》体系 + 《紫微斗数全书》古典断语 + 全网专业资料整合
 * 供合盘 AI 分析使用
 */

// ─── 十四主星在夫妻宫的完整断语 ──────────────────────────

export const STAR_IN_FUQI_GU: Record<string, {
  summary: string;       // Một câu cốt lõi
  good: string;          // Điểm cát lợi / điều kiện thuận
  bad: string;           // Điểm thận trọng / chú ý
  spouse_traits: string; // Khí chất & hình mẫu bạn đời
  timing: string;        // Lời khuyên hôn phối
  ni_quote?: string;     // Khẩu quyết Thầy Nghê Hải Hà
}> = {
  '紫微': {
    summary: 'Bạn đời cao sang, có năng lực, nên kết hôn muộn; nền tảng tình cảm dựa trên sự tôn trọng lẫn nhau.',
    good: 'Tam phương có Tả Phụ Hữu Bật củng chiếu/giáp cung, bạn đời hiền tài đắc lực, sau hôn nhân đắc quý nhân tương trợ; tam hợp kiến Lộc chủ tài lộc song toàn.',
    bad: 'Tử Vi cô quân không có tả phụ hữu bật thì bạn đời dễ áp đặt khó giao tiếp; đóng Thìn Tuất tình duyên phai nhạt; hội Phá Quân thì tiền hôn nhân nhiều sóng gió.',
    spouse_traits: 'Bạn đời khí chất cao sang, có chính kiến rõ ràng, lòng tự tôn lớn, năng lực gánh vác mạnh mẽ nhưng ít khi chủ động biểu lộ cảm xúc yếu mềm.',
    timing: 'Nên kết hôn muộn (Nam ngoài 30, Nữ ngoài 27), kết hôn sớm dễ gặp nhiều va vấp trắc trở.',
    ni_quote: 'Tử Vi cư Phu Thê mang tính cô khắc, nên kết hôn muộn. Tình cảm dù tốt nhưng đòi hỏi sự thấu hiểu và nhường nhịn rất lớn.',
  },
  '天机': {
    summary: 'Hôn nhân nhiều chuyển biến linh hoạt, rất thích hợp với bạn đời có khoảng cách tuổi tác tương đối lớn.',
    good: 'Kiến Lộc Tồn hoặc Hóa Lộc thì tình cảm vững bền; hội Thái Âm tăng thêm sự tinh tế, dịu dàng và chu đáo trong đời sống gia đình.',
    bad: 'Hóa Kỵ hoặc hội sát tinh thì cảm xúc dao động lớn, dễ sinh ly cách; Thiên Cơ bản chất thiện biến nên bạn đời đôi lúc do dự khó quyết đoán.',
    spouse_traits: 'Bạn đời thông minh mẫn tiệp, suy nghĩ sâu sắc vi tế, có duyên với triết học nghệ thuật, đôi khi suy nghĩ thái quá sinh lo âu.',
    timing: 'Nên chênh lệch tuổi tác tương đối (chênh từ 6 tuổi trở lên) để giảm thiểu va chạm tôi rèn sự hòa hợp.',
    ni_quote: 'Thiên Cơ bản chất thiện biến, không ưa độc tọa tại Phu Thê, cuộc sống hôn nhân cần sự thấu hiểu và vững tâm dài lâu.',
  },
  '太阳': {
    summary: 'Nam mệnh trợ lực cho vợ, Nữ mệnh vượng phu ích tử; nếu lạc hãm hoặc Hóa Kỵ thì chủ hình khắc trắc trở.',
    good: 'Miếu vượng (từ Mão đến Thân): Bạn đời tháo vát năng động, nam mệnh có hiền nội trợ đắc lực; nữ mệnh lấy được chồng vượng phát, hôn nhân mỹ mãn rạng rỡ.',
    bad: 'Lạc hãm (Dậu đến Dần): Nam mệnh bạn đời thể chất dễ suy yếu; nữ mệnh gả cho người bình phàm; Hóa Kỵ: Nữ mệnh gặp cảnh gian nan thử thách lớn đối với người phối ngẫu.',
    spouse_traits: 'Bạn đời tính tình cởi mở, khẳng khái, có ý thức giữ gìn hình ảnh xã hội, hào hiệp trượng nghĩa nhưng đôi khi hơi nóng nảy hoặc áp đặt.',
    timing: 'Tình cảm có xu hướng ban đầu nồng nhiệt, về sau sâu lắng; nên giữ không gian riêng và đổi mới để duy trì tình cảm ấm áp.',
    ni_quote: 'Thái Dương cư Phu Thê tối hỷ miếu vượng quang minh; kỵ nhất Hóa Kỵ gây áp lực nặng nề cho vận trình người phối ngẫu.',
  },
  '武曲': {
    summary: 'Quả tú chi tinh, mang tính chất cương nghị độc lập trong tình duyên, nhất loạt nên kết hôn muộn.',
    good: 'Vũ Khúc Hóa Lộc: Bạn đời có năng lực kinh tế tài chính xuất chúng; kiến Lộc Tồn giáp củng thì hôn nhân vững chãi giàu sang.',
    bad: 'Hóa Kỵ: Cô quả, khó lập gia đình sớm, hoặc bạn đời dễ gặp biến cố sức khỏe; Vũ Khúc Thất Sát (Mão Dậu): Hôn nhân nhiều thử thách khắc nghiệt; gặp tứ sát tinh dễ sinh bất hòa ly tán.',
    spouse_traits: 'Bạn đời cương liệt, độc lập, tính tình bộc trực thẳng thắn, không khéo biểu đạt lời nói ngọt ngào, tài chính mạnh nhưng tính cách khá cô độc.',
    timing: 'Dòng Vũ Khúc đều khuyên nên kết hôn sau 30 tuổi, vội vã sớm dễ đứt gánh giữa đường.',
    ni_quote: 'Vũ Khúc là tài tinh kiêm quả tú, tính chất cương trực dứt khoát, cung Phu Thê có Vũ Khúc nhất thiết phải kết hôn muộn mới an yên.',
  },
  '天同': {
    summary: 'Bạn đời ôn hòa, thích hưởng thụ an nhàn, nên chênh lệch tuổi tác, kết hôn muộn là đại cát.',
    good: 'Gặp Lộc Tồn hoặc Hóa Lộc: Bạn đời hiền thục mang lại tài lộc, gia đạo yên bình; đồng cung với Thái Âm thì tình cảm ngọt ngào lãng mạn.',
    bad: 'Hóa Kỵ: Ban đầu mặn nồng sau nhạt dần do phối hợp bất như ý; ngộ nhiều sát tinh thì tính cách ỷ lại biến thành gánh nặng.',
    spouse_traits: 'Bạn đời tính tình thiện lương, lạc quan, dễ gần hòa nhã, tâm hồn trẻ trung, đôi khi thiếu chút quyết đoán và chuộng an phận.',
    timing: 'Nam lấy vợ trẻ hơn, nữ lấy chồng lớn tuổi hơn, chênh lệch tuổi tác tương đối là thế phối hợp hài hòa nhất.',
  },
  '廉贞': {
    summary: 'Thứ Đào Hoa kiêm Tù Tinh, cung vị biến động cảm xúc mãnh liệt nhất, cần giữ gìn sự chung thủy và nhường nhịn.',
    good: 'Liêm Trinh Thiên Phủ (Tý Ngọ): Bạn đời thanh tú nho nhã, tình cảm ổn định bền vững, công việc hành chính vững vàng.',
    bad: 'Liêm Trinh Tham Lang hoặc Liêm Trinh Phá Quân: Tình duyên thăng trầm sóng gió; Liêm Trinh Thất Sát: Dễ gặp cảnh ly biệt nếu kết hôn sớm; Hóa Kỵ: Tình cảm quấy rầy, hợp tan khó lường.',
    spouse_traits: 'Bạn đời ngoại hình nổi bật, tài hoa, giao thiệp rộng, mang lại cảm xúc mãnh liệt nhưng tâm lý đôi khi thất thường, dễ xa cách vì công việc.',
    timing: 'Nam mệnh nên lấy vợ kém nhiều tuổi, nữ mệnh nên lấy chồng lớn hơn nhiều tuổi; kết hôn muộn sẽ hóa giải được nhiều hung hiểm.',
    ni_quote: 'Liêm Trinh cư Phu Thê là đào hoa biến cách, phải dùng lý trí và sự chân thành tuyệt đối để giữ gìn đạo vợ chồng.',
  },
  '天府': {
    summary: 'Cát tinh bảo bọc, chủ bình ổn trường cửu, tình cảm đằm thắm dù đôi khi hơi đơn điệu tẻ nhạt.',
    good: 'Gặp Lộc Tồn hoặc Hóa Lộc: Tài lộc dồi dào, tình cảm son sắt thủy chung; tam phương vô sát thì gia đình êm ấm thái bình.',
    bad: 'Gặp Tả Phụ hoặc Hữu Bật đơn độc: Đề phòng đào hoa duyên ngoài luồng; gặp tứ sát: Tình cảm lạnh nhạt dần theo thời gian.',
    spouse_traits: 'Bạn đời nho nhã, phong thái đĩnh đạc, quản lý tiền bạc nguyên tắc chu toàn, làm việc chắc chắn nhưng đôi khi có phần thận trọng bảo thủ.',
    timing: 'Hôn nhân nhìn chung ổn định, nên chủ động làm mới đời sống tinh thần để tránh sự buồn tẻ rập khuôn.',
  },
  '太阴': {
    summary: 'Ưa bạn đời thanh tú dịu dàng, nết na; lạc hãm gặp sát tinh thì tình cảm dễ đa đoan biến động.',
    good: 'Miếu vượng (từ Tý đến Tỵ) hội cát tinh: Bạn đời thanh tú, có năng lực và thành tựu; nam mệnh lấy được vợ đẹp đảm đang; nữ mệnh bản thân đoan trang quý phái.',
    bad: 'Lạc hãm (Mùi đến Hợi): Tình cảm dễ sinh trắc trở; Hóa Kỵ (nam mệnh đặc biệt kỵ): Dễ sinh bất hòa giữa mẹ chồng và nàng dâu; gặp Hỏa Tinh, Linh Tinh tình cảm dễ biến cố.',
    spouse_traits: 'Bạn đời dịu dàng, chu đáo, tinh tế, nội tâm sâu sắc, rất trọng tình nghĩa nhưng đôi lúc khá nhạy cảm và dễ xúc động.',
    timing: 'Không ràng buộc khắt khe, nhưng nếu Thái Âm hãm địa thì khuyên nên kết hôn muộn để tâm tính vững vàng.',
    ni_quote: 'Nam mệnh tối kỵ Thái Âm Hóa Kỵ cư Phu Thê hoặc Tật Ách, nội bộ gia đình dễ sinh mâu thuẫn khó hòa hợp.',
  },
  '贪狼': {
    summary: 'Chính Đào Hoa chi tinh, tình cảm nồng nàn phong phú, cần sự minh bạch và chung thủy để giữ lửa lâu dài.',
    good: 'Hóa Lộc: Bạn đời đa tài đa nghệ, phong tình duyên dáng, tình cảm thăng hoa ngọt ngào; hội Hóa Khoa giảm bớt đào hoa tạp khí.',
    bad: 'Hóa Kỵ: Dễ trải qua trắc trở tình cảm; Tử Vi Tham Lang (Mão Dậu): Bạn đời hay đi xa, giao thiệp rộng; gặp tứ sát tinh dễ sinh bất hòa phân ly.',
    spouse_traits: 'Bạn đời tài hoa nổi trội, năng lực xã giao xuất sắc, nhân duyên khác phái cực tốt, nhiều hoài bão khát vọng lớn trong đời.',
    timing: 'Kết hôn sớm dễ bất ổn, nên kết hôn muộn khi bản thân và đối phương đã thấu hiểu giá trị của sự gắn bó bền lâu.',
    ni_quote: 'Tham Lang tại Phu Thê là đào hoa chi tinh, tại cung Ngọ lại là tướng tinh công danh, chớ vội vàng đoán định tiêu cực mà phải xem kỹ tương phối.',
  },
  '巨门': {
    summary: 'Ám tinh chủ về khẩu tài và tư duy phản biện, vợ chồng dễ tranh luận khẩu thiệt, rất cần Thái Dương quang minh hóa giải.',
    good: 'Thái Dương miếu vượng tương hội: Chuyển hóa thành gia đình hòa hợp, lời ăn tiếng nói nâng đỡ nhau; Hóa Lộc: Bạn đời tài năng tháo vát, mở mang đường tài.',
    bad: 'Hóa Kỵ: Bạn đời hay cằn nhằn, thị phi liên miên; Đà La đồng độ: Tự chuốc lấy phiền muộn lo âu; độc thủ vô cát: Nội tâm u uất, dễ chất chứa khúc mắc.',
    spouse_traits: 'Bạn đời tài ăn nói sắc sảo, tự trọng cao, quan sát tỉ mỉ, đôi khi hơi khắt khe kỹ tính nhưng nội tâm rất sâu sắc và thủy chung.',
    timing: 'Cần chuẩn bị tâm thế giao tiếp chân thành, nhường nhịn và lắng nghe nhau để chuyển hóa khẩu thiệt thành tương trợ đắc lực.',
  },
  '天相': {
    summary: 'Mối lương duyên thân tình tri kỷ, phu xướng phụ tùy, mô hình hôn nhân đồng hành hợp tác tuyệt vời.',
    good: 'Kiến Tả Phụ Hữu Bật song toàn: Tình cảm thủy chung son sắt, bạn đời chính trực vững chãi; tam hợp kiến Lộc thì tài lộc sung túc dồi dào.',
    bad: 'Tả Hữu đơn tinh: Cần chú ý gìn giữ ranh giới các mối quan hệ xã hội; ngộ nhiều sát tinh: Trong lòng dễ có uẩn ức không giải tỏa được.',
    spouse_traits: 'Bạn đời đoan chính, đàng hoàng, giữ chữ tín, ghét xung đột tranh chấp, khéo điều hòa gia đình, là người bạn đồng hành lý tưởng cả đời.',
    timing: 'Thường bén duyên từ bạn học, đồng nghiệp, bạn bè thân quen từ trước; rất hợp vợ chồng cùng chung tay xây dựng sự nghiệp.',
  },
  '天梁': {
    summary: 'Ấm tinh che chở, ưa bạn đời có tinh thần trách nhiệm cao hoặc lớn tuổi hơn, trước hôn nhân thường qua vài thử thách.',
    good: 'Kiến Lộc: Bạn đời có phúc trạch dồi dào, tình cảm chân thành thực tế; tam phương có cát tinh hội: Hôn nhân bền vững, càng về sau càng êm ấm.',
    bad: 'Hóa Kỵ hoặc kiến sát tinh: Hay thuyết giáo, tranh luận nguyên tắc, tạo khoảng cách tâm lý; phối Thiên Mã: Vợ chồng dễ xa cách vì hoàn cảnh.',
    spouse_traits: 'Bạn đời chín chắn trước tuổi, trọng đạo lý, có tinh thần gánh vác che chở cho gia đình, đôi khi có xu hướng thích dạy bảo khuyên răn.',
    timing: 'Tiền hôn nhân gặp vài trắc trở là quy luật bình thường của Thiên Lương; một khi đã vượt qua bước vào hôn nhân thì hậu vận rất bền vững.',
  },
  '七杀': {
    summary: 'Tướng tinh độc lập, phu thê tụ ít chia nhiều, nhất loạt nên kết hôn muộn sau 30 tuổi để tránh hình khắc.',
    good: 'Miếu vượng (Dần Thân): Bạn đời cương nghị nhưng tuyệt đối trung thành, hết lòng vì gia đình; Hóa Lộc tương trợ: Giảm thiểu sự cô khắc lạnh lùng.',
    bad: 'Ngộ sát tinh: Bề ngoài cố giữ hòa khí nhưng bên trong dễ rạn nứt bất đồng; Vũ Khúc Thất Sát (Mão Dậu): Đường tình duyên nhiều sóng gió trắc trở nhất.',
    spouse_traits: 'Bạn đời cá tính mạnh mẽ, cương quyết, tình cảm đến nhanh và dứt khoát, dám nghĩ dám làm, không thích bị kiểm soát hay phụ thuộc.',
    timing: 'Nhất loạt nên kết hôn muộn sau 30 tuổi; hôn nhân muộn sẽ đằm thắm và chín chắn, tránh được đổ vỡ thời nông nổi trẻ tuổi.',
    ni_quote: 'Thất Sát cư Phu Thê tình cảm dễ nguội lạnh nếu không biết thấu hiểu. Cần sự nhường nhịn bao dung của cả hai bên mới bền vững trường cửu.',
  },
  '破军': {
    summary: 'Hao tinh dũng mãnh, ưa tự do không gò bó, tình cảm đòi hỏi sự thấu hiểu và tôn trọng cá tính riêng biệt.',
    good: 'Hóa Lộc: "Phá rồi mới lập", trải qua sóng gió ban đầu thì hậu vận càng thêm gắn bó son sắt; Anh Tinh nhập miếu: Bạn đời khôi ngô có bản lĩnh lớn.',
    bad: 'Hóa Kỵ: Tổn hao tình cảm nặng nề; Tử Vi Phá Quân (Sửu Mùi): Nếu gặp sát tinh dễ bất hòa ly tán; trung niên trở đi cần đề phòng cảnh xa cách phòng loan.',
    spouse_traits: 'Bạn đời phóng khoáng, ghét sự trói buộc rập khuôn, thích đột phá sáng tạo, cá tính độc đáo và cuộc đời nhiều biến động thăng trầm.',
    timing: 'Thời trẻ dễ cảm nắng nhanh chóng hoặc cưới vội, nên kéo dài thời gian tìm hiểu kỹ lưỡng trước khi quyết định gắn kết trọn đời.',
    ni_quote: 'Phá Quân cư Phu Thê mang tính chất phá cũ lập mới, cần lấy sự bao dung, tin tưởng và tôn trọng tự do làm gốc để duy trì hạnh phúc.',
  },
};

// ─── 四化在夫妻宫的完整断语 ──────────��─────────────────────

export const SIHUA_IN_FUQI_GU = {
  '化禄': 'Có nhân duyên tiền định sâu đậm, bạn đời tính tình lạc quan, sau kết hôn tình cảm ngày càng thắm thiết, kinh tế gia đình vượng phát hanh thông.',
  '化权': 'Hôn nhân thường do bản thân chủ động theo đuổi mà thành, bạn đời có năng lực nắm quyền quyết đoán trong gia đình, cần học cách buông bỏ kiểm soát để giữ hòa khí.',
  '化科': 'Xem như tiểu Lộc, chung sống hòa thuận tôn trọng nhau, có quý nhân phù trợ cho lương duyên; bạn đời thường có danh tiếng, học vấn hoặc chuyên môn cao.',
  '化忌': 'Mang tính chất bài học nghiệp lực tình cảm, dễ có cảm giác mắc nợ lẫn nhau, khuyên nên kết hôn muộn; cần dùng tình thương và sự nhẫn nại để hóa giải khúc mắc.',
};

// ─── 合盘核心方法论 ─────────────────────────────────────────

export const HEMING_METHODOLOGY = `
## 合盘分析核心框架（倪海厦体系 + 《紫微斗数全书》综合）

### 一、双宫联参原则（倪海厦最重要的婚姻断法）

**核心口诀：「看婚姻，光看夫妻宫，大错特错，一定要同时看福德宫。」**

- **夫妻宫**：看配偶的星性、外形、性格、互动模式
- **福德宫**：代表夫妻深层感情、婚姻能否长久
- **倪师案例**：“有人夫妻宫很好，福德宫很烂，散！夫妻要散。”

**因此合盘时必须同时分析双方的：命宫 + 夫妻宫 + 福德宫**

---

### 二、天作之合的判断标准

**最高级匹配（天作之合）**：
- 甲方夫妻宫主星 = 乙方命宫主星
- 乙方夫妻宫主星 = 甲方命宫主星
- 两者互相对应，则为命中注定的一对

**次级良配**：
- 一方夫妻宫主星 = 对方命宫主星（单向对应）
- 双方命宫星性五行相生（如木命配土命、土命配水命）
- 双方大限同走旺运

**凶兆组合**：
- 双方互相化忌冲对方命宫（互为冤家）
- 一方化忌飞入另一方夫妻宫（带给对方婚姻伤害）
- 双方夫妻宫皆有重煞无吉星

---

### 三、完整合盘五步法

**第一步：评估双方命格基础**
- 双方命宫格局是否般配（同类型 or 互补型）
- 重点看：命宫 + 身宫 + 福德宫的星性搭配
- 警戒：双方皆为杀破狼格（两虎相争）；或一强一弱过度悬殊

**第二步：夫妻宫互参**
- 甲方夫妻宫主星 → 是否对应乙方命宫/三合方星？
- 乙方夫妻宫主星 → 是否对应甲方命宫/三合方星？
- 双方夫妻宫各自的四化状态（化禄/化忌影响最大）

**第三步：太阳太阴星象分析**
- 女命：太阳代表丈夫；太阳庙旺=旺夫，落陷化忌=克夫
- 男命：太阴代表妻子；太阴庙旺=妻美贤，化忌=婆媳不和
- 这两颗星在双方命盘中的状态，直接影响婚姻质量

**第四步：四化飞化互参（高级技法）**
- 甲方生年干 → 找到四化星 → 这些星落在乙方命盘哪个宫位
  - 化禄飞入乙方命宫/财帛宫：对乙方有正向帮助
  - 化忌飞入乙方夫妻宫：带给乙方婚姻伤害
  - 化忌飞入乙方命宫：自身给对方带来压力
- 乙方生年干 → 反向飞化分析甲方
- 形成”飞化互参“，判断双向的”缘分类型”

**第五步：大限同步分析**
- 双方当前大限是否同走旺运：俱旺=最佳时机，俱衰=共同挑战
- 一方旺一方衰：需有意识平衡双方状态
- 流年三合方桃花星聚集：当年结婚好时机

---

### 四、缘分类型判断

| 化缘类型 | 特征 |
|---------|------|
| 化禄引动 | 正缘、真爱，感情甜蜜顺遂 |
| 化权引动 | 主动争取的感情，有张力，有主导方 |
| 化科引动 | 和谐相处的缘分，互相尊重，白头偕老型 |
| 化忌引动 | 逆缘/冤家，彼此折磨但难以分离，需修行方可化解 |
| 双方互化忌 | “冤家路窄“型，感情强烈但痛苦并存，前世欠债型 |

---

### 五、婚期判断三层法

**第一层：本命盘格局**
- 夫妻宫无煞：宜早婚
- 夫妻宫有煞无吉：宜晚婚（男30以上，女27以上）
- 武曲、廉贞、七杀、破军在夫妻宫：一律建议晚婚

**第二层：大限**
- 大限夫妻宫吉星多：该十年有结婚机会
- 大限夫妻宫化忌：该十年感情受阻

**第三层：流年**
- 红鸾、天喜入命宫或夫妻宫：该年婚恋有动
- 流年宫位落到夫妻宫：该年婚姻是重点
- 流年三合方桃花星汇集：该年感情机遇多

---

### 六、各宫位结婚情形

| 流年宫位 | 结婚情形 |
|---------|---------|
| 夫妻宫 | 正常感情发展结婚 |
| 命宫 | 自己主动出击结婚 |
| 子女宫 | 奉子成婚（先上车后补票） |
| 田宅宫 | 因家庭、房产缘故结婚 |
| 父母宫 | 奉父母之命，经长辈介绍 |

---

### 七、克夫/克妻的具体标志

**克夫命（非传统含义）倪师定义**：
> “克夫的女孩子，就是太太在前面走，先生在后面满头大汗提着大包小包付钱，好不容易等到车，先生还要帮太太开门。这叫克夫。”
> “旺夫，一个太太完全让先生没有后顾之忧。”

**具体标志**：
- 夫妻宫廉贞+贪狼/破军/七杀（三凶组合）
- 太阳落陷化忌（女命）
- 太阴化忌（男命）
- 夫妻宫四煞齐聚无吉星
- 寡宿孤辰入命宫或夫妻宫
- 福德宫破军陷落 + 廉贞平（水中做冢格）

---

### 八、事业合作合盘判断

**主要参考宫位**：
- 官禄宫：双方事业宫星性是否兼容
- 兄弟宫（仆役宫）：代表合伙关系
- 福德宫：能否同甘共苦

**事业合作吉象**：
- 双方命宫互补（一谋一行）
- 一方官禄宫化禄飞入另一方官禄宫
- 兄弟宫有禄存无化忌冲

**事业合作凶象**：
- 双方化忌互冲官禄宫
- 对方命宫化忌飞入己方财帛宫（对方消耗自己钱财）
- 巨门在兄弟/仆役宫：倪师：”巨门在朋友宫，代表跟朋友合伙会朋友变仇人”

---

### 九、感情相位类型（命格兼容性速判）

| 双方组合 | 兼容性 | 说明 |
|---------|-------|------|
| 紫微 + 天府 | ★★★★★ | 帝星遇财库，相互成就，最稳定 |
| 天相 + 任何星 | ★★★★ | 印星佐才，天相适应性强 |
| 天梁 + 天同 | ★★★★ | 老成与温和互补，白头偕老型 |
| 太阳 + 太阴 | ★★★★ | 日月并明，经典互补，阴阳调和 |
| 七杀 + 七杀 | ★★ | 两虎相争，火花大，矛盾多 |
| 破军 + 破军 | ★★ | 双破，彼此破坏，婚姻不稳 |
| 廉贞 + 七杀/破军 | ★ | 三凶组合之二，生离死别风险最高 |
| 杀破狼 + 机月同梁 | ★★★ | 动静互补，但需磨合，一方开拓一方守成 |
| 紫破 + 廉府 | ★★★★ | 格局相当，互相吸引 |
| 武曲 + 天同 | ★★★ | 刚柔互济，武曲收敛遇天同温和，能互补 |

---

### 十、倪海厦合盘核心名言汇总

1. **“看婚姻，光看夫妻宫，大错特错，一定要同时看福德宫。”**
2. **“廉贞贪狼/廉贞破军在夫妻宫，不管男命女命，非生离即死别。”**
3. **“廉贞七杀——半路埋尸；廉贞破军——水中做冢；廉贞贪狼——横夭夭折。”**
4. **“太阳化忌，上不见父，下不见子，中不见夫。“（女命那十年配偶有重大灾难）**
5. **“男人的命，最怕太阴化忌，婆媳不和，太太跟妈妈一定不和。”**
6. **“旺夫，一个太太完全让先��没有后顾之忧；克夫是感情太好，完全以对方为主。”**
7. **“巨门在朋友宫，跟朋友合伙会朋友变仇人。”**
8. **“如果你娶个太太是七杀入命，那你差不多毁了一半了，很累啊，草木皆兵。”**
`;

// ─── 婚姻判断辅助表 ───────────��─────────────────────────────

export const MARRIAGE_STARS_BRIEF: Record<string, string> = {
  '红鸾': '婚恋正缘，入命身主动成婚；流年逢红鸾该年婚恋有动',
  '天喜': '婚喜，与红鸾相互引动，主喜事到来',
  '天姚': '才艺桃花，感情机遇；婚恋中遇天姚易有浪漫邂逅',
  '咸池': '强力桃花，注意感情纷扰；遇贪狼则桃花最旺',
  '孤辰': '孤克之星，男命入命宫主独立好，但入夫妻宫主缘浅',
  '寡宿': '孤克之星，女命入命或夫妻宫，主婚姻不顺聚少离多',
  '天哭': '孤克刑伤，入夫妻宫主配偶有重大灾祸',
  '天虚': '空耗之星，入夫妻宫主感情虚耗',
  '天巫': '晚婚遗产宗教；入夫妻宫主晚婚为吉，早婚多波折',
};

export const HEMING_SCORE_CRITERIA = {
  '五星': '双方夫妻宫互映天作之合，四化相互补益，大限同走旺运，福德宫双吉',
  '四星': '一方夫妻宫对应对方命宫，四化以禄科为主，感情基础扎实',
  '三星': '命格相配但各有棱角，需磨合，长期来看稳定',
  '二星': '夫妻宫各有煞星，化忌有冲，感情起伏大，需双方主动经营',
  '一星': '凶星汇聚夫妻宫，或廉贞三凶组合，生离死别风险高',
};
