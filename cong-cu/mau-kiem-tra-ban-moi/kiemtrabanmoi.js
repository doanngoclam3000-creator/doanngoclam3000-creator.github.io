// Kiểm tra bản mới từ website, dùng cho app Electron (Windows và Mac).
//
// Cách dùng trong chinh.js:
//
//   const kiemTraBanMoi = require("./kiemtrabanmoi");
//   app.whenReady().then(() => {
//     moCuaSo();
//     kiemTraBanMoi.chay({ maPhanMem: "gia-lap-vi-tri" });
//   });
//
// - Bản đang chạy cũ hơn "banToiThieu" trên web  -> BẮT BUỘC cập nhật, không cho dùng tiếp.
// - Chỉ cũ hơn "phienBan"                        -> nhắc nhẹ, cho phép để sau.
// - Không có mạng                                -> im lặng, dùng bình thường.

const { app, dialog, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const DIA_CHI = "https://phanmemtq.com/phien-ban.json";
const CHO_TOI_DA = 10000; // 10 giây, quá thì bỏ qua

// ---------------------------------------------- so sánh phiên bản

// Trả về true nếu a cũ hơn b. Ví dụ cuHon("1.1.7", "1.2") === true
function cuHon(a, b) {
  const x = String(a).split(".").map((n) => parseInt(n, 10) || 0);
  const y = String(b).split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const m = x[i] || 0;
    const n = y[i] || 0;
    if (m !== n) return m < n;
  }
  return false;
}

// ---------------------------------------------- nhớ bản đã bỏ qua

function tepBoQua() {
  return path.join(app.getPath("userData"), "boqua-banmoi.json");
}

function docBoQua() {
  try {
    return JSON.parse(fs.readFileSync(tepBoQua(), "utf8"));
  } catch {
    return {};
  }
}

function ghiBoQua(ma, phienBan) {
  try {
    const d = docBoQua();
    d[ma] = phienBan;
    fs.mkdirSync(app.getPath("userData"), { recursive: true });
    fs.writeFileSync(tepBoQua(), JSON.stringify(d), "utf8");
  } catch {
    // Không ghi được thì kệ, lần sau hỏi lại thôi.
  }
}

// ---------------------------------------------- lấy dữ liệu từ web

async function layThongTin(maPhanMem) {
  const dungLai = new AbortController();
  const hen = setTimeout(() => dungLai.abort(), CHO_TOI_DA);
  try {
    const phanHoi = await fetch(DIA_CHI, {
      signal: dungLai.signal,
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (!phanHoi.ok) return null;
    const goi = await phanHoi.json();
    if (!goi || !Array.isArray(goi.phanMem)) return null;
    return goi.phanMem.find((p) => p.ma === maPhanMem) || null;
  } catch {
    return null; // Mất mạng, hỏng dữ liệu... đều bỏ qua, không làm phiền người dùng.
  } finally {
    clearTimeout(hen);
  }
}

// ---------------------------------------------- các bảng thông báo

function duongDanTai(pm) {
  const theoMay = process.platform === "win32" ? pm.tai.windows : pm.tai.mac;
  return theoMay || pm.trang;
}

// Bảng không bỏ qua được: chỉ có tải bản mới hoặc thoát
function batCapNhat(pm, banHienTai) {
  let chu = `Bạn đang dùng bản ${banHienTai}. Bản này đã quá cũ và không dùng tiếp được.\n\n`;
  chu += `Hãy tải bản ${pm.phienBan || "mới nhất"} để tiếp tục.`;
  if (pm.ghiChuCapNhat) chu += `\n\n${pm.ghiChuCapNhat}`;

  const chon = dialog.showMessageBoxSync({
    type: "warning",
    title: `Cần cập nhật ${pm.ten}`,
    message: `Cần cập nhật ${pm.ten}`,
    detail: chu,
    buttons: ["Tải bản mới", "Thoát"],
    defaultId: 0,
    cancelId: 1,
    noLink: true,
  });

  if (chon === 0) shell.openExternal(duongDanTai(pm));
  app.quit(); // Không cho dùng tiếp bản cũ
}

// Nhắc nhẹ, vẫn dùng tiếp được
function nhacCapNhat(pm, banHienTai) {
  let chu = `Bạn đang dùng bản ${banHienTai}.`;
  if (pm.ghiChuCapNhat) chu += `\n\n${pm.ghiChuCapNhat}`;

  const chon = dialog.showMessageBoxSync({
    type: "info",
    title: "Đã có bản mới",
    message: `Đã có ${pm.ten} bản ${pm.phienBan}`,
    detail: chu,
    buttons: ["Tải ngay", "Để sau", "Bỏ qua bản này"],
    defaultId: 0,
    cancelId: 1,
    noLink: true,
  });

  if (chon === 0) shell.openExternal(duongDanTai(pm));
  else if (chon === 2) ghiBoQua(pm.ma, pm.phienBan);
}

// ---------------------------------------------- điểm gọi vào

/**
 * @param {object} tuyChon
 * @param {string} tuyChon.maPhanMem  Mã trên web, ví dụ "gia-lap-vi-tri"
 * @param {string} [tuyChon.banHienTai]  Mặc định lấy từ package.json
 * @param {number} [tuyChon.hoanLai]  Chờ bao nhiêu mili giây rồi mới kiểm tra
 */
async function chay(tuyChon) {
  const maPhanMem = tuyChon && tuyChon.maPhanMem;
  if (!maPhanMem) return;

  const banHienTai = (tuyChon && tuyChon.banHienTai) || app.getVersion();
  const hoanLai = (tuyChon && tuyChon.hoanLai) || 0;
  if (hoanLai > 0) await new Promise((xong) => setTimeout(xong, hoanLai));

  const pm = await layThongTin(maPhanMem);
  if (!pm) return;

  // 1. Bắt buộc cập nhật
  if (pm.banToiThieu && cuHon(banHienTai, pm.banToiThieu)) {
    batCapNhat(pm, banHienTai);
    return;
  }

  // 2. Nhắc nhẹ khi có bản mới hơn
  if (pm.phienBan && cuHon(banHienTai, pm.phienBan)) {
    if (docBoQua()[maPhanMem] === pm.phienBan) return; // đã bấm bỏ qua bản này
    nhacCapNhat(pm, banHienTai);
  }
}

module.exports = { chay, cuHon };
