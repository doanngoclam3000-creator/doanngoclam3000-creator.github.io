---
ten: "Bot WeChat"
moTa: "Trợ lý tự động cho WeChat: AI trả lời khách thay bạn, hẹn giờ nhắn nhóm, nhắn tin hàng loạt và đăng bài lên Bảng tin. Chạy ngầm trong lúc bạn vẫn dùng máy bình thường. Có bản Mac và bản Windows."
nenTang: ["macOS", "Windows"]
phienBan: "1.6.0"
banToiThieu: "1.6.0"
banToiThieuMac: "1.6.0"
banToiThieuWin: "1.0.0"
ngayCapNhat: 2026-09-18
ghiChuCapNhat: "- (Mac 1.6.0) Bản Mac nay giống bản Windows: bot chuyển sang cuộc trò chuyện khác bằng phím gửi ngầm vào WeChat, không mượn chuột của bạn nữa và không kéo WeChat lên trước màn hình.
- WeChat nằm dưới ứng dụng khác thì bot mở hội thoại và gửi ngay, không phải chờ bạn rời tay. Chỉ khi bạn đang gõ trong chính WeChat thì bot mới chờ.
- Trả lời khách xong, bot mở lại đúng cuộc trò chuyện bạn đang xem dở. Bạn tự chuyển sang người khác thì bot thôi không lật lại.
- Áp dụng cho trả lời khách bằng AI, hẹn giờ nhắn nhóm, nhắn tin hàng loạt và nút Tách cửa sổ.
- Bản Windows vẫn là 1.0.0, không đổi."
linkTaiMac: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/bot-wechat-1.6.0/BotWeChat-1.6.0.dmg"
linkTaiWin: "https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/bot-wechat-win-1.0.0/BotWeChat-1.0.0-Windows.zip"
gia: "80.000đ / tháng · 3 tháng 220.000đ · 6 tháng 420.000đ · 1 năm 800.000đ — dùng thử miễn phí 10 ngày"
dungLuong: "61 MB (Windows) · khoảng 3 MB (macOS) — bản Windows giải nén ra đúng một file .exe"
anhIcon: "/icon/bot-wechat.png"
icon: "🤖"
mauNen: "#0ea5e9"
noiBat: true
thuTu: 5
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

### Dành riêng cho nghề đổi tệ

Bật **Kèm bán nhân dân tệ** là bot biết luôn bảng giá của bạn:

- **Mỗi hình thức một giá.** Alipay Trung Quốc, Alipay Việt Nam, WeChat, thẻ ngân hàng,
  thanh toán hộ — bạn đặt giá riêng cho từng loại, AI hỏi khách trả bằng hình thức nào
  rồi báo đúng giá đó. Không bao giờ tự giảm giá, không tự bịa.
- **Khách chốt là có đơn.** AI nhận ra lúc khách đồng ý, tự dựng một đơn nháp vào sổ
  Bán tệ. Bạn chuyển tệ xong thì bấm xác nhận, lúc đó đơn mới vào sổ và cộng vào lãi.
- **Bảng tính tệ.** Gõ `4v2+23499 ali TQ` là ra ngay `65.499 × 3.895 = 255.118.605đ`.
  Dùng được cả trong phần mềm (mục **Bot tuỳ chỉnh**) lẫn gõ thẳng vào khung chat WeChat.
  `v` là vạn: `2v` = 20.000, `2v3499` = 23.499, `4v2` = 42.000.
- **Nhắc khách chuyển khoản.** Chốt đơn đã lâu mà chưa thấy tiền, bot tự nhắn nhắc một
  câu lịch sự — bạn đặt sau bao nhiêu phút thì nhắc và nhắc tối đa mấy lần.
- **Đọc bill khách gửi.** Khách gửi ảnh chuyển khoản, phần mềm đọc số tiền ngay trên
  ảnh, cộng dồn nếu khách chuyển làm nhiều lần, còn thiếu thì báo thiếu bao nhiêu, đủ
  rồi thì cảm ơn khách. Ảnh mã QR hay bill bằng tệ thì bỏ qua, không tính nhầm. Số tiền
  đọc được vào thẳng **sổ giao dịch** để cuối ngày đối soát, xuất ra Excel được.

Cả hai bản đều có **kết bạn hàng loạt** từ những nhóm bạn đang tham gia.

### Bản Windows và bản Mac khác nhau chỗ nào

Bản Windows (mới, 1.0.0) có: trả lời khách bằng AI, hẹn giờ nhắn nhóm, quét danh bạ rồi tích
chọn người để nhắn, quét nhóm, kết bạn trong nhóm. Ba phần **đăng bài lên Bảng tin**, **bán
nhân dân tệ** và **đọc bill** hiện mới có trên Mac, sẽ đưa sang Windows sau.

Bù lại, bản Windows **không bao giờ đụng đến chuột**: mọi thao tác đọc và gõ vào WeChat đều
chạy nền, con trỏ của bạn tự do hoàn toàn — kể cả lúc bot mở một cuộc trò chuyện mới. Từ bản
1.6.0, bản Mac cũng mở cuộc trò chuyện mới bằng phím gửi ngầm chứ không mượn chuột nữa.

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
| Máy tính Windows | Windows 10 trở lên, loại 64-bit. Không cần quyền quản trị, không cần cài thêm gì. |
| WeChat | Đã cài và đăng nhập sẵn trên máy |

## Cài trên Mac

Tải file `.dmg`, mở ra rồi kéo **Bot WeChat** vào thư mục Applications.

Bản này đã ký bằng chứng chỉ nhà phát triển và được Apple công chứng, nên mở là chạy,
không bị chặn. Nếu máy vẫn báo *"không mở được vì Apple chưa kiểm tra được"* (thường do tải
bằng trình duyệt lạ), **bấm chuột phải vào Bot WeChat** trong thư mục Applications rồi chọn
**Mở**, sau đó bấm **Mở** lần nữa. Chỉ phải làm một lần duy nhất.

Lần đầu chạy, phần mềm sẽ xin **quyền Trợ năng** — đây là quyền bắt buộc, không có nó thì
bot không đọc và không gõ được vào WeChat. Vào *Cài đặt hệ thống → Quyền riêng tư & Bảo mật
→ Trợ năng*, bật công tắc cho **Bot WeChat**. Phần mềm tự nhận ra khi được cấp quyền, không
phải khởi động lại.

## Cài trên máy tính Windows

Giải nén file `.zip` ra một thư mục rồi chạy **Bot WeChat.exe** — đúng một file, chép vào
đâu cũng chạy, không phải cài .NET hay gì khác. Lần đầu Windows có thể báo *"Windows đã bảo
vệ máy tính của bạn"* vì phần mềm chưa mua chứng chỉ ký số — bấm **Thông tin thêm** rồi
**Vẫn chạy**, chỉ phải làm một lần.

Bản Windows không xin quyền gì cả: không cần quyền quản trị, không cần cấp quyền trợ năng.
Mở WeChat lên, đăng nhập sẵn, rồi bấm **Bật bot** là chạy.

## Giá và dùng thử

Cài xong **tự có 10 ngày dùng thử miễn phí**, không phải nhập gì, không phải trả trước.

Hết 10 ngày, phần mềm xin key bản quyền — **80.000đ cho một tháng**. Mua nhiều tháng thì
rẻ hơn: 3 tháng 220.000đ, 6 tháng 420.000đ, một năm 800.000đ.

Cách mua **giống nhau trên Mac và Windows**: mở phần mềm, bấm **Bản quyền**, chép dòng
**Mã máy** (dạng `MAY-XXXXXX`) gửi cho chúng tôi, chuyển khoản — tiền về là phần mềm tự cộng
ngày, không phải nhắn ai. Hạn khoá theo máy nên chỉ dùng được đúng máy đó; máy Mac và máy
Windows là hai máy khác nhau, mỗi máy một key.

## Vài điều nói trước cho thật

- **Bản Mac chỉ còn mượn chuột vài giây khi đăng bài lên Bảng tin** (và khi nhắn cho người
  chưa từng trò chuyện) — WeChat trên Mac không nhận lệnh gửi ngầm cho hai việc đó, con trỏ
  được trả về đúng chỗ cũ ngay sau đó. Còn trả lời khách, hẹn giờ nhắn nhóm, nhắn hàng loạt
  thì từ bản 1.6.0 đi hết bằng phím gửi ngầm. **Bản Windows thì không đụng chuột ở bất kỳ bước nào.**
- **Bản Windows mới ra.** Phần đọc/gõ vào WeChat phụ thuộc phiên bản WeChat Windows bạn đang
  cài; nếu bot không đọc được, bấm *Kiểm tra WeChat* trong phần mềm rồi gửi kết quả cho chúng
  tôi để vá — bản vá ra nhanh, không phải mua lại.
- **Bot chưa đọc được ảnh và tin thoại** khách gửi. Gặp ảnh thì bot bỏ qua chứ không đoán bừa.
- **Nên đặt tốc độ vừa phải** khi nhắn hàng loạt. Gửi dồn dập cho hàng trăm người trong vài
  phút là cách nhanh nhất để WeChat để ý tới tài khoản của bạn. Phần mềm có sẵn chỗ đặt
  khoảng nghỉ giữa hai tin — để mặc định là an toàn.
- **WeChat lên đời lớn có thể làm bot lệch.** Khi đó phần mềm báo rõ chứ không im lặng, và
  chúng tôi ra bản vá.
