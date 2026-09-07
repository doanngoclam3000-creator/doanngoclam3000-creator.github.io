---
tieuDe: "Hướng dẫn cài và dùng LamVPN — từ lúc mua mã tới lúc vào được YouTube"
moTa: "Mua mã, cài app, nhập mã, bấm một nút. Bài này đi hết từng bước kèm ảnh, cả cách chọn máy chủ, gia hạn cộng dồn, đổi máy, và cách xử lý khi không kết nối được."
ngayDang: 2026-09-08
chuyenMuc: "huong-dan"
thuocPhanMem: "lam-vpn"
anh: "/anh/lam-vpn/1-tong-quan.svg"
tags: ["LamVPN", "VPN", "hướng dẫn", "TestFlight"]
noiBat: true
---

Bài này viết cho người chưa dùng VPN bao giờ. Bạn làm theo đúng thứ tự là chạy được,
không cần biết gì về kỹ thuật.

Tổng cộng mất khoảng **ba phút**.

> **Lưu ý:** app đang chờ Apple duyệt TestFlight (1–2 ngày làm việc). **Mua mã bây giờ vẫn
> được và không thiệt** — số ngày chỉ đếm từ lúc bạn nhập mã vào app, không phải từ lúc mua.

![Tổng quan LamVPN](/anh/lam-vpn/1-tong-quan.svg)

## Bước 1 — Mua mã kích hoạt

LamVPN không có bản dùng thử. Phải có mã mới mở được app.

1. Vào **phanmemtq.com**, đăng nhập (chưa có thì đăng ký, mất 30 giây).
2. Vào mục **Tài khoản**, nạp tiền vào số dư. Trang sẽ hiện số tài khoản ngân hàng và
   nội dung chuyển khoản — **chuyển đúng nội dung đó** thì tiền vào tự động trong ít phút.
3. Vẫn ở trang Tài khoản, chọn **LamVPN**, chọn gói, bấm **Mua**.
4. Mã hiện ra ngay trên màn hình. Bấm nút **chép** cạnh mã.

Mã có dạng `LAM-XXXX-XXXX-XXXX`. Cứ để nguyên cả dấu gạch, không cần xoá.

> **Giữ lại mã.** Cài lại máy hay đổi điện thoại còn dùng tới. Mã cũng nằm trong lịch sử
> đơn hàng ở trang Tài khoản nếu bạn lỡ mất.

## Bước 2 — Cài app

Hiện có bản cho **iPhone, iPad và Mac**, cài qua **TestFlight** — đây là kho cài thử chính
chủ của Apple, an toàn như App Store.

**Trên iPhone/iPad:**

1. Vào App Store, tải app tên **TestFlight** (biểu tượng cánh quạt trắng trên nền xanh).
2. Bấm vào link mời chúng tôi gửi, hoặc link ở trang LamVPN trên website.
3. Trong TestFlight bấm **Accept**, rồi bấm **Install**.

**Trên Mac:** làm y hệt, TestFlight có sẵn trên Mac App Store.

Bản **Android** và **Windows** đang làm. Mã bạn mua bây giờ **dùng chung cho cả hai bản đó**
khi ra mắt — không phải mua lại.

## Bước 3 — Nhập mã và kết nối

![Ba bước dùng LamVPN](/anh/lam-vpn/2-nhap-ma.svg)

1. Mở LamVPN. Màn hình đầu tiên là ô nhập mã.
2. Dán mã vào, bấm **Kích hoạt**. App tải danh sách máy chủ về, mất vài giây.
3. Bấm **nút tròn** ở giữa.
4. Máy sẽ hỏi *"LamVPN muốn thêm cấu hình VPN"* — bấm **Cho phép** rồi nhập mật khẩu máy
   (hoặc quét Face ID). **Chỉ hỏi đúng một lần**, những lần sau không hỏi nữa.
5. Nút chuyển **xanh lá** và chữ đổi thành **Đã kết nối** là xong.

Mở Safari hay Chrome vào thử youtube.com — vào được là chạy đúng.

## Chọn máy chủ cho hợp

![Chọn máy chủ](/anh/lam-vpn/3-chon-may-chu.svg)

Bấm dòng **Máy chủ** ở trang chính để đổi nơi. Hiện có ba nơi:

| Nơi | Hợp với ai |
|---|---|
| 🇯🇵 **Tokyo** | Khách ở miền bắc và miền đông Trung Quốc |
| 🇰🇷 **Seoul** | Gần Sơn Đông, Liêu Ninh, Bắc Kinh |
| 🇸🇬 **Singapore** | Miền nam: Quảng Đông, Phúc Kiến |

Con số bên phải là **độ trễ**, tính bằng mili giây — **số càng nhỏ càng nhanh**.

Không muốn nghĩ thì cứ để **Tự động**, app luôn chọn nơi phản hồi nhanh nhất giúp bạn.

> Số đo lúc **đang bật VPN** sẽ cao hơn thực tế, vì nó đi vòng qua đường hầm.
> Muốn đo cho chuẩn thì ngắt kết nối rồi mở lại màn hình chọn máy chủ.

## Tải Facebook, TikTok, Zalo… sau khi có VPN

![Cách tải app sau khi có VPN](/anh/lam-vpn/5-tai-app.svg)

Đây là chỗ nhiều người hiểu nhầm nhất, đọc kỹ mục này.

**Bật VPN thôi chưa đủ để tải app trên iPhone.** VPN lo phần *mạng*. Còn việc App Store có
cho tải app đó hay không là do **khu vực của Apple ID**. App Store Trung Quốc không có
Facebook, Instagram, YouTube, WhatsApp, Zalo, và TikTok bản quốc tế — bật VPN xong tìm vẫn
không thấy.

Cách làm, đúng thứ tự:

**1. Bật LamVPN trước.** Chờ chữ chuyển thành *Đã kết nối*. Chưa bật VPN mà đổi khu vực thì
App Store hay báo lỗi mạng.

**2. Đổi khu vực App Store sang Việt Nam:**

1. Mở **App Store**.
2. Bấm **ảnh đại diện** ở góc trên bên phải.
3. Bấm vào **tên bạn** ở trên cùng.
4. Chọn **Quốc gia/Vùng** → **Thay đổi quốc gia hoặc vùng**.
5. Chọn **Việt Nam**, đồng ý điều khoản.
6. Ở mục thanh toán chọn **Không có** — không cần thẻ Việt Nam.

**3. Tải app như bình thường.** Quay lại App Store, tìm TikTok, Facebook, Zalo, Instagram…
giờ đã thấy đủ, bấm **Nhận** là tải được.

> ### 🚫 Đừng đăng xuất iCloud
>
> Chỉ **đổi khu vực**, hoặc nếu dùng Apple ID khác thì chỉ đăng xuất ở **mục App Store**.
> Đăng xuất iCloud là **mất ảnh, danh bạ, tin nhắn** đã lưu trên máy. Rất nhiều người mất
> dữ liệu vì bước này.

**Apple không cho đổi khu vực?** Thường vì còn gói đăng ký đang chạy hoặc còn số dư trong
tài khoản. Huỷ hết gói đăng ký, tiêu hết số dư rồi đổi lại. Chọn phương thức thanh toán
**Không có** là qua được.

**Máy Android:** điện thoại mua ở Trung Quốc thường không có sẵn CH Play. Bật VPN rồi cài
CH Play, hoặc tải thẳng file cài từ trang chính chủ của app. Đừng tải từ trang lạ.

**Sau khi tải xong, nhớ giữ VPN bật** mỗi khi dùng những app đó — tải được không có nghĩa là
dùng được, vẫn cần VPN để chúng kết nối ra ngoài.

## Gia hạn — ngày cộng dồn, không mất ngày thừa

![Gia hạn cộng dồn](/anh/lam-vpn/4-gia-han.svg)

Gần hết hạn thì **không phải chờ hết mới gia hạn**:

1. Mua thêm một mã trên website như bước 1.
2. Ở trang chính của app, **bấm vào dòng "Hết hạn"** — ô nhập mã hiện ra.
3. Dán mã mới vào, bấm xác nhận.

Còn 5 ngày mà nhập mã 30 ngày thì thành **35 ngày**, không mất 5 ngày cũ.

Hết hạn mà không gia hạn thì app **tự ngắt**. Chúng tôi không lưu thẻ, không tự động trừ
tiền, không gia hạn ngầm.

## Đổi sang máy khác

Một mã dùng trên **một máy tại một thời điểm**. Đổi điện thoại, cài lại máy, hay gỡ app rồi
cài lại đều làm máy cũ vẫn giữ suất.

Nhắn cho chúng tôi kèm mã của bạn, chúng tôi **nhả suất cũ trong vài phút, không mất phí**.
Sau đó bạn nhập lại đúng mã đó trên máy mới là chạy.

Muốn dùng **đồng thời** hai máy thì mua hai mã.

## Không kết nối được thì làm gì

Thử theo thứ tự này, phần lớn trường hợp dừng ở bước 2:

1. **Đổi máy chủ.** Đang Tokyo thì thử Singapore, hoặc ngược lại. Mạng mỗi nhà mỗi khác.
2. **Tắt VPN rồi bật lại.** Bấm nút tròn hai lần.
3. **Đổi giữa Wi-Fi và 4G.** Có nhà mạng chặn khác nhau.
4. **Đóng hẳn app rồi mở lại.** Vuốt app ra khỏi danh sách đang chạy.
5. **Xem dòng Độ trễ.** Nếu mọi máy chủ đều hiện gạch đỏ thì máy bạn đang không ra được
   Internet — kiểm tra lại Wi-Fi trước đã.

Vẫn không được thì nhắn cho chúng tôi kèm **ảnh chụp màn hình** và cho biết bạn đang ở
tỉnh nào, dùng mạng gì. Có ảnh thì tìm ra nguyên nhân nhanh hơn nhiều.

## Vài câu hay được hỏi

**Có giới hạn dung lượng không?**
Không. Xem phim, tải file thoải mái.

**Có ghi lại tôi vào trang nào không?**
Không. Máy chủ đặt mức ghi nhật ký ở mức chỉ ghi lỗi hệ thống, không ghi địa chỉ trang bạn
truy cập. App cũng không có công cụ thống kê hay theo dõi nào của bên thứ ba.

**Dùng được cho ChatGPT không?**
Vào được trang chủ, nhưng ChatGPT chặn địa chỉ của máy chủ thuê nên có thể báo lỗi khi đăng
nhập. Đây là chuyện chung của mọi VPN, không riêng LamVPN.

**Tại sao nhanh hơn VPN rẻ tiền?**
Phần lớn VPN giá rẻ chạy OpenVPN hoặc WireGuard — hai giao thức này bị nhận ra ngay nên hay
bị bóp băng thông. LamVPN dùng **VLESS + Reality** (trên đường truyền trông như lưu lượng vào
một trang web lớn có thật) và **Hysteria2** (chạy nền QUIC, rớt gói vẫn giữ tốc độ).

**Một mã dùng cho cả điện thoại và máy tính được không?**
Được, nhưng **không cùng lúc**. Cần dùng song song thì mua hai mã.
