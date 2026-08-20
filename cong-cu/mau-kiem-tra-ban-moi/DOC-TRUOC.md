# Bắt người dùng cập nhật bản mới

Phần mềm trên **iPhone** cài qua TestFlight nên Apple lo phần cập nhật giúp. Nhưng phần mềm
trên **Mac và Windows** tải bằng link Google Drive thì máy khách không tự biết có bản mới —
phải để chính phần mềm hỏi website.

## Cách chạy

Website xuất ra một địa chỉ máy đọc được:

**https://phanmemtq.com/phien-ban.json**

Mỗi lần mở lên, phần mềm gọi vào địa chỉ này, so số phiên bản của mình với số trên web:

| Tình huống | Phần mềm làm gì |
| --- | --- |
| Bản đang dùng **cũ hơn `banToiThieu`** | Hiện bảng **bắt buộc cập nhật**, không cho dùng tiếp |
| Bản đang dùng **cũ hơn `phienBan`** | Nhắc nhẹ, cho phép để sau |
| Bản đang dùng bằng hoặc mới hơn | Không hiện gì |
| Máy không có mạng | Không hiện gì, dùng bình thường |

## Đặt hai ô này ở đâu

Mở app **Soạn Bài Website** → tab **Phần mềm** → chọn phần mềm:

- **Phiên bản** — số bản mới nhất bạn vừa phát hành, ví dụ `3.2`
- **Bản tối thiểu bắt buộc** — để trống thì chỉ nhắc nhẹ. Điền số vào là bắt buộc:
  ai đang chạy bản cũ hơn số này sẽ **không dùng tiếp được** cho tới khi tải bản mới.
- **Ghi chú bản mới** — một câu ngắn hiện trong bảng nhắc, ví dụ *"Sửa lỗi mất kết nối iPhone"*

Bấm **Lưu** rồi **Đăng lên web** là xong. Khoảng 1–2 phút sau mọi máy khách đều biết.

## Gắn vào phần mềm macOS

Kéo file `KiemTraBanMoi.swift` vào project Xcode, rồi gọi một dòng lúc app khởi động:

```swift
func applicationDidFinishLaunching(_ n: Notification) {
    KiemTraBanMoi.chay(maPhanMem: "gia-lap-vi-tri", banHienTai: "3.1")
    // ... phần còn lại
}
```

`maPhanMem` chính là tên file markdown trên web (`gia-lap-vi-tri`, `ban-te`, `phan-mem-order`...).

## Quan trọng: giữ nguyên link Google Drive khi ra bản mới

Đừng tải file mới lên thành một file khác — link sẽ đổi và bạn phải sửa lại web mỗi lần.

Thay vào đó, trên Google Drive:

1. Bấm chuột phải vào file cũ → **Quản lý phiên bản**
2. Bấm **Tải phiên bản mới lên**, chọn file mới
3. Xong

Link giữ nguyên y hệt, ai bấm vào cũng nhận được bản mới nhất. Bạn chỉ cần đổi số **Phiên bản**
trong app Soạn Bài, không phải đụng tới link.
