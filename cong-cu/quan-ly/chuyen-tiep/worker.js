// MAY CHU CHUYEN TIEP — "Quan ly website tren dien thoai"
//
// App Quan Ly Website tren Mac (vai=may) noi WebSocket vao mot "phong" theo ma ghep.
// Dien thoai mo https://…/?m=<ma ghep> nhu mot trang web thuong. Moi yeu cau HTTP cua
// dien thoai duoc goi lai thanh goi tin, day qua WebSocket ve Mac; Mac tu goi may chu
// noi bo cua no (cong 4500) roi tra ket qua nguoc lai. May chu nay KHONG giu du lieu gi,
// KHONG biet ma quan tri vi, khong hieu noi dung — chi la ong dan.
//
// Chong lam dung: chi may Mac biet BI_MAT (gui X-Khoa = HMAC-SHA256(BI_MAT, ma ghep)) moi MO
// duoc phong. Dien thoai chi vao duoc phong da mo va phai biet ma ghep (160 bit ngau nhien,
// sinh tren Mac, doi luc nao cung duoc). Ma ghep = chia khoa quan tri website → dung de lo link.
// BI_MAT la bien bi mat cua worker (wrangler secret put BI_MAT), khong nam trong ma nguon.

import { DurableObject } from "cloudflare:workers";
import { Buffer } from "node:buffer";

const GIAY_MAC_IM_LA_MAT = 75;          // Mac ping 25 giay mot lan; im qua nguong nay coi nhu da mat
const THAN_TOI_DA = 45 * 1024 * 1024;   // dien thoai gui len (anh, video ngan)
const TRA_LOI_TOI_DA = 60 * 1024 * 1024;
const KHUC = 512 * 1024;                // moi goi WebSocket phai nho hon 1 MiB sau khi doi sang base64
const CHO_TOI_DA = 240_000;             // ms — "Dang len web" va wrangler deploy co the mat ca phut
const NHIP_CHO = 25;                    // ms

function boHex(s) {
  const ra = new Uint8Array(s.length / 2);
  for (let i = 0; i < ra.length; i++) ra[i] = parseInt(s.substr(i * 2, 2), 16);
  return ra;
}

async function bamHex(chu) {
  const dl = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(chu));
  return [...new Uint8Array(dl)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/// X-Khoa co dung la HMAC cua ma ghep khong (verify cua WebCrypto so sanh thoi gian hang)
async function kiemKhoa(req, env, ma) {
  try {
    const biMat = String(env.BI_MAT || "");
    const khoaHex = (req.headers.get("X-Khoa") || "").toLowerCase();
    if (!/^[0-9a-f]{64}$/.test(biMat) || !/^[0-9a-f]{64}$/.test(khoaHex)) return false;
    const khoa = await crypto.subtle.importKey("raw", boHex(biMat), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    return await crypto.subtle.verify("HMAC", khoa, boHex(khoaHex), new TextEncoder().encode(ma));
  } catch {
    return false;
  }
}

const sachMa = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const maHopLe = (ma) => ma.length >= 32 && ma.length <= 48;

function docCookie(req, ten) {
  for (const doan of (req.headers.get("Cookie") || "").split(";")) {
    const i = doan.indexOf("=");
    if (i > 0 && doan.slice(0, i).trim() === ten) return doan.slice(i + 1).trim();
  }
  return "";
}

const DAU_CHUNG = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
};

const traJson = (obj, ma) => new Response(JSON.stringify(obj), {
  status: ma, headers: { ...DAU_CHUNG, "Content-Type": "application/json; charset=utf-8" },
});

/// Trang hien khi chua vao duoc bang dieu khien. tuThuLai: tu nap lai sau vai giay.
function trangCho(tieuDe, chu, tuThuLai, ma) {
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="QL Website">
<link rel="apple-touch-icon" href="/icon-180.png"><title>Quản lý website</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#12203a;color:#e6edf8;
font-family:-apple-system,BlinkMacSystemFont,sans-serif;text-align:center}
div{padding:28px;max-width:420px}h1{font-size:19px;margin:14px 0 10px}p{font-size:14.5px;line-height:1.65;color:#a9bad6;margin:0 0 18px}
button{font:inherit;font-weight:600;padding:11px 22px;border:0;border-radius:10px;background:#2563eb;color:#fff}
.b{font-size:46px}small{display:block;margin-top:16px;color:#7f93b3;font-size:12.5px}</style></head>
<body><div><div class="b">${tuThuLai ? "💤" : "🔒"}</div><h1>${tieuDe}</h1><p>${chu}</p>
<button onclick="location.reload()">Thử lại</button>
${tuThuLai ? "<small>Trang tự thử lại mỗi 6 giây.</small><script>setTimeout(()=>location.reload(),6000)</script>" : ""}
</div></body></html>`;
  // Luon tra 200: app iOS "Quan Ly" thay ma >= 400 la huy trang va hien thong bao loi chung chung,
  // mat loi huong dan va nhip tu thu lai cua trang nay. (ma chi con de ghi nhat ky.)
  return new Response(html, { status: 200, headers: { ...DAU_CHUNG, "Content-Type": "text/html; charset=utf-8", "X-Ma-That": String(ma) } });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const duong = url.pathname;

    // ---- May Mac noi vao ----
    if (duong === "/noi") {
      if ((req.headers.get("Upgrade") || "").toLowerCase() !== "websocket") {
        return new Response("Can WebSocket", { status: 426 });
      }
      const ma = sachMa(url.searchParams.get("ma"));
      if (!maHopLe(ma)) return new Response("Thieu ma ghep", { status: 400 });
      if (!(await kiemKhoa(req, env, ma))) return new Response("Khong phai app Quan Ly Website", { status: 403 });
      const id = env.PHONG.idFromName(await bamHex("phong-web:" + ma));
      return env.PHONG.get(id).fetch(req);
    }
    if (duong === "/song") return new Response("ok");
    if (duong === "/icon-180.png") return env.ASSETS.fetch(req);

    // ---- Dien thoai ----
    const laTrang = duong === "/" || duong === "/index.html";
    const laApi = duong.startsWith("/api/");
    const maTrenLink = laTrang ? sachMa(url.searchParams.get("m")) : "";
    const ma = maTrenLink || sachMa(docCookie(req, "m"));
    if (!maHopLe(ma)) {
      if (!laTrang) return traJson({ loi: "Chưa ghép với máy Mac. Quét lại mã QR trong app Quản Lý Website.", saiMa: true }, 401);
      return trangCho("Chưa ghép với máy Mac",
        "Mở app <b>Quản Lý Website</b> trên Mac, vào mục <b>📱 Điện thoại</b>, bật lên rồi quét mã QR bằng camera điện thoại.", false, 401);
    }

    // Lenh ghi phai xuat phat tu chinh trang nay (cookie da SameSite=Strict, day la lop thu hai)
    if (req.method !== "GET" && req.method !== "HEAD") {
      const goc = req.headers.get("Origin");
      if (goc && goc !== url.origin) return traJson({ loi: "Nguồn gọi không hợp lệ" }, 403);
    }

    url.searchParams.delete("m");
    const dauGui = { "X-Pt": req.method, "X-D": duong + url.search };
    const kieu = req.headers.get("Content-Type");
    if (kieu) dauGui["X-Kieu"] = kieu;
    // Phien dang nhap bang mat khau: worker khong hieu, chi chuyen ve cho Mac kiem
    const phien = req.headers.get("X-Phien") || "";
    if (/^[0-9a-f]{16,128}$/.test(phien)) dauGui["X-Phien"] = phien;
    const dai = Number(req.headers.get("Content-Length") || 0);
    if (dai > THAN_TOI_DA) return traJson({ loi: "File quá lớn để gửi từ điện thoại (tối đa 45 MB). Việc này làm trên máy Mac." }, 413);
    const coThan = req.method !== "GET" && req.method !== "HEAD" && req.body;

    const id = env.PHONG.idFromName(await bamHex("phong-web:" + ma));
    let tra = await env.PHONG.get(id).fetch(new Request("https://phong/yc", {
      method: "POST", headers: dauGui, body: coThan ? req.body : null,
    }));

    // Mo bang trinh duyet ma chua vao duoc: hien trang cho de doc thay vi JSON tran
    if (laTrang && tra.status !== 200) {
      const saiMa = tra.status === 404;
      tra = saiMa
        ? trangCho("Mã ghép không còn đúng",
            "Máy Mac đã đổi mã ghép, hoặc chưa từng bật <b>Quản lý trên điện thoại</b>. Mở app Quản Lý Website trên Mac → mục <b>📱 Điện thoại</b> → quét lại mã QR.", false, 404)
        : trangCho("Máy Mac đang không kết nối",
            "Bảng điều khiển chạy trên máy Mac của bạn. Hãy mở app <b>Quản Lý Website</b> trên Mac, cắm ổ chứa mã nguồn website và để máy có mạng.", true, 503);
    }

    if (!maTrenLink) return tra;
    // Nho ma ghep bang cookie de cac lenh /api/… va anh ve sau khoi phai mang ma tren link
    const dau = new Headers(tra.headers);
    dau.append("Set-Cookie", `m=${ma}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Strict`);
    return new Response(tra.body, { status: tra.status, headers: dau });
  },
};

export class Phong extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.cho = new Map();   // id yeu cau -> { dau, khuc[], nhan, xong }
    this.dem = 0;
    // "ping" -> "pong" tra loi ngay tai ria mang, KHONG danh thuc phong — giu ket noi gan nhu mien phi
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
  }

  async fetch(req) {
    const duong = new URL(req.url).pathname;

    if (duong === "/noi") {
      const cap = new WebSocketPair();
      // Moi phong chi mot may Mac. Ket noi cu (thuong la xac chet sau khi Mac ngu) thi dong.
      for (const ws of this.ctx.getWebSockets("may")) {
        try { ws.close(4000, "thay"); } catch {}
      }
      this.ctx.acceptWebSocket(cap[1], ["may"]);
      cap[1].serializeAttachment({ luc: Date.now() });
      await this.ctx.storage.put("coPhong", true);
      return new Response(null, { status: 101, webSocket: cap[0] });
    }

    // ---- Yeu cau tu dien thoai ----
    if (!(await this.ctx.storage.get("coPhong"))) {
      return traJson({ loi: "Mã ghép không đúng hoặc máy Mac đã đổi mã. Quét lại mã QR trên máy Mac.", saiMa: true }, 404);
    }
    const may = this.macSong();
    if (!may) {
      return traJson({ loi: "Máy Mac đang không kết nối — kiểm tra Mac còn mở app Quản Lý Website và có mạng không.", macMat: true }, 503);
    }

    let than = null;
    if (req.body) {
      than = new Uint8Array(await req.arrayBuffer());
      if (than.length > THAN_TOI_DA) return traJson({ loi: "File quá lớn để gửi từ điện thoại (tối đa 45 MB)." }, 413);
      if (!than.length) than = null;
    }

    const id = (++this.dem).toString(36) + "-" + crypto.randomUUID().slice(0, 8);
    const muc = { dau: null, khuc: [], nhan: 0, tong: 0, xong: false };
    this.cho.set(id, muc);
    try {
      const soKhuc = than ? Math.ceil(than.length / KHUC) : 0;
      may.send(JSON.stringify({
        k: "yc", id, pt: req.headers.get("X-Pt") || "GET", d: req.headers.get("X-D") || "/",
        kieu: req.headers.get("X-Kieu") || "", phien: req.headers.get("X-Phien") || "", n: soKhuc,
      }));
      for (let i = 0; i < soKhuc; i++) {
        const doan = than.subarray(i * KHUC, Math.min(than.length, (i + 1) * KHUC));
        may.send(JSON.stringify({ k: "yct", id, i, b: Buffer.from(doan.buffer, doan.byteOffset, doan.length).toString("base64") }));
      }

      // Cho Mac tra loi. Tham do bang dong ho thay vi cho Promise do su kien WebSocket
      // (mot ngu canh khac) danh thuc — cach nay khong bao gio bi coi la yeu cau treo.
      const han = Date.now() + CHO_TOI_DA;
      while (!muc.xong) {
        if (Date.now() > han) return traJson({ loi: "Máy Mac xử lý quá lâu, đã thôi chờ. Việc có thể vẫn đang chạy trên Mac — tải lại để xem." }, 504);
        if (muc.mat) return traJson({ loi: "Mất kết nối với máy Mac giữa chừng. Thử lại sau vài giây.", macMat: true }, 503);
        if (muc.qualon) return traJson({ loi: "Dữ liệu trả về quá lớn để xem trên điện thoại." }, 502);
        await scheduler.wait(NHIP_CHO);
      }

      const dau = { ...DAU_CHUNG };
      const kieu = muc.dau.kieu || "application/octet-stream";
      dau["Content-Type"] = kieu;
      if (/^text\/html/i.test(kieu)) dau["Content-Security-Policy"] = "frame-ancestors 'none'";
      const thanTra = muc.khuc.length ? new Blob(muc.khuc) : null;
      return new Response(thanTra, { status: muc.dau.ma || 200, headers: dau });
    } catch (e) {
      return traJson({ loi: "Mất kết nối với máy Mac giữa chừng.", macMat: true }, 503);
    } finally {
      this.cho.delete(id);
    }
  }

  /// Ket noi Mac vua moi len tieng (khong phai xac chet sau khi Mac ngu)
  macSong() {
    const nguong = Date.now() - GIAY_MAC_IM_LA_MAT * 1000;
    for (const ws of this.ctx.getWebSockets("may")) {
      const ping = this.ctx.getWebSocketAutoResponseTimestamp(ws);
      const luc = Math.max(ping ? ping.getTime() : 0, (ws.deserializeAttachment() || {}).luc || 0);
      if (luc >= nguong) return ws;
    }
    return null;
  }

  async webSocketMessage(ws, tin) {
    if (typeof tin !== "string") return;
    let goi;
    try { goi = JSON.parse(tin); } catch { return; }
    if (!goi || typeof goi.k !== "string") return;

    if (goi.k === "xoa") {
      // Mac doi ma ghep / tat tinh nang: xoa phong, link cu het hieu luc ngay
      await this.ctx.storage.deleteAll();
      try { ws.close(4001, "xoa"); } catch {}
      return;
    }

    const muc = this.cho.get(goi.id);
    if (!muc) return;
    if (goi.k === "tl") {
      muc.dau = { ma: Number(goi.ma) || 200, kieu: String(goi.kieu || ""), n: Number(goi.n) || 0 };
      if (!muc.dau.n) muc.xong = true;
    } else if (goi.k === "tlt" && muc.dau) {
      const doan = Buffer.from(String(goi.b || ""), "base64");
      muc.tong += doan.length;
      if (muc.tong > TRA_LOI_TOI_DA) { muc.qualon = true; muc.khuc = []; return; }
      muc.khuc.push(doan);
      muc.nhan++;
      if (muc.nhan >= muc.dau.n) muc.xong = true;
    }
  }

  async webSocketClose(ws, ma, lyDo) {
    this.macRoi();
    try { ws.close(ma === 1005 || ma === 1006 ? 1000 : ma, lyDo); } catch {}
  }

  async webSocketError() { this.macRoi(); }

  /// Mac rot mang giua chung: cac yeu cau dang cho khoi phai doi het han
  macRoi() {
    for (const muc of this.cho.values()) muc.mat = true;
  }
}
