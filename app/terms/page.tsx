export const metadata = {
  title: 'Điều Khoản Dịch Vụ · ZHANXING MINGSHU',
  description: 'Điều khoản sử dụng dịch vụ nền tảng ZHANXING MINGSHU',
};

export default function TermsPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Trang chủ</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.15em' }}>ZHANXING MINGSHU (占星明舒)</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, color: 'var(--tx-0)' }}>Điều Khoản Dịch Vụ</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 11/2026</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12, color: 'var(--tx-0)' }}>1. Khái quát dịch vụ</h2>
        <p>
          <strong>ZHANXING MINGSHU (占星明舒)</strong> là cỗ máy chiêm tinh và luận giải Tử Vi Đẩu Số vận hành trên nền tảng tri thức học thuật chính tông của Đại sư Nghê Hải Hà 《Thiên Kỷ》, kết hợp tinh hoa các cổ thư kinh điển như 《Tử Vi Đẩu Số Toàn Tập》, 《Tử Vi Đẩu Số Toàn Thư》, 《Cốt Tủy Phú》.
        </p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12, color: 'var(--tx-0)' }}>2. Tôn chỉ học thuật & Khuyến cáo</h2>
        <p>
          Thuật số Tử Vi là công cụ khảo sát quy luật thiên nhiên, nhân sinh quan và thời vận để thấu hiểu bản thân, "Tri mệnh vi môn, Thiên Địa Nhân vi lộ". Mọi luận đoán trên hệ thống mang tính chất học thuật, nghiên cứu văn hóa truyền thống phương Đông, tham khảo định hướng và không thay thế các phán quyết pháp lý, y tế hoặc tài chính chuyên biệt.
        </p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12, color: 'var(--tx-0)' }}>3. Bản quyền & Sở hữu trí tuệ</h2>
        <p style={{ background: 'rgba(184,146,42,0.06)', border: '1px solid rgba(184,146,42,0.2)', padding: 16, borderRadius: 8 }}>
          Hệ thống cấu trúc giao diện, thuật toán diễn giải tiếng Việt, kho mẫu hình cách cục và động cơ luận giải độc quyền được xây dựng công phu cho cộng đồng người dùng Việt Nam. Mọi hành vi sao chép, thu thập tự động độc hại nhằm mục đích thương mại phi pháp đều bị nghiêm cấm.
        </p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12, color: 'var(--tx-0)' }}>4. Tinh thần Thiên - Địa - Nhân</h2>
        <p>
          Mệnh do Trời định (Thiên Kỷ chiếm 1/3), Môi trường phong thủy địa lý hỗ trợ (Địa Kỷ chiếm 1/3), và Sự nỗ lực tu dưỡng, quyết sách của Bản Thân (Nhân Kỷ chiếm 1/3). Vì vậy, tâm sáng chí bền, tu thân tích đức chính là chìa khóa chuyển hóa vận mệnh thù thắng nhất.
        </p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}>Chính sách bảo mật</a> · <a href="/" style={{ color: 'var(--ac)' }}>Quay lại Trang chủ</a>
        </p>
      </main>
    </>
  );
}
