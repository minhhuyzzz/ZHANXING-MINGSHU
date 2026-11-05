export const metadata = {
  title: 'Chính Sách Bảo Mật · ZHANXING MINGSHU',
  description: 'Chính sách bảo mật thông tin và quyền riêng tư của nền tảng ZHANXING MINGSHU',
};

export default function PrivacyPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, color: 'var(--tx-0)' }}>Chính Sách Bảo Mật</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 11/2026</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12, color: 'var(--tx-0)' }}>1. Thu thập thông tin</h2>
        <p>Để lập lá số Tử Vi Đẩu Số và thực hiện luận giải chuẩn xác, chúng tôi chỉ thu thập các dữ kiện sinh thần cần thiết:</p>
        <ul style={{ paddingLeft: 24, listStyleType: 'disc' }}>
          <li><strong>Thông tin lập lá số</strong>: Họ tên (tùy chọn), ngày tháng năm sinh (Dương lịch/Âm lịch), giờ sinh, giới tính và nơi sinh (để hiệu chỉnh Chân Thái Dương Thời).</li>
          <li><strong>Lịch sử trình duyệt</strong>: Lá số được lưu cục bộ trên trình duyệt (LocalStorage) của bạn để thuận tiện xem lại.</li>
          <li><strong>Tương tác luận giải</strong>: Các câu hỏi và trao đổi trong phiên luận giải không lưu trữ danh tính thực.</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12, color: 'var(--tx-0)' }}>2. Mục đích sử dụng dữ liệu</h2>
        <ul style={{ paddingLeft: 24, listStyleType: 'disc' }}>
          <li>Tính toán an sao, lập cục diện, kiểm tra cách cục và luận giải vận mệnh theo hệ thống 《Thiên Kỷ》 của Nghê Hải Hà.</li>
          <li>Nâng cao chất lượng trải nghiệm giao diện người dùng và thuật toán phân tích.</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12, color: 'var(--tx-0)' }}>3. Bảo mật & Lưu trữ</h2>
        <p>Chúng tôi tôn trọng tối đa quyền riêng tư của quý hội viên. Toàn bộ tính toán an sao cơ bản diễn ra trực tiếp ngay trên trình duyệt máy khách (Client-side) với mã nguồn mở minh bạch.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12, color: 'var(--tx-0)' }}>4. Quyền của người dùng</h2>
        <ul style={{ paddingLeft: 24, listStyleType: 'disc' }}>
          <li>Bạn có toàn quyền xóa lịch sử lá số đã lưu trên trình duyệt bất kỳ lúc nào bằng nút xóa bộ nhớ tạm.</li>
          <li>Không bắt buộc phải nhập tên thật hoặc số điện thoại khi tra cứu lá số.</li>
        </ul>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac)' }}>Điều khoản dịch vụ</a> · <a href="/" style={{ color: 'var(--ac)' }}>Quay lại Trang chủ</a>
        </p>
      </main>
    </>
  );
}
