'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import ChartSummary from '@/components/ChartSummary';
import InsightPanel from '@/components/InsightPanel';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import AiAstrolabeScanningModal from '@/components/AiAstrolabeScanningModal';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';
import Link from 'next/link';

/**
 * Cỗ máy coi Tử Vi — Hệ thống Nghê Hải Hà (Thiên Kỷ)
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());
  const [isScanning, setIsScanning] = useState(false);
  const [pendingInfo, setPendingInfo] = useState<BirthInfo | null>(null);

  // ── Chưa khởi bàn: Form nhập thông tin sinh thần ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 1 }}>
        {isScanning && pendingInfo && (
          <AiAstrolabeScanningModal
            personName={pendingInfo.name}
            onComplete={() => {
              setChart(generateChart(pendingInfo));
              setIsScanning(false);
            }}
          />
        )}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)', color: 'var(--t-gold)', fontSize: 12, marginBottom: 12 }}>
            <span>✦</span>
            <span>Cỗ Máy Coi Tử Vi Đẩu Số · Hệ Thống Nghê Hải Hà 《Thiên Kỷ》</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: 'var(--t-gold)' }}>
            Lập Lá Số & Luận Giải Tử Vi Chuyên Sâu
          </h1>
          <p style={{ color: 'var(--t-text2)', fontSize: 13, lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
            Thuật toán an sao chuẩn xác, 14 chính tinh, tứ hóa phi tinh, nhận định cách cục tự động, hiệu chỉnh Chân Thái Dương Thời theo kinh độ 63 tỉnh thành Việt Nam.
          </p>
        </div>
        <BirthForm
          onSubmit={(info: BirthInfo) => {
            setPendingInfo(info);
            setIsScanning(true);
          }}
        />
      </main>
    );
  }

  // ── Đã khởi bàn: Hiển thị Mệnh bàn + Phân tích luận giải ──
  return (
    <main style={{ maxWidth: 1360, margin: '0 auto', padding: '20px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => { setChart(null); setSelectedPalace(null); }}
            style={{
              padding: '7px 16px', cursor: 'pointer',
              border: '1px solid var(--t-border)', borderRadius: 10,
              background: 'var(--t-card)', color: 'var(--t-text)',
              fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>←</span>
            <span>Khởi tạo lá số khác</span>
          </button>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.25)', color: 'var(--t-gold)' }}>
            <span className="text-[10px] animate-pulse">✦</span>
            <span>AI ZHANXING MINGSHU · Đã Quét 1100+ Cách Cục & Y Lý Tử Ngọ Lưu Chú</span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              href="/heming"
              style={{
                padding: '7px 14px', borderRadius: 10,
                background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.3)',
                color: 'var(--t-gold)', fontSize: 12, fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Hợp Bàn (So sánh 2 lá số) →
            </Link>
          </div>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]"
          style={{
            gap: 20, alignItems: 'start',
          }}
        >
          <div className="space-y-4">
            <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
            <ChartSummary chart={chart} />
          </div>
          <div style={{ position: 'sticky', top: 20, height: 'calc(100vh - 40px)', minHeight: 650 }}>
            <InsightPanel chart={chart} selectedPalace={selectedPalace} />
          </div>
        </div>
      </main>
    );
}
