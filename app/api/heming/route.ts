import { NextRequest } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import { getStarVi, getPalaceVi, getGanZhiVi } from '@/lib/ziwei/vietnamese';
import { STAR_IN_FUQI_GU } from '@/lib/ziwei/heming-knowledge';
import {
  calculateCompatibility,
  buildUniversalQuestionAnswer,
  GAN_SIHUA,
  STEM_VI_MAP,
} from '@/lib/ziwei/heming-engine';

export const runtime = 'nodejs';

function analyzeHemingDeep(chartA: ZiweiChart, chartB: ZiweiChart, question?: string) {
  const mingA = chartA.palaces.find(p => p.branch === chartA.mingGongBranch);
  const mingB = chartB.palaces.find(p => p.branch === chartB.mingGongBranch);
  const fuqiA = chartA.palaces.find(p => p.name === '夫妻');
  const fuqiB = chartB.palaces.find(p => p.name === '夫妻');
  const fudeA = chartA.palaces.find(p => p.name === '福德');
  const fudeB = chartB.palaces.find(p => p.name === '福德');

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

  // Tính chỉ số hòa hợp chiêm tinh đa chiều có căn cứ thuật toán thực tế
  const compatResult = calculateCompatibility(chartA, chartB);
  const score = compatResult.totalScore;

  const nameA = chartA.birthInfo?.name || 'Bên A';
  const nameB = chartB.birthInfo?.name || 'Bên B';
  const genderA = chartA.birthInfo?.gender === 'male' ? 'Nam' : 'Nữ';
  const genderB = chartB.birthInfo?.gender === 'male' ? 'Nam' : 'Nữ';

  // Nếu người dùng có đặt câu hỏi riêng biệt, tạo lời giải đáp chuyên sâu đưa lên đầu
  const specificAnswer = question ? buildUniversalQuestionAnswer(question, chartA, chartB) : '';

  const text = `${specificAnswer ? `${specificAnswer}\n\n---\n\n` : ''}**【Tổng quan Cơ Duyên & Chỉ Số Tương Hợp】**
- **Đánh giá tổng quan:** Đạt **${score}% — ${compatResult.level}**. ${compatResult.levelDesc}
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

  return { text, score, compatResult };
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

    const { text: fullText, score, compatResult } = analyzeHemingDeep(chartA, chartB, question);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Enqueue score metadata first
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ meta: { score, compatResult } })}\n\n`));

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
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Heming API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
