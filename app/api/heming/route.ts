import { NextRequest } from 'next/server';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import { getStarVi, getPalaceVi, getGanZhiVi, STEM_VI_MAP } from '@/lib/ziwei/vietnamese';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import { STAR_IN_FUQI_GU } from '@/lib/ziwei/heming-knowledge';

export const runtime = 'nodejs';

// Bảng tính Tứ Hóa theo Thiên Can năm sinh (Nghê Hải Hà Thiên Kỷ)
const GAN_SIHUA: Record<string, { lu: string; quan: string; ke: string; ji: string }> = {
  'Giáp': { lu: 'Liêm Trinh', quan: 'Phá Quân', ke: 'Vũ Khúc', ji: 'Thái Dương' },
  'Ất':   { lu: 'Thiên Cơ', quan: 'Thiên Lương', ke: 'Tử Vi', ji: 'Thái Âm' },
  'Bính': { lu: 'Thiên Đồng', quan: 'Thiên Cơ', ke: 'Văn Xương', ji: 'Liêm Trinh' },
  'Đinh': { lu: 'Thái Âm', quan: 'Thiên Đồng', ke: 'Thiên Cơ', ji: 'Cự Môn' },
  'Mậu':  { lu: 'Tham Lang', quan: 'Thái Âm', ke: 'Hữu Bật', ji: 'Thiên Cơ' },
  'Kỷ':   { lu: 'Vũ Khúc', quan: 'Tham Lang', ke: 'Thiên Lương', ji: 'Văn Khúc' },
  'Canh': { lu: 'Thái Dương', quan: 'Vũ Khúc', ke: 'Thái Âm', ji: 'Thiên Đồng' },
  'Tân':  { lu: 'Cự Môn', quan: 'Thái Dương', ke: 'Văn Khúc', ji: 'Văn Xương' },
  'Nhâm': { lu: 'Thiên Lương', quan: 'Tử Vi', ke: 'Tả Phụ', ji: 'Vũ Khúc' },
  'Quý':  { lu: 'Phá Quân', quan: 'Cự Môn', ke: 'Thái Âm', ji: 'Tham Lang' },
};

function formatPalaceStars(pal?: Palace): string {
  if (!pal || pal.stars.length === 0) return 'Vô chính diệu (không có chính tinh, mượn đối cung)';
  const major = pal.stars.filter(s => s.type === 'major');
  if (major.length === 0) return 'Vô chính diệu (mượn tinh diệu đối cung)';
  return major.map(s => {
    const starVi = getStarVi(s.name);
    const sihuaVi = s.siHua ? ` [Hóa ${s.siHua}]` : '';
    return `**${starVi}** (${s.name})${sihuaVi}`;
  }).join(', ');
}

/** Trả lời câu hỏi riêng biệt theo từng khía cạnh thực tế của lá số */
function buildSpecificQuestionAnswer(
  q: string,
  ctx: {
    nameA: string; nameB: string;
    genderA: string; genderB: string;
    yearA: number; yearB: number; ageDiff: number;
    starA: string; starB: string;
    caiA?: Palace; caiB?: Palace;
    quanA?: Palace; quanB?: Palace;
    dienA?: Palace; dienB?: Palace;
    fuqiA?: Palace; fuqiB?: Palace;
    fudeA?: Palace; fudeB?: Palace;
    tuA?: Palace; tuB?: Palace;
    noA?: Palace; noB?: Palace;
    phuMauA?: Palace; phuMauB?: Palace;
    sihuaA: { lu: string; quan: string; ke: string; ji: string };
    sihuaB: { lu: string; quan: string; ke: string; ji: string };
    aLuInB: string; aJiInB: string;
    bLuInA: string; bJiInA: string;
  }
): string {
  const {
    nameA, nameB,
    caiA, caiB,
    quanA, quanB,
    dienA, dienB,
    fuqiA, fuqiB,
    fudeA, fudeB,
    tuA, tuB,
    noA, noB,
    sihuaA, sihuaB,
    aLuInB, aJiInB,
    bLuInA, bJiInA,
  } = ctx;

  const lowerQ = q.toLowerCase();

  // 1. TÀI LỘC & KINH TẾ
  if (lowerQ.includes('tài lộc') || lowerQ.includes('giàu có') || lowerQ.includes('tiền') || lowerQ.includes('tài chính') || lowerQ.includes('kinh tế')) {
    const starsCaiA = formatPalaceStars(caiA);
    const starsCaiB = formatPalaceStars(caiB);
    const starsDienA = formatPalaceStars(dienA);
    const starsDienB = formatPalaceStars(dienB);

    const aLuVượng = aLuInB.includes('Tài') || aLuInB.includes('Mệnh') || aLuInB.includes('Quan') || aLuInB.includes('Điền');
    const bLuVượng = bLuInA.includes('Tài') || bLuInA.includes('Mệnh') || bLuInA.includes('Quan') || bLuInA.includes('Điền');

    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Tài Lộc & Khả Năng Tương Trợ Làm Giàu】**
*Câu hỏi: "${q}"*

**1. Khảo sát Cung Tài Bạch & Cung Điền Trạch (Kho tích lũy tài sản):**
- **${nameA}:** Cung Tài Bạch tọa tại cung **${caiA?.name ? getPalaceVi(caiA.name) : 'Tài Bạch'}**, hội tụ các tinh diệu: ${starsCaiA}. Cung Điền Trạch (két sắt giữ của) hội tụ: ${starsDienA}.
- **${nameB}:** Cung Tài Bạch tọa tại cung **${caiB?.name ? getPalaceVi(caiB.name) : 'Tài Bạch'}**, hội tụ các tinh diệu: ${starsCaiB}. Cung Điền Trạch hội tụ: ${starsDienB}.
- **Đánh giá phối hợp:** Hai lá số có sự bù trừ rõ nét giữa dòng tiền lưu động bên ngoài và khả năng tích lũy bất động sản hậu phương.

**2. Tứ Hóa Phi Nhập chiếu rọi tài nguyên giữa hai người:**
- **Sao Hóa Lộc của ${nameA} (${sihuaA.lu}):** Bay thẳng vào **cung ${aLuInB}** của ${nameB}. ${aLuVượng ? `✦ Cực kỳ đắc lợi! ${nameA} chính là "Thần Tài" mang đến nhiều cơ duyên phát triển kinh tế, gia tăng thu nhập và kích hoạt vận tài lộc của ${nameB}.` : `Mang lại cho ${nameB} tâm lý thoải mái, tiêu trừ áp lực tài chính trong cuộc sống.`}
- **Sao Hóa Lộc của ${nameB} (${sihuaB.lu}):** Bay thẳng vào **cung ${bLuInA}** của ${nameA}. ${bLuVượng ? `✦ Tuyệt hảo! ${nameB} là hậu phương vượng tài đắc lực, biết gom góp tích lũy và tương trợ ${nameA} mở rộng cơ đồ.` : `Tạo dựng sự an tâm vững chãi cho ${nameA} khi tập trung sự nghiệp.`}
- **Lưu ý Hóa Kỵ:** Sao Hóa Kỵ của ${nameA} bay vào cung ${aJiInB} và của ${nameB} bay vào cung ${bJiInA} — nhắc nhở hai bên cần công khai minh bạch các kế hoạch đầu tư lớn, tránh giấu giếm tài chính gây nghi kỵ.

**3. Khẩu quyết Thầy Nghê Hải Hà (*Thiên Kỷ*):**
*"Tài Bạch là tiền bạc kiếm được ngoài xã hội, còn Điền Trạch mới là kho báu giữ tiền thực sự. Hai vợ chồng một người xông pha kiến tạo tài nguyên, một người quản lý quy đổi dòng tiền thành tài sản thực (bất động sản, tư liệu sản xuất) thì tiền tài vạn kiếp bất suy!"*

**4. Kết luận & Chiến lược phát triển tài phú:**
Hai người **hoàn toàn có năng lực tương trợ giúp nhau giàu có vượt bậc**. Hãy để người có tính cẩn trọng nắm giữ sổ sách ngân sách gia đình, người có sao khai phá phụ trách mở rộng quan hệ đối ngoại. Tránh các kênh đầu cơ mạo hiểm nếu cung Tài/Điền có sát tinh ngộ Không Kiếp.`;
  }

  // 2. HỢP TÁC LÀM ĂN & KINH DOANH
  if (lowerQ.includes('hợp tác') || lowerQ.includes('làm ăn') || lowerQ.includes('kinh doanh') || lowerQ.includes('chung vốn') || lowerQ.includes('đối tác')) {
    const starsQuanA = formatPalaceStars(quanA);
    const starsQuanB = formatPalaceStars(quanB);
    const starsNoA = formatPalaceStars(noA);
    const starsNoB = formatPalaceStars(noB);

    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Hợp Tác Làm Ăn & Kinh Doanh Chung】**
*Câu hỏi: "${q}"*

**1. Khảo sát Cung Quan Lộc (Sự nghiệp) & Cung Nô Bộc (Cộng sự):**
- **${nameA}:** Cung Quan Lộc hội tụ: ${starsQuanA}. Phong cách làm việc chủ về sự quyết đoán và năng lực chuyên môn. Cung Nô Bộc hội tụ: ${starsNoA}.
- **${nameB}:** Cung Quan Lộc hội tụ: ${starsQuanB}. Phong cách làm việc thiên về mưu lược, sự bền bỉ và chu toàn. Cung Nô Bộc hội tụ: ${starsNoB}.
- **Thế phối hợp:** Một bên chủ về **Mưu** (hoạch định chiến lược, quan hệ, đàm phán), một bên chủ về **Hành** (thực thi, quản trị quy trình, kiểm soát chất lượng). Đây là thế chân vạc rất tốt trong kinh doanh.

**2. Chiếu rọi Tứ Hóa & Nguy cơ tiềm ẩn:**
- Hai bên hỗ trợ nhau qua Hóa Lộc (${sihuaA.lu} và ${sihuaB.lu}), tạo nên động lực kiếm tiền và phát triển chung rất lớn.
- Tuy nhiên, cần lưu ý sao Hóa Kỵ của ${nameA} vào cung ${aJiInB} và của ${nameB} vào cung ${bJiInA}: Đây là những điểm dễ sinh bất đồng ý kiến về quy trình làm việc hoặc quản lý nhân sự.

**3. Khẩu quyết Thầy Nghê Hải Hà (*Thiên Kỷ*):**
*"Hợp tác làm ăn giữa người thân hoặc vợ chồng muốn lâu bền thì 'Tiền bạc phải phân minh, ái tình phải dứt khoát'. Không thể vì tình cảm mà bỏ qua nguyên tắc hợp đồng và thẩm quyền quyết định."*

**4. Lời khuyên phân định vai trò thực tế:**
- **Nên hợp tác:** Hoàn toàn có thể hợp tác nhưng **bắt buộc phải phân định rõ một người làm Trưởng (Người ra quyết định cuối cùng)** và một người làm Phó điều hành.
- Tránh cùng quyết định một việc chi tiết nhỏ nhặt. Khi có bất đồng về chiến lược kinh doanh, hãy dựa vào số liệu và quy chế đã thống nhất từ trước.`;
  }

  // 3. ĐIỂM XUNG ĐỘT QUAN ĐIỂM & BẤT ĐỒNG
  if (lowerQ.includes('xung đột') || lowerQ.includes('mâu thuẫn') || lowerQ.includes('bất đồng') || lowerQ.includes('quan điểm') || lowerQ.includes('cãi nhau') || lowerQ.includes('khắc')) {
    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Điểm Xung Đột Quan Điểm & Bí Quyết Hóa Giải】**
*Câu hỏi: "${q}"*

**1. Nút thắt xung đột từ Tứ Hóa Phi Kỵ:**
- **Sao Hóa Kỵ của ${nameA} (${sihuaA.ji})** bay vào **cung ${aJiInB}** của ${nameB}: Đây là điểm va chạm nhạy cảm nhất! Khi ${nameA} can thiệp hoặc tỏ thái độ khắt khe đối với lĩnh vực của cung **${aJiInB}**, ${nameB} rất dễ cảm thấy bị tổn thương, gò bó hoặc mất đi quyền tự chủ.
- **Sao Hóa Kỵ của ${nameB} (${sihuaB.ji})** bay vào **cung ${bJiInA}** của ${nameA}: Ngược lại, những thói quen hoặc quyết định của ${nameB} chạm vào lĩnh vực của cung **${bJiInA}** sẽ là ngòi nổ khiến ${nameA} dễ phiền lòng, ưu tư và bộc phát bức xúc.

**2. Khác biệt về khí chất tiên thiên:**
- Cốt cách chính tinh Mệnh của ${nameA} (${getStarVi(ctx.starA)}) và ${nameB} (${getStarVi(ctx.starB)}): Một bên coi trọng nguyên tắc và tính hiệu quả ngay lập tức, một bên giàu cảm xúc và coi trọng sự lắng nghe chia sẻ. Khi gặp áp lực cuộc sống, cách phản ứng khác nhau này dễ tạo ra cảm giác "không hiểu nhau".

**3. Phương pháp hóa giải triệt để theo Y Đạo & Thiên Kỷ:**
- **Nguyên tắc "Hòa - Nhẫn" của Cung Phúc Đức:** Thầy Nghê Hải Hà dạy: *"Lửa giận bốc lên từ Can hỏa, nói nhiều sinh tổn khí. Khi nảy sinh bất đồng, tuyệt đối không đôi co sau 23h đêm trong phòng ngủ."*
- Hãy chủ động dừng cuộc tranh luận, uống một tách trà ấm để bình Can hỏa, và ngồi lại trò chuyện khi cả hai đã lấy lại sự điềm tĩnh. Dùng lý trí thấu hiểu rằng đối phương khác biệt chứ không hề có ác ý.`;
  }

  // 4. KẾT HÔN CÓ HẠNH PHÚC BỀN LÂU KHÔNG
  if (lowerQ.includes('hạnh phúc') || lowerQ.includes('bền lâu') || lowerQ.includes('kết hôn') || lowerQ.includes('ly hôn') || lowerQ.includes('trọn đời') || lowerQ.includes('ly biệt')) {
    const starsFudeA = formatPalaceStars(fudeA);
    const starsFudeB = formatPalaceStars(fudeB);
    const starsFuqiA = formatPalaceStars(fuqiA);
    const starsFuqiB = formatPalaceStars(fuqiB);

    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Hôn Nhân Có Hạnh Phúc Bền Lâu Không?】**
*Câu hỏi: "${q}"*

**1. Khảo sát Cung Phúc Đức — Chiếc mỏ neo quyết định độ bền hôn nhân:**
- Khẩu quyết Thầy Nghê Hải Hà: *"Muốn biết vợ chồng có đi trọn đời cùng nhau hay không, nhìn cung Phu Thê chỉ thấy được 3 phần duyên nợ ban đầu, nhìn cung Phúc Đức mới thấy trọn 7 phần nghiệp quả trường cửu!"*
- **Cung Phúc Đức ${nameA}:** Hội tụ: ${starsFudeA}. Chủ về chiều sâu tâm tưởng và nguồn phúc trạch tích lũy.
- **Cung Phúc Đức ${nameB}:** Hội tụ: ${starsFudeB}. Bổ trợ sự thiện lương và khả năng nhường nhịn.
- **Đánh giá:** Nền tảng Phúc Đức của cả hai bên đều vững vàng, có sự gắn kết đạo lý và ý thức trách nhiệm gia đình cao.

**2. Tương khảo Cung Phu Thê hai bên:**
- Phu Thê của ${nameA} (${starsFuqiA}) và Phu Thê của ${nameB} (${starsFuqiB}) phản ánh mẫu người bạn đời mà mỗi bên hướng tới. Khí chất của ${nameB} tương thích cao với tiêu chuẩn ngầm định của ${nameA}.
- Chênh lệch độ tuổi: ${ctx.ageDiff} tuổi. ${ctx.ageDiff >= 7 ? `✦ Rất đắc cách trưởng tuổi theo hệ thống Thiên Kỷ (trên 7 tuổi), giúp tâm lý đôi bên trưởng thành, tránh được sự nông nổi của tuổi trẻ.` : `Đồng trang lứa, cần duy trì sự tôn trọng bình đẳng và thường xuyên hâm nóng tình cảm.`}

**3. Kết luận về độ bền vững:**
Hai bạn **hoàn toàn có đủ cơ duyên để xây dựng cuộc hôn nhân hạnh phúc, bền lâu đến đầu bạc răng long**. Dù trong đời sống gia đình sẽ có những chu kỳ đại hạn thử thách, nhưng với sự tôn trọng lẫn nhau và nền tảng Phúc Đức ấm êm, hai người sẽ luôn tìm được tiếng nói chung để cùng nhau vượt qua.`;
  }

  // 5. PHONG THỦY PHÒNG NGỦ & DƯƠNG TRẠCH
  if (lowerQ.includes('phong thủy') || lowerQ.includes('phòng ngủ') || lowerQ.includes('giường') || lowerQ.includes('bếp') || lowerQ.includes('nhà cửa') || lowerQ.includes('dương trạch')) {
    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Phong Thủy Phòng Ngủ & Dương Trạch Sau Cưới】**
*Câu hỏi: "${q}"*

**1. Bí pháp Bát Quái Càn - Khôn (Quẻ Địa Thiên Thái độc quyền Thầy Nghê Hải Hà):**
- Theo Dịch Lý và Dương Trạch Thiên Kỷ:
  + Người Chồng giữ ngôi vị **Quẻ Càn** (Trời, Phương Tây Bắc).
  + Người Vợ giữ ngôi vị **Quẻ Khôn** (Đất, Phương Tây Nam).
- **Phép an vị hoàn hảo:** Sau khi kết hôn, hai vợ chồng **bắt buộc phải đặt Phòng Ngủ Chính tại Cung Tây Bắc** của ngôi nhà.
- **Ý nghĩa nhiệm màu:** Người Vợ (Khôn) ở vào vị trí của Chồng (Càn) tạo nên thế quẻ **Địa Thiên Thái** (Đất trên Trời, Âm giáng Dương thăng, Âm Dương giao hòa). Kết quả: Người chồng sự nghiệp thăng hoa tột bậc, thành công đại nghiệp; người vợ khỏe mạnh đoan trang thọ trường; gia đạo tích lũy của cải dồi dào, con cái hiếu thuận vinh hiển!

**2. Những cấm kỵ sinh tử tuyệt đối phải tránh trong ngôi nhà:**
- **Tuyệt đối không đặt Bếp ở Tây Bắc:** Đây là thế hung hiểm *"Hỏa Thiêu Thiên Môn"*. Lửa của bếp đốt cháy cung Càn (đại diện cho người cha, người chồng trong nhà), khiến người đàn ông dễ bị bệnh tim mạch, tai biến, đột quỵ hoặc sự nghiệp sa sút nghiêm trọng.
- **Không đặt Nhà Vệ Sinh ở Trung Cung:** Tâm mạch của ngôi nhà phải luôn thông thoáng, sạch sẽ và đón ánh sáng. Nhà vệ sinh ở giữa nhà sẽ làm uế khí tán đi tứ phía, ảnh hưởng xấu đến hệ tiêu hóa và hòa khí vợ chồng.
- **Đầu giường ngủ:** Phải tựa vào tường kiên cố, tuyệt đối không để gương soi thẳng vào giường ngủ hoặc xà ngang đè lên đỉnh đầu.`;
  }

  // 6. CON CÁI & TỬ TỨC
  if (lowerQ.includes('con cái') || lowerQ.includes('sinh con') || lowerQ.includes('con trai') || lowerQ.includes('con gái') || lowerQ.includes('tử tức')) {
    const starsTuA = formatPalaceStars(tuA);
    const starsTuB = formatPalaceStars(tuB);
    return `**【Giải Đáp Chuyên Sâu Tinh Bàn: Duyên Phận Con Cái & Cung Tử Tức】**
*Câu hỏi: "${q}"*

**1. Khảo sát Cung Tử Tức của cả hai bên:**
- **Cung Tử Tức của ${nameA}:** Tọa tinh: ${starsTuA}.
- **Cung Tử Tức của ${nameB}:** Tọa tinh: ${starsTuB}.
- **Nhận định tinh diệu:** Các cát tinh củng chiếu cung Tử Tức cho thấy hậu duệ là người thông minh, hiếu thuận và có chí tiến thủ.

**2. Duyên phận sinh con & Lời khuyên dưỡng sinh:**
- Theo Thầy Nghê Hải Hà, con cái là kết tinh của khí huyết phụ mẫu. Muốn sinh con thông minh khỏe mạnh, hai vợ chồng nên điều dưỡng Can - Thận từ trước 6 tháng, đi ngủ trước 23h để kinh Đởm phục hồi tủy huyết.
- Tránh căng thẳng công việc trong thời kỳ thụ thai để con sinh ra mang tính cách điềm đạm, hòa ái.`;
  }

  // 7. CÂU HỎI TÙY BIẾN KHÁC
  return `**【Giải Đáp Chuyên Sâu Tinh Bàn: "${q}"】**

**1. Khảo sát liên đới giữa hai tinh bàn:**
Dựa trên cấu trúc Mệnh Cung (**${getStarVi(ctx.starA)}** của ${nameA} và **${getStarVi(ctx.starB)}** của ${nameB}) cùng thế tam phương tứ chính của hai lá số:
- Mối quan hệ giữa hai người chịu sự chi phối mạnh mẽ của Tứ Hóa Phi Tinh: Hóa Lộc của ${nameA} mang phúc khí sang cung **${aLuInB}** của ${nameB}, trong khi Hóa Lộc của ${nameB} chiếu rọi cung **${bLuInA}** của ${nameA}.
- Năng lượng tương hỗ này cho thấy đối với vấn đề bạn đang băn khoăn (*"${q}"*), sự phối hợp nhịp nhàng và chủ động chia sẻ của đôi bên sẽ chuyển hóa mọi khúc mắc thành cơ hội phát triển.

**2. Chỉ dẫn hành động thực tiễn theo trường phái Nghê Hải Hà:**
- Lấy sự thấu hiểu và chân thành làm kim chỉ nam. Khi đứng trước các quyết định quan trọng, hãy bình tâm suy xét từ góc nhìn của đối phương.
- Kết hợp phong thủy phòng ngủ Tây Bắc (quẻ Địa Thiên Thái) để gia tăng phúc khí, giúp tâm trí hanh thông và đưa ra những lựa chọn chuẩn xác nhất.`;
}

function analyzeHemingDeep(chartA: ZiweiChart, chartB: ZiweiChart, question?: string) {
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

  const starNameA = mingA?.stars.find(s => s.type === 'major')?.name || 'Vô Chính Diệu';
  const starNameB = mingB?.stars.find(s => s.type === 'major')?.name || 'Vô Chính Diệu';

  const fuqiStarA = fuqiA?.stars.find(s => s.type === 'major')?.name || '';
  const fuqiStarB = fuqiB?.stars.find(s => s.type === 'major')?.name || '';

  const fuqiInsightA = STAR_IN_FUQI_GU[fuqiStarA];
  const fuqiInsightB = STAR_IN_FUQI_GU[fuqiStarB];

  // Tính chênh lệch tuổi
  const yearA = chartA.birthInfo?.year || 1990;
  const yearB = chartB.birthInfo?.year || 1990;
  const ageDiff = Math.abs(yearA - yearB);

  // Tính Tứ Hóa Phi Nhập từ Thiên Can năm sinh
  const stemNameA = STEMS[chartA.lunarInfo.yearStem] || '甲';
  const stemNameB = STEMS[chartB.lunarInfo.yearStem] || '甲';
  const ganA = STEM_VI_MAP[stemNameA] || 'Giáp';
  const ganB = STEM_VI_MAP[stemNameB] || 'Giáp';
  const ganZhiA = getGanZhiVi(stemNameA + (BRANCHES[chartA.lunarInfo.yearBranch] || '子'));
  const ganZhiB = getGanZhiVi(stemNameB + (BRANCHES[chartB.lunarInfo.yearBranch] || '子'));

  const sihuaA = GAN_SIHUA[ganA] || GAN_SIHUA['Giáp'];
  const sihuaB = GAN_SIHUA[ganB] || GAN_SIHUA['Giáp'];

  // Xem sao Hóa Lộc / Hóa Kỵ của A nằm ở cung nào của B
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

  // Đánh giá Phúc Đức hai bên
  const fudeStarsA = fudeA?.stars.map(s => getStarVi(s.name)).join(', ') || 'Thanh tĩnh';
  const fudeStarsB = fudeB?.stars.map(s => getStarVi(s.name)).join(', ') || 'Thanh tĩnh';

  // Tính chỉ số hòa hợp cơ sở (75 - 95 điểm)
  let score = 82;
  if (ageDiff >= 7) score += 6; // Đắc cách 7 tuổi theo Thiên Kỷ
  if (aLuInB.includes('Mệnh') || aLuInB.includes('Tài') || aLuInB.includes('Quan')) score += 4;
  if (bLuInA.includes('Mệnh') || bLuInA.includes('Tài') || bLuInA.includes('Quan')) score += 4;
  if (score > 96) score = 96;

  const nameA = chartA.birthInfo?.name || 'Bên A';
  const nameB = chartB.birthInfo?.name || 'Bên B';
  const genderA = chartA.birthInfo?.gender === 'male' ? 'Nam' : 'Nữ';
  const genderB = chartB.birthInfo?.gender === 'male' ? 'Nam' : 'Nữ';

  // Nếu người dùng có đặt câu hỏi riêng biệt, tạo lời giải đáp chuyên sâu đưa lên đầu
  const specificAnswer = question ? buildSpecificQuestionAnswer(question, {
    nameA, nameB, genderA, genderB, yearA, yearB, ageDiff,
    starA: starNameA, starB: starNameB,
    caiA, caiB, quanA, quanB, dienA, dienB,
    fuqiA, fuqiB, fudeA, fudeB, tuA, tuB, noA, noB, phuMauA, phuMauB,
    sihuaA, sihuaB,
    aLuInB, aJiInB, bLuInA, bJiInA,
  }) : '';

  const text = `${specificAnswer ? `${specificAnswer}\n\n---\n\n` : ''}**【Tổng quan Cơ Duyên & Chỉ Số Tương Hợp】**
- **${nameA} (${genderA} Mệnh):** Năm ${ganZhiA} (${yearA}), Cục ${chartA.wuxingJuName}, Mệnh tọa ${getPalaceVi(mingA?.name || '')} có **${getStarVi(starNameA)}** thủ mệnh.
- **${nameB} (${genderB} Mệnh):** Năm ${ganZhiB} (${yearB}), Cục ${chartB.wuxingJuName}, Mệnh tọa ${getPalaceVi(mingB?.name || '')} có **${getStarVi(starNameB)}** thủ mệnh.
- **Khoảng cách độ tuổi:** Chênh lệch ${ageDiff} tuổi. ${ageDiff >= 7 ? `✦ Đắc cách «Trưởng thất tuế dĩ thượng» của Thầy Nghê Hải Hà: Cách biệt từ 7 tuổi trở lên là dương số chuyển hóa, tâm lý bao dung nhường nhịn, tương trợ như bậc tiền bối dìu dắt, gia đạo càng thêm hòa mục.` : `Độ tuổi ngang hàng, tư tưởng đồng trang lứa, cần lấy sự tôn trọng và chia sẻ bình đẳng làm gốc.`}

---

**【Thiên Địa Uyên Ương Hợp · Tương Khảo Cung Mệnh & Phu Thê】**
- **Cung Phu Thê của ${nameA}:** Tọa tinh **${fuqiStarA ? getStarVi(fuqiStarA) : 'Vô Chính Diệu'}**. ${fuqiInsightA?.summary || 'Kỳ vọng bạn đời có phẩm cách cương trực, biết lắng nghe.'}
- **Cung Phu Thê của ${nameB}:** Tọa tinh **${fuqiStarB ? getStarVi(fuqiStarB) : 'Vô Chính Diệu'}**. ${fuqiInsightB?.summary || 'Kỳ vọng sự chia sẻ ân cần và đồng cam cộng khổ.'}
- **Mức độ tương tác:** Bản tính của ${nameB} mang thần thái ${getStarVi(starNameB)}, tương ứng mật thiết với hình mẫu mà cung Phu Thê ${nameA} tìm kiếm. Sự kết hợp giữa ${getStarVi(starNameA)} và ${getStarVi(starNameB)} tạo nên thế cân bằng động: một bên chủ về cương nghị mở lối, một bên chủ về nhu hòa tích lũy tài nguyên.

---

**【Tứ Hóa Phi Nhập Tương Hỗ (Duyên Nợ & Tài Phúc)】**
- **${nameA} phóng Tứ Hóa sang lá số ${nameB}:**
  + **Hóa Lộc (${sihuaA.lu}):** Bay vào **cung ${aLuInB}** của ${nameB} → ${nameA} chính là cát tinh mang đến phúc khí, sự tự tin và tài lộc cho ${nameB} ở phương diện này.
  + **Hóa Kỵ (${sihuaA.ji}):** Bay vào **cung ${aJiInB}** của ${nameB} → Đây là cung vị mà ${nameA} đôi khi vô tình gây áp lực tâm lý hoặc khiến ${nameB} phải bận tâm suy nghĩ nhiều nhất. Cần mở lòng giãi bày để hóa giải.
- **${nameB} phóng Tứ Hóa sang lá số ${nameA}:**
  + **Hóa Lộc (${sihuaB.lu}):** Bay vào **cung ${bLuInA}** của ${nameA} → ${nameB} là hậu phương trợ lực đắc lực, vượng phát vận tài lộc của ${nameA}.
  + **Hóa Kỵ (${sihuaB.ji}):** Bay vào **cung ${bJiInA}** của ${nameA} → Điểm cần nhẫn nại, tránh cố chấp hay tranh cãi khi chạm vào việc gia đạo tại phương diện này.

---

**【Phúc Đức Hợp Khán · Nền Móng Nghiệp Quả & Độ Bền Hôn Nhân】**
- **Khẩu quyết Thầy Nghê Hải Hà (*Thiên Kỷ*):** *"Cung Phu Thê chỉ là biểu hiện ban đầu, cung Phúc Đức mới là gốc rễ quyết định có đi cùng nhau trọn đời hay không!"*
- **Phúc Đức cung của ${nameA}:** Hội tụ tinh diệu: *${fudeStarsA}*. Thể hiện tư tưởng nội tâm sâu kín và nguồn phúc ấm tổ tiên.
- **Phúc Đức cung của ${nameB}:** Hội tụ tinh diệu: *${fudeStarsB}*. 
- **Đánh giá bền vững:** Cả hai bên đều có cung Phúc Đức bổ trợ trường năng lượng. Dù trong cuộc sống không tránh khỏi những lúc sóng gió bát đũa xô nhau, nhưng nhờ đức dày và sự hiểu biết đạo lý, đôi bên hoàn toàn có thể nắm tay vượt qua mọi gian truân.

---

**【Cẩm Nang Dương Trạch Hóa Giải Của Thầy Nghê Hải Hà】**
1. **Phép bố trí phòng ngủ chính (Quẻ Địa Thiên Thái):**
   - Sau khi kết hôn, hai vợ chồng **bắt buộc phải đặt phòng ngủ tại Phương Tây Bắc (Càn vị)** của ngôi nhà.
   - Vợ (Khôn) ở vị trí của Chồng (Càn) tạo nên quẻ **Địa Thiên Thái** (Đất trên Trời, Âm giáng Dương thăng), gia tài đại hưng thịnh, chồng thành đại nghiệp, vợ an khang thọ trường.
2. **Các cấm kỵ tuyệt đối cần tránh:**
   - **Tuyệt đối không đặt Nhà Bếp ở Tây Bắc:** Bếp tượng dao thớt mổ xẻ và hỏa thiêu. Bếp ở Tây Bắc gọi là *"Hỏa thiêu Thiên Môn"*, cực kỳ nguy hiểm cho sinh mệnh và sự nghiệp của người chồng.
   - **Không làm Phòng Khách ở Tây Bắc:** Chủ người chồng coi nhà như quán trọ, công tác liên miên hoặc dễ dẫn đến phu thê sinh ly.
   - **Giữ trung tâm ngôi nhà (Trung Cung) sạch sẽ, thoáng sáng:** Tránh đặt nhà vệ sinh giữa nhà gây xung phá tâm mạch.

---

**【Lời Khuyên Thực Tiễn Tri Hành Hợp Nhất】**
Hai bạn có nhân duyên tương ngộ rất sâu sắc. Hãy trân quý từng khoảnh khắc đồng hành, bố trí phương vị nhà cửa hòa hợp âm dương và cùng nhau tu dưỡng tâm tính để viết nên câu chuyện hạnh phúc rực rỡ nhất!`;

  return { text, score };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chartA, chartB, question } = body as {
      chartA: ZiweiChart;
      chartB: ZiweiChart;
      question?: string;
    };

    if (!chartA || !chartB) {
      return new Response(JSON.stringify({ error: 'Missing charts data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { text: fullText, score } = analyzeHemingDeep(chartA, chartB, question);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Enqueue score metadata first
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ meta: { score } })}\n\n`));

        const chunkSize = 28;
        for (let i = 0; i < fullText.length; i += chunkSize) {
          const chunk = fullText.slice(i, i + chunkSize);
          const payload = `data: ${JSON.stringify({ delta: { text: chunk } })}\n\n`;
          controller.enqueue(encoder.encode(payload));
          await new Promise(r => setTimeout(r, 10));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Heming API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
