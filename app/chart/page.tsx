'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import ChartSummary from '@/components/ChartSummary';
import PalaceListView from '@/components/PalaceListView';
import InsightPanel from '@/components/InsightPanel';
import { type TimeView } from '@/components/TimeNav';
import AiAstrolabeScanningModal from '@/components/AiAstrolabeScanningModal';
import { generateChart } from '@/lib/ziwei/algorithm';
import { useHistory } from '@/lib/ziwei/history';
import { formToBirthInfo } from '@/lib/ziwei/share';
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
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [isExporting, setIsExporting] = useState(false);

  const { history, save: saveHistory, remove: removeHistory } = useHistory();

  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      const el = document.getElementById('ziwei-chart-board-container');
      if (!el) {
        alert('Vui lòng chuyển về chế độ Bàn 4x4 để xuất ảnh hoàn chỉnh.');
        return;
      }
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#070b14',
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `La-So-Tu-Vi-${chart?.birthInfo?.name ? chart.birthInfo.name.replace(/\s+/g, '-') : 'ZHANXING'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export error:', err);
      alert('Không thể xuất ảnh lúc này, vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

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

        {/* Lịch sử lá số đã xem gần đây (Click để mở nhanh) */}
        {history.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border" style={{ background: 'var(--t-card)', borderColor: 'var(--t-border)' }}>
            <div className="flex items-center justify-between mb-3 text-xs font-semibold" style={{ color: 'var(--t-gold)' }}>
              <span className="flex items-center gap-1.5">
                <span>✦</span>
                <span>Lá số đã xem gần đây (Click để xem lại nhanh)</span>
              </span>
              <span className="text-[10px] font-normal" style={{ color: 'var(--t-faint)' }}>{history.length} bản ghi</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {history.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all hover:border-amber-400/50 hover:bg-amber-400/5"
                  style={{ background: 'var(--t-surface)', borderColor: 'var(--t-border)' }}
                  onClick={() => {
                    const info = formToBirthInfo(item.form);
                    setChart(generateChart(info));
                  }}
                >
                  <div className="truncate mr-2">
                    <div className="font-semibold text-amber-300 truncate">{item.form.name || 'Khách viếng'}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.label}</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistory(item.id);
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors text-[11px]"
                    title="Xóa bản ghi này"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <BirthForm
          onSubmit={(info: BirthInfo) => {
            setPendingInfo(info);
            setIsScanning(true);
          }}
          onFormSave={(formState) => {
            saveHistory(formState);
          }}
        />
      </main>
    );
  }

  // ── Đã khởi bàn: Hiển thị Mệnh bàn + Phân tích luận giải ──
  return (
    <main style={{ maxWidth: 1360, margin: '0 auto', padding: '20px 16px', position: 'relative', zIndex: 1 }}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setChart(null); setSelectedPalace(null); }}
            style={{
              padding: '7px 14px', cursor: 'pointer',
              border: '1px solid var(--t-border)', borderRadius: 10,
              background: 'var(--t-card)', color: 'var(--t-text)',
              fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>←</span>
            <span>Khởi tạo lá số khác</span>
          </button>

          {/* Nút chuyển chế độ xem: 4x4 vs Danh Sách 12 Cung */}
          <div className="flex items-center rounded-lg p-0.5 border" style={{ background: 'var(--t-card)', borderColor: 'var(--t-border)' }}>
            <button
              type="button"
              onClick={() => setDisplayMode('grid')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${displayMode === 'grid' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ⊞ Bàn 4x4
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('list')}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-all ${displayMode === 'list' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ☰ 12 Cung
            </button>
          </div>
        </div>

        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
          style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.25)', color: 'var(--t-gold)' }}>
          <span className="text-[10px] animate-pulse">✦</span>
          <span>ZHANXING MINGSHU · Hệ Thống 1100+ Cách Cục & Y Lý Tử Ngọ Lưu Chú</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút Tải ảnh Lá Số PNG */}
          <button
            type="button"
            onClick={handleExportImage}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all hover:bg-amber-400/10 disabled:opacity-50"
            style={{
              borderColor: 'rgba(212,168,67,0.3)',
              color: 'var(--t-gold)',
              background: 'rgba(212,168,67,0.06)',
            }}
            title="Lưu hình ảnh bàn Tử Vi về máy"
          >
            <span>{isExporting ? '⏳' : '📷'}</span>
            <span>{isExporting ? 'Đang xuất ảnh...' : 'Tải ảnh PNG'}</span>
          </button>

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
          {displayMode === 'grid' ? (
            <ChartBoard
              chart={chart}
              onPalaceSelect={setSelectedPalace}
              view={view}
              onViewChange={setView}
              liunianYear={liunianYear}
              onYearChange={setLiunianYear}
            />
          ) : (
            <PalaceListView
              chart={chart}
              selectedPalace={selectedPalace}
              onPalaceSelect={setSelectedPalace}
            />
          )}
          <ChartSummary chart={chart} />
        </div>
        <div className="lg:sticky lg:top-5 lg:h-[calc(100vh-40px)] min-h-[500px]">
          <InsightPanel
            chart={chart}
            selectedPalace={selectedPalace}
            view={view}
            liunianYear={liunianYear}
          />
        </div>
      </div>
    </main>
  );
}
