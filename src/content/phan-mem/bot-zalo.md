---
ten: "Bot Zalo"
moTa: "Trợ lý tự động cho Zalo: quét đủ thành viên nhóm (cả cộng đồng nghìn người), kết bạn và nhắn tin hàng loạt, đăng bài vào nhiều nhóm, hẹn giờ, mời vào nhóm, tìm khách quanh khu vực qua Google Maps. Xem và trả lời tin nhắn ngay trong phần mềm."
nenTang: ["macOS", "Windows"]
phienBan: "2.2.0"
banToiThieu: "1.1"
ngayCapNhat: 2026-08-30
ghiChuCapNhat: "- Thêm Trợ lý AI: tự trả lời khách trên Zalo, tư vấn theo bảng giá của shop\n- Khách gửi ảnh thì trợ lý xem ảnh rồi tư vấn; khách đòi xem hàng thì gửi ảnh sản phẩm luôn\n- Bảng chốt đơn ngay trong phần mềm: sản phẩm, số lượng, tên, SĐT, địa chỉ, trạng thái, xuất CSV\n- Cập nhật ngay trong phần mềm, chỉ tải gói nhỏ ~245KB thay vì cả bản đầy đủ\n- Mọi việc chạy dài đều có nút Dừng: kết bạn, nhắn tin, đăng bài, mời nhóm, lấy số\n- Sửa lỗi mở phần mềm lên không hiện dữ liệu đã lưu"
linkTaiMac: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/bot-zalo-2.0/BotZalo-2.0.0-mac-arm64.dmg"
linkTaiWin: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/bot-zalo-2.2.0/BotZalo-2.2.0-Windows.zip"
linkGoiWin: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/bot-zalo-2.2.0/ban-2.2.0-80cf6121.goi"
gia: "150.000đ / tháng — dùng thử miễn phí 2 ngày"
dungLuong: "77 MB (Windows) — giải nén ra đúng một file .exe"
video: "https://www.youtube.com/watch?v=nhAeWN_W8BM"
anhIcon: "/icon/bot-zalo.png"
icon: "💬"
mauNen: "#2b7cff"
noiBat: true
thuTu: 3
---

## Giới thiệu

**Bot Zalo** làm hộ bạn những việc bán hàng lặp đi lặp lại trên Zalo: lấy danh sách
thành viên một nhóm, kết bạn và nhắn tin cho họ, đăng bài vào nhiều nhóm cùng lúc, hẹn
giờ gửi tự động, và tìm khách hàng quanh khu vực qua Google Maps. Tất cả chạy **ngay trên
máy bạn**, không qua máy chủ trung gian, dữ liệu khách hàng nằm trong máy bạn.

![Bảng điều khiển Bot Zalo](/anh/bot-zalo/1-tong-quan.svg)

### Những việc Bot Zalo làm

- **Quét đủ thành viên nhóm.** Dán link nhóm hoặc chọn nhóm đã tham gia, bấm một nút là
  ra danh sách thành viên kèm tên và ảnh đại diện. Kể cả **cộng đồng lớn nghìn người** —
  bản này lấy đủ, không bị chặn ở vài người như cách thông thường.
- **Kết bạn & nhắn tin hàng loạt.** Chọn người trong danh sách rồi tự động gửi lời mời
  kết bạn và nhắn tin, mỗi hành động cách nhau một khoảng thời gian bạn đặt cho an toàn.
  Chèn `{ten}` để mỗi tin tự xưng đúng tên người nhận, gửi kèm ảnh cũng được.
- **Đăng bài vào nhiều nhóm.** Soạn một nội dung, chọn nhiều nhóm, đặt giãn cách — bot
  đăng lần lượt vào từng nhóm.
- **Hẹn giờ.** Đặt lịch gửi tin hoặc đăng bài, chạy một lần hoặc lặp hằng ngày, hằng tuần.
- **Mời vào nhóm.** Kéo những người đã là bạn vào nhóm của bạn theo từng đợt.
- **Tìm khách qua Google Maps.** Nhập nghề và khu vực (ví dụ *"tiệm nail Cầu Giấy"*), bot
  mở Google Maps ngay trong phần mềm và lấy tên, **số điện thoại**, địa chỉ của các cửa
  hàng — đổ thẳng sang danh bạ để nhắn tin.
- **Xem và trả lời tin nhắn.** Có sẵn Zalo web ngay trong phần mềm, đổi qua lại giữa nhiều
  tài khoản để chăm sóc khách từng người.

![Quét đủ thành viên nhóm](/anh/bot-zalo/2-quet-thanh-vien.svg)

![Tìm khách quanh khu vực qua Google Maps](/anh/bot-zalo/3-tim-khach-maps.svg)

## Nhiều tài khoản, mỗi tài khoản một phiên

Thêm bao nhiêu tài khoản Zalo cũng được, mỗi tài khoản đăng nhập một lần bằng QR và phần
mềm tự nhớ phiên — **không lưu mật khẩu**. Gán phân loại và proxy riêng cho từng acc,
chuyển qua lại chỉ bằng một cú bấm.

## Dữ liệu của bạn được giữ kín

Danh bạ khách, danh sách thành viên và phiên đăng nhập Zalo đều **mã hoá bằng khoá của
máy** — chép sang máy khác cũng không đọc được. Phần mềm chạy hoàn toàn trên máy bạn,
không gửi dữ liệu đi đâu.

## Cần chuẩn bị gì

Phần viết bài bằng AI dùng **API key của Google Gemini** — bạn tự lấy, miễn phí, tiền AI
trả thẳng cho Google. Trong phần mềm có nút mở trang lấy khoá kèm hướng dẫn từng bước.
Các phần còn lại **không cần API key**.

## Yêu cầu hệ thống

| Thiết bị | Yêu cầu |
| --- | --- |
| Mac | macOS 12 trở lên (máy Apple Silicon) |
| Máy tính Windows | Windows 10 trở lên, loại 64-bit |
| Zalo | Đăng nhập bằng QR ngay trong phần mềm |

## Cài trên Mac

Tải file `.dmg`, mở ra rồi kéo **Bot Zalo** vào thư mục Applications. Lần đầu mở, nếu macOS
báo *"không mở được"*, bấm chuột phải vào **Bot Zalo** rồi chọn **Mở** — chỉ phải làm một lần.

## Cài trên máy tính Windows

Giải nén file `.zip` ra một thư mục rồi chạy **Bot Zalo.exe**. Lần đầu Windows có thể báo
*"Windows đã bảo vệ máy tính của bạn"* vì phần mềm chưa mua chứng chỉ ký số — bấm **Thông
tin thêm** rồi **Vẫn chạy**. Những lần sau không hỏi lại.

## Giá và dùng thử

Cài xong **tự có 2 ngày dùng thử miễn phí**, không phải nhập gì. Hết hạn, phần mềm xin key
bản quyền — **150.000đ một tháng**, 3 tháng 300.000đ, 6 tháng 500.000đ, một năm 900.000đ.

Cách mua: mở phần mềm, quét mã QR ngay trong phần mềm để chuyển khoản. Tiền về là phần mềm
**tự cộng ngày**, không phải nhắn ai xin key. Hạn khoá theo máy nên chỉ dùng được đúng máy đó.

## Vài điều nói trước cho thật

- **Số điện thoại người lạ trong nhóm thì Zalo không cho lấy** — chỉ lấy được số của người
  đã là bạn hoặc để công khai. Muốn có số cả nhóm thì kết bạn trước, hoặc dùng phần quét
  Google Maps (số cửa hàng vốn công khai).
- **Nên đặt tốc độ vừa phải** khi kết bạn hay nhắn hàng loạt. Làm dồn dập là cách nhanh nhất
  để Zalo để ý tới tài khoản. Phần mềm có sẵn chỗ đặt khoảng nghỉ — để mặc định là an toàn.
- **Zalo có giới hạn mời người lạ vào nhóm mỗi ngày.** Bot chỉ mời người đã là bạn cho chắc,
  và báo rõ khi chạm giới hạn chứ không im lặng.
