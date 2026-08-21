---
tieuDe: "Giả Lập Vị Trí 4.1: sửa lỗi iPhone chạy iOS 14 và 15 không đặt được vị trí"
moTa: "Bản 4.1 sửa lỗi máy iPhone đời cũ báo kết nối thành công nhưng không đổi được vị trí, kèm thông báo lỗi đúng thay vì bảo đi bật một mục không tồn tại."
ngayDang: 2026-08-21
chuyenMuc: "cap-nhat"
thuocPhanMem: "gia-lap-vi-tri"
tags: ["giả lập vị trí", "cập nhật", "iOS"]
noiBat: true
---

Bản **4.1** phát hành cho cả macOS và Windows, sửa một lỗi khiến iPhone chạy **iOS 14 và iOS 15** không dùng được phần mềm.

## Lỗi cũ trông như thế nào

Cắm iPhone đời cũ vào, phần mềm báo kết nối bình thường:

> Đã kết nối iPhone — iOS 14.4.

Nhưng bấm đặt vị trí thì hiện lỗi:

> iPhone chưa mở kênh dành cho nhà phát triển. Thường là do Chế độ nhà phát triển chưa bật.

Câu này **sai hoàn toàn với máy đời cũ**. Apple chỉ thêm mục "Chế độ nhà phát triển" từ iOS 16, iPhone chạy iOS 14 hay 15 không hề có mục đó trong Cài đặt. Nhiều người tìm mãi không thấy nên tưởng phải nâng cấp iOS lên bản mới nhất mới dùng được — trong khi máy đời cũ vốn vẫn chạy tốt.

## Nguyên nhân thật

iPhone từ iOS 16 trở xuống cần một tệp gọi là **ảnh đĩa nhà phát triển** thì mới mở được kênh đổi vị trí. Lần đầu dùng, phần mềm phải tải tệp này về (khoảng 20 MB).

Bước tải ấy có thể hỏng — chủ yếu do máy tính không vào được mạng. Chỗ sai là phần mềm **nuốt mất lỗi**: gắn không xong nhưng vẫn báo "đã kết nối", để tới lúc bấm đặt vị trí mới ngã, mà lại ngã bằng một câu sai.

## Bản 4.1 sửa những gì

- **Báo lỗi ngay lúc kết nối.** Chưa gắn được ảnh đĩa thì dừng luôn tại đó và nói rõ lý do, không báo kết nối thành công nữa.
- **Thử lại hai lần** rồi mới chịu thua, thay vì thử đúng một lần như trước.
- **Thông báo đúng theo đời máy.** iPhone dưới iOS 16 sẽ không bao giờ bị bảo đi bật Chế độ nhà phát triển nữa.
- **Nới thời gian chờ tải** từ 120 lên 180 giây, đủ cho đường mạng chậm.
- **Tự gắn lại** nếu ảnh đĩa tuột ra sau khi iPhone khởi động lại, thay vì báo lỗi ngay.

## Cần làm gì

Tải lại bản mới ở trang phần mềm rồi cài đè lên bản cũ. Khoá kích hoạt giữ nguyên, không phải nhập lại.

Nếu iPhone của bạn chạy iOS 14 hoặc 15, nhớ **để máy tính vào được mạng trong lần chạy đầu tiên** — phần mềm cần tải tệp ảnh đĩa về một lần duy nhất, những lần sau thì không cần nữa.
