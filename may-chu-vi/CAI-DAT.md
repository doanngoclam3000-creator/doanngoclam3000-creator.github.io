# Máy chủ ví phanmemtq.com

Tài khoản khách + ví tiền cho website. Khách đăng ký, nạp tiền bằng chuyển khoản
ngân hàng, mua key phần mềm trừ thẳng vào ví, và rút phần tiền chưa tiêu về
tài khoản ngân hàng của chính họ.

- **Mã nguồn:** `worker.js` (Cloudflare Worker)
- **Kho dữ liệu:** D1 `vi-phanmemtq` — id `a253f3c6-cebd-409c-9500-996325069b57`
- **Địa chỉ:** `https://vi-phanmemtq.phanmemtq.workers.dev`
- **Trang khách:** `/tai-khoan/dang-ky/`, `/tai-khoan/dang-nhap/`, `/tai-khoan/`
- **Trang chủ shop:** `/tai-khoan/quan-tri/`

## Cài đặt

```
cd may-chu-vi
node cai-dat.cjs
```

Script tự bốc chuỗi bí mật, tự lấy `secret` / địa chỉ / mã quản trị của ba máy chủ
bản quyền trong `%APPDATA%\Tao Key\san-pham.json` rồi triển khai. Chạy xong nó in
ra **mã quản trị** và **token webhook SePay** — chép lại hai chuỗi đó.

Chạy lại lần sau vẫn ra đúng chuỗi cũ (đọc từ `.bi-mat.json`), khách không bị văng.

### Còn một việc phải làm tay: khai webhook trên SePay

Vào <https://my.sepay.vn> → **Webhooks** → *Thêm webhook*:

| Ô | Điền |
|---|---|
| Tên | `vi phanmemtq` |
| URL | `https://vi-phanmemtq.phanmemtq.workers.dev/webhook/sepay` |
| Kiểu xác thực | API Key |
| API Key | *token webhook mà `cai-dat.cjs` in ra* |
| Tài khoản | Tất cả |
| Sự kiện | Chỉ tiền vào |

Webhook này **không đụng** vào ba webhook cũ của Bot Zalo / Shopee / Order:
nó chỉ ăn giao dịch có nội dung `NAP<mã>`, còn `BZ…`, `ST…`, `PMO…` thì bỏ qua.

## Cách tiền chạy

```
Khách chuyển khoản  ──►  SePay  ──►  /webhook/sepay  ──►  cộng vào ví
                                     (nội dung NAP<mã của khách>)

Khách bấm Mua key   ──►  trừ ví  ──►  gọi /admin/sua của máy chủ bản quyền
                                      (cộng thẳng ngày cho mã máy)
                                      ──► hỏng thì HOÀN TIỀN ngay

Khách bấm Rút tiền  ──►  trừ ví (giữ tiền lại)  ──►  chủ shop chuyển khoản tay
                                                     ──► bấm "Đã trả"
                                                     ──► hoặc Từ chối = hoàn lại
```

## Vì sao dùng D1 chứ không dùng KV

Các máy chủ bản quyền dùng KV vì chỉ ghi ngày hết hạn. Ví thì khác: KV là kho
"eventually consistent", hai yêu cầu mua cùng lúc đọc ra cùng một số dư cũ rồi
ghi đè nhau — khách mua được hai key mà chỉ trừ một lần tiền. D1 là SQLite thật.

Mọi lần trừ/cộng đều đi qua hàm `ghiSo()`: đọc số dư ra, rồi ghi cả cụm bằng
`DB.batch()` (D1 chạy cả cụm trong **một** giao dịch). Câu `UPDATE` chỉ ăn khi số dư
vẫn đúng bằng lúc đọc; các câu còn lại đều kèm điều kiện "số dư đã bằng số mới"
nên update trượt là không câu nào ghi được. Ai đó sửa số dư xen giữa thì vòng lặp
thử lại. Đã thử thật: bấm mua 10 lần cùng lúc khi ví chỉ đủ 3 lần → đúng 3 đơn.

Cột `ma_ngoai` trong `so_cai` có khoá duy nhất, nên SePay gọi lại webhook lần hai
là bị chặn ngay ở tầng CSDL, không cộng hai lần.

## Bảng dữ liệu

| Bảng | Chứa gì |
|---|---|
| `nguoi_dung` | tài khoản, số dư, mã nạp, tài khoản ngân hàng để rút |
| `so_cai` | **mọi** biến động tiền, chỉ thêm chứ không bao giờ sửa/xoá |
| `don_key` | đơn mua key: phần mềm, gói, mã máy, key đã cấp |
| `yeu_cau_rut` | yêu cầu rút tiền và trạng thái xử lý |

Cộng hết `so_cai.so_tien` của một người phải ra đúng `nguoi_dung.so_du` — muốn soát
sổ thì chạy:

```
npx wrangler d1 execute vi-phanmemtq --remote --command \
  "SELECT n.id, n.email, n.so_du, COALESCE(SUM(s.so_tien),0) tinh_lai \
   FROM nguoi_dung n LEFT JOIN so_cai s ON s.nguoi=n.id GROUP BY n.id \
   HAVING n.so_du <> tinh_lai"
```

Không ra dòng nào là sổ sách khớp.

## Đường dẫn

Khách (kèm `Authorization: Bearer <token>`):
`/dk` `/dn` `/toi` `/doi-mat-khau` `/ngan-hang` `/nap` `/so-cai` `/bang-gia`
`/mua` `/don` `/rut`

Chủ shop (kèm `Authorization: Apikey <mã quản trị>`):
`/admin/tong-quan` `/admin/nguoi` `/admin/so-cai` `/admin/tien` `/admin/khoa`
`/admin/don` `/admin/rut`

## Sửa giá / thêm phần mềm

Sửa `PHAN_MEM` và `GOI` ở đầu `worker.js` rồi chạy lại `node cai-dat.cjs`.
Phần mềm nào có `tienTo` + máy chủ bản quyền thì cấp key tự động; không có thì
đơn nằm ở mục *Đơn chờ cấp key tay* trong trang quản trị.

## Rút tiền — vì sao phải chuyển khoản tay

SePay chỉ **đọc** tiền vào, không chuyển tiền ra được. Muốn máy tự chuyển khoản
phải có API chi hộ của ngân hàng doanh nghiệp. Khi nào có thì chỉ cần thay đúng
chỗ xử lý `viec === 'tra'` trong `/admin/rut`, phần còn lại giữ nguyên.

Quy tắc đang áp: chỉ rút được về tài khoản ngân hàng **đứng tên chính khách**, và
không có đường chuyển tiền giữa hai tài khoản khách với nhau — cố ý làm vậy để ví
không thành dịch vụ trung gian thanh toán (thứ cần giấy phép của Ngân hàng Nhà nước).

## Ba cái bẫy của Cloudflare đã vấp (đừng sửa ngược lại)

1. **PBKDF2 tối đa 100.000 vòng.** Để 210.000 thì hàm băm mật khẩu ném lỗi, khách
   đăng ký nhận `error code: 1101`. Chạy `wrangler dev` ở máy KHÔNG lộ ra vì bản
   chạy máy không áp giới hạn này.
2. **Worker không fetch sang Worker khác cùng tài khoản được** — trả về 404 kèm
   `error code: 1042`. Vì vậy phần mua key đi qua **service binding**
   (`SV_BZ` / `SV_ST` / `SV_PMO` khai trong `wrangler.toml`) chứ không gọi địa chỉ
   `cap-key-*.workers.dev`. Thêm phần mềm mới có máy chủ bản quyền thì nhớ khai
   thêm một `[[services]]`, không thì đơn sẽ hỏng và tự hoàn tiền.
3. **Lớp CSS `.the` đã có sẵn** trong `global.css` (thẻ card, `display:flex`).
   Trang ví dùng `.hop`. Đặt trùng tên là `el.hidden = true` không ẩn được.

Và một cái bẫy của Astro: HTML do script chèn ra sau **không** mang dấu phạm vi
`data-astro-cid-*`, nên style viết trong `<style>` của trang không ăn vào. Mọi lớp
dùng cho phần chèn động phải nằm trong `src/styles/tai-khoan.css`.

## Link tải bị khoá sau đăng nhập

HTML của website **không còn chứa link tải thật**, chỉ còn mã phần mềm. Bấm nút tải
là trang hỏi `GET /lien-ket?pm=<mã>` kèm token; chưa đăng nhập thì bị đẩy sang trang
đăng nhập.

Bảng link nằm trong `lien-ket.json`, sinh tự động từ `src/content/phan-mem/*.md` bằng
`lay-lien-ket.cjs` — chạy sẵn trong `npm run build` và trong `cai-dat.cjs`. **Đổi link
tải trong tệp .md thì phải chạy lại `node cai-dat.cjs`**, không thì Worker vẫn trả link cũ.

**Cổng này chặn người vào web bình thường, không chặn được người cố tìm.** Link tải
vẫn nằm ở hai chỗ công khai:
- `phanmemtq.com/phien-ban.json` — các app đã phát hành gọi vào đó để tự cập nhật,
  bỏ đi là hỏng nút cập nhật của khách cũ.
- Kho GitHub của website là kho công khai, mở `src/content/phan-mem/*.md` là thấy.

Muốn khoá chặt thật thì phải chuyển file cài đặt sang chỗ khác (ví dụ Cloudflare R2)
rồi cho Worker ký đường dẫn tạm — lúc đó mới không ai lấy được link vĩnh viễn.
