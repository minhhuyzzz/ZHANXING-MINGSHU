export interface CityInfo {
  name: string;
  longitude: number; // degrees East
}

export interface ProvinceInfo {
  name: string;
  cities: CityInfo[];
}

/**
 * Danh mục chuẩn 63 Tỉnh / Thành phố Việt Nam & các thành phố quốc tế trọng điểm
 * Phục vụ hiệu chỉnh Chân Thái Dương Thời (True Solar Time) theo kinh độ thực địa.
 * Chuẩn kinh độ Việt Nam: Kinh tuyến trục chuẩn múi giờ GMT+7 là 105°E (hoặc chuẩn Trung tâm 105°–109.5°E).
 * Mỗi độ kinh lệch 4 phút giờ mặt trời.
 */
export const PROVINCES: ProvinceInfo[] = [
  // ─── 5 THÀNH PHỐ TRỰC THUỘC TRUNG ƯƠNG ─────────────────────────
  {
    name: 'Hà Nội',
    cities: [
      { name: 'Hà Nội (Trung tâm Hoàn Kiếm)', longitude: 105.85 },
      { name: 'Ba Đình / Đống Đa', longitude: 105.83 },
      { name: 'Cầu Giấy / Nam Từ Liêm', longitude: 105.78 },
      { name: 'Tây Hồ / Long Biên', longitude: 105.87 },
      { name: 'Hà Đông / Thanh Xuân', longitude: 105.77 },
      { name: 'Sơn Tây / Ba Vì', longitude: 105.50 },
      { name: 'Đông Anh / Sóc Sơn', longitude: 105.85 },
      { name: 'Gia Lâm / Mê Linh', longitude: 105.89 },
    ],
  },
  {
    name: 'TP. Hồ Chí Minh',
    cities: [
      { name: 'TP. Hồ Chí Minh (Trung tâm Quận 1)', longitude: 106.70 },
      { name: 'TP. Thủ Đức', longitude: 106.77 },
      { name: 'Quận 3 / Quận 5 / Quận 10', longitude: 106.67 },
      { name: 'Bình Thạnh / Phú Nhuận', longitude: 106.69 },
      { name: 'Tân Bình / Tân Phú', longitude: 106.63 },
      { name: 'Gò Vấp / Quận 12', longitude: 106.66 },
      { name: 'Quận 7 / Nhà Bè', longitude: 106.73 },
      { name: 'Bình Chánh / Bình Tân', longitude: 106.59 },
      { name: 'Củ Chi / Hóc Môn', longitude: 106.50 },
      { name: 'Cần Giờ', longitude: 106.96 },
    ],
  },
  {
    name: 'Đà Nẵng',
    cities: [
      { name: 'Đà Nẵng (Hải Châu / Thanh Khê)', longitude: 108.22 },
      { name: 'Sơn Trà / Ngũ Hành Sơn', longitude: 108.25 },
      { name: 'Liên Chiểu / Cẩm Lệ', longitude: 108.16 },
      { name: 'Huyện Hòa Vang', longitude: 108.06 },
    ],
  },
  {
    name: 'Hải Phòng',
    cities: [
      { name: 'Hải Phòng (Hồng Bàng / Ngô Quyền)', longitude: 106.68 },
      { name: 'Lê Chân / Hải An', longitude: 106.70 },
      { name: 'Đồ Sơn / Dương Kinh', longitude: 106.79 },
      { name: 'Kiến An / Thủy Nguyên', longitude: 106.67 },
      { name: 'Cát Bà / Bạch Long Vĩ', longitude: 107.05 },
    ],
  },
  {
    name: 'Cần Thơ',
    cities: [
      { name: 'Cần Thơ (Ninh Kiều / Cái Răng)', longitude: 105.78 },
      { name: 'Bình Thủy / Ô Môn', longitude: 105.72 },
      { name: 'Thốt Nốt / Phong Điền', longitude: 105.58 },
    ],
  },

  // ─── MIỀN BẮC (ĐỒNG BẰNG SÔNG HỒNG & ĐÔNG BẮC - TÂY BẮC) ──────
  {
    name: 'Bắc Ninh',
    cities: [
      { name: 'TP. Bắc Ninh', longitude: 106.07 },
      { name: 'Từ Sơn / Tiên Du', longitude: 105.97 },
      { name: 'Quế Võ / Thuận Thành', longitude: 106.15 },
    ],
  },
  {
    name: 'Hải Dương',
    cities: [
      { name: 'TP. Hải Dương', longitude: 106.31 },
      { name: 'Chí Linh / Kinh Môn', longitude: 106.45 },
      { name: 'Cẩm Giàng / Bình Giang', longitude: 106.21 },
    ],
  },
  {
    name: 'Hưng Yên',
    cities: [
      { name: 'TP. Hưng Yên', longitude: 106.05 },
      { name: 'Văn Giang / Mỹ Hào', longitude: 105.98 },
      { name: 'Yên Mỹ / Khoái Châu', longitude: 106.02 },
    ],
  },
  {
    name: 'Quảng Ninh',
    cities: [
      { name: 'TP. Hạ Long', longitude: 107.08 },
      { name: 'TP. Cẩm Phả / Móng Cái', longitude: 107.45 },
      { name: 'Uông Bí / Đông Triều', longitude: 106.78 },
      { name: 'Vân Đồn / Cô Tô', longitude: 107.42 },
    ],
  },
  {
    name: 'Nam Định',
    cities: [
      { name: 'TP. Nam Định', longitude: 106.17 },
      { name: 'Giao Thủy / Hải Hậu', longitude: 106.35 },
      { name: 'Ý Yên / Vụ Bản', longitude: 106.05 },
    ],
  },
  {
    name: 'Thái Bình',
    cities: [
      { name: 'TP. Thái Bình', longitude: 106.33 },
      { name: 'Tiền Hải / Thái Thụy', longitude: 106.52 },
      { name: 'Hưng Hà / Quỳnh Phụ', longitude: 106.25 },
    ],
  },
  {
    name: 'Ninh Bình',
    cities: [
      { name: 'TP. Ninh Bình', longitude: 105.97 },
      { name: 'Tam Điệp / Hoa Lư', longitude: 105.90 },
      { name: 'Kim Sơn / Yên Khánh', longitude: 106.08 },
    ],
  },
  {
    name: 'Hà Nam',
    cities: [
      { name: 'TP. Phủ Lý', longitude: 105.92 },
      { name: 'Duy Tiên / Kim Bảng', longitude: 105.94 },
    ],
  },
  {
    name: 'Vĩnh Phúc',
    cities: [
      { name: 'TP. Vĩnh Yên', longitude: 105.60 },
      { name: 'Phúc Yên / Tam Đảo', longitude: 105.67 },
    ],
  },
  {
    name: 'Bắc Giang',
    cities: [
      { name: 'TP. Bắc Giang', longitude: 106.19 },
      { name: 'Việt Yên / Hiệp Hòa', longitude: 106.02 },
      { name: 'Lục Ngạn / Lục Nam', longitude: 106.60 },
    ],
  },
  {
    name: 'Thái Nguyên',
    cities: [
      { name: 'TP. Thái Nguyên', longitude: 105.84 },
      { name: 'Sông Công / Phổ Yên', longitude: 105.83 },
      { name: 'Đại Từ / Định Hóa', longitude: 105.63 },
    ],
  },
  {
    name: 'Phú Thọ',
    cities: [
      { name: 'TP. Việt Trì', longitude: 105.38 },
      { name: 'TX. Phú Thọ', longitude: 105.22 },
      { name: 'Thanh Sơn / Cẩm Khê', longitude: 105.15 },
    ],
  },
  {
    name: 'Hòa Bình',
    cities: [
      { name: 'TP. Hòa Bình', longitude: 105.34 },
      { name: 'Lương Sơn / Mai Châu', longitude: 105.10 },
    ],
  },
  {
    name: 'Lạng Sơn',
    cities: [
      { name: 'TP. Lạng Sơn', longitude: 106.76 },
      { name: 'Hữu Lũng / Chi Lăng', longitude: 106.40 },
    ],
  },
  {
    name: 'Tuyên Quang',
    cities: [
      { name: 'TP. Tuyên Quang', longitude: 105.21 },
      { name: 'Sơn Dương / Chiêm Hóa', longitude: 105.26 },
    ],
  },
  {
    name: 'Yên Bái',
    cities: [
      { name: 'TP. Yên Bái', longitude: 104.89 },
      { name: 'Nghĩa Lộ / Mù Cang Chải', longitude: 104.50 },
    ],
  },
  {
    name: 'Lào Cai',
    cities: [
      { name: 'TP. Lào Cai', longitude: 103.97 },
      { name: 'Sa Pa / Bát Xát', longitude: 103.84 },
    ],
  },
  {
    name: 'Hà Giang',
    cities: [
      { name: 'TP. Hà Giang', longitude: 104.98 },
      { name: 'Đồng Văn / Mèo Vạc', longitude: 105.36 },
    ],
  },
  {
    name: 'Cao Bằng',
    cities: [
      { name: 'TP. Cao Bằng', longitude: 106.26 },
      { name: 'Trùng Khánh / Quảng Hòa', longitude: 106.50 },
    ],
  },
  {
    name: 'Bắc Kạn',
    cities: [
      { name: 'TP. Bắc Kạn', longitude: 105.83 },
      { name: 'Ba Bể / Chợ Đồn', longitude: 105.70 },
    ],
  },
  {
    name: 'Sơn La',
    cities: [
      { name: 'TP. Sơn La', longitude: 103.91 },
      { name: 'Mộc Châu / Mai Sơn', longitude: 104.65 },
    ],
  },
  {
    name: 'Điện Biên',
    cities: [
      { name: 'TP. Điện Biên Phủ', longitude: 103.02 },
      { name: 'Mường Lay / Tuần Giáo', longitude: 103.20 },
    ],
  },
  {
    name: 'Lai Châu',
    cities: [
      { name: 'TP. Lai Châu', longitude: 103.46 },
      { name: 'Phong Thổ / Tam Đường', longitude: 103.35 },
    ],
  },

  // ─── BẮC TRUNG BỘ & DUYÊN HẢI MIỀN TRUNG ──────────────────────
  {
    name: 'Thanh Hóa',
    cities: [
      { name: 'TP. Thanh Hóa', longitude: 105.78 },
      { name: 'Sầm Sơn / Bỉm Sơn', longitude: 105.90 },
      { name: 'Nghi Sơn / Thọ Xuân', longitude: 105.65 },
    ],
  },
  {
    name: 'Nghệ An',
    cities: [
      { name: 'TP. Vinh', longitude: 105.68 },
      { name: 'Cửa Lò / Diễn Châu', longitude: 105.72 },
      { name: 'Hoàng Mai / Thái Hòa', longitude: 105.50 },
    ],
  },
  {
    name: 'Hà Tĩnh',
    cities: [
      { name: 'TP. Hà Tĩnh', longitude: 105.90 },
      { name: 'Hồng Lĩnh / Kỳ Anh', longitude: 106.28 },
    ],
  },
  {
    name: 'Quảng Bình',
    cities: [
      { name: 'TP. Đồng Hới', longitude: 106.62 },
      { name: 'Ba Đồn / Bố Trạch', longitude: 106.40 },
    ],
  },
  {
    name: 'Quảng Trị',
    cities: [
      { name: 'TP. Đông Hà', longitude: 107.10 },
      { name: 'TX. Quảng Trị', longitude: 107.19 },
    ],
  },
  {
    name: 'Thừa Thiên Huế',
    cities: [
      { name: 'TP. Huế', longitude: 107.59 },
      { name: 'Hương Thủy / Hương Trà', longitude: 107.55 },
      { name: 'Phú Lộc / Lăng Cô', longitude: 108.00 },
    ],
  },
  {
    name: 'Quảng Nam',
    cities: [
      { name: 'TP. Tam Kỳ', longitude: 108.48 },
      { name: 'TP. Hội An', longitude: 108.34 },
      { name: 'Điện Bàn / Núi Thành', longitude: 108.55 },
    ],
  },
  {
    name: 'Quảng Ngãi',
    cities: [
      { name: 'TP. Quảng Ngãi', longitude: 108.80 },
      { name: 'Bình Sơn / Đức Phổ', longitude: 108.90 },
    ],
  },
  {
    name: 'Bình Định',
    cities: [
      { name: 'TP. Quy Nhơn', longitude: 109.22 },
      { name: 'An Nhơn / Hoài Nhơn', longitude: 109.05 },
    ],
  },
  {
    name: 'Phú Yên',
    cities: [
      { name: 'TP. Tuy Hòa', longitude: 109.30 },
      { name: 'Sông Cầu / Đông Hòa', longitude: 109.35 },
    ],
  },
  {
    name: 'Khánh Hòa',
    cities: [
      { name: 'TP. Nha Trang', longitude: 109.19 },
      { name: 'TP. Cam Ranh', longitude: 109.15 },
      { name: 'Ninh Hòa / Vạn Ninh', longitude: 109.23 },
    ],
  },
  {
    name: 'Ninh Thuận',
    cities: [
      { name: 'TP. Phan Rang - Tháp Chàm', longitude: 108.99 },
      { name: 'Ninh Hải / Ninh Phước', longitude: 109.02 },
    ],
  },
  {
    name: 'Bình Thuận',
    cities: [
      { name: 'TP. Phan Thiết', longitude: 108.10 },
      { name: 'TX. La Gi / Mũi Né', longitude: 108.28 },
      { name: 'Hàm Tân / Tuy Phong', longitude: 108.50 },
    ],
  },

  // ─── TÂY NGUYÊN ──────────────────────────────────────────────
  {
    name: 'Đắk Lắk',
    cities: [
      { name: 'TP. Buôn Ma Thuột', longitude: 108.04 },
      { name: 'TX. Buôn Hồ / Ea Kar', longitude: 108.30 },
    ],
  },
  {
    name: 'Lâm Đồng',
    cities: [
      { name: 'TP. Đà Lạt', longitude: 108.44 },
      { name: 'TP. Bảo Lộc', longitude: 107.80 },
      { name: 'Đức Trọng / Đơn Dương', longitude: 108.38 },
    ],
  },
  {
    name: 'Gia Lai',
    cities: [
      { name: 'TP. Pleiku', longitude: 108.00 },
      { name: 'An Khê / Ayun Pa', longitude: 108.55 },
    ],
  },
  {
    name: 'Kon Tum',
    cities: [
      { name: 'TP. Kon Tum', longitude: 108.00 },
      { name: 'Măng Đen / Ngọc Hồi', longitude: 107.80 },
    ],
  },
  {
    name: 'Đắk Nông',
    cities: [
      { name: 'TP. Gia Nghĩa', longitude: 107.69 },
      { name: 'Đắk Mil / Cư Jút', longitude: 107.75 },
    ],
  },

  // ─── ĐÔNG NAM BỘ ─────────────────────────────────────────────
  {
    name: 'Bình Dương',
    cities: [
      { name: 'TP. Thủ Dầu Một', longitude: 106.65 },
      { name: 'TP. Thuận An / Dĩ An', longitude: 106.72 },
      { name: 'TP. Tân Uyên / Bến Cát', longitude: 106.60 },
    ],
  },
  {
    name: 'Đồng Nai',
    cities: [
      { name: 'TP. Biên Hòa', longitude: 106.84 },
      { name: 'TP. Long Khánh', longitude: 107.24 },
      { name: 'Long Thành / Nhơn Trạch', longitude: 106.95 },
    ],
  },
  {
    name: 'Bà Rịa - Vũng Tàu',
    cities: [
      { name: 'TP. Vũng Tàu', longitude: 107.08 },
      { name: 'TP. Bà Rịa / Phú Mỹ', longitude: 107.16 },
      { name: 'Côn Đảo', longitude: 106.60 },
    ],
  },
  {
    name: 'Tây Ninh',
    cities: [
      { name: 'TP. Tây Ninh', longitude: 106.10 },
      { name: 'Trảng Bàng / Hòa Thành', longitude: 106.25 },
    ],
  },
  {
    name: 'Bình Phước',
    cities: [
      { name: 'TP. Đồng Xoài', longitude: 106.88 },
      { name: 'Bình Long / Phước Long', longitude: 106.75 },
    ],
  },

  // ─── ĐỒNG BẰNG SÔNG CỬU LONG ─────────────────────────────────
  {
    name: 'Long An',
    cities: [
      { name: 'TP. Tân An', longitude: 106.41 },
      { name: 'Bến Lức / Đức Hòa', longitude: 106.50 },
    ],
  },
  {
    name: 'Tiền Giang',
    cities: [
      { name: 'TP. Mỹ Tho', longitude: 106.36 },
      { name: 'Gò Công / Cai Lậy', longitude: 106.60 },
    ],
  },
  {
    name: 'Bến Tre',
    cities: [
      { name: 'TP. Bến Tre', longitude: 106.38 },
      { name: 'Ba Tri / Châu Thành', longitude: 106.60 },
    ],
  },
  {
    name: 'Đồng Tháp',
    cities: [
      { name: 'TP. Cao Lãnh', longitude: 105.63 },
      { name: 'TP. Sa Đéc / Hồng Ngự', longitude: 105.75 },
    ],
  },
  {
    name: 'Vĩnh Long',
    cities: [
      { name: 'TP. Vĩnh Long', longitude: 105.97 },
      { name: 'Bình Minh / Long Hồ', longitude: 105.85 },
    ],
  },
  {
    name: 'An Giang',
    cities: [
      { name: 'TP. Long Xuyên', longitude: 105.44 },
      { name: 'TP. Châu Đốc / Tân Châu', longitude: 105.12 },
    ],
  },
  {
    name: 'Kiên Giang',
    cities: [
      { name: 'TP. Rạch Giá', longitude: 105.08 },
      { name: 'TP. Phú Quốc', longitude: 103.96 },
      { name: 'Hà Tiên', longitude: 104.48 },
    ],
  },
  {
    name: 'Hậu Giang',
    cities: [
      { name: 'TP. Vị Thanh', longitude: 105.47 },
      { name: 'Ngã Bảy / Châu Thành', longitude: 105.80 },
    ],
  },
  {
    name: 'Trà Vinh',
    cities: [
      { name: 'TP. Trà Vinh', longitude: 106.34 },
      { name: 'Duyên Hải / Càng Long', longitude: 106.50 },
    ],
  },
  {
    name: 'Sóc Trăng',
    cities: [
      { name: 'TP. Sóc Trăng', longitude: 105.97 },
      { name: 'Vĩnh Châu / Trần Đề', longitude: 106.10 },
    ],
  },
  {
    name: 'Bạc Liêu',
    cities: [
      { name: 'TP. Bạc Liêu', longitude: 105.72 },
      { name: 'Giá Rai / Hòa Bình', longitude: 105.50 },
    ],
  },
  {
    name: 'Cà Mau',
    cities: [
      { name: 'TP. Cà Mau', longitude: 105.15 },
      { name: 'Năm Căn / Đất Mũi', longitude: 104.75 },
    ],
  },

  // ─── QUỐC TẾ / SINH Ở HẢI NGOẠI ──────────────────────────────
  {
    name: 'Quốc Tế / Hải Ngoại',
    cities: [
      { name: 'Tokyo (Nhật Bản)', longitude: 139.69 },
      { name: 'Seoul (Hàn Quốc)', longitude: 126.97 },
      { name: 'Đài Bắc (Đài Loan)', longitude: 121.56 },
      { name: 'Singapore', longitude: 103.82 },
      { name: 'Bangkok (Thái Lan)', longitude: 100.50 },
      { name: 'Sydney (Úc)', longitude: 151.21 },
      { name: 'Melbourne (Úc)', longitude: 144.96 },
      { name: 'Paris (Pháp)', longitude: 2.35 },
      { name: 'Berlin (Đức)', longitude: 13.40 },
      { name: 'London (Anh)', longitude: -0.12 },
      { name: 'California / Bờ Tây (Mỹ)', longitude: -119.41 },
      { name: 'Texas / Trung Mỹ (Mỹ)', longitude: -97.74 },
      { name: 'New York / Bờ Đông (Mỹ)', longitude: -74.00 },
      { name: 'Toronto (Canada)', longitude: -79.38 },
      { name: 'Vancouver (Canada)', longitude: -123.12 },
    ],
  },
];
