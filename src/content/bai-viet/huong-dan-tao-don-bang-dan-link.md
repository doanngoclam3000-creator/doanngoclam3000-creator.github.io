---
tieuDe: "Phần Mềm Order: tạo đơn chỉ bằng cách dán link 1688"
moTa: "Cách dán một loạt link sản phẩm để phần mềm tự dựng đơn theo từng shop, chốt giá và copy báo giá gửi khách qua Zalo."
ngayDang: 2026-08-14
chuyenMuc: "huong-dan"
thuocPhanMem: "phan-mem-order"
tags: ["phần mềm order", "1688", "hướng dẫn"]
noiBat: true
---

Đây là chức năng nhiều người dùng nhất trong Phần Mềm Order. Nắm được nó là làm đơn nhanh gấp mấy lần gõ tay.

## Bước 1: Cài đặt ban đầu (chỉ làm một lần)

Vào **Cài đặt** và điền:

- **Tỉ giá lẻ** và **tỉ giá sỉ** — hai mức bạn áp cho hai nhóm khách khác nhau.
- **Giá vốn tệ** — giá bạn thực sự mua tệ vào, dùng để tính lãi thật.
- **Phí dịch vụ** — phần trăm hoặc số tiền cố định bạn thu.
- **Số tài khoản ngân hàng** — để in vào tin nhắn báo giá.

Sau đó vào **Kho Trung Quốc** lưu sẵn địa chỉ kho của bạn. Khi đặt hàng trên 1688 chỉ cần bấm copy là dán được thẳng vào ô địa chỉ.

## Bước 2: Dán link để tạo đơn

Bấm **Tạo đơn**, chọn khách, rồi dán vào ô nhập theo quy tắc:

- Dòng nào **bắt đầu bằng `http`** là một **shop mới**.
- Các dòng ngay dưới đó là **sản phẩm của shop ấy**.

Phần mềm tự tách thành cây shop → mã hàng, không cần bạn gõ lại gì.

## Bước 3: Chốt giá

Mở đơn vừa tạo, điền số lượng và giá tệ cho từng mã. Phần mềm tự quy đổi ra tiền Việt theo tỉ giá của khách đó và cộng phí dịch vụ.

Muốn thêm chi phí phát sinh (ship nội địa Trung Quốc, cước cân), mở sheet **Chi phí** — phần mềm sẽ phân bổ khoản đó về từng mã hàng theo tỉ trọng, không phải chia tay.

## Bước 4: Gửi báo giá cho khách

Bấm nút **Copy báo giá**. Phần mềm dựng sẵn một tin nhắn hoàn chỉnh gồm danh sách hàng, thành tiền, tổng cộng và số tài khoản. Mở Zalo dán vào là xong.

## Bước 5: Ghi nhận tiền và theo dõi

- Khách chuyển tiền → mở đơn, bấm **Ghi nhận thanh toán**, nhập số tiền. Khách trả nhiều đợt cũng ghi được từng đợt.
- Vào **Sổ khách hàng** để xem ai còn nợ bao nhiêu.
- Màn hình **Cần nhắn** liệt kê những khách đang chờ bạn trả lời, không sợ bỏ sót.
- Vào **Báo cáo** xem doanh thu và lợi nhuận theo tháng.

---

Mẹo: giữ thói quen ghi nhận thanh toán ngay lúc nhận được tiền. Để dồn đến cuối ngày là bắt đầu lệch sổ.
