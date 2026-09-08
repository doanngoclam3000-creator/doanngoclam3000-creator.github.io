---
ten: "LamVPN"
moTa: "Vào Internet quốc tế ổn định từ Trung Quốc: YouTube, Facebook, Google, Instagram, X. Máy chủ riêng đặt tại Tokyo, Seoul, Singapore — không dùng chung với ai. Nhập mã là chạy, không phải cấu hình gì."
nenTang: ["iOS", "macOS", "Windows", "Android"]
phienBan: "1.3"
banToiThieu: "1.2"
ngayCapNhat: 2026-09-08
ghiChuCapNhat: "- Đã có bản Android: tải file APK ở nút Tải về, kích hoạt cùng mã với iPhone, Mac và Windows.
- Đã có bản Windows, kích hoạt cùng mã.
- Bản iPhone/Mac phát hành qua TestFlight."
gia: "Dùng thử miễn phí 1 ngày · 80.000đ / tháng · 1 năm 800.000đ (trả 10 tháng dùng 12)"
linkTaiIOS: "https://testflight.apple.com/join/PCtZb1MD"
linkTaiWin: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/lam-vpn-1.2.0/LamVPN-1.2.0-Windows.zip"
linkTaiAndroid: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/lam-vpn-android-1.2.0/LamVPN-1.2.0-moi-may.apk"
dungLuong: "iPhone/Mac ~60 MB qua TestFlight · Windows 21 MB · Android 20–58 MB (file APK)"
anhIcon: "/icon/lam-vpn.png"
icon: "🛡️"
mauNen: "#0b5fff"
noiBat: false
thuTu: 7
an: false
---

> ### ⏳ App đang chờ Apple duyệt — nhưng mua mã bây giờ được, không thiệt
>
> Bản iPhone và Mac đã nộp lên TestFlight, Apple thường duyệt trong **1–2 ngày làm việc**.
>
> **Mua trước không mất ngày nào:** số ngày chỉ bắt đầu đếm từ lúc bạn **nhập mã vào app**,
> không phải từ lúc mua. Mua hôm nay, ba ngày nữa mới kích hoạt thì vẫn đủ nguyên số ngày.
>
> Bản **Windows** và **Android** đã có — tải ngay ở nút Tải về, dùng chung mã kích hoạt với iPhone/Mac, không phải mua lại.

![Tổng quan LamVPN](/anh/lam-vpn/1-tong-quan.svg)

## Mạng quốc tế ổn định, không phải nghĩ

**LamVPN** đưa máy của bạn ra Internet quốc tế qua **máy chủ riêng của chúng tôi** đặt tại
Tokyo, Seoul và Singapore. Không dùng chung máy chủ với dịch vụ nào khác, không quảng cáo,
không giới hạn dung lượng.

Mở app, nhập mã kích hoạt, bấm một nút. Hết.

## Vì sao chạy nhanh hơn các dịch vụ rẻ tiền

Phần lớn VPN giá rẻ chạy giao thức **OpenVPN** hoặc **WireGuard** trên máy thuê của Amazon.
Hai giao thức đó bị nhận ra ngay từ gói dữ liệu đầu tiên nên hay bị bóp băng thông — lúc
nhanh lúc rùa.

LamVPN dùng hai giao thức khác:

- **VLESS + Reality** — trên đường truyền trông y hệt lưu lượng vào một trang web lớn có thật,
  nên không bị bóp.
- **Hysteria2** — chạy trên nền QUIC/UDP, đường truyền rớt gói vẫn giữ được tốc độ. Đây là lý
  do khách dùng buổi tối cao điểm vẫn xem được video mượt.

App tự đo độ trễ tới từng máy chủ và chọn nơi nhanh nhất, bạn không phải chọn tay.

![Ba bước dùng LamVPN](/anh/lam-vpn/2-nhap-ma.svg)

## Ba nơi để chọn

![Chọn máy chủ](/anh/lam-vpn/3-chon-may-chu.svg)

App đo độ trễ tới từng máy chủ rồi xếp từ nhanh đến chậm — số càng nhỏ càng nhanh. Để chế độ
**Tự động** thì app luôn chuyển sang nơi phản hồi nhanh nhất, bạn không phải nghĩ.

## Dùng được ở đâu

Có bản cho **iPhone/iPad**, **Mac**, **Windows** và **Android** — tất cả dùng chung một mã
kích hoạt.

Một mã dùng được trên **một máy tại một thời điểm**. Đổi sang máy khác thì nhắn cho chúng tôi
để nhả suất cũ, không mất phí. Muốn dùng đồng thời nhiều máy thì mua thêm mã.

### Cài trên Android

Nút **Tải về** cho Android tải file **APK cài được mọi máy** (khoảng 58 MB). Nếu muốn file nhẹ
hơn, máy đời từ 2018 trở đi tải bản
[arm64-v8a (20 MB)](https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/lam-vpn-android-1.2.0/LamVPN-1.2.0-arm64-v8a.apk);
máy cũ 32-bit tải bản
[armeabi-v7a (20 MB)](https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/lam-vpn-android-1.2.0/LamVPN-1.2.0-armeabi-v7a.apk).

Chép file vào máy rồi bấm cài. Lần đầu Android hỏi *"cho phép cài từ nguồn này"* thì bấm Cho
phép. Mở app, nhập mã, bấm nút tròn, đồng ý hộp thoại kết nối VPN của Android là xong.

## Tải Facebook, TikTok, Zalo sau khi có VPN

![Cách tải app sau khi có VPN](/anh/lam-vpn/5-tai-app.svg)

Bật VPN thôi **chưa đủ** để tải app trên iPhone — App Store Trung Quốc không có sẵn những
app đó. Phải đổi **khu vực Apple ID** sang Việt Nam: mở App Store, bấm ảnh đại diện góc trên
bên phải, bấm tên bạn, chọn Quốc gia/Vùng rồi đổi sang Việt Nam. Xong là tìm thấy đủ.

Chi tiết từng bước có trong [bài hướng dẫn](/bai-viet/huong-dan-cai-va-dung-lamvpn/).

## Gia hạn cộng dồn

Gần hết hạn, bạn mua thêm một mã rồi nhập vào app — **ngày cộng dồn vào số ngày còn lại**,
không mất ngày thừa. Ví dụ còn 5 ngày, nhập mã 30 ngày thì thành 35 ngày.

Hết hạn mà không gia hạn thì app tự ngắt, không âm thầm trừ tiền, không tự động gia hạn.

![Gia hạn cộng dồn](/anh/lam-vpn/4-gia-han.svg)

## Chúng tôi không xem bạn làm gì

Máy chủ đặt mức ghi nhật ký ở mức chỉ ghi lỗi hệ thống. **Không ghi lại trang bạn vào, không
ghi lại nội dung bạn xem.** App cũng không có công cụ thống kê hay theo dõi nào của bên thứ ba.

## Bảng giá

| Gói | Giá | Tính ra mỗi tháng |
|---|---|---|
| 1 tháng | 80.000đ | 80.000đ |
| 3 tháng | 220.000đ | 73.300đ |
| 6 tháng | 420.000đ | 70.000đ |
| **1 năm** | **800.000đ** | **66.700đ** |

Mua 1 năm là **trả 10 tháng, dùng 12 tháng** — tiết kiệm 160.000đ so với mua lẻ từng tháng.

### Dùng thử miễn phí 1 ngày

Chưa tin thì thử trước đã. Đăng nhập trên website, vào mục **Tài khoản**, chọn LamVPN rồi bấm
**Dùng thử miễn phí 1 ngày** — nhận mã ngay, không cần nạp tiền, không cần thẻ.

Mỗi tài khoản nhận được một lần. Thấy chạy nhanh thì mua tiếp, ngày sẽ cộng dồn.

Mua bằng số dư trong tài khoản trên website. Nạp tiền xong, bấm mua là **nhận mã ngay**,
không phải chờ ai duyệt.
