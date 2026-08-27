---
tieuDe: "Hướng dẫn cài và kích hoạt Giả Lập Vị Trí (Mac và Windows)"
moTa: "Các bước cài đặt Giả Lập Vị Trí trên máy tính, bật Chế độ nhà phát triển trên iPhone và kích hoạt phần mềm."
ngayDang: 2026-08-19
anh: "/anh/gia-lap-vi-tri/1-chon-vi-tri.svg"
chuyenMuc: "huong-dan"
thuocPhanMem: "gia-lap-vi-tri"
video: "https://youtu.be/GC6kPz9QlmQ"
tags: ["giả lập vị trí", "cài đặt", "iPhone", "Android", "video"]
noiBat: true
---

Video bên trên quay lại toàn bộ quá trình trên Windows, từ lúc cài đến khi vị trí đã đổi trên iPhone. Xem hết mất khoảng ba phút.

Bên dưới là các bước viết bằng chữ, tiện cho ai muốn dò lại từng chỗ.

Làm theo đúng thứ tự dưới đây là dùng được. Cả hai hệ điều hành đều chỉ cần **một file duy nhất**.

## A. Nếu bạn dùng Windows

### 1. Cài app Apple Devices trước
Đây là bước hay bị bỏ qua nhất, và bỏ qua là phần mềm **không nhìn thấy iPhone** dù cắm cáp thế nào.

Windows không tự biết đọc iPhone. Phải có app **Apple Devices** của chính Apple (miễn phí, tải ở Microsoft Store — hoặc cài iTunes tải từ apple.com, đừng dùng bản iTunes cũ trên Microsoft Store). Cài xong **mở app đó lên một lần** để Windows nạp trình điều khiển, rồi hãy sang bước sau.

### 2. Giải nén
Bấm **chuột phải** vào file `GiaLapViTri-5.3-Windows.zip` → **Extract All...** → **Extract**.

**Đợi giải nén xong hẳn** rồi mới sang bước sau. Bên trong có một thư mục tên `GiaLapViTri`.

> Đừng mở file .zip lên rồi kéo ruột nó ra ngoài, cũng đừng bấm chạy khi còn đang xem bên trong file .zip.

### 3. Chạy phần mềm
Mở thư mục `GiaLapViTri`, bấm đúp vào `GiaLapViTri.exe`.

Windows sẽ hiện một bảng cảnh báo màu xanh — bấm **More info**, rồi bấm **Run anyway**. Phần mềm chưa mua chữ ký số của Microsoft nên lần đầu nào cũng bị hỏi như vậy.

> **Để nguyên cả thư mục.** Đừng tách riêng file `GiaLapViTri.exe` ra Desktop hay chỗ khác — nó cần mấy chục file nằm cùng thư mục. Tách ra sẽ báo lỗi *"The code execution cannot proceed because ffmpeg.dll was not found"*. Muốn để ngoài Desktop cho tiện thì kéo **cả thư mục** ra, hoặc chuột phải vào file .exe chọn **Send to → Desktop (create shortcut)**.

### 4. Chuẩn bị iPhone
- Cắm cáp iPhone vào máy tính, trên iPhone bấm **Tin cậy máy tính này**.
- Vào **Cài đặt → Quyền riêng tư & Bảo mật → Chế độ nhà phát triển**, bật lên.
- **Khởi động lại iPhone.**

### 5. Kích hoạt
Mở phần mềm, quét mã QR hiện trong đó để thanh toán. Vài giây sau phần mềm tự kích hoạt và dùng được ngay.

### Nếu phần mềm báo "Chưa thấy thiết bị nào"

Phần mềm tự dò xem thiếu gì và hiện luôn cách sửa. Ba nguyên nhân theo thứ tự hay gặp:

1. **Chưa cài Apple Devices** — quay lại bước 1. Phần mềm sẽ hiện một khung màu cam kèm nút mở thẳng trang cài.
2. **Cáp chỉ sạc được, không truyền được dữ liệu** — cáp rẻ tiền thường chỉ có hai dây điện. Đổi sang cáp đi kèm máy, và cắm thẳng vào máy tính chứ đừng qua bộ chia (hub).
3. **iPhone chưa bấm Tin cậy** — mở khoá màn hình iPhone, bảng "Tin cậy máy tính này?" sẽ hiện lên, bấm **Tin cậy** rồi nhập mật mã.

---

## B. Nếu bạn dùng Mac

### 1. Cài đặt
Mở file `GiaLapViTri-macOS.dmg`, kéo biểu tượng phần mềm thả vào thư mục **Applications**.

### 2. Mở lần đầu
Vào **Applications**, **bấm chuột phải** vào phần mềm → chọn **Open** → bấm **Open** một lần nữa.

> Chỉ cần làm cách này ở lần mở đầu tiên. Những lần sau mở bình thường như mọi ứng dụng khác.

### 3. Chuẩn bị iPhone
- Cắm cáp iPhone vào máy, trên iPhone bấm **Tin cậy máy tính này**.
- Vào **Cài đặt → Quyền riêng tư & Bảo mật → Chế độ nhà phát triển**, bật lên.
- **Khởi động lại iPhone.**

### 4. Kích hoạt
Mở phần mềm, quét mã QR trong đó để thanh toán. Vài giây sau tự kích hoạt.

---

## Cài xong rồi dùng thế nào

![Chọn vị trí trên bản đồ](/anh/gia-lap-vi-tri/1-chon-vi-tri.svg)

Cắm máy vào máy tính, phần mềm nhận ra là hiện tên ngay ở góc dưới. Từ đó bạn có hai cách đặt vị trí:

- **Bấm thẳng vào bản đồ** — chạm chỗ nào là nhảy tới chỗ đó, không cần bấm thêm nút xác nhận.
- **Gõ tên địa điểm** vào ô tìm kiếm phía trên, chọn kết quả là xong.

Những chỗ hay dùng thì lưu lại thành vị trí yêu thích, lần sau chọn trong danh sách chỉ mất một giây.

![Vẽ tuyến đường và chọn tốc độ di chuyển](/anh/gia-lap-vi-tri/2-mo-phong-di-chuyen.svg)

Muốn giả lập đang di chuyển chứ không đứng yên, vẽ một tuyến đường trên bản đồ rồi chọn tốc độ: đi bộ, chạy bộ, xe máy hoặc ô tô. Vị trí sẽ nhích dần theo tuyến như đang đi thật.

Xong việc thì bấm nút trả về vị trí thật, máy quay lại định vị bình thường.

---

## Hay gặp lỗi gì

| Hiện tượng | Cách xử lý |
| --- | --- |
| Không thấy mục Chế độ nhà phát triển | Cắm iPhone vào máy tính và mở phần mềm lên một lần, mục này mới hiện ra |
| Máy tính không nhận iPhone | Đổi cáp khác (cáp sạc rẻ tiền thường không truyền dữ liệu), đổi cổng USB |
| Mac báo "chưa xác minh nhà phát triển" | Bấm chuột phải vào app rồi chọn Open như bước 2 |
| Kích hoạt xong vẫn báo chưa kích hoạt | Đóng hẳn phần mềm rồi mở lại |

Còn vướng chỗ nào cứ nhắn cho tôi.
