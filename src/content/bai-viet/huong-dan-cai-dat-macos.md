---
tieuDe: "Hướng dẫn cài phần mềm trên macOS khi máy báo chưa xác minh nhà phát triển"
moTa: "Mở được phần mềm trên macOS chỉ với vài bước, kể cả khi máy hiện cảnh báo không mở được vì chưa xác minh."
ngayDang: 2026-08-05
chuyenMuc: "huong-dan"
tags: ["macOS", "cài đặt", "hướng dẫn"]
noiBat: true
---

Rất nhiều bạn tải phần mềm về, bấm mở thì macOS hiện cảnh báo **"không thể mở vì chưa xác minh nhà phát triển"**. Đây là cơ chế bảo vệ mặc định của Apple, không phải phần mềm bị lỗi. Làm theo các bước dưới đây là mở được.

## Cách 1: Bấm chuột phải để mở

1. Mở thư mục **Applications** (Ứng dụng).
2. **Bấm chuột phải** vào phần mềm → chọn **Open**.
3. Hộp thoại hiện ra, bấm **Open** lần nữa.

Chỉ cần làm một lần duy nhất. Những lần sau mở bình thường như mọi ứng dụng khác.

## Cách 2: Cho phép trong Cài đặt hệ thống

1. Vào **System Settings → Privacy & Security** (Cài đặt hệ thống → Quyền riêng tư & Bảo mật).
2. Kéo xuống mục **Security**, bạn sẽ thấy dòng nhắc về phần mềm vừa bị chặn.
3. Bấm **Open Anyway**, nhập mật khẩu máy để xác nhận.

## Nếu vẫn không mở được

Trường hợp macOS báo file bị hỏng, thường là do trình duyệt gắn cờ cách ly khi tải. Mở **Terminal** và chạy lệnh sau, thay đường dẫn bằng tên phần mềm của bạn:

```bash
xattr -dr com.apple.quarantine /Applications/TenPhanMem.app
```

Sau đó mở lại phần mềm là được.

> Vẫn vướng ở bước nào, chụp màn hình gửi cho tôi — tôi hỗ trợ trực tiếp.
