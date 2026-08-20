# Website Phần Mềm Việt

Website giới thiệu và phát hành các phần mềm tự phát triển. Chạy bằng [Astro](https://astro.build), tự động deploy lên GitHub Pages mỗi khi push lên nhánh `main`.

## Cách đăng bài mới

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
