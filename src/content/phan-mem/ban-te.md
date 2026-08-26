---
ten: "Phần Mềm Quản Lý Kho Tệ"
moTa: "Quản lý kho nhân dân tệ: theo dõi số tệ còn lại, ghi sổ từng lần mua bán, tự tính tiền Việt và lợi nhuận. Dùng được trên máy tính lẫn iPhone."
nenTang: ["Windows", "macOS", "iOS"]
phienBan: "1.9"
banToiThieu: "1.9"
ngayCapNhat: 2026-08-25
ghiChuCapNhat: "- Cập nhật bản mới lấy thẳng từ trang phanmemtq.com
- Đóng dấu bản quyền, chống sao chép phần mềm"
linkTaiWin: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/ban-te-1.9/BanTe-Windows-1.9.0.zip"
linkTaiMac: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/ban-te-1.9/BanTe-1.9-build29.dmg"
linkTaiIOS: "https://testflight.apple.com/join/vUtNFS1Q"
dungLuong: "khoảng 110 MB (Windows) · 3 MB (Mac)"
anhIcon: "/icon/ban-te.png"
icon: "💱"
mauNen: "#059669"
noiBat: true
thuTu: 3
---

## Giới thiệu

**Phần Mềm Quản Lý Kho Tệ** dành cho người làm dịch vụ chuyển tiền và mua bán nhân dân tệ. Thay vì bấm máy tính rồi ghi vào sổ tay, bạn nhập một lần — phần mềm tính xong tiền, lưu lại giao dịch và cộng dồn lãi cho bạn.

![Ghi một giao dịch bán tệ](/anh/quan-ly-kho-te/2-ghi-giao-dich.svg)

### Tính năng chính

- **Tính tiền tức thì:** nhập số tệ, hiện ngay số tiền Việt khách phải trả và phần lãi bạn được.
- **Hai mức tỉ giá:** đặt sẵn tỉ giá mua vào và bán ra, đổi lúc nào cũng được mà giao dịch cũ vẫn giữ nguyên tỉ giá tại thời điểm ghi.
- **Sổ giao dịch:** mỗi lần bán lưu lại tên khách, số tệ, tỉ giá và thời gian.
- **Thống kê theo ngày, tuần, tháng:** biết đã bán bao nhiêu tệ, thu về bao nhiêu tiền và lãi bao nhiêu.
- **Dùng được trên cả Mac và iPhone:** ngồi bàn thì mở Mac, ra ngoài thì dùng điện thoại.
- **Sao lưu tự động:** phần mềm giữ lại nhiều bản sao lưu gần nhất, lỡ tay xoá nhầm vẫn khôi phục được.

## Đồng bộ giữa Mac và iPhone

![Sổ giao dịch và thống kê](/anh/quan-ly-kho-te/3-so-thong-ke.svg)

Bản Mac và bản iPhone giữ sổ riêng trên từng máy. Khi hai bên lệch nhau, dùng **Xuất dữ liệu** ở máy đang có sổ đúng, gửi file sang máy kia rồi bấm **Nhập dữ liệu**. Trước khi ghi đè, phần mềm hiện bảng so sánh số giao dịch của hai bên để bạn cân nhắc.

> Đừng bao giờ sửa thẳng file kho dữ liệu bằng tay. Luôn dùng chức năng xuất và nhập có sẵn trong phần mềm.

## Yêu cầu hệ thống

| Thiết bị | Yêu cầu |
| --- | --- |
| Máy tính Windows | Windows 10 trở lên, loại 64-bit |
| Mac | macOS 15 trở lên |
| iPhone / iPad | iOS 17 trở lên |

## Cài trên máy tính Windows

Tải file `.zip` ở nút **Tải cho Windows**, giải nén ra một thư mục rồi chạy
**Ban Te.exe** bên trong. Không phải cài đặt gì thêm.

Lần đầu chạy, Windows có thể báo *"Windows đã bảo vệ máy tính của bạn"* vì phần mềm
chưa mua chứng chỉ ký số — bấm **Thông tin thêm** rồi **Vẫn chạy**. Những lần sau
không hỏi lại nữa.

Khi có bản mới, phần mềm tự báo ngay trên máy và yêu cầu cập nhật trước khi dùng
tiếp. Dữ liệu và key bản quyền giữ nguyên sau khi cập nhật.

## Chuyển sổ giữa máy tính và iPhone

Mỗi máy giữ sổ riêng. Muốn hai bên khớp nhau: ở máy đang có sổ ĐÚNG bấm
**Xuất dữ liệu** ra file, gửi file sang máy kia (Zalo, USB, email) rồi bấm
**Nhập dữ liệu**. File dùng chung được cả hai chiều.

> Nhập dữ liệu là ghi đè toàn bộ sổ đang có trên máy đó. Phần mềm tự giữ một bản
> sao trước khi ghi đè, phòng khi nhập nhầm.

## Cài trên Mac

Tải file `.dmg` ở nút **Tải cho macOS**, mở file rồi kéo **phần mềm** vào thư mục
**Applications**. Phần mềm đã được Apple kiểm duyệt (notarize) nên mở là chạy,
máy không báo chặn.

Khi có bản mới, phần mềm tự báo ngay trên máy và yêu cầu cập nhật trước khi dùng
tiếp. Dữ liệu và key bản quyền giữ nguyên sau khi cập nhật.

Bản Mac đồng bộ tự động với iPhone qua iCloud khi hai máy đăng nhập **cùng một
tài khoản Apple**. Khác tài khoản, hoặc muốn khớp với máy Windows, thì dùng
**Xuất / Nhập dữ liệu** như trên.

> Bản cho iPhone và iPad được phát hành qua TestFlight. Xem bài **[Hướng dẫn cài phần mềm trên iPhone qua TestFlight](/bai-viet/huong-dan-cai-qua-testflight)** để làm theo từng bước, có hình minh hoạ.
