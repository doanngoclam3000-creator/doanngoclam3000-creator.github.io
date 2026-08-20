# Website Phần Mềm Việt

Website giới thiệu và phát hành các phần mềm tự phát triển. Chạy bằng [Astro](https://astro.build), tự động deploy lên GitHub Pages mỗi khi push lên nhánh `main`.

## Cách dễ nhất: dùng phần mềm Soạn Bài Website

Mở **Soạn Bài Website** trong thư mục Applications (cài từ file `Soan Bai Website.dmg`). Phần mềm mở ra cửa sổ riêng, trong đó bạn có thể:

- Xem danh sách toàn bộ bài viết và phần mềm
- Viết bài mới, sửa bài cũ, xoá bài
- **Kéo thả ảnh và video** vào để tải lên
- Dán link YouTube làm video hướng dẫn
- Bấm **Xem thử** để xem bài hiện lên web trông thế nào
- Bấm **Đăng lên web** là tự đẩy lên GitHub, 1–2 phút sau website cập nhật

Phím tắt: **Cmd + S** lưu bài · **Cmd + R** tải lại · **Cmd + P** mở website xem thử.

### Dựng lại app sau khi sửa

Nếu sửa file `cong-cu/giao-dien.html` hoặc `cong-cu/soan-bai.mjs`, chạy lệnh sau để dựng lại app và file DMG:

```bash
cong-cu/app-macos/dung-app.sh
```

File DMG mới sẽ nằm ngoài Desktop.

### Về video

- **Video dài** (trên 90MB): tải lên YouTube trước, rồi dán link vào ô *Video hướng dẫn*. Đây là cách nên dùng.
- **Video ngắn**: kéo thẳng file vào ô tải lên. File sẽ nằm trong thư mục `public/video/`.

> GitHub giới hạn mỗi file tối đa 100MB. Video dài hãy dùng YouTube.

---

## Cách thủ công: viết file markdown

### Đăng một bài viết
Tạo file mới trong `src/content/bai-viet/`, ví dụ `ten-bai-viet.md`:

```markdown
---
tieuDe: "Tiêu đề bài viết"
moTa: "Mô tả ngắn, hiện ở trang danh sách và Google."
ngayDang: 2026-08-20
chuyenMuc: "cap-nhat"        # cap-nhat | huong-dan | thu-thuat | tin-tuc
thuocPhanMem: "ban-te"       # tuỳ chọn, tên file phần mềm liên quan
tags: ["từ khoá 1", "từ khoá 2"]
noiBat: false
---

Nội dung bài viết viết bằng markdown ở đây.

## Đề mục lớn

- gạch đầu dòng
- **chữ đậm**
```

Tên file chính là đường dẫn: `ten-bai-viet.md` → `/bai-viet/ten-bai-viet`.

### Thêm một phần mềm
Tạo file mới trong `src/content/phan-mem/`:

```markdown
---
ten: "Tên phần mềm"
moTa: "Mô tả ngắn một câu."
nenTang: ["macOS", "Windows"]
phienBan: "1.0"
ngayCapNhat: 2026-08-20
gia: "Liên hệ"
linkTai: "https://link-tai-ve"
icon: "📦"
mauNen: "#2563eb"
thuTu: 7
---

Nội dung trang phần mềm.
```

### Đăng lên web
```bash
git add .
git commit -m "Them bai viet moi"
git push
```
Khoảng 1–2 phút sau website tự cập nhật.

## Chạy thử trên máy
```bash
npm install
npm run dev      # mở http://localhost:4321
npm run build    # build ra thư mục dist
```

## Sửa thông tin chung
Mở `src/config.ts` để đổi tên website, khẩu hiệu, Facebook, Zalo, email và danh sách chuyên mục.
