---
tieuDe: "Giả Lập Vị Trí 5.1 cho Windows: sửa lỗi tải về bấm không chạy"
moTa: "Bản 5.0 giải nén ra tên file bị vỡ nên nhiều máy bấm vào không chạy được. Bản 5.1 sửa chuyện đó, và nói rõ khi máy tính còn thiếu trình điều khiển của Apple."
ngayDang: 2026-08-27
chuyenMuc: "cap-nhat"
thuocPhanMem: "gia-lap-vi-tri"
tags: ["giả lập vị trí", "windows", "cập nhật"]
noiBat: true
---

Bản **5.1** phát hành cho Windows. Ai đang dùng 5.0 mà thấy phần mềm không chạy hoặc không nhận iPhone thì tải bản này.

## Sửa lỗi tải về bấm không chạy

Bản 5.0 đóng gói với tên file có dấu tiếng Việt. File nén được tạo trên máy Mac, mà cách nén đó không đánh dấu bảng mã cho Windows biết, nên sang máy Windows giải nén ra thì cái tên biến thành một dãy ký tự vỡ vụn. Nhiều máy bấm vào không mở được gì cả.

Bản 5.1 đổi tên file thành `GiaLapViTri.exe` không dấu. Tên hiện trên cửa sổ phần mềm vẫn là "Giả Lập Vị Trí" như cũ.

## Nói rõ khi máy tính thiếu trình điều khiển Apple

Đây là chuyện gây hiểu nhầm nhiều nhất. Windows **không tự biết đọc iPhone** — phải có app **Apple Devices** của Apple cài sẵn thì mới nhận máy qua cáp. Máy nào chưa cài thì cắm cáp kiểu gì phần mềm cũng không thấy iPhone.

Trước đây gặp cảnh đó phần mềm chỉ báo cụt lủn "Chưa thấy máy. Cắm cáp + Tin cậy." — đọc xong không biết phải làm gì tiếp.

Từ 5.1, phần mềm tự kiểm tra máy tính rồi nói thẳng vấn đề:

- Chưa cài Apple Devices → hiện khung cảnh báo kèm **nút mở thẳng trang cài**.
- Đã cài nhưng dịch vụ đang tắt → có nút bật lại ngay trong phần mềm.
- iPhone chưa bấm Tin cậy, hoặc đang khoá màn hình → nói rõ từng trường hợp.

Cắm cáp vào là phần mềm tự nhận, không phải bấm "Tìm lại" nữa.

## Hướng dẫn nằm ngay trong phần mềm

Thêm mục hướng dẫn có hình, chia ba thẻ: **iPhone / iPad**, **Android**, và **Cài trình điều khiển Windows**. Phần iPhone dùng đúng bộ ảnh chụp màn hình chỉ chỗ bật Chế độ nhà phát triển.

## Bản đồ dễ nhìn hơn

- Chấm vị trí nhấp nháy lan toả giống bản Mac, nhìn là biết đang đứng ở đâu.
- Thêm ô **tìm địa chỉ** ngay trên bản đồ: gõ "Hồ Gươm, Hà Nội" là nhảy tới.
- Chưa kết nối iPhone mà bấm đặt vị trí thì phần mềm nói rõ lý do, thay vì im lặng không phản ứng.

## Cập nhật thế nào

Tải bản mới ở [trang phần mềm](/phan-mem/gia-lap-vi-tri/), giải nén rồi chạy. Khoá kích hoạt giữ nguyên, không phải nhập lại.

Các bước cài chi tiết nằm trong bài [Hướng dẫn cài và kích hoạt Giả Lập Vị Trí](/bai-viet/huong-dan-cai-gia-lap-vi-tri/).
