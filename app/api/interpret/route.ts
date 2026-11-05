import { NextRequest } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { generateInterpretStream } from '@/lib/ziwei/interpret-engine';

export const runtime = 'nodejs';

const PALACE_NAME_VI_TO_CN: Record<string, string> = {
  'mệnh': '命宫',
  'mệnh cung': '命宫',
  'phu thê': '夫妻',
  'quan lộc': '官禄',
  'tài bạch': '财帛',
  'thiên di': '迁移',
  'tật ách': '疾厄',
  'phúc đức': '福德',
  'điền trạch': '田宅',
  'tử tức': '子女',
  'nô bộc': '仆役',
  'giao hữu': '仆役',
  'huynh đệ': '兄弟',
  'phụ mẫu': '父母',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chart, messages } = body as {
      chart: ZiweiChart;
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    };

    if (!chart) {
      return new Response(JSON.stringify({ error: 'Missing chart data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : '';
    const lower = lastMessage.toLowerCase();

    // ── 1. Nhận diện chủ đề (Tiếng Việt & Tiếng Trung) ──
    let topic = 'overview';
    if (
      lower.includes('tình cảm') || lower.includes('hôn nhân') || lower.includes('phu thê') ||
      lower.includes('bạn đời') || lower.includes('duyên phận') ||
      lastMessage.includes('感情') || lastMessage.includes('夫妻')
    ) {
      topic = 'love';
    } else if (
      lower.includes('sự nghiệp') || lower.includes('công danh') || lower.includes('quan lộc') ||
      lower.includes('nghề nghiệp') || lower.includes('việc làm') || lower.includes('thăng tiến') ||
      lastMessage.includes('事业') || lastMessage.includes('官禄')
    ) {
      topic = 'career';
    } else if (
      lower.includes('tài lộc') || lower.includes('tài bạch') || lower.includes('tiền tài') ||
      lower.includes('điền trạch') || lower.includes('tụ tài') || lower.includes('làm ăn') ||
      lastMessage.includes('财运') || lastMessage.includes('财帛')
    ) {
      topic = 'wealth';
    } else if (
      lower.includes('sức khỏe') || lower.includes('tật ách') || lower.includes('bệnh tật') ||
      lower.includes('kinh lạc') || lower.includes('tạng phủ') || lower.includes('dưỡng sinh') ||
      lastMessage.includes('健康') || lastMessage.includes('疾厄')
    ) {
      topic = 'health';
    } else if (
      lower.includes('tính cách') || lower.includes('khí chất') || lower.includes('tâm lý') ||
      lower.includes('ưu nhược điểm') || lastMessage.includes('性格') || lastMessage.includes('特质')
    ) {
      topic = 'personality';
    }

    // ── 2. Nhận diện cung vị được hỏi cụ thể ──
    let selectedPalaceName: string | undefined = undefined;
    for (const [viName, cnName] of Object.entries(PALACE_NAME_VI_TO_CN)) {
      if (lower.includes(`cung ${viName}`) || lower.includes(`【${viName}】`)) {
        selectedPalaceName = cnName;
        break;
      }
    }
    if (!selectedPalaceName) {
      const palaceMatch = lastMessage.match(/【(.+?)(?:宫)?】/);
      if (palaceMatch && palaceMatch[1]) {
        selectedPalaceName = palaceMatch[1].replace('宫', '');
      }
    }

    // ── 3. Nhận diện Tứ Hóa cụ thể ──
    let selectedSiHua: { starName: string; siHua: string } | undefined = undefined;
    const sihuaMatchVi = lastMessage.match(/sao\s+([a-zA-Zà-ỹÀ-Ỹ\s]+?)\s+Hóa\s+(Lộc|Quyền|Khoa|Kỵ)/i);
    const sihuaMatchCn = lastMessage.match(/(?:sao|星)?\s*([紫微天机太阳武曲天同廉贞天府太阴贪狼巨门天相天梁七杀破军左辅右弼文昌文曲]+)\s*化\s*([禄权科忌])/);
    if (sihuaMatchVi) {
      selectedSiHua = { starName: sihuaMatchVi[1].trim(), siHua: sihuaMatchVi[2] };
    } else if (sihuaMatchCn) {
      selectedSiHua = { starName: sihuaMatchCn[1].trim(), siHua: sihuaMatchCn[2] };
    }

    // ── 4. Kiểm tra xem có cấu hình AI ngoại viện không ──
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.MIMO_API_KEY;

    if (apiKey && process.env.AI_PROVIDER) {
      try {
        const baseUrl = process.env.DEEPSEEK_API_KEY
          ? 'https://api.deepseek.com/v1'
          : process.env.MIMO_BASE_URL || 'https://api.openai.com/v1';
        const model = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : (process.env.MIMO_MODEL || 'gpt-4o');

        const systemPrompt = `Bạn là Đại Sư Chiêm Tinh Tử Vi Đẩu Số cao cấp (Thương hiệu ZHANXING MINGSHU · 占星明舒), thấu suốt hệ thống của Thầy Nghê Hải Hà (Ni Haisha - Thiên Kỷ) và cổ tịch Tử Vi Đẩu Số Toàn Thư.
Khi luận giải cho người hỏi:
1. Luôn dùng thuật ngữ Tử Vi chuẩn Hán - Việt.
2. Căn cứ nghiêm ngặt vào lá số đã cung cấp: Mệnh, Thân, 14 chính tinh miếu hãm, Tứ Hóa, Tam phương tứ chính, Cung Tật Ách và Y lý Tử Ngọ Lưu Chú.
3. Nhấn mạnh triết lý Nghê Hải Hà: "Đại đạo chí giản", "Tiên thiên Mệnh 1/3, Nhân sự nỗ lực 1/3, Địa lý phong thủy 1/3", dùng lời khuyên tích cực, hướng thiện, thực tế.
4. Cấu trúc câu trả lời rõ ràng theo định dạng các thẻ: **【Tiêu đề】** trên một dòng riêng biệt để giao diện hiển thị huy hiệu vàng kim.`;

        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            stream: true,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'system', content: `Dữ liệu lá số Tử Vi: ${JSON.stringify(chart)}` },
              ...messages,
            ],
          }),
        });

        if (response.ok && response.body) {
          return new Response(response.body, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          });
        }
      } catch (err) {
        console.warn('External AI call failed, falling back to built-in Tianji engine:', err);
      }
    }

    // ── 5. Động cơ Luận Giải Độc Lập Chuẩn Thiên Kỷ (Zero-API Key!) ──
    const fullText = generateInterpretStream({
      chart,
      topic,
      selectedPalaceName,
      selectedSiHua,
      userQuery: lastMessage,
    });

    // Tạo luồng phản hồi SSE kiểu chữ gõ mượt mà
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Chia đoạn nhỏ để mô phỏng dòng suy nghĩ thời gian thực
        const chunks = fullText.split('\n');
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i] + (i < chunks.length - 1 ? '\n' : '');
          const sseEvent = `data: ${JSON.stringify({ delta: { text: chunk } })}\n\n`;
          controller.enqueue(encoder.encode(sseEvent));
          // Khoảng nghỉ nhỏ để tạo hiệu ứng typewriter tự nhiên
          await new Promise(r => setTimeout(r, 22));
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
  } catch (error) {
    console.error('Interpret API error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
