'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANNOUNCEMENT_VERSION = '2026-11-05-vi';
const STORAGE_KEY = `announcement_seen_${ANNOUNCEMENT_VERSION}`;

export default function AnnouncementModal() {
  const [open, setOpen] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setOpen(true);
    } catch { /* skip */ }
    setDecided(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* skip */ }
  };

  if (!decided) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,8,4,0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #1c170d 0%, #120e06 100%)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '620px',
              maxHeight: 'min(88vh, 760px)',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 4px 20px rgba(212,168,67,0.2)',
              border: '1px solid rgba(212,168,67,0.3)',
              display: 'flex',
              flexDirection: 'column',
              color: '#e8eef6',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 28px 16px',
              borderBottom: '1px solid rgba(212,168,67,0.18)',
              background: 'linear-gradient(180deg, rgba(212,168,67,0.08) 0%, transparent 100%)',
              flexShrink: 0,
              position: 'relative',
            }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#d4a843', opacity: 0.85, marginBottom: '6px' }}>
                ZHANXING MINGSHU · 占星明舒
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f5d77f', letterSpacing: '0.04em', margin: 0 }}>
                Kính gửi quý bạn hữu đồng hành
              </h2>
              <button
                onClick={close}
                aria-label="Đóng"
                style={{
                  position: 'absolute', top: '16px', right: '18px',
                  width: '32px', height: '32px',
                  background: 'rgba(212,168,67,0.1)',
                  border: '1px solid rgba(212,168,67,0.25)',
                  borderRadius: '50%',
                  color: '#d4a843', fontSize: '16px',
                  cursor: 'pointer', lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >×</button>
            </div>

            {/* Banner nổi bật */}
            <div style={{
              margin: '16px 24px 0',
              padding: '12px 18px',
              background: 'linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 100%)',
              border: '1px dashed rgba(212,168,67,0.4)',
              borderRadius: '14px',
              flexShrink: 0,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#d4a843', marginBottom: '4px', fontWeight: 600 }}>
                ✦ HỆ THỐNG NGHÊ HẢI HÀ 《THIÊN KỶ》 HOÀN TOÀN MIỄN PHÍ ✦
              </div>
              <div style={{ fontSize: '14px', color: '#f3e8c8', fontWeight: 500, lineHeight: 1.6 }}>
                An sao chuẩn xác · Nhận diện 1100+ cách cục · Hiệu chỉnh Chân Thái Dương Thời Việt Nam · Luận giải chuyên sâu
              </div>
            </div>

            {/* Nội dung thư */}
            <div style={{
              padding: '20px 28px 24px',
              overflowY: 'auto',
              fontSize: '13.5px',
              lineHeight: 1.85,
              color: 'rgba(235,242,252,0.85)',
              flex: 1,
            }}>
              <p style={{ margin: '0 0 12px' }}>
                Chào mừng bạn đến với <strong>ZHANXING MINGSHU (占星明舒)</strong> — nền tảng số hóa tinh hoa thuật toán Tử Vi Đẩu Số dựa trên giảng huấn của Thầy <strong>Nghê Hải Hà (Ni Haisha)</strong>.
              </p>
              <p style={{ margin: '0 0 12px' }}>
                Tâm nguyện của chúng tôi là mang tinh hoa cổ học uyên bác của cổ nhân đến với người Việt một cách <strong>trong sáng, khoa học, logic và dễ tiếp cận nhất</strong>. Không mê tín dị đoan, không thần bí hóa, mà lấy triết lý:
              </p>
              <div style={{
                margin: '0 0 14px',
                padding: '12px 16px',
                background: 'rgba(212,168,67,0.08)',
                borderLeft: '3px solid #d4a843',
                borderRadius: '0 10px 10px 0',
                fontStyle: 'italic',
                color: '#f5d77f',
              }}>
                "Tiên thiên mệnh chiếm 1/3, Địa lý phong thủy chiếm 1/3, Nhân sự nỗ lực chiếm 1/3. Nhân sự (1/3) + Địa lý (1/3) = 2/3, hoàn toàn làm chủ được Tiên thiên vận mệnh (1/3)."
              </div>
              <p style={{ margin: '0 0 12px' }}>
                Mục đích của việc coi Tử Vi không phải là để lo sợ một số mệnh an bài, mà là để: <strong>Thấu hiểu sở trường sở đoản của bản thân, nhận diện đúng thời cơ vận hạn, từ đó chủ động kiến tạo cuộc đời ý nghĩa nhất.</strong>
              </p>
              <p style={{ margin: 0, textAlign: 'right', fontSize: '13px', color: '#d4a843' }}>
                — Trân trọng chúc bạn vạn sự cát tường, phúc tuệ viên mãn 🙏
              </p>
            </div>

            {/* Footer */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid rgba(212,168,67,0.18)',
              background: 'rgba(0,0,0,0.25)',
              display: 'flex',
              justifyContent: 'flex-end',
              flexShrink: 0,
            }}>
              <button
                onClick={close}
                style={{
                  padding: '10px 26px',
                  background: 'linear-gradient(135deg, #d4a843 0%, #b8892a 100%)',
                  color: '#08080a',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(212,168,67,0.3)',
                }}
              >
                Tôi Đã Hiểu (Bắt Đầu Trải Nghiệm)
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
