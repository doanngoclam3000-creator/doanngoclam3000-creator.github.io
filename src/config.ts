// ===== SUA THONG TIN WEBSITE CUA BAN O DAY =====
export const CAUHINH = {
  tenSite: 'Phần Mềm Việt',
  khauHieu: 'Phần mềm tự viết cho người Việt',
  moTa: 'Nơi phát hành các phần mềm do tôi tự phát triển: giả lập vị trí, bán tệ, học tiếng Trung, quản lý kho hàng 1688 & Taobao... Kèm hướng dẫn sử dụng và thông báo cập nhật.',
  tacGia: 'Đoàn Ngọc Lâm',
  // Lien he
  facebook: 'https://www.facebook.com/oanngoclam.324266',
  zalo: '',
  wechat: 'tieuphung1409',
  wechatQR: '/anh/wechat-qr.jpg',
  // Ma trang tren GoatCounter de dem luot truy cap.
  // Dang ky mien phi o goatcounter.com roi dien ma vao day, vi du 'phanmemtq'.
  // De trong thi khong dem va khong hien o thong ke.
  goatCounter: '',
  email: 'luc.tieu.phung1409@gmail.com',
  youtube: '',
  // Anh banner o trang chu. Thay bang anh cua ban:
  // bo file vao thu muc public/ roi doi duong dan o day, vi du '/banner.jpg'
  anhBanner: '/banner.svg',
};

export const CHUYEN_MUC = {
  'cap-nhat': { ten: 'Cập nhật', mau: '#2563eb', icon: '🚀', moTa: 'Thông báo phiên bản mới, tính năng mới và sửa lỗi.' },
  'huong-dan': { ten: 'Hướng dẫn', mau: '#059669', icon: '📘', moTa: 'Hướng dẫn cài đặt và sử dụng từng phần mềm.' },
  'thu-thuat': { ten: 'Thủ thuật', mau: '#d97706', icon: '💡', moTa: 'Mẹo dùng máy, mẹo làm việc nhanh hơn.' },
  'tin-tuc': { ten: 'Tin tức', mau: '#7c3aed', icon: '📰', moTa: 'Tin tức và thông báo chung.' },
} as const;

export type MaChuyenMuc = keyof typeof CHUYEN_MUC;

export const dinhDangNgay = (d: Date) =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
