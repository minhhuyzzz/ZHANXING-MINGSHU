'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';
import { getPalaceVi, getStarVi, getSiHuaShortVi } from '@/lib/ziwei/vietnamese';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Mệnh Cách', icon: '✦' },
  { key: 'love',        label: 'Tình Duyên', icon: '❦' },
  { key: 'career',      label: 'Sự Nghiệp', icon: '⚔' },
  { key: 'wealth',      label: 'Tài Lộc',   icon: '⚜' },
  { key: 'health',      label: 'Sức Khỏe',  icon: '⚕' },
  { key: 'personality', label: 'Tính Cách', icon: '☯' },
] as const;

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Hãy phân tích tổng quan mệnh cách, trình bày theo cấu trúc sau:

**【Mệnh cách định tính】**
Khái quát cốt cách tiên thiên và khí chất chủ đạo của mệnh chủ.

**【Chính tinh giải đoán】**
Phân tích tinh diệu thủ mệnh, dẫn khẩu quyết trường phái Nghê Hải Hà.

**【Tam phương tứ chính】**
Thế tam giác Mệnh - Tài - Quan - Di và sự hỗ trợ giữa các cung.

**【Đại Hạn hiện tại】**
Định hướng cơ hội và vận trình 10 năm hiện tại.

**【Ưu thế & Lưu ý】**
Sở trường thiên bẩm và bài học tu dưỡng cần lưu ý.`,

  love: `Hãy phân tích chuyên sâu vận thế tình cảm hôn nhân, trình bày theo cấu trúc sau:

**【Tình cảm cách cục】**
Khái quát tính chất tình cảm và duyên phận phối ngẫu.

**【Cung Phu Thê tường giải】**
Chính tinh, phụ tinh, tứ hóa tại Phu Thê và luận đoán theo Nghê Sư.

**【Tam phương liên đới】**
Tác động qua lại từ cung Mệnh, Thiên Di và Phúc Đức đối với hôn nhân.

**【Vận hạn tình cảm hiện tại】**
Chuyển biến duyên cảm trong Đại Hạn và thời điểm bước ngoặt.

**【Lời khuyên phối ngẫu】**
Định hướng dung hòa tính cách và gìn giữ hạnh phúc gia đạo.`,

  career: `Hãy phân tích chuyên sâu vận thế công danh sự nghiệp, trình bày theo cấu trúc sau:

**【Sự nghiệp cách cục】**
Định tính xu hướng: hợp tự chủ kinh doanh, công chức, chuyên môn kỹ thuật hay học thuật.

**【Cung Quan Lộc tường giải】**
Các sao tại Quan Lộc, tứ hóa và luận điểm trường phái Nghê Hải Hà.

**【Liên đới Tài Bạch】**
Mối quan hệ mật thiết giữa dòng tiền và địa vị công danh.

**【Đại Hạn sự nghiệp】**
Cơ hội thăng tiến, chuyển việc hoặc mở rộng quy mô trong 10 năm này.

**【Lời khuyên hành động】**
Lĩnh vực then chốt, chiến lược phát triển và đối sách vượt khó.`,

  wealth: `Hãy phân tích chuyên sâu vận trình tài lộc, trình bày theo cấu trúc sau:

**【Tài lộc cách cục】**
Định tính tài cách: chính tài bền bỉ hay hoạch tài bất ngờ.

**【Cung Tài Bạch tường giải】**
Chính tinh, tài tinh thủ cung và phương thức tạo ra của cải.

**【Cung Điền Trạch (Kho của)】**
Khả năng tích lũy tài sản, bất động sản và gìn giữ gia nghiệp.

**【Vận trình tài vận hiện tại】**
Thời cơ gặt hái và các giai đoạn cần phòng hao tài tốn của.

**【Lời khuyên quản trị tài chính】**
Phương pháp đầu tư, chi tiêu an toàn và gia tăng phúc lộc.`,

  health: `Hãy phân tích sức khỏe và kinh lạc tạng phủ, trình bày theo cấu trúc sau:

**【Cung Tật Ách chủ tinh】**
Ý nghĩa các tinh diệu tại Tật Ách liên quan đến thể chất.

**【Tạng phủ & Tử Ngọ Lưu Chú】**
Ứng dụng y lý Nghê Hải Hà, các bộ phận và kinh mạch cần lưu tâm dưỡng sinh.

**【Đại Hạn sức khỏe】**
Xu hướng thể trạng trong đại vận và những năm cần chú ý phòng hộ.

**【Lời khuyên dưỡng sinh】**
Chế độ sinh hoạt, dinh dưỡng và phương pháp bồi bổ kinh khí.`,

  personality: `Hãy phân tích chi tiết đặc điểm tính cách, trình bày theo cấu trúc sau:

**【Khí chất chủ đạo】**
Cốt cách tâm hồn, phẩm chất tự nhiên của chính tinh thủ mệnh.

**【Tâm lý đa chiều】**
Sự tương tác giữa lý trí, cảm xúc và động lực nội tâm.

**【Phong cách giao tiếp & Xã hội】**
Cách đối nhân xử thế, tương tác bạn bè và vị thế trong tập thể.

**【Ưu điểm & Bài học tu thân】**
Thế mạnh vượt trội và những góc khuất cần hoàn thiện tu tâm dưỡng tính.`,
};

const PALACE_ROLES: Record<string, string> = {
  '命宫':   'Bản thân, tính cách, tiên thiên mệnh cách',
  '兄弟宫': 'Quan hệ anh em, hợp tác làm ăn',
  '夫妻宫': 'Duyên nợ tình cảm, hôn nhân',
  '子女宫': 'Duyên phận con cái, hậu bối',
  '财帛宫': 'Dòng tiền, phương thức tụ tài',
  '疾厄宫': 'Thể chất sức khỏe, kinh lạc tạng phủ',
  '迁移宫': 'Cơ hội đi xa, giao thiệp đối ngoại',
  '交友宫': 'Bạn bè, quý nhân, nhân viên',
  '官禄宫': 'Công danh sự nghiệp, địa vị xã hội',
  '田宅宫': 'Bất động sản, điền sản, gia đạo',
  '福德宫': 'Đời sống tinh thần, phúc đức tổ tiên',
  '父母宫': 'Quan hệ phụ mẫu, trưởng bối, văn thư',
};

function getPalaceRole(name: string): string {
  return PALACE_ROLES[name] || PALACE_ROLES[`${name}宫`] || PALACE_ROLES[name.replace('宫', '')] || 'Cung vị trọng yếu';
}

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3.5 pb-1 first:pt-0">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,168,67,0.18) 0%, rgba(184,146,42,0.06) 100%)',
                  borderColor: 'rgba(212,168,67,0.3)',
                  color: 'var(--t-gold)',
                }}
              >
                <span style={{ fontSize: '9px', opacity: 0.8 }}>✦</span>
                <span>{sectionMatch[1]}</span>
              </div>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[12px] leading-[1.8] pl-0.5" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-semibold" style={{ color: 'var(--t-gold)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-generate 命格总览 on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${getStarVi(s.name)}${s.siHua ? ' Hóa ' + getSiHuaShortVi(s.siHua) : ''}`).join(', ')
      : 'Vô chính diệu (mượn tinh diệu đối cung)';
    const role = getPalaceRole(selectedPalace.name);
    const palaceVi = getPalaceVi(selectedPalace.name);

    const prompt = `Hãy phân tích chuyên sâu cung 【${palaceVi} (${selectedPalace.name})】 (Chủ quản: ${role}), cung này có chính tinh là ${starDesc}, theo cấu trúc sau:

**【Cung Vị Định Tính】**
Ý nghĩa của cung ${palaceVi} trong lá số và nhận định tổng quan về cách phối tinh diệu này.

**【Chính Tinh Luận Giải】**
Luận giải các tinh diệu tọa thủ theo hệ thống Thầy Nghê Hải Hà, dẫn chứng quan điểm cụ thể.

**【Tam Phương Tứ Chính Liên Động】**
Ảnh hưởng hội chiếu của các cung trong tam phương tứ chính tới cung ${palaceVi}.

**【Lời Khuyên Ứng Dụng】**
Lời khuyên hành động cụ thể dựa trên cung vị này.`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // 注入四化飞化分析
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // 找出该星所在宫位
    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar?.name ?? 'cung vị liên quan';
    const palaceVi = palaceOfStar ? getPalaceVi(palaceOfStar.name) : 'cung vị liên quan';
    const starVi = getStarVi(selectedSiHua.starName);
    const siHuaVi = getSiHuaShortVi(selectedSiHua.siHua);
    const viewLabel = selectedSiHua.view === 'daxian' ? 'Đại Hạn' : 'Lưu Niên';

    const prompt = `Hãy phân tích ảnh hưởng của sao ${starVi} (${selectedSiHua.starName}) Hóa ${siHuaVi} (${viewLabel}) đóng tại cung ${palaceVi} (${palaceName}), theo cấu trúc sau:

**【Ý nghĩa cốt lõi Hóa ${siHuaVi}】**
Ý nghĩa đặc thù của ${starVi} (${selectedSiHua.starName}) khi đắc Hóa ${siHuaVi} theo trường phái Nghê Hải Hà.

**【Tác động tại cung tọa thủ】**
Sao ${starVi} Hóa ${siHuaVi} lâm vào cung ${palaceVi}, ảnh hưởng trực tiếp đến lĩnh vực và con người tương ứng.

**【Tam phương tứ chính liên đới】**
Sự củng chiếu và chuyển dịch năng lượng của Hóa ${siHuaVi} đối với cung đối và hai cung tam hợp.

**【Thời điểm ứng vận & Chỉ dẫn hành động】**
Dưới góc nhìn thời gian của ${viewLabel}, tứ hóa này mang đến thời cơ hay thử thách gì cần chú ý.

**【Lời khuyên thực tiễn】**
Hành động thực tế để tối ưu hóa cát tường và hóa giải trở lực.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (res.status === 404) throw new Error('api-missing');
      if (!res.ok) throw new Error('Yêu cầu thất bại');
      if (!res.body) throw new Error('Không có luồng phản hồi');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'api-missing';
      setMessages(prev => [...prev, { role: 'assistant', content: missing ? 'Không thể kết nối máy chủ phân tích mệnh lý (/api/interpret). Vui lòng thử lại sau.' : 'Quá trình phân tích gặp lỗi, vui lòng thử lại sau giây lát.' }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    // Capture current messages synchronously via ref (avoids stale closure)
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Topic buttons ── */}
      <div className="flex-shrink-0 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                <span className="text-[9px] opacity-70">{t.icon}</span><span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {/* Loading state before first message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.1 }}>✦</div>
            <p className="text-[10px] animate-pulse" style={{ color: 'var(--t-faint)' }}>Đang tổng hợp luận giải lá số…</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[11px]"
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.18)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            // Assistant message
            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[9px] tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  AI ZHANXING MINGSHU · Luận Giải Chuyên Sâu
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Hỏi thêm về lá số (vd: năm nay công việc ra sao, khi nào kết hôn...)"
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : 'Gửi'}
          </button>
        </div>
      </div>

    </div>
  );
}
