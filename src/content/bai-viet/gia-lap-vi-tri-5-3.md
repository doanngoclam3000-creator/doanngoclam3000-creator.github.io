---
tieuDe: "Giả Lập Vị Trí 5.3 cho Windows: nhận iPhone trở lại"
moTa: "Bản 5.1 cắm cáp vào vẫn không dò ra iPhone vì bộ Python đi kèm thiếu một gói dành riêng cho Windows. Bản 5.2 sửa chuyện đó."
ngayDang: 2026-08-27
chuyenMuc: "cap-nhat"
thuocPhanMem: "gia-lap-vi-tri"
tags: ["giả lập vị trí", "windows", "cập nhật"]
noiBat: true
---

Bản **5.3** phát hành cho Windows. Ai đang dùng bản 5.0, 5.1 hay 5.2 đều nên tải bản này.

## Sửa lỗi không dò được iPhone

Bản 5.1 cắm cáp vào vẫn báo "Chưa thấy thiết bị nào", kèm dòng lỗi:

> ModuleNotFoundError: No module named 'win32security'

Bộ Python đi kèm phần mềm được đóng gói trên máy Mac. Trong danh sách thư viện của `pymobiledevice3` có một gói ghi rõ "chỉ cài khi chạy trên Windows" — đóng gói trên máy Mac nên điều kiện đó không đúng và gói bị bỏ qua. Sang máy Windows chạy thì thiếu, và thiếu ngay ở bước đầu tiên nên không dò được máy nào cả.

Bản 5.2 đã kèm đủ gói đó. Cắm cáp là nhận máy như thường.

## Không thấy máy Android thì nói rõ vướng ở đâu

Trước đây máy Android không hiện ra thì chỉ báo cụt lủn "Chưa thấy máy. Bật Gỡ lỗi USB." Giờ phần mềm phân biệt được từng trường hợp:

- **Điện thoại chưa cho phép gỡ lỗi USB** — nhắc nhìn màn hình điện thoại để bấm OK.
- **Máy đang offline** — bảo rút cáp cắm lại.
- **Không thấy gì cả** — nhắc bật Gỡ lỗi USB, dùng cáp truyền dữ liệu, và khi cắm nhớ chọn chế độ Truyền tệp (MTP) chứ đừng để "Chỉ sạc".

## Sửa lỗi tải về bấm không chạy

Bản 5.0 đóng gói với tên file có dấu tiếng Việt. File nén được tạo trên máy Mac, mà cách nén đó không đánh dấu bảng mã cho Windows biết, nên sang máy Windows giải nén ra thì cái tên biến thành một dãy ký tự vỡ vụn. Nhiều máy bấm vào không mở được gì cả.

Từ bản 5.1 đổi tên file thành `GiaLapViTri.exe` không dấu. Tên hiện trên cửa sổ phần mềm vẫn là "Giả Lập Vị Trí" như cũ.

## Nói rõ khi máy tính thiếu trình điều khiển Apple

Đây là chuyện gây hiểu nhầm nhiều nhất. Windows **không tự biết đọc iPhone** — phải có app **Apple Devices** của Apple cài sẵn thì mới nhận máy qua cáp. Máy nào chưa cài thì cắm cáp kiểu gì phần mềm cũng không thấy iPhone.

Trước đây gặp cảnh đó phần mềm chỉ báo cụt lủn "Chưa thấy máy. Cắm cáp + Tin cậy." — đọc xong không biết phải làm gì tiếp.

Phần mềm tự kiểm tra máy tính rồi nói thẳng vấn đề:

- Chưa cài Apple Devices → hiện khung cảnh báo kèm **nút mở thẳng trang cài**.
- Đã cài nhưng dịch vụ đang tắt → có nút bật lại ngay trong phần mềm.
- iPhone chưa bấm Tin cậy, hoặc đang khoá màn hình → nói rõ từng trường hợp.

Cắm cáp vào là phần mềm tự nhận, không phải bấm "Tìm lại" nữa.

## Nhận lại các key cấp theo lối cũ

Loại key mở khoá theo **số ngày** (thay vì theo gói tháng) hồi đầu đánh dấu bằng chữ `D` ở đầu, sau đổi sang chữ `N`. Phần mềm chỉ hiểu chữ `N`, nên khách nào cầm key cấp theo lối cũ thì nhập vào chỉ báo cụt lủn *"Key không đúng"* — dù key đó hoàn toàn hợp lệ.

Từ bản 5.3 phần mềm nhận cả hai. Key cũ, key mới, key theo gói tháng đều dùng được, và vẫn gắn với đúng một máy như trước.

## File nén nay bọc trong một thư mục

Trước đây mở file .zip ra là thấy 18 thứ nằm lổn nhổn ngay ở gốc. Ai kéo thẳng đống đó vào Downloads thì mười mấy nghìn tệp đổ lẫn vào chỗ có sẵn, và nếu bấm chạy khi máy còn đang chép dở thì Windows báo:

> The code execution cannot proceed because ffmpeg.dll was not found.

Không phải phần mềm hỏng — chỉ là `GiaLapViTri.exe` chưa có đủ các tệp nằm cạnh nó.

Giờ mở file .zip ra chỉ thấy **một thư mục `GiaLapViTri`**, bên trong có sẵn tờ `DOC-TRUOC-KHI-CHAY.txt`. Cứ giải nén xong, mở thư mục đó, chạy `GiaLapViTri.exe`. Muốn để ra Desktop thì kéo cả thư mục, hoặc tạo lối tắt.

## Hướng dẫn nằm ngay trong phần mềm

Thêm mục hướng dẫn có hình, chia ba thẻ: **iPhone / iPad**, **Android**, và **Cài trình điều khiển Windows**. Phần iPhone dùng đúng bộ ảnh chụp màn hình chỉ chỗ bật Chế độ nhà phát triển.

## Bản đồ dễ nhìn hơn

- Chấm vị trí nhấp nháy lan toả giống bản Mac, nhìn là biết đang đứng ở đâu.
- Thêm ô **tìm địa chỉ** ngay trên bản đồ: gõ "Hồ Gươm, Hà Nội" là nhảy tới.
- Chưa kết nối iPhone mà bấm đặt vị trí thì phần mềm nói rõ lý do, thay vì im lặng không phản ứng.

## Cập nhật thế nào

Tải bản mới ở [trang phần mềm](/phan-mem/gia-lap-vi-tri/), giải nén rồi chạy. Khoá kích hoạt giữ nguyên, không phải nhập lại.

Các bước cài chi tiết nằm trong bài [Hướng dẫn cài và kích hoạt Giả Lập Vị Trí](/bai-viet/huong-dan-cai-gia-lap-vi-tri/).
