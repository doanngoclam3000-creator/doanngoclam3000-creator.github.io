---
tieuDe: "Hướng dẫn cài và dùng Vị Trí Pro (iPhone và Windows)"
moTa: "Từng bước cài Vị Trí Pro, tạo tệp ghép đôi cho iPhone, kích hoạt key và đổi vị trí. Kèm cách xử lý khi máy tính không thấy iPhone."
ngayDang: 2026-11-17
anh: "/anh/vi-tri-pro/1-dich-chuyen.svg"
chuyenMuc: "huong-dan"
thuocPhanMem: "gia-lap-vi-tri"
tags: ["Vị Trí Pro", "đổi vị trí", "iPhone", "hướng dẫn"]
noiBat: true
---

Bài này đi hết các bước từ lúc tải về tới lúc đổi được vị trí. Nút tải nằm ngay trong từng phần bên dưới.

<style>
.vtp-tai{position:relative;margin:1.4em 0;border:1px solid var(--vien);border-radius:20px;overflow:hidden;background:radial-gradient(700px 260px at 12% 0%,color-mix(in srgb,#0f9d8f 16%,transparent),transparent 70%),var(--nen-the)}
.vtp-tai::before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,transparent,#0f9d8f,transparent)}
.vtp-luoi{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;padding:22px}
.noi-dung a.vtp-nut{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:12px;color:#fff;text-decoration:none;word-break:normal;background:linear-gradient(135deg,#0f9d8f,#0a6259);box-shadow:0 6px 18px rgba(15,157,143,.32);transition:.18s ease}
.noi-dung a.vtp-nut:hover{color:#fff;transform:translateY(-2px);box-shadow:0 10px 26px rgba(15,157,143,.45)}
.noi-dung a.vtp-nut.tf{background:linear-gradient(135deg,#3aa9ff,#0a72e8);box-shadow:0 6px 18px rgba(10,114,232,.34)}
.noi-dung a.vtp-nut.phu{background:linear-gradient(135deg,#64748b,#1e293b);box-shadow:0 6px 18px rgba(30,41,59,.3)}
.noi-dung a.vtp-nut.hd{background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 6px 18px rgba(217,119,6,.34)}
.vtp-nut .i{font-size:1.35rem;width:34px;text-align:center;flex-shrink:0}
.vtp-nut .c{flex:1;line-height:1.3}
.vtp-nut .c b{display:block;font-size:.97rem}
.vtp-nut .c small{font-size:.78rem;opacity:.9}
.vtp-nut .m{font-size:1.1rem;opacity:.85}
.vtp-mot{display:block;max-width:420px;margin:1.1em 0}
</style>

Chọn đúng phần bạn cần:

- **Phần A** — dùng trên máy tính Windows, cắm cáp iPhone.
- **Phần B** — dùng ngay trên iPhone, không cần mang máy tính theo.
- **Phần C** — mua và kích hoạt key.
- **Phần D** — cách dùng: dịch chuyển, cần điều khiển, tuyến đường.
- **Phần E** — khi gặp trục trặc.

## Phần A — Dùng trên máy tính Windows

Cần: Windows 10 hoặc 11 (64-bit), cáp truyền dữ liệu.

<div class="vtp-mot"><a class="vtp-nut" href="https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/vi-tri-pro-1.0/ViTriPro-1.0-Windows-CaiDat.exe"><span class="i">⊞</span><span class="c"><b>Vị Trí Pro cho Windows</b><small>Windows 10 / 11 · file .exe · 734 MB</small></span><span class="m">↓</span></a></div>

1. Bấm nút ở trên để tải **Vị Trí Pro cho Windows** rồi bấm đúp vào tệp vừa tải. Lần đầu Windows có thể hiện bảng xanh "Windows protected your PC": bấm **More info** rồi **Run anyway**.
2. Phần mềm tự cài trong khoảng một phút, tạo lối tắt **Vi Tri Pro** ngoài Desktop rồi tự mở.
3. Cắm iPhone vào máy tính, mở khoá màn hình, bấm **Tin cậy** và nhập mật mã iPhone.
4. Nếu góc trên bên trái báo **chưa có driver Apple**: bấm nút **⋯** → **Cài driver Apple…**, chọn **Yes** khi Windows hỏi quyền, đợi cài xong rồi rút cáp cắm lại.
5. Bật **Chế độ nhà phát triển** trên iPhone: bấm **⋯** → **Bật Chế độ nhà phát triển trên iPhone…** rồi làm theo lời nhắc. Hoặc trên iPhone vào **Cài đặt → Quyền riêng tư & Bảo mật → Chế độ nhà phát triển**, bật lên, iPhone sẽ khởi động lại.
6. Kích hoạt key (Phần C), rồi dùng như Phần D.

![Bảng xanh của Windows: bấm More info rồi Run anyway](/anh/vi-tri-pro/3-cai-windows.svg)

![Cắm cáp, mở khoá iPhone và bấm Tin cậy](/anh/vi-tri-pro/4-tin-cay.svg)

Lần dịch chuyển đầu tiên mất khoảng 10–30 giây để nối tới iPhone. Đóng phần mềm hoặc rút cáp thì iPhone trở về vị trí thật.

## Phần B — Dùng ngay trên iPhone

Cần: iPhone chạy iOS 17.4 trở lên, có đặt mật mã. Một máy tính Windows để tạo tệp ghép đôi, chỉ dùng một lần.

### Bước 1 — Cài app Vị Trí Pro lên iPhone

1. Trên iPhone, mở App Store và cài app **TestFlight** của Apple.
2. Bấm nút dưới đây **ngay trên iPhone**.
3. Bấm **Chấp nhận** rồi **Cài đặt**. App Vị Trí Pro hiện ra ngoài màn hình chính.

<div class="vtp-mot"><a class="vtp-nut tf" href="https://testflight.apple.com/join/aabZw9gJ" target="_blank" rel="noopener"><span class="i">📱</span><span class="c"><b>Vị Trí Pro cho iPhone</b><small>iOS 17.4 trở lên · qua TestFlight</small></span><span class="m">↗</span></a></div>

Chưa dùng TestFlight bao giờ thì xem [hướng dẫn cài qua TestFlight có hình](/bai-viet/huong-dan-cai-qua-testflight/).

### Bước 2 — Tạo tệp ghép đôi trên máy tính Windows

App trên iPhone cần một tệp ghép đôi tạo từ máy tính thì mới được phép đặt vị trí. Mỗi iPhone chỉ làm một lần.

1. Bấm nút dưới đây để tải **Tạo Tệp Ghép Đôi cho Windows** rồi bấm đúp. Bảng xanh "Windows protected your PC" thì bấm **More info** → **Run anyway**. Phần mềm tự cài và tự mở.
2. Nếu phần mềm báo **Máy tính này chưa có driver Apple**: bấm **Cài driver Apple**, chọn **Yes** khi Windows hỏi quyền, đợi khoảng một phút.
3. Cắm iPhone bằng cáp, mở khoá màn hình, bấm **Tin cậy** và nhập mật mã nếu iPhone hỏi.
4. Chọn iPhone trong danh sách, bấm **Tạo tệp ghép đôi**, đợi vài giây. Giữ iPhone mở khoá và đừng rút cáp trong lúc chờ.
5. Tệp được lưu ở `Desktop\TepGhepDoi\(tên iPhone)\pairingFile.plist`.

<div class="vtp-mot"><a class="vtp-nut phu" href="https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/vi-tri-pro-1.0/TaoTepGhepDoi-1.0-Windows-CaiDat.exe"><span class="i">🔗</span><span class="c"><b>Tạo Tệp Ghép Đôi</b><small>Công cụ cho bản iPhone · Windows · 111 MB</small></span><span class="m">↓</span></a></div>

![Chọn iPhone rồi bấm Tạo tệp ghép đôi](/anh/vi-tri-pro/5-tao-tep.svg)

### Bước 3 — Đưa tệp sang iPhone

Gửi tệp sang iPhone qua Zalo, iCloud Drive hoặc email, rồi lưu vào app **Tệp**. Hoặc trong phần mềm bấm **Sao chép nội dung**, gửi đoạn chữ đó sang iPhone và sao chép lại trên iPhone.

Mở app **Vị Trí Pro** trên iPhone, bấm **Chọn tệp ghép đôi** và chọn tệp vừa nhận. Nếu bạn đã sao chép nội dung thì bấm **Dán từ bộ nhớ tạm**. Sau đó làm tiếp các bước app hướng dẫn trên màn hình.

![Trong app Vị Trí Pro bấm Chọn tệp ghép đôi](/anh/vi-tri-pro/6-chon-tep.svg)

> Tệp ghép đôi giống như chìa khoá của iPhone đó. Giữ cho riêng bạn, đừng gửi cho người khác. Đổi sang iPhone khác thì phải tạo tệp mới.

## Phần C — Mua và kích hoạt key

Chưa có key thì bấm **Dịch chuyển** phần mềm sẽ mở màn hình bản quyền. Trên máy tính có thể mở từ nút **⋯** → **Bản quyền…**.

![Màn hình bản quyền: quét mã QR hoặc nhập key](/anh/vi-tri-pro/7-ban-quyen.svg)

**Cách 1 — Quét mã QR (tự động):**

1. Chọn gói: 1 tháng 300.000đ · 2 tháng 500.000đ · vĩnh viễn 2.000.000đ.
2. Quét mã QR bằng app ngân hàng. **Giữ nguyên nội dung chuyển khoản** (dạng `DOIVT` kèm mã máy) — sửa hoặc xoá nội dung thì phần mềm không nhận ra khoản chuyển của bạn.
3. Để màn hình bản quyền mở. Thường trong vòng nửa phút phần mềm tự chuyển sang **Đã kích hoạt**. Nếu chưa, bấm **Tôi đã chuyển khoản — kiểm tra**.

**Cách 2 — Mua qua WeChat:** gửi mã máy (dạng `MAY-XXXXXX`, hiện trong màn hình bản quyền) tới WeChat **tieumanthau1409**. Nhận key rồi dán vào ô **Đã có key? Nhập ở đây** và bấm **Kích hoạt**.

**Dùng cả điện thoại lẫn máy tính:** hãy mua key cho iPhone. Trên máy tính, cắm iPhone đó vào trước khi mua thì mã QR sẽ gắn key với iPhone; hoặc mua ngay trong app trên iPhone. Sau này cắm iPhone đó vào máy tính nào có cài Vị Trí Pro, bản máy tính cũng tự nhận key, không phải nhập lại.

Chuyển thiếu thì chưa có key; tiền được cộng dồn, chuyển bù cho đủ gói là có key.

## Phần D — Cách dùng

- **Ghim và dịch chuyển:** bấm lên bản đồ để ghim một điểm (hoặc gõ tên địa điểm, hoặc dán toạ độ vào ô tìm kiếm), rồi bấm **Dịch chuyển tới điểm ghim**.
- **Cần điều khiển:** bật cần điều khiển rồi kéo núm theo hướng muốn đi. Trên máy tính dùng được phím mũi tên hoặc W A S D, phím tắt bật/tắt là Ctrl+J.
- **Tuyến đường:** chuyển sang tab **Tuyến đường**, bấm lên bản đồ để thêm từng điểm. Phần mềm nối các điểm theo đường thật. Bấm **Bắt đầu** để đi, có **Tạm dừng**, **Đi tiếp** và lặp đi – về.
- **Tốc độ:** chọn đi bộ, chạy, xe đạp hoặc ô tô, hoặc kéo thanh trượt.
- **Yêu thích:** ghim một điểm rồi bấm ngôi sao để lưu.
- **Về vị trí thật:** bấm **Về vị trí thật** khi dùng xong.

![Ghim một điểm rồi bấm Dịch chuyển tới điểm ghim](/anh/vi-tri-pro/1-dich-chuyen.svg)

![Đi theo tuyến đường và dùng cần điều khiển](/anh/vi-tri-pro/2-tuyen-duong.svg)

## Phần E — Khi gặp trục trặc

| Hiện tượng | Cách xử lý |
| --- | --- |
| Máy tính không thấy iPhone | Cắm lại cáp, mở khoá iPhone, bấm **Tin cậy**. Thử cáp hoặc cổng USB khác (cáp chỉ sạc không dùng được). Kiểm tra đã cài driver Apple |
| Báo iPhone đang khoá | Mở khoá màn hình iPhone, để ở màn hình chính rồi thử lại |
| Không đặt được vị trí | Kiểm tra đã bật Chế độ nhà phát triển trên iPhone. Rút cáp, cắm lại rồi thử lại |
| Tạo tệp ghép đôi báo iPhone không hỗ trợ | Cập nhật iPhone lên iOS 17.4 trở lên và đặt mật mã cho iPhone |
| Chuyển khoản rồi mà chưa mở khoá | Chờ thêm nửa phút rồi bấm **Tôi đã chuyển khoản — kiểm tra**. Kiểm tra nội dung chuyển khoản có đúng như trên mã QR không. Vẫn chưa được thì nhắn shop kèm mã máy |
| Báo key không đúng | Key gắn với mã máy. Kiểm tra bạn đang dùng đúng máy (hoặc đang cắm đúng iPhone) mà key được cấp |
| Ứng dụng vẫn thấy vị trí thật | Một số trò chơi và ứng dụng tự kiểm tra và từ chối vị trí giả lập |

Cần hỗ trợ thêm: WeChat **tieumanthau1409** · Zalo **0971619705**.
