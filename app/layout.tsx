import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'ZHANXING MINGSHU (占星明舒) — Tử Vi Đẩu Số Hệ Thống Nghê Hải Hà 《Thiên Kỷ》',
  description: 'ZHANXING MINGSHU (占星明舒) - Cỗ máy lập và luận giải lá số Tử Vi Đẩu Số chuẩn xác theo hệ thống Thầy Nghê Hải Hà 《Thiên Kỷ》, kết hợp cổ tịch Tử Vi Đẩu Số Toàn Thư và AI luận giải chuyên sâu.',
  keywords: 'ZHANXING MINGSHU, zhanxing mingshu, 占星明舒, tử vi đẩu số, xem tử vi, nghê hải hà, thiên kỷ, lá số tử vi, 14 chính tinh, tứ hóa phi tinh, hợp bàn tử vi',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ZHANXING MINGSHU (占星明舒) · Tử Vi Đẩu Số',
    description: 'Cỗ máy lập lá số và luận giải Tử Vi Đẩu Số chuyên sâu hệ thống Thầy Nghê Hải Hà 《Thiên Kỷ》',
    url: SITE_URL,
    siteName: 'ZHANXING MINGSHU',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
