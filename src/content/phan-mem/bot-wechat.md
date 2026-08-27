---
ten: "Bot WeChat"
moTa: "Trợ lý tự động cho WeChat: AI trả lời khách thay bạn, hẹn giờ nhắn nhóm, nhắn tin hàng loạt và đăng bài lên Bảng tin. Chạy ngầm trong lúc bạn vẫn dùng máy bình thường."
nenTang: ["macOS", "Windows"]
phienBan: "1.2"
banToiThieu: "1.0"
ngayCapNhat: 2026-08-25
ghiChuCapNhat: "- Bản Windows đổi sang file nén .zip: giải nén ra chạy luôn\n- Icon phần mềm hiện đúng trên máy tính\n- Cập nhật bản mới lấy thẳng từ trang phanmemtq.com\n- Dùng thử miễn phí tăng lên 10 ngày"
linkTaiMac: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/bot-wechat-1.0/BotWeChat-1.0.dmg"
linkTaiWin: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/bot-wechat-1.2/BotWeChat-1.2-Windows.zip"
gia: "150.000đ / tháng — dùng thử miễn phí 10 ngày"
dungLuong: "khoảng 2 MB (Mac) · 58 MB (Windows, file nén)"
anhIcon: "/icon/bot-wechat.png"
icon: "🤖"
mauNen: "#0ea5e9"
noiBat: true
thuTu: 1
---

## Giới thiệu

**Bot WeChat** làm hộ bạn những việc lặp đi lặp lại trên WeChat: trả lời khách,
nhắn vào nhóm đúng giờ, gửi thông báo cho cả danh sách khách, đăng bài lên Bảng tin.

Điều quan trọng nhất: **bot làm việc trong lúc bạn vẫn đang dùng máy**. Bạn chat với
khách quan trọng, bot lo phần còn lại — không tranh chuột, không tranh bàn phím của bạn.

![Màn hình chính với hai công tắc và nhật ký](/anh/bot-wechat/1-tong-quan.svg)

### Bốn việc bot làm

- **Trả lời khách bằng AI.** Khách nhắn tới, bot đọc rồi trả lời bằng tiếng Việt theo
  đúng vai trò bạn đặt ra. Bạn viết một đoạn mô tả kiểu *"Bạn là nhân viên tư vấn của
  shop, trả lời ngắn gọn, không được bịa giá"* — bot theo đó mà làm.
- **Hẹn giờ nhắn nhóm.** Đặt giờ, chọn nhóm, viết nội dung. Đúng giờ bot tự gửi. Đặt được
  nhiều lịch, mỗi lịch nhiều nhóm, chọn theo thứ trong tuần hoặc lặp lại theo khoảng thời gian.
- **Nhắn tin hàng loạt.** Chọn khách trong danh sách rồi gửi cùng một nội dung, mỗi người
  đúng một tin. Gõ `{ten}` ở chỗ muốn chèn tên người nhận.
- **Đăng bài lên Bảng tin.** Chọn ảnh, viết nội dung, đặt giờ. Đặt bao nhiêu bài cũng được,
  mỗi bài một khung giờ riêng — sáng một bài, trưa một bài, tối một bài.

Riêng bản Mac còn có **kết bạn hàng loạt** từ những nhóm bạn đang tham gia.

![Dạy bot đóng vai và chọn người được trả lời](/anh/bot-wechat/2-tra-loi-khach.svg)

## Bot nhớ ngữ cảnh cuộc trò chuyện

Bot không trả lời từng câu rời rạc. Nó nhớ 20 lượt gần nhất với từng người, nên khách hỏi
*"vừa nãy tôi hỏi gì?"* thì bot trả lời được. Sau một tiếng không nhắn thì tự quên đi để
câu chuyện cũ không lẫn vào câu chuyện mới.

## Bạn giữ quyền quyết định

- **Chỉ trả lời người bạn cho phép.** Mặc định bot chỉ trả lời những người bạn tự tay chọn.
  Muốn bot trả lời tất cả thì bật một nút. Trả lời nhầm đối tác làm ăn phiền hơn nhiều so
  với chậm một tin.
- **Bật tắt riêng từng phần.** Phần trả lời khách và phần hẹn giờ là hai nút riêng, chạy
  độc lập. Chỉ cần hẹn giờ nhắn nhóm thì không phải mua API key.
- **Nhật ký viết bằng tiếng người.** *"Chị Lan hỏi về giá"*, *"Đã trả lời Chị Lan"* — không
  phải dòng mã khó hiểu. Tiền AI hiện bằng đồng, không hiện chữ token.

![Hẹn giờ nhắn nhóm theo thứ trong tuần](/anh/bot-wechat/3-hen-gio-nhan-nhom.svg)

![Nhắn hàng loạt, chèn tên từng người](/anh/bot-wechat/4-nhan-hang-loat.svg)

## Cần chuẩn bị gì

Phần trả lời bằng AI dùng **API key của Google Gemini** — bạn tự lấy, miễn phí, và tiền
AI trả thẳng cho Google chứ không qua chúng tôi. Trong phần mềm có nút mở trang lấy khoá
kèm hướng dẫn từng bước. Google cho một lượng dùng miễn phí mỗi ngày, đủ cho shop nhỏ.

Hai phần còn lại — hẹn giờ nhắn nhóm và nhắn tin hàng loạt — **không cần API key**.

![Đặt lịch đăng bài lên Bảng tin](/anh/bot-wechat/5-bang-tin.svg)

## Yêu cầu hệ thống

| Thiết bị | Yêu cầu |
| --- | --- |
| Mac | macOS 14 trở lên. Phải cấp quyền Trợ năng cho phần mềm. |
| Máy tính Windows | Windows 10 trở lên, loại 64-bit |
| WeChat | Đã cài và đăng nhập sẵn trên máy |

## Cài trên Mac

Tải file `.dmg`, mở ra rồi kéo **Bot WeChat** vào thư mục Applications.

Lần đầu mở, macOS có thể báo *"không mở được vì Apple chưa kiểm tra được"* — bản này
đã ký bằng chứng chỉ nhà phát triển nhưng đang chờ Apple duyệt xong khâu công chứng. Cách mở:
**bấm chuột phải vào Bot WeChat** trong thư mục Applications rồi chọn **Mở**, sau đó bấm **Mở**
lần nữa ở hộp thoại hiện ra. Chỉ phải làm một lần duy nhất.

Lần đầu chạy, phần mềm sẽ xin **quyền Trợ năng** — đây là quyền bắt buộc, không có nó thì
bot không đọc và không gõ được vào WeChat. Vào *Cài đặt hệ thống → Quyền riêng tư & Bảo mật
→ Trợ năng*, bật công tắc cho **Bot WeChat**. Phần mềm tự nhận ra khi được cấp quyền, không
phải khởi động lại.

## Cài trên máy tính Windows

Chỉ có một file `BotWeChat.exe`. Chép vào đâu cũng chạy — **không phải cài .NET hay bất cứ
thứ gì khác**.

Lần đầu chạy, Windows có thể báo *"Windows đã bảo vệ máy tính của bạn"* vì phần mềm chưa mua
chứng chỉ ký số — bấm **Thông tin thêm** rồi **Vẫn chạy**. Những lần sau không hỏi lại.

Nếu bot không điều khiển được WeChat, bấm chuột phải vào file rồi chọn **Run as administrator**:
WeChat chạy quyền cao hơn thì phần mềm phải chạy quyền ngang bằng mới ra lệnh được.

## Giá và dùng thử

Cài xong **tự có 10 ngày dùng thử miễn phí**, không phải nhập gì, không phải trả trước.

Hết 10 ngày, phần mềm xin key bản quyền — **150.000đ cho một tháng**. Mua nhiều tháng thì
rẻ hơn: 3 tháng 300.000đ, 6 tháng 500.000đ, một năm 900.000đ.

Cách mua: mở phần mềm, bấm **Bản quyền**, chép dòng **Mã máy** gửi cho chúng tôi, chuyển
khoản rồi nhận key. Key khoá theo máy nên chỉ dùng được đúng máy đó.

## Vài điều nói trước cho thật

- **Bot có mượn chuột vài giây** khi cần mở một cuộc trò chuyện mới hoặc đăng bài lên Bảng
  tin — WeChat không nhận lệnh gửi ngầm cho những việc đó. Con trỏ được trả về đúng chỗ cũ
  ngay sau đó. Còn việc gửi tin vào cuộc trò chuyện đã mở thì hoàn toàn chạy ngầm.
- **Bot chưa đọc được ảnh và tin thoại** khách gửi. Gặp ảnh thì bot bỏ qua chứ không đoán bừa.
- **Nên đặt tốc độ vừa phải** khi nhắn hàng loạt. Gửi dồn dập cho hàng trăm người trong vài
  phút là cách nhanh nhất để WeChat để ý tới tài khoản của bạn. Phần mềm có sẵn chỗ đặt
  khoảng nghỉ giữa hai tin — để mặc định là an toàn.
- **WeChat lên đời lớn có thể làm bot lệch.** Khi đó phần mềm báo rõ chứ không im lặng, và
  chúng tôi ra bản vá.
