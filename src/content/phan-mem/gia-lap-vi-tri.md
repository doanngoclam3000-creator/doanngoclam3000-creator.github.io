---
ten: "Vị Trí Pro"
moTa: "Đổi vị trí GPS của iPhone: dùng ngay trên iPhone, hoặc điều khiển từ máy tính Windows hay MacBook qua cáp. Một key dùng được cho cả điện thoại lẫn máy tính."
nenTang: ["iOS", "Windows", "macOS"]
phienBan: "1.0"
# Hai dòng dưới là mức ép cập nhật của app Giả Lập Vị Trí đời cũ (app đó vẫn hỏi mục này).
# Giữ nguyên để máy khách cũ không bị đổi cách chạy. Vị Trí Pro không dùng tới.
banToiThieu: "5.18"
banToiThieuMac: "5.20"
ngayCapNhat: 2026-11-17
ghiChuCapNhat: "- Vị Trí Pro thay cho Giả Lập Vị Trí\n- Có bản chạy ngay trên iPhone, bản cho máy tính Windows và bản cho MacBook\n- Mua key bằng mã QR ngay trong phần mềm, chuyển khoản xong là tự mở khoá"
gia: "300.000đ / tháng · 500.000đ / 2 tháng · 2.000.000đ vĩnh viễn"
anhIcon: "/icon/gia-lap-vi-tri.png"
icon: "📍"
mauNen: "#0f9d8f"
thuTu: 1
---

## Giới thiệu

**Vị Trí Pro** đổi vị trí GPS của iPhone sang bất kỳ điểm nào trên bản đồ. Phần mềm có ba bản, dùng chung một key:

| Bản | Dùng khi nào |
| --- | --- |
| **iPhone** | Đổi vị trí ngay trên điện thoại, không cần mang theo máy tính |
| **Windows** | Cắm iPhone vào máy tính Windows bằng cáp rồi điều khiển từ máy tính |
| **MacBook** | Cắm iPhone vào máy Mac bằng cáp rồi điều khiển từ máy Mac |

Vị Trí Pro thay cho phần mềm Giả Lập Vị Trí trước đây.

![Ghim một điểm trên bản đồ rồi bấm Dịch chuyển tới điểm ghim](/anh/vi-tri-pro/1-dich-chuyen.svg)

### Làm được gì

- **Dịch chuyển tới một điểm:** bấm lên bản đồ để ghim, hoặc tìm theo tên địa điểm, hoặc dán toạ độ, rồi bấm **Dịch chuyển tới điểm ghim**.
- **Cần điều khiển:** kéo núm trên bản đồ (bản máy tính dùng được cả phím mũi tên và W A S D) để đi lại như đang cầm máy đi thật.
- **Đi theo tuyến đường:** bấm thêm vài điểm lên bản đồ, phần mềm nối thành tuyến bám theo đường thật rồi tự đi. Có tạm dừng, đi tiếp, lặp đi – về.
- **Chọn tốc độ:** đi bộ, chạy, xe đạp, ô tô, hoặc kéo thanh trượt từ 1 đến 150 km/h.
- **Yêu thích và gần đây:** lưu những điểm hay dùng, lần sau bấm một cái là tới.
- **Nhập / xuất tuyến GPX.**
- **Về vị trí thật:** bấm một nút là iPhone quay lại định vị bình thường.

![Đi theo tuyến đường và dùng cần điều khiển](/anh/vi-tri-pro/2-tuyen-duong.svg)

## Tải về

<style>
.vtp-tai{position:relative;margin:1.4em 0;border:1px solid var(--vien);border-radius:20px;overflow:hidden;background:radial-gradient(700px 260px at 12% 0%,color-mix(in srgb,#0f9d8f 16%,transparent),transparent 70%),var(--nen-the)}
.vtp-tai::before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,transparent,#0f9d8f,transparent)}
.vtp-luoi{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;padding:22px}
.noi-dung a.vtp-nut{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:12px;color:#fff;text-decoration:none;word-break:normal;background:linear-gradient(135deg,#0f9d8f,#0a6259);box-shadow:0 6px 18px rgba(15,157,143,.32);transition:.18s ease}
.noi-dung a.vtp-nut:hover{color:#fff;transform:translateY(-2px);box-shadow:0 10px 26px rgba(15,157,143,.45)}
.noi-dung a.vtp-nut.tf{background:linear-gradient(135deg,#3aa9ff,#0a72e8);box-shadow:0 6px 18px rgba(10,114,232,.34)}
.noi-dung a.vtp-nut.phu{background:linear-gradient(135deg,#64748b,#1e293b);box-shadow:0 6px 18px rgba(30,41,59,.3)}
.noi-dung a.vtp-nut.hd{background:linear-gradient(135deg,#f59e0b,#d97706);box-shadow:0 6px 18px rgba(217,119,6,.34)}
.vtp-nut .i{font-size:1.35rem;width:34px;text-align:center;flex-shrink:0}
.vtp-nut .c{flex:1;line-height:1.3}
.vtp-nut .c b{display:block;font-size:.97rem}
.vtp-nut .c small{font-size:.78rem;opacity:.9}
.vtp-nut .m{font-size:1.1rem;opacity:.85}
.vtp-mot{display:block;max-width:420px;margin:1.1em 0}
.vtq{position:relative;margin:1.4em 0;padding:22px;border-radius:22px;display:grid;gap:22px;border:1.5px solid color-mix(in srgb,#0f9d8f 55%,var(--vien));background:radial-gradient(900px 320px at 0% 0%,color-mix(in srgb,#0f9d8f 20%,transparent),transparent 70%),radial-gradient(700px 300px at 100% 100%,color-mix(in srgb,#7c6cf0 16%,transparent),transparent 70%),var(--nen-the);box-shadow:0 0 0 4px color-mix(in srgb,#0f9d8f 10%,transparent),0 18px 50px color-mix(in srgb,#0f9d8f 22%,transparent)}
.vtq-nhom{display:grid;gap:10px}
.noi-dung p.vtq-ten{margin:0;display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;font-size:.84rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--chu)}
.vtq-ten::before{content:"";width:4px;height:16px;border-radius:2px;background:var(--mau,#0f9d8f)}
.vtq-nhom:nth-child(1){--mau:#2f8cf0}.vtq-nhom:nth-child(2){--mau:#0f9d8f}.vtq-nhom:nth-child(3){--mau:#7c6cf0}
.vtq-ten span{font-weight:500;letter-spacing:0;text-transform:none;color:var(--chu-nhat)}
.vtq-luoi{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.noi-dung a.vtq-o,.noi-dung a.vtq-hd{--mau:#0f9d8f;display:flex;align-items:center;gap:13px;min-height:70px;padding:13px 15px;border-radius:15px;border:1.5px solid color-mix(in srgb,var(--mau) 50%,var(--vien));background:linear-gradient(135deg,color-mix(in srgb,var(--mau) 22%,var(--nen-the)),color-mix(in srgb,var(--mau) 7%,var(--nen-the)));color:var(--chu);text-decoration:none;word-break:normal;box-shadow:0 4px 14px color-mix(in srgb,var(--mau) 16%,transparent);transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
.noi-dung a.vtq-o:hover,.noi-dung a.vtq-hd:hover{color:var(--chu);border-color:var(--mau);transform:translateY(-2px);box-shadow:0 10px 26px color-mix(in srgb,var(--mau) 38%,transparent)}
.noi-dung a.vtq-o.ios{--mau:#2f8cf0;border-color:transparent;background:linear-gradient(135deg,#3b9bff,#0a63d8);color:#fff;box-shadow:0 8px 24px rgba(10,99,216,.45)}
.noi-dung a.vtq-o.ios:hover{color:#fff;box-shadow:0 12px 30px rgba(10,99,216,.6)}
.noi-dung a.vtq-o.cu{--mau:#8b93a5;box-shadow:none}
.noi-dung a.vtq-o.cc{--mau:#7c6cf0}
.noi-dung a.vtq-hd{--mau:#e08a12}
.vtq-i{flex:none;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--mau);color:#fff;box-shadow:0 4px 10px color-mix(in srgb,var(--mau) 40%,transparent)}
.vtq-o.ios .vtq-i{background:rgba(255,255,255,.22);box-shadow:none}
.vtq-i svg{width:22px;height:22px;fill:currentColor}
.vtq-c{flex:1;min-width:0;line-height:1.3}
.vtq-c b{display:block;font-size:1rem;font-weight:700}
.vtq-c small{display:block;margin-top:2px;font-size:.8rem;color:var(--chu-nhat)}
.vtq-o.ios .vtq-c small{color:rgba(255,255,255,.88)}
.vtq-m{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:1rem;font-weight:700;background:color-mix(in srgb,var(--mau) 20%,transparent);color:var(--mau)}
.vtq-o.ios .vtq-m{background:rgba(255,255,255,.22);color:#fff}
.vtq-the{margin-left:8px;padding:1px 7px;border-radius:999px;font-size:.68rem;font-style:normal;font-weight:650;vertical-align:1px;background:color-mix(in srgb,#e08a12 22%,transparent);color:#e08a12}
@media (max-width:520px){.vtq{padding:14px}}
</style>
<div class="vtq">
<div class="vtq-nhom"><p class="vtq-ten">Bản cho iPhone <span>cài qua TestFlight</span></p><div class="vtq-luoi">
<a class="vtq-o ios" href="https://testflight.apple.com/join/aabZw9gJ" target="_blank" rel="noopener"><span class="vtq-i"><svg viewBox="0 0 24 24"><path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v13h8V5zm3 14.2v1.3h2v-1.3z"/></svg></span><span class="vtq-c"><b>Vị Trí Pro cho iPhone</b><small>iOS 17.4 trở lên · bản mới nhất</small></span><span class="vtq-m">↗</span></a>
<a class="vtq-o cu" href="https://testflight.apple.com/join/KYYj3Bfd" target="_blank" rel="noopener"><span class="vtq-i"><svg viewBox="0 0 24 24"><path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v13h8V5zm3 14.2v1.3h2v-1.3z"/></svg></span><span class="vtq-c"><b>Vị Trí Pro — bản cũ<i class="vtq-the">Bản cũ</i></b><small>Chỉ cho iOS đời cũ · iOS 26 trở lên không dùng được</small></span><span class="vtq-m">↗</span></a>
</div></div>
<div class="vtq-nhom"><p class="vtq-ten">Bản cho máy tính <span>điều khiển iPhone qua cáp</span></p><div class="vtq-luoi">
<a class="vtq-o may" href="https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/vi-tri-pro-1.0/ViTriPro-1.0-Windows-CaiDat.exe"><span class="vtq-i"><svg viewBox="0 0 24 24"><path d="M3 5.5 11 4v7.5H3zM13 3.7 21 2.5v9H13zM3 12.5h8V20l-8-1.5zM13 12.5h8v9l-8-1.2z"/></svg></span><span class="vtq-c"><b>Vị Trí Pro cho Windows</b><small>Windows 10 / 11 · 734 MB</small></span><span class="vtq-m">↓</span></a>
<a class="vtq-o may" href="https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/vi-tri-pro-1.0/ViTriPro-1.1-macOS.dmg"><span class="vtq-i"><svg viewBox="0 0 24 24"><path d="M5 5h14a1 1 0 0 1 1 1v10H4V6a1 1 0 0 1 1-1zm1 2v7h12V7zM2 17.5h20V18a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18z"/></svg></span><span class="vtq-c"><b>Vị Trí Pro cho MacBook</b><small>macOS 14 trở lên · chip Apple · 36 MB</small></span><span class="vtq-m">↓</span></a>
</div></div>
<div class="vtq-nhom"><p class="vtq-ten">Tạo Tệp Ghép Đôi cho iOS <span>công cụ cho bản iPhone, chọn theo máy tính của bạn</span></p><div class="vtq-luoi">
<a class="vtq-o cc" href="https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/vi-tri-pro-1.0/TaoTepGhepDoi-1.0-Windows-CaiDat.exe"><span class="vtq-i"><svg viewBox="0 0 24 24"><path d="M3 5.5 11 4v7.5H3zM13 3.7 21 2.5v9H13zM3 12.5h8V20l-8-1.5zM13 12.5h8v9l-8-1.2z"/></svg></span><span class="vtq-c"><b>Bản Windows</b><small>Chạy trên Windows 10 / 11 · 111 MB</small></span><span class="vtq-m">↓</span></a>
<a class="vtq-o cc" href="https://github.com/doanngoclam3000-creator/doanngoclam3000-creator.github.io/releases/download/vi-tri-pro-1.0/TaoTepGhepDoi-1.1-macOS.dmg"><span class="vtq-i"><svg viewBox="0 0 24 24"><path d="M5 5h14a1 1 0 0 1 1 1v10H4V6a1 1 0 0 1 1-1zm1 2v7h12V7zM2 17.5h20V18a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18z"/></svg></span><span class="vtq-c"><b>Bản MacBook</b><small>Chạy trên MacBook chip Apple · 36 MB</small></span><span class="vtq-m">↓</span></a>
</div></div>
<a class="vtq-hd" href="/bai-viet/huong-dan-vi-tri-pro/"><span class="vtq-i"><svg viewBox="0 0 24 24"><path d="M4 4h6a3 3 0 0 1 2 .8A3 3 0 0 1 14 4h6v15h-6a2 2 0 0 0-2 1 2 2 0 0 0-2-1H4zm2 2v11h4c.4 0 .7 0 1 .2V7a1 1 0 0 0-1-1zm12 0h-4a1 1 0 0 0-1 1v10.2c.3-.2.6-.2 1-.2h4z"/></svg></span><span class="vtq-c"><b>Hướng dẫn cài và dùng</b><small>Từng bước, có hình minh hoạ</small></span><span class="vtq-m">→</span></a>
</div>

> **Bản iPhone cài qua TestFlight.** Cài app **TestFlight** của Apple từ App Store trước, rồi bấm nút iPhone ở trên **ngay trên iPhone**. iPhone chạy iOS 26 trở lên dùng bản mới nhất; **bản cũ** chỉ dành cho iPhone chạy iOS đời cũ, từ iOS 26 trở lên không dùng được. Chưa dùng TestFlight bao giờ thì xem [hướng dẫn có hình](/bai-viet/huong-dan-cai-qua-testflight/).

## Cần chuẩn bị

| Thiết bị | Yêu cầu |
| --- | --- |
| iPhone | Bản iPhone và công cụ Tạo Tệp Ghép Đôi cần iOS 17.4 trở lên. iPhone phải có đặt mật mã |
| Máy tính Windows | Windows 10 hoặc 11, 64-bit. Chưa có driver Apple thì phần mềm có nút cài sẵn |
| Máy Mac | Chip Apple (M1 trở lên), macOS 14 trở lên. Không cần cài thêm gì |
| Cáp | Cáp truyền dữ liệu. Cáp chỉ sạc sẽ không nhận máy |

## Bắt đầu nhanh

**Dùng trên máy tính Windows:**

1. Tải **Vị Trí Pro cho Windows** ở phần Tải về và bấm đúp để cài.
2. Cắm iPhone bằng cáp, mở khoá màn hình, bấm **Tin cậy**.
3. Mở Vị Trí Pro, nhập key hoặc quét mã QR để mua key.
4. Bấm lên bản đồ để ghim một điểm, rồi bấm **Dịch chuyển tới điểm ghim**.

![Bảng xanh của Windows: bấm More info rồi Run anyway](/anh/vi-tri-pro/3-cai-windows.svg)

**Dùng trên MacBook:**

1. Tải **Vị Trí Pro cho MacBook** ở phần Tải về, mở file .dmg và kéo app vào **Applications**.
2. Lần đầu mở nếu Mac chặn: vào **Cài đặt hệ thống → Quyền riêng tư & Bảo mật**, bấm **Vẫn mở**.
3. Cắm iPhone bằng cáp, mở khoá màn hình, bấm **Tin cậy**. Trên iPhone bật **Cài đặt → Quyền riêng tư & Bảo mật → Chế độ nhà phát triển**.
4. Nhập key hoặc quét mã QR để mua key, ghim một điểm trên bản đồ rồi bấm **Dịch chuyển tới điểm ghim**. Lần đầu mất 10–30 giây và cần có mạng Internet.

**Dùng ngay trên iPhone:**

1. Cài app **TestFlight**, mở [link Vị Trí Pro](https://testflight.apple.com/join/aabZw9gJ) trên iPhone và bấm cài.
2. Trên máy tính Windows hoặc MacBook, tải **Tạo Tệp Ghép Đôi cho iOS** đúng bản của máy tính đó, cắm iPhone và bấm **Tạo tệp ghép đôi**. Việc này chỉ làm một lần cho mỗi iPhone.
3. Đưa tệp sang iPhone, mở app Vị Trí Pro và bấm **Chọn tệp ghép đôi**.
4. Kích hoạt key, ghim một điểm trên bản đồ rồi bấm dịch chuyển.

![Tạo tệp ghép đôi trên máy tính Windows](/anh/vi-tri-pro/5-tao-tep.svg)

Các bước chi tiết, kèm cách xử lý khi gặp trục trặc, nằm trong bài hướng dẫn:

<div class="vtp-mot"><a class="vtp-nut hd" href="/bai-viet/huong-dan-vi-tri-pro/"><span class="i">📖</span><span class="c"><b>Hướng dẫn cài và dùng</b><small>Từng bước, có hình minh hoạ</small></span><span class="m">→</span></a></div>

## Giá và key

| Gói | Giá |
| --- | --- |
| 1 tháng | 300.000đ |
| 2 tháng | 500.000đ |
| Vĩnh viễn | 2.000.000đ |

- **Không có bản dùng thử.** Chưa có key thì vẫn xem bản đồ, tìm địa điểm và ghim được, nhưng chưa dịch chuyển được.
- **Mua ngay trong phần mềm:** mở màn hình bản quyền, chọn gói, quét mã QR bằng app ngân hàng và giữ nguyên nội dung chuyển khoản. Chuyển xong phần mềm tự mở khoá, thường trong vòng nửa phút.
- **Chuyển thiếu thì chưa có key.** Tiền được cộng dồn, chuyển bù cho đủ gói là có key.
- **Một key dùng cho cả điện thoại lẫn máy tính:** key mua cho iPhone thì cắm iPhone đó vào máy tính là bản máy tính tự nhận, không phải mua thêm.
- Key gắn với mã máy. Bạn chỉ dùng bản máy tính thì key gắn với máy tính đó.
- Mua qua WeChat **tieumanthau1409**: gửi mã máy (dạng `MAY-XXXXXX`, hiện trong màn hình bản quyền) để nhận key.

![Màn hình bản quyền: quét mã QR hoặc nhập key](/anh/vi-tri-pro/7-ban-quyen.svg)

## Lưu ý quan trọng

- Key của Giả Lập Vị Trí (dạng `GL-…`) **không dùng được** cho Vị Trí Pro.
- Tệp ghép đôi là riêng của từng iPhone và giống như chìa khoá của máy đó. **Đừng gửi tệp cho người khác.**
- Một số trò chơi và ứng dụng tự kiểm tra và có thể từ chối vị trí giả lập.
- Phần mềm được làm ra từ việc học tập và nghiên cứu kỹ thuật, không nhằm mục đích lừa đảo hay gian lận dưới bất kỳ hình thức nào. Vui lòng không dùng để lừa dối người khác, trục lợi bất chính, hoặc vi phạm pháp luật và điều khoản của các ứng dụng, dịch vụ khác. Người dùng tự chịu trách nhiệm về cách mình sử dụng.
