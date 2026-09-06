// =============================================================
//  VI PHANMEMTQ.COM - Cloudflare Worker
//
//  Lam gi: tai khoan khach (dang ky / dang nhap), vi tien (nap qua chuyen
//  khoan ngan hang, tru khi mua key, rut ve ngan hang chinh chu).
//
//  Vi sao dung D1 chu khong dung KV nhu may chu ban quyen: KV la kho
//  "eventually consistent" - hai yeu cau cung luc doc ra cung mot so du cu
//  roi ghi de nhau, khach mua duoc hai key ma chi tru mot lan tien. D1 la
//  SQLite that, co giao dich, tru tien moi dung.
//
//  Cai dat: xem CAI-DAT.md
// =============================================================

// Bang link tai, sinh tu src/content/phan-mem/*.md bang lay-lien-ket.cjs.
// Trang web KHONG con de link that trong HTML nua - phai dang nhap, hoi day
// moi lay duoc. Doi link trong tep .md thi nho chay lai `node cai-dat.cjs`.
import LIEN_KET from './lien-ket.json';

const BO_KY_TU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bo I O 0 1 cho khoi doc nham
const NGAY = 86400 * 1000;
const HAN_TOKEN = 30 * NGAY;
const VONG_BAM = 100000; // so vong PBKDF2 - Cloudflare Workers CHAN qua 100.000,
                         // de cao hon la ham nem loi 1101 (chay o may thi khong lo ra)

// ---- Danh muc phan mem ban duoc bang vi ----
//
// MA GOI va GIA phai TRUNG bang gia trong chinh phan mem do, khong duoc doan:
// ma goi sai la key cap ra khong doc duoc, gia sai la khach so bi thu thieu.
// Hai kieu cap key, phan mem nao cung cap TU DONG, khong phai cho duyet:
//
//   kieu 'mayChu' - phan mem hoi may chu ban quyen moi lan mo (Bot Zalo,
//     Shopee Tu Dong). Mua xong goi thang /admin/sua cua may chu do de cong
//     ngay cho ma may; khach khong phai nhap key.
//
//   kieu 'tuKy'   - phan mem giu khoa bi mat ngay trong may khach va tu kiem
//     key (Bot WeChat, Gia Lap Vi Tri, Quan Ly Kho Te, Hoc Tieng Trung).
//     Key dang <TIENTO><6 ky tu><10 ky tu chu ky>, chu ky la HMAC-SHA256 cua
//     "<6 ky tu>|<ma may>". Sinh ngay tai day, khong can goi di dau.
const PHAN_MEM = {
  'bot-zalo': {
    ten: 'Bot Zalo', kieu: 'mayChu', tienTo: 'BZ', bienSecret: 'SECRET_BZ',
    goi: [
      { ma: 'M', ten: '1 tháng', ngay: 30,  gia: 150000 },
      { ma: 'Q', ten: '3 tháng', ngay: 90,  gia: 300000 },
      { ma: 'H', ten: '6 tháng', ngay: 180, gia: 500000 },
      { ma: 'Y', ten: '1 năm',   ngay: 365, gia: 900000 },
    ],
  },
  'shopee-tu-dong': {
    ten: 'Shopee Tự Động', kieu: 'mayChu', tienTo: 'ST', bienSecret: 'SECRET_ST',
    goi: [
      { ma: 'M', ten: '1 tháng', ngay: 30,  gia: 150000 },
      { ma: 'Q', ten: '3 tháng', ngay: 90,  gia: 300000 },
      { ma: 'H', ten: '6 tháng', ngay: 180, gia: 500000 },
      { ma: 'Y', ten: '1 năm',   ngay: 365, gia: 900000 },
    ],
  },
  // Phan Mem Order dang phat hanh MIEN PHI (website co nhan do "MIEN PHI") nen
  // khong ban key.
  'bot-wechat': {
    ten: 'Bot WeChat', kieu: 'tuKy', tienTo: 'BW', bienSecret: 'SECRET_BW',
    goi: [
      { ma: 'M', ten: '1 tháng', ngay: 30,  gia: 150000 },
      { ma: 'Q', ten: '3 tháng', ngay: 90,  gia: 300000 },
      { ma: 'S', ten: '6 tháng', ngay: 180, gia: 500000 },
      { ma: 'Y', ten: '1 năm',   ngay: 365, gia: 900000 },
    ],
  },
  'gia-lap-vi-tri': {
    ten: 'Giả Lập Vị Trí', kieu: 'tuKy', tienTo: 'GL', bienSecret: 'SECRET_GL',
    luuY: 'Dùng được cho cả bản máy tính lẫn bản iPhone cài qua TestFlight.',
    goi: [
      { ma: 'M', ten: '1 tháng', ngay: 30,  gia: 300000 },
      { ma: 'Q', ten: '3 tháng', ngay: 90,  gia: 800000 },
      { ma: 'S', ten: '6 tháng', ngay: 180, gia: 1500000 },
      { ma: 'Y', ten: '1 năm',   ngay: 365, gia: 2500000 },
    ],
  },
  'ban-te': {
    ten: 'Phần Mềm Quản Lý Kho Tệ', kieu: 'tuKy', tienTo: 'BT', bienSecret: 'SECRET_BT',
    luuY: 'Dùng được cho cả bản máy tính lẫn bản iPhone. Mỗi máy một mã máy riêng.',
    goi: [
      { ma: 'M', ten: '1 tháng', ngay: 30,  gia: 150000 },
      { ma: 'Q', ten: '3 tháng', ngay: 90,  gia: 300000 },
      { ma: 'S', ten: '6 tháng', ngay: 180, gia: 500000 },
      { ma: 'Y', ten: '1 năm',   ngay: 365, gia: 900000 },
    ],
  },
  'hoc-tieng-trung': {
    ten: 'Học Tiếng Trung', kieu: 'tuKy', tienTo: 'HT', bienSecret: 'SECRET_HT',
    // Ban iPhone dung chung ma nguon Flutter voi ban may tinh, cung o nhap key
    // va cung cach tinh ma may -> key mua o day dung duoc ca hai.
    luuY: 'Dùng được cho cả bản máy tính lẫn bản iPhone. Mỗi máy một mã máy riêng.',
    goi: [
      { ma: 'M', ten: '1 tháng', ngay: 30,  gia: 150000 },
      { ma: 'Q', ten: '3 tháng', ngay: 90,  gia: 300000 },
      { ma: 'S', ten: '6 tháng', ngay: 180, gia: 500000 },
      { ma: 'Y', ten: '1 năm',   ngay: 365, gia: 900000 },
    ],
  },
};

// ---------------- Tien ich chung ----------------
const nhiPhanToHex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
const chuoiToByte = (s) => new TextEncoder().encode(s);

function b64urlMa(s) {
  return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlGiai(s) {
  const t = s.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(escape(atob(t + '==='.slice((t.length + 3) % 4))));
}

async function hmac(khoa, chuoi) {
  const k = await crypto.subtle.importKey('raw', chuoiToByte(khoa), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', k, chuoiToByte(chuoi));
}
async function hmacHex(khoa, chuoi, cat) {
  const h = nhiPhanToHex(await hmac(khoa, chuoi)).toUpperCase();
  return cat ? h.slice(0, cat) : h;
}
// So sanh khong ro ri thoi gian
function bangNhau(a, b) {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

function chuoiNgauNhien(n) {
  const b = crypto.getRandomValues(new Uint8Array(n));
  return [...b].map((x) => BO_KY_TU[x % BO_KY_TU.length]).join('');
}

// ---------------- Mat khau ----------------
async function bamMatKhau(mk, muoi) {
  const m = muoi || nhiPhanToHex(crypto.getRandomValues(new Uint8Array(16)));
  const k = await crypto.subtle.importKey('raw', chuoiToByte(mk), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: chuoiToByte(m), iterations: VONG_BAM, hash: 'SHA-256' }, k, 256);
  return 'pbkdf2$' + VONG_BAM + '$' + m + '$' + nhiPhanToHex(bits);
}
async function khopMatKhau(mk, luu) {
  const p = String(luu || '').split('$');
  if (p.length !== 4 || p[0] !== 'pbkdf2') return false;
  const k = await crypto.subtle.importKey('raw', chuoiToByte(mk), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: chuoiToByte(p[2]), iterations: Number(p[1]), hash: 'SHA-256' }, k, 256);
  return bangNhau(nhiPhanToHex(bits), p[3]);
}

// ---------------- Token phien ----------------
async function taoToken(env, nd) {
  const than = b64urlMa(JSON.stringify({ u: nd.id, v: nd.phien_ver, h: Date.now() + HAN_TOKEN }));
  return than + '.' + b64urlMa(nhiPhanToHex(await hmac(env.KHOA_PHIEN, than)));
}
async function docToken(env, token) {
  const [than, ky] = String(token || '').split('.');
  if (!than || !ky) return null;
  const dung = b64urlMa(nhiPhanToHex(await hmac(env.KHOA_PHIEN, than)));
  if (!bangNhau(ky, dung)) return null;
  try {
    const o = JSON.parse(b64urlGiai(than));
    if (!o.h || o.h < Date.now()) return null;
    return o;
  } catch { return null; }
}

// ---------------- Ma dat lai mat khau ----------------
// Ky rieng bang tien to 'datlai:' de token phien KHONG dung lam ma dat lai
// duoc va nguoc lai. Kem phien_ver nen dat lai xong (phien_ver tang) la ma
// cu chet luon - bam hai lan cung chi doi duoc mot lan.
const HAN_MA_DAT_LAI = 30 * 60 * 1000;   // 30 phut

async function taoMaDatLai(env, nd) {
  const than = b64urlMa(JSON.stringify({ u: nd.id, v: nd.phien_ver, h: Date.now() + HAN_MA_DAT_LAI }));
  return than + '.' + b64urlMa(nhiPhanToHex(await hmac(env.KHOA_PHIEN, 'datlai:' + than)));
}
async function docMaDatLai(env, ma) {
  const [than, ky] = String(ma || '').split('.');
  if (!than || !ky) return null;
  const dung = b64urlMa(nhiPhanToHex(await hmac(env.KHOA_PHIEN, 'datlai:' + than)));
  if (!bangNhau(ky, dung)) return null;
  try {
    const o = JSON.parse(b64urlGiai(than));
    if (!o.h || o.h < Date.now()) return null;
    return o;
  } catch { return null; }
}

// ---------------- Gui thu ----------------
// Cloudflare Workers khong tu gui mail duoc, phai qua mot dich vu. Khai bao
// khoa nao thi dung dich vu do; chua khai bao cai nao thi tra ve khong gui
// duoc, va chu shop van lay duoc duong dan tay o trang quan tri.
async function guiThu(env, den, tieuDe, html) {
  const tu = env.MAIL_TU || 'Phan Mem Viet <no-reply@phanmemtq.com>';
  try {
    if (env.RESEND_KEY) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + env.RESEND_KEY },
        body: JSON.stringify({ from: tu, to: [den], subject: tieuDe, html }),
      });
      if (r.ok) return { ok: true };
      return { ok: false, loi: 'Resend: ' + (await r.text()).slice(0, 200) };
    }
    if (env.BREVO_KEY) {
      const khop = tu.match(/^(.*)<(.+)>$/);
      const r = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'api-key': env.BREVO_KEY },
        body: JSON.stringify({
          sender: { name: (khop ? khop[1] : 'Phan Mem Viet').trim(), email: khop ? khop[2] : tu },
          to: [{ email: den }], subject: tieuDe, htmlContent: html,
        }),
      });
      if (r.ok) return { ok: true };
      return { ok: false, loi: 'Brevo: ' + (await r.text()).slice(0, 200) };
    }
  } catch (e) {
    return { ok: false, loi: 'khong goi duoc dich vu gui thu: ' + e };
  }
  return { ok: false, loi: 'chua khai bao dich vu gui thu' };
}

function thuDatLai(tenDn, duongDan) {
  return '<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1b1430">' +
    '<p>Chào <b>' + tenDn + '</b>,</p>' +
    '<p>Có người vừa xin đặt lại mật khẩu cho tài khoản của bạn trên <b>phanmemtq.com</b>. ' +
    'Bấm nút dưới đây để đặt mật khẩu mới:</p>' +
    '<p><a href="' + duongDan + '" style="display:inline-block;background:#7c3aed;color:#fff;' +
    'text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:700">Đặt mật khẩu mới</a></p>' +
    '<p style="color:#665c80;font-size:13px">Đường dẫn này chỉ dùng được <b>một lần</b> và hết hạn sau <b>30 phút</b>. ' +
    'Nếu không phải bạn xin đặt lại thì cứ bỏ qua thư này, mật khẩu cũ vẫn nguyên.</p>' +
    '<p style="color:#665c80;font-size:12px;word-break:break-all">Nút không bấm được thì chép đường dẫn này vào trình duyệt:<br>' +
    duongDan + '</p></div>';
}

// ---------------- Sinh key ban quyen ----------------
// Kieu 'mayChu' (Bot Zalo, Shopee Tu Dong): giong het ham taoKey ben may chu
// ban quyen cua tung phan mem.
async function taoKey(secret, tienTo, maGoi, maMay) {
  const than = maGoi + maMay;
  return tienTo + '-' + than + '-' + await hmacHex(secret, 'may:' + than, 8);
}

// Kieu 'tuKy' (Bot WeChat, Gia Lap Vi Tri, Quan Ly Kho Te, Hoc Tieng Trung):
// key 18 ky tu = 2 ky tu tien to + 6 ky tu than + 10 ky tu chu ky.
// Than: ky tu dau la ma goi, 5 ky tu sau la ngau nhien - ben doc khong dung
// den, chi can khop voi cai da ky. Phan mem gach het dau gach noi truoc khi
// doc nen viet co gach cho de nhin.
async function taoKeyMay(secret, tienTo, maGoi, maMay) {
  const than = maGoi + chuoiNgauNhien(5);
  const chuKy = await hmacHex(secret, than + '|' + maMay, 10);
  return tienTo + '-' + than + '-' + chuKy;
}
const maMayHopLe = (m) => /^[A-Z0-9]{4,16}$/.test(m) && [...m].every((c) => BO_KY_TU.includes(c));

// Phan mem nay cap key tu dong duoc khong: phai co du khoa bi mat da nap.
function capTuDong(env, pm) {
  if (!env[pm.bienSecret]) return false;
  if (pm.kieu === 'mayChu') return !!(env['MC_' + pm.tienTo] && env['QT_' + pm.tienTo]);
  return pm.kieu === 'tuKy';
}

// ---------------- Link rut gon cho cong tac vien ----------------
// Chi nhan link cua may san buon minh dang lam affiliate. Khong mo rong bua:
// cho dan link bat ky la thanh cho ai cung dung web minh de rut gon link la,
// dinh lua dao thi minh chiu.
const NEN_TANG = [
  { ten: 'shopee', mien: ['shopee.vn', 'shp.ee', 's.shopee.vn'] },
  { ten: 'tiktok', mien: ['tiktok.com', 'vt.tiktok.com', 'vm.tiktok.com', 'shop.tiktok.com'] },
];

// Co NEN_LINK (may chu go) thi dung duong ngan nhat: go.../<ma>.
// Khong co thi rot ve /l/<ma> ngay tren may chu vi.
function duongLinkNgan(env, ma) {
  if (env.NEN_LINK) return env.NEN_LINK.replace(/\/+$/, '') + '/' + ma;
  return (env.NGUON || 'https://phanmemtq.com') + '/l/' + ma;
}

function nhanNenTang(u) {
  let host;
  try {
    const d = new URL(u);
    if (d.protocol !== 'https:' && d.protocol !== 'http:') return null;
    host = d.hostname.toLowerCase().replace(/^www\./, '');
  } catch { return null; }
  for (const n of NEN_TANG) {
    if (n.mien.some((m) => host === m || host.endsWith('.' + m))) return n.ten;
  }
  return null;
}

// Doi link goc thanh link co gan ma affiliate CUA CHU SHOP, kem sub_id la ma
// cong tac vien de biet don nao cua ai.
//
// CHUA co tai khoan affiliate thi tra ve nguyen link goc - link van bam duoc,
// van dem duoc luot, chi la chua ra tien. Khai SHOPEE_AFF_ID / TIKTOK_AFF_ID
// la tu dong gan vao, khong phai sua cho nao khac.
function linkAffiliate(env, url, nen, maCtv) {
  try {
    const d = new URL(url);
    if (nen === 'shopee' && env.SHOPEE_AFF_ID) {
      d.searchParams.set('af_id', env.SHOPEE_AFF_ID);
      d.searchParams.set('sub_id', maCtv);
    } else if (nen === 'tiktok' && env.TIKTOK_AFF_ID) {
      d.searchParams.set('aff_id', env.TIKTOK_AFF_ID);
      d.searchParams.set('sub_id', maCtv);
    } else {
      return url;
    }
    return d.toString();
  } catch { return url; }
}

// ---------------- Tra loi + CORS ----------------
function dauCORS(env, req) {
  const nguon = req.headers.get('origin') || '';
  const chapNhan = [env.NGUON || 'https://phanmemtq.com', 'https://www.phanmemtq.com',
    'http://localhost:4321', 'http://127.0.0.1:4321'];
  return {
    'access-control-allow-origin': chapNhan.includes(nguon) ? nguon : (env.NGUON || 'https://phanmemtq.com'),
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization',
    'access-control-max-age': '86400',
    'vary': 'origin',
  };
}
function traJson(env, req, o, status = 200) {
  return new Response(JSON.stringify(o), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...dauCORS(env, req) },
  });
}

// ---------------- Ghi so cai (tru/cong tien) ----------------
// Cach chong tru tien sai: doc so du ra truoc, roi ghi ca cum bang env.DB.batch
// (D1 chay ca cum trong MOT giao dich). Cau UPDATE chi an khi so du VAN dung
// bang luc doc; cac cau con lai deu keo theo dieu kien "so du da bang so moi"
// nen update truot la khong cau nao ghi duoc. Ai do sua so du xen giua thi
// vong lap thu lai.
//
//   soTien : duong la cong, am la tru (khac 0)
//   setThem: manh SQL cong them vao cot dem, VD "da_nap = da_nap + 150000"
//            (chi ghep tu so nguyen do chinh minh tinh ra, khong lay tu khach)
//   themCau: ham nhan (soDuSau) tra ve mang cau lenh ghi kem trong cung giao dich
async function ghiSo(env, uid, { loai, soTien, ghiChu, maNgoai, setThem, themCau }) {
  soTien = Math.round(Number(soTien) || 0);
  if (!soTien) return { ok: false, loi: 'Số tiền không hợp lệ' };

  for (let lan = 0; lan < 5; lan++) {
    const nd = await env.DB.prepare('SELECT so_du, khoa FROM nguoi_dung WHERE id=?').bind(uid).first();
    if (!nd) return { ok: false, loi: 'Không tìm thấy tài khoản' };
    const truoc = Number(nd.so_du);
    const sau = truoc + soTien;
    // thieuTien: co dau rieng de noi goi phan biet, khong phai do chuoi chu
    if (sau < 0) return { ok: false, thieuTien: true, loi: 'Số dư không đủ', soDu: truoc };

    const cau = [
      env.DB.prepare('UPDATE nguoi_dung SET so_du=?1' + (setThem ? ', ' + setThem : '') +
        ' WHERE id=?2 AND so_du=?3').bind(sau, uid, truoc),
      env.DB.prepare('INSERT INTO so_cai (nguoi,loai,so_tien,so_du_sau,ghi_chu,ma_ngoai,luc)' +
        ' SELECT ?1,?2,?3,?4,?5,?6,?7 FROM nguoi_dung WHERE id=?1 AND so_du=?4')
        .bind(uid, loai, soTien, sau, ghiChu || null, maNgoai || null, Date.now()),
      ...(themCau ? themCau(sau) : []),
    ];

    let kq;
    try {
      kq = await env.DB.batch(cau);
    } catch (e) {
      // Trung ma_ngoai = SePay goi lai webhook lan hai -> coi nhu da xu ly
      if (String(e).includes('UNIQUE')) return { ok: false, trung: true, loi: 'Giao dịch đã xử lý' };
      throw e;
    }
    if (kq[0].meta.changes > 0) return { ok: true, soDu: sau, truoc };
  }
  return { ok: false, loi: 'Máy chủ đang bận, thử lại sau vài giây' };
}

// ---------------- Doc nguoi dung tu token ----------------
async function layNguoi(env, req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const o = await docToken(env, token);
  if (!o) return null;
  const nd = await env.DB.prepare('SELECT * FROM nguoi_dung WHERE id=?').bind(o.u).first();
  if (!nd || Number(nd.phien_ver) !== Number(o.v)) return null;
  return nd;
}
const laQuanTri = (req, env) =>
  !!env.MA_QUAN_TRI && (req.headers.get('authorization') || '') === 'Apikey ' + env.MA_QUAN_TRI;

// Ho so gui ve trinh duyet - khong bao gio kem mat khau
const hoSo = (nd) => ({
  id: nd.id, email: nd.email, tenDn: nd.ten_dn || '', dienThoai: nd.dien_thoai || '',
  coGoogle: !!nd.google_sub,
  soDu: Number(nd.so_du), vaiTro: nd.vai_tro, maNap: nd.ma_nap,
  daNap: Number(nd.da_nap), daRut: Number(nd.da_rut), hhKiem: Number(nd.hh_kiem),
  nganHang: nd.ngan_hang || '', soTk: nd.so_tk || '', chuTk: nd.chu_tk || '',
  khoa: !!nd.khoa, taoLuc: Number(nd.tao_luc),
});

const emailHopLe = (e) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e);
// Ten tai khoan: chu KHONG DAU, so va . _ - ; dung de dang nhap nen khong
// cho dau cach va khong cho dau tieng Viet (go nham dau la khong vao duoc).
const tenDnHopLe = (t) => /^[A-Za-z0-9._-]{3,30}$/.test(t);

// Ghi IP va lan cuoi khach vao. KHONG ghi thanh pho nua: Cloudflare chi doan
// theo duong truyen nen hay ra sai tinh, doc vao de hieu nham hon la khong co.
// Dia chi that thi lay o o "Dia chi" khach tu khai.
function ghiNoiO(env, req, uid) {
  const ip = req.headers.get('cf-connecting-ip') || '';
  return env.DB.prepare('UPDATE nguoi_dung SET ip=?, lan_cuoi=? WHERE id=?')
    .bind(ip, Date.now(), uid).run();
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname.replace(/\/+$/, '') || '/';
    const J = (o, s) => traJson(env, req, o, s);

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: dauCORS(env, req) });

    const than = async () => { try { return await req.json(); } catch { return {}; } };

    // ============ CONG KHAI ============

    // ---- Bam vao link rut gon -> day sang cho ban hang ----
    // Duong nay CONG KHAI va phai nhanh: doc mot dong, dem luot roi day di luon.
    if (req.method === 'GET' && p.startsWith('/l/')) {
      const ma = p.slice(3);
      const lk = await env.DB.prepare('SELECT * FROM lien_ket WHERE ma=?').bind(ma).first();
      if (!lk) return new Response('Link không tồn tại hoặc đã bị xoá.', { status: 404 });
      // Dem luot nhung khong bat khach cho: loi o day khong duoc chan duong di
      try {
        await env.DB.prepare('UPDATE lien_ket SET luot=luot+1, bam_cuoi=? WHERE ma=?')
          .bind(Date.now(), ma).run();
      } catch { /* dem hut mot luot con hon chan khach */ }
      const di = linkAffiliate(env, lk.dich, lk.nen, 'ctv' + lk.nguoi);
      return new Response(null, { status: 302, headers: { location: di, 'cache-control': 'no-store' } });
    }

    if (p === '/' || p === '/khoe') return J({ ok: true, ten: 'vi-phanmemtq' });

    // Trang web hoi xem co bat dang nhap Google khong, va Client ID la gi.
    // Client ID cong khai nen tra thang duoc.
    if (p === '/cau-hinh') {
      return J({ googleClientId: env.GOOGLE_CLIENT_ID || '' });
    }

    // ---- Bang gia ----
    if (p === '/bang-gia') {
      return J({
        phanMem: Object.entries(PHAN_MEM).map(([ma, m]) => ({
          ma, ten: m.ten,
          tuDong: capTuDong(env, m),
          luuY: m.luuY || '',
          goi: m.goi.map((g) => ({ ma: g.ma, ten: g.ten, ngay: g.ngay, gia: g.gia })),
        })),
      });
    }

    // ---- Dang ky ----
    if (req.method === 'POST' && p === '/dk') {
      const b = await than();
      const email = String(b.email || '').trim().toLowerCase();
      const tenDn = String(b.tenDn || '').trim();
      const mk = String(b.matKhau || '');
      if (!tenDnHopLe(tenDn)) {
        return J({ loi: 'Tên tài khoản từ 3 đến 30 ký tự, chỉ gồm chữ không dấu, số và . _ -' }, 400);
      }
      if (!emailHopLe(email)) return J({ loi: 'Email không hợp lệ' }, 400);
      if (mk.length < 8) return J({ loi: 'Mật khẩu phải từ 8 ký tự trở lên' }, 400);

      const daCo = await env.DB.prepare('SELECT id FROM nguoi_dung WHERE email=?').bind(email).first();
      if (daCo) return J({ loi: 'Email này đã có tài khoản' }, 409);
      const trungTen = await env.DB.prepare('SELECT id FROM nguoi_dung WHERE lower(ten_dn)=?')
        .bind(tenDn.toLowerCase()).first();
      if (trungTen) return J({ loi: 'Tên tài khoản này đã có người dùng, chọn tên khác' }, 409);

      // Ai gioi thieu: khach dan ma nap cua nguoi gioi thieu
      let nguoiGt = null;
      const maGt = String(b.gioiThieu || '').trim().toUpperCase().replace(/^NAP/, '');
      if (maGt) {
        const r = await env.DB.prepare('SELECT id FROM nguoi_dung WHERE ma_nap=?').bind(maGt).first();
        if (r) nguoiGt = r.id;
      }

      const bam = await bamMatKhau(mk);
      let nd = null;
      for (let lan = 0; lan < 6 && !nd; lan++) {
        try {
          nd = await env.DB.prepare(
            'INSERT INTO nguoi_dung (email,ten_dn,dien_thoai,mat_khau,ma_nap,nguoi_gt,tao_luc)' +
            ' VALUES (?,?,?,?,?,?,?) RETURNING *')
            .bind(email, tenDn, String(b.dienThoai || '').trim().slice(0, 20),
              bam, chuoiNgauNhien(6), nguoiGt, Date.now()).first();
        } catch (e) {
          if (!String(e).includes('UNIQUE')) throw e;   // trung ma_nap -> boc ma khac
          const lai = await env.DB.prepare('SELECT id FROM nguoi_dung WHERE email=?').bind(email).first();
          if (lai) return J({ loi: 'Email này đã có tài khoản' }, 409);
          const lai2 = await env.DB.prepare('SELECT id FROM nguoi_dung WHERE lower(ten_dn)=?')
            .bind(tenDn.toLowerCase()).first();
          if (lai2) return J({ loi: 'Tên tài khoản này đã có người dùng, chọn tên khác' }, 409);
        }
      }
      if (!nd) return J({ loi: 'Không tạo được tài khoản, thử lại' }, 500);
      await ghiNoiO(env, req, nd.id);
      return J({ token: await taoToken(env, nd), nguoi: hoSo(nd) });
    }

    // ---- Dang nhap ----
    if (req.method === 'POST' && p === '/dn') {
      const b = await than();
      // Go ten tai khoan hay email deu vao duoc
      const nhap = String(b.taiKhoan || b.email || '').trim().toLowerCase();
      const nd = await env.DB.prepare(
        'SELECT * FROM nguoi_dung WHERE email=?1 OR lower(ten_dn)=?1').bind(nhap).first();
      // Van bam mat khau gia khi khong co tai khoan: tra loi nhanh/cham nhu nhau
      // thi ke la khong do duoc email nao da dang ky.
      const dung = nd ? await khopMatKhau(String(b.matKhau || ''), nd.mat_khau)
        : await khopMatKhau('x', 'pbkdf2$' + VONG_BAM + '$00$00');
      if (!nd) return J({ loi: 'Tên tài khoản hoặc mật khẩu không đúng' }, 401);
      if (Number(nd.khoa_den) > Date.now()) {
        return J({ loi: 'Sai quá nhiều lần, thử lại sau ' + Math.ceil((nd.khoa_den - Date.now()) / 60000) + ' phút' }, 429);
      }
      if (!dung) {
        const lan = Number(nd.sai_lan) + 1;
        await env.DB.prepare('UPDATE nguoi_dung SET sai_lan=?, khoa_den=? WHERE id=?')
          .bind(lan, lan >= 8 ? Date.now() + 15 * 60000 : 0, nd.id).run();
        return J({ loi: 'Tên tài khoản hoặc mật khẩu không đúng' }, 401);
      }
      if (nd.khoa) return J({ loi: 'Tài khoản đang bị khoá' }, 403);
      await env.DB.prepare('UPDATE nguoi_dung SET sai_lan=0, khoa_den=0 WHERE id=?').bind(nd.id).run();
      await ghiNoiO(env, req, nd.id);
      return J({ token: await taoToken(env, nd), nguoi: hoSo(nd) });
    }

    // ---- Quen mat khau: gui thu kem duong dan dat lai ----
    if (req.method === 'POST' && p === '/quen-mat-khau') {
      const b = await than();
      const nhap = String(b.taiKhoan || b.email || '').trim().toLowerCase();
      // Luon tra ve ok: khong de nguoi la do xem email/ten nao co that
      if (!nhap) return J({ ok: true });
      const nd = await env.DB.prepare(
        'SELECT * FROM nguoi_dung WHERE email=?1 OR lower(ten_dn)=?1').bind(nhap).first();
      if (!nd || nd.khoa) return J({ ok: true });

      const ma = await taoMaDatLai(env, nd);
      const duongDan = (env.NGUON || 'https://phanmemtq.com') +
        '/tai-khoan/dat-lai-mat-khau/?ma=' + encodeURIComponent(ma);
      await guiThu(env, nd.email, 'Đặt lại mật khẩu phanmemtq.com',
        thuDatLai(nd.ten_dn || nd.email, duongDan));
      // Tra ve DUNG MOT cau cho moi truong hop - co tai khoan hay khong, gui
      // duoc thu hay khong. Tra khac nhau la nguoi la do ra duoc email nao da
      // dang ky tren web.
      return J({ ok: true });
    }

    // ---- Dat mat khau moi bang ma trong thu ----
    if (req.method === 'POST' && p === '/dat-lai-mat-khau') {
      const b = await than();
      const o = await docMaDatLai(env, b.ma);
      if (!o) return J({ loi: 'Đường dẫn đã hết hạn hoặc đã dùng rồi. Xin đặt lại lần nữa.' }, 400);
      if (String(b.matKhau || '').length < 8) return J({ loi: 'Mật khẩu phải từ 8 ký tự trở lên' }, 400);
      const nd = await env.DB.prepare('SELECT * FROM nguoi_dung WHERE id=?').bind(o.u).first();
      if (!nd || Number(nd.phien_ver) !== Number(o.v)) {
        return J({ loi: 'Đường dẫn đã hết hạn hoặc đã dùng rồi. Xin đặt lại lần nữa.' }, 400);
      }
      // Tang phien_ver: ma nay chet luon va moi may dang dang nhap cung bi day ra
      const moi = await env.DB.prepare(
        'UPDATE nguoi_dung SET mat_khau=?, phien_ver=phien_ver+1, sai_lan=0, khoa_den=0 WHERE id=? RETURNING *')
        .bind(await bamMatKhau(String(b.matKhau)), nd.id).first();
      await ghiNoiO(env, req, moi.id);
      return J({ ok: true, token: await taoToken(env, moi), nguoi: hoSo(moi) });
    }

    // ---- Dang nhap bang Google ----
    // Trang gui len "ID token" Google vua cap. Nho CHINH Google kiem ho chu
    // khong tu go lai phep kiem chu ky - it ma hon va khong so viet sai cho
    // hiem. Van phai tu doi chieu aud/iss/exp: tokeninfo tra ve token that
    // nhung co the la token cap cho MOT TRANG KHAC.
    if (req.method === 'POST' && p === '/google') {
      if (!env.GOOGLE_CLIENT_ID) return J({ loi: 'Chưa bật đăng nhập Google' }, 501);
      const b = await than();
      const idToken = String(b.idToken || '');
      if (!idToken) return J({ loi: 'Thiếu mã Google' }, 400);

      let g;
      try {
        const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken));
        g = await r.json();
        if (!r.ok) return J({ loi: 'Google không nhận mã này' }, 401);
      } catch {
        return J({ loi: 'Không hỏi được Google, thử lại' }, 502);
      }

      const issDung = g.iss === 'accounts.google.com' || g.iss === 'https://accounts.google.com';
      const conHan = Number(g.exp || 0) * 1000 > Date.now();
      if (!issDung || g.aud !== env.GOOGLE_CLIENT_ID || !conHan) {
        return J({ loi: 'Mã Google không hợp lệ' }, 401);
      }
      if (g.email_verified !== true && g.email_verified !== 'true') {
        return J({ loi: 'Email Google này chưa được xác minh' }, 401);
      }
      const email = String(g.email || '').trim().toLowerCase();
      const sub = String(g.sub || '');
      if (!email || !sub) return J({ loi: 'Google không trả về email' }, 401);

      // 1) Da noi Google roi thi vao thang
      let nd = await env.DB.prepare('SELECT * FROM nguoi_dung WHERE google_sub=?').bind(sub).first();

      // 2) Chua noi: co tai khoan cung email thi noi vao tai khoan do
      if (!nd) {
        nd = await env.DB.prepare('SELECT * FROM nguoi_dung WHERE email=?').bind(email).first();
        if (nd) {
          await env.DB.prepare('UPDATE nguoi_dung SET google_sub=? WHERE id=?').bind(sub, nd.id).run();
        }
      }

      // 3) Van chua co thi mo tai khoan moi
      if (!nd) {
        // Ten tai khoan lay tu phan truoc dau @, bo ky tu la; trung thi them so
        let goc = email.split('@')[0].replace(/[^A-Za-z0-9._-]/g, '').slice(0, 24) || 'nguoidung';
        if (goc.length < 3) goc = goc + 'abc'.slice(0, 3 - goc.length);
        let tenDn = goc;
        for (let lan = 0; lan < 20; lan++) {
          const trung = await env.DB.prepare('SELECT id FROM nguoi_dung WHERE lower(ten_dn)=?')
            .bind(tenDn.toLowerCase()).first();
          if (!trung) break;
          tenDn = goc.slice(0, 20) + Math.floor(Math.random() * 9000 + 1000);
        }
        // Mat khau ngau nhien dai: tai khoan nay dang nhap bang Google, muon
        // dang nhap bang mat khau thi bam "Quen mat khau" de tu dat.
        const mkNgau = chuoiNgauNhien(24) + chuoiNgauNhien(24);
        for (let lan = 0; lan < 6 && !nd; lan++) {
          try {
            nd = await env.DB.prepare(
              'INSERT INTO nguoi_dung (email,ten_dn,mat_khau,ma_nap,google_sub,tao_luc)' +
              ' VALUES (?,?,?,?,?,?) RETURNING *')
              .bind(email, tenDn, await bamMatKhau(mkNgau), chuoiNgauNhien(6), sub, Date.now()).first();
          } catch (e) {
            if (!String(e).includes('UNIQUE')) throw e;
            const lai = await env.DB.prepare('SELECT * FROM nguoi_dung WHERE google_sub=? OR email=?')
              .bind(sub, email).first();
            if (lai) { nd = lai; break; }
          }
        }
      }

      if (!nd) return J({ loi: 'Không tạo được tài khoản, thử lại' }, 500);
      if (nd.khoa) return J({ loi: 'Tài khoản đang bị khoá' }, 403);
      await env.DB.prepare('UPDATE nguoi_dung SET sai_lan=0, khoa_den=0 WHERE id=?').bind(nd.id).run();
      await ghiNoiO(env, req, nd.id);
      const moi = await env.DB.prepare('SELECT * FROM nguoi_dung WHERE id=?').bind(nd.id).first();
      return J({ token: await taoToken(env, moi), nguoi: hoSo(moi) });
    }

    // ============ CAN DANG NHAP ============
    const toi = await layNguoi(env, req);
    const canDN = () => J({ loi: 'Chưa đăng nhập' }, 401);

    if (p === '/toi') {
      if (!toi) return canDN();
      return J({ nguoi: hoSo(toi) });
    }

    // ---- Doi mat khau ----
    if (req.method === 'POST' && p === '/doi-mat-khau') {
      if (!toi) return canDN();
      const b = await than();
      if (!await khopMatKhau(String(b.cu || ''), toi.mat_khau)) return J({ loi: 'Mật khẩu cũ không đúng' }, 400);
      if (String(b.moi || '').length < 8) return J({ loi: 'Mật khẩu mới phải từ 8 ký tự' }, 400);
      // Tang phien_ver: moi token cu (may khac) het hieu luc ngay
      const nd = await env.DB.prepare('UPDATE nguoi_dung SET mat_khau=?, phien_ver=phien_ver+1 WHERE id=? RETURNING *')
        .bind(await bamMatKhau(String(b.moi)), toi.id).first();
      return J({ ok: true, token: await taoToken(env, nd) });
    }

    // ---- Luu tai khoan ngan hang de rut ----
    if (req.method === 'POST' && p === '/ngan-hang') {
      if (!toi) return canDN();
      const b = await than();
      const nh = String(b.nganHang || '').trim().slice(0, 60);
      const stk = String(b.soTk || '').replace(/\s/g, '').slice(0, 30);
      const ctk = String(b.chuTk || '').trim().toUpperCase().slice(0, 80);
      if (!nh || !/^[0-9]{6,20}$/.test(stk) || ctk.length < 4) {
        return J({ loi: 'Thiếu tên ngân hàng, số tài khoản hoặc tên chủ tài khoản' }, 400);
      }
      await env.DB.prepare('UPDATE nguoi_dung SET ngan_hang=?, so_tk=?, chu_tk=? WHERE id=?')
        .bind(nh, stk, ctk, toi.id).run();
      return J({ ok: true });
    }

    // ---- Sua ho so: so dien thoai ----
    if (req.method === 'POST' && p === '/ho-so') {
      if (!toi) return canDN();
      const b = await than();
      await env.DB.prepare('UPDATE nguoi_dung SET dien_thoai=? WHERE id=?')
        .bind(String(b.dienThoai || '').trim().slice(0, 20), toi.id).run();
      return J({ ok: true });
    }

    // ---- Link tai that: CHI tra ve khi da dang nhap ----
    // Trang web chi mang ma phan mem, bam nut la hoi day.
    if (p === '/lien-ket') {
      if (!toi) return canDN();
      if (toi.khoa) return J({ loi: 'Tài khoản đang bị khoá' }, 403);
      const ma = String(url.searchParams.get('pm') || '');
      const cua = LIEN_KET[ma];
      if (!cua) return J({ loi: 'Không có phần mềm này' }, 404);
      await ghiNoiO(env, req, toi.id);
      return J({ link: cua });
    }

    // ---- Tao link rut gon ----
    if (req.method === 'POST' && p === '/tao-link') {
      if (!toi) return canDN();
      if (toi.khoa) return J({ loi: 'Tài khoản đang bị khoá' }, 403);
      const b = await than();
      const dich = String(b.url || '').trim();
      const nen = nhanNenTang(dich);
      if (!nen) {
        return J({ loi: 'Chỉ nhận link Shopee hoặc TikTok. Dán lại đúng link sản phẩm giúp tôi.' }, 400);
      }
      if (dich.length > 1500) return J({ loi: 'Link dài quá' }, 400);

      const dem = await env.DB.prepare('SELECT COUNT(*) n FROM lien_ket WHERE nguoi=?').bind(toi.id).first();
      if (Number(dem.n) >= 500) return J({ loi: 'Bạn đã tạo 500 link rồi, xoá bớt link cũ đi' }, 429);

      let ma = null;
      for (let lan = 0; lan < 6 && !ma; lan++) {
        const thu = chuoiNgauNhien(7);
        try {
          await env.DB.prepare(
            'INSERT INTO lien_ket (ma,nguoi,dich,nen,ten,tao_luc) VALUES (?,?,?,?,?,?)')
            .bind(thu, toi.id, dich, nen, String(b.ten || '').trim().slice(0, 80) || null, Date.now()).run();
          ma = thu;
        } catch (e) {
          if (!String(e).includes('UNIQUE')) throw e;   // trung ma -> boc ma khac
        }
      }
      if (!ma) return J({ loi: 'Không tạo được link, thử lại' }, 500);
      return J({
        ok: true, ma, nen,
        link: duongLinkNgan(env, ma),
        sanSang: !!(nen === 'shopee' ? env.SHOPEE_AFF_ID : env.TIKTOK_AFF_ID),
      });
    }

    // ---- Link cua toi ----
    if (p === '/link-cua-toi') {
      if (!toi) return canDN();
      const r = await env.DB.prepare(
        'SELECT ma,dich,nen,ten,luot,bam_cuoi,tao_luc FROM lien_ket WHERE nguoi=? ORDER BY tao_luc DESC LIMIT 200')
        .bind(toi.id).all();
      return J({
        link: (r.results || []).map((l) => ({ ...l, link: duongLinkNgan(env, l.ma) })),
      });
    }

    // ---- Xoa link cua chinh minh ----
    if (req.method === 'POST' && p === '/xoa-link') {
      if (!toi) return canDN();
      const b = await than();
      await env.DB.prepare('DELETE FROM lien_ket WHERE ma=? AND nguoi=?')
        .bind(String(b.ma || ''), toi.id).run();
      return J({ ok: true });
    }

    // ---- Thong tin nap tien ----
    if (p === '/nap') {
      if (!toi) return canDN();
      const soTien = Math.max(0, Math.round(Number(url.searchParams.get('soTien')) || 0));
      const noiDung = 'NAP' + toi.ma_nap;
      const q = new URLSearchParams({
        bank: env.NGAN_HANG, acc: env.SO_TK, template: 'qronly', showinfo: 'true',
        holder: env.CHU_TK, des: noiDung,
      });
      if (soTien) q.set('amount', String(soTien));
      return J({
        nganHang: env.NGAN_HANG, soTk: env.SO_TK, chuTk: env.CHU_TK,
        noiDung, qr: 'https://vietqr.app/img?' + q.toString(),
      });
    }

    // ---- So cai cua toi ----
    if (p === '/so-cai') {
      if (!toi) return canDN();
      const truoc = Number(url.searchParams.get('truoc')) || 0;
      const r = await env.DB.prepare(
        'SELECT id,loai,so_tien,so_du_sau,ghi_chu,luc FROM so_cai WHERE nguoi=?' +
        (truoc ? ' AND id<?2' : '') + ' ORDER BY id DESC LIMIT 30')
        .bind(...(truoc ? [toi.id, truoc] : [toi.id])).all();
      return J({ dong: r.results || [] });
    }

    // ---- Mua key bang tien trong vi ----
    if (req.method === 'POST' && p === '/mua') {
      if (!toi) return canDN();
      if (toi.khoa) return J({ loi: 'Tài khoản đang bị khoá' }, 403);
      const b = await than();
      const maPm = String(b.phanMem || '');
      const pm = PHAN_MEM[maPm];
      const goi = pm && pm.goi.find((g) => g.ma === String(b.goi || ''));
      if (!pm || !goi) return J({ loi: 'Không có phần mềm hoặc gói này' }, 400);

      const may = String(b.maMay || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const tuDong = capTuDong(env, pm);
      // Ca hai kieu deu can ma may: kieu mayChu de cong ngay dung may, kieu
      // tuKy de ky key rieng cho may do.
      if (tuDong && !maMayHopLe(may)) {
        return J({ loi: 'Mã máy không đúng. Mở phần mềm, vào mục Bản quyền rồi chép đúng mã máy ở đó.' }, 400);
      }

      const gia = goi.gia;
      const donId = 'D' + Date.now().toString(36).toUpperCase() + chuoiNgauNhien(4);

      // Tru tien + ghi don trong CUNG mot giao dich.
      const kq = await ghiSo(env, toi.id, {
        loai: 'mua', soTien: -gia, maNgoai: 'mua:' + donId,
        ghiChu: 'Mua key ' + pm.ten + ' - ' + goi.ten + (may ? ' (may ' + may + ')' : ''),
        themCau: (sau) => [
          env.DB.prepare('INSERT INTO don_key (id,nguoi,phan_mem,ten_pm,goi,so_ngay,ma_may,gia,trang_thai,luc)' +
            ' SELECT ?1,?2,?3,?4,?5,?6,?7,?8,?9,?10 FROM nguoi_dung WHERE id=?2 AND so_du=?11')
            .bind(donId, toi.id, maPm, pm.ten, goi.ma, goi.ngay, may || null, gia,
              tuDong ? 'dang_xu_ly' : 'cho_tay', Date.now(), sau),
        ],
      });
      if (!kq.ok) {
        return J({
          loi: kq.thieuTien
            ? 'Số dư không đủ. Cần ' + gia.toLocaleString('vi-VN') + 'đ, đang có ' +
              Number(kq.soDu || 0).toLocaleString('vi-VN') + 'đ.'
            : kq.loi,
        }, 400);
      }

      // Thuong nguoi gioi thieu - loi o day khong duoc lam hong don
      const traHoaHong = async () => {
        const ti = Number(env.HOA_HONG || 0);
        if (!toi.nguoi_gt || !ti) return;
        const tien = Math.round((gia * ti) / 100 / 1000) * 1000;
        if (tien > 0) {
          await ghiSo(env, toi.nguoi_gt, {
            loai: 'hoahong', soTien: tien, maNgoai: 'hh:' + donId,
            ghiChu: 'Hoa hồng ' + ti + '% đơn ' + pm.ten + ' của ' + toi.email,
            setThem: 'hh_kiem = hh_kiem + ' + tien,
          }).catch(() => {});
        }
      };

      if (!tuDong) {
        await traHoaHong();
        return J({
          ok: true, don: donId, choTay: true, soDu: kq.soDu,
          nhan: 'Đã nhận đơn. Phần mềm này chưa cấp key tự động — chủ shop sẽ gửi key trong ít phút.',
        });
      }

      // ---- Kieu tuKy: ky key ngay tai day, khong goi di dau, khong cho duyet ----
      if (pm.kieu === 'tuKy') {
        const key = await taoKeyMay(env[pm.bienSecret], pm.tienTo, goi.ma, may);
        await env.DB.prepare("UPDATE don_key SET trang_thai='xong', key=? WHERE id=?")
          .bind(key, donId).run();
        await traHoaHong();
        return J({
          ok: true, don: donId, key, soNgay: goi.ngay, soDu: kq.soDu,
          nhan: 'Key đã cấp xong. Mở ' + pm.ten + ', vào mục Bản quyền, dán key vào rồi bấm Kích hoạt — cộng ngay ' +
            goi.ngay + ' ngày cho máy ' + may + '.',
        });
      }

      // Goi may chu ban quyen cong thang ngay vao ma may, dung duong ma
      // webhook SePay van dung. Khach khong phai nhap key.
      let loiGoi = '';
      const duongGoi = env['MC_' + pm.tienTo].replace(/\/+$/, '') + '/admin/sua';
      try {
        // Di qua service binding chu KHONG fetch ra dia chi workers.dev:
        // Cloudflare chan mot Worker goi HTTP sang Worker khac cung tai khoan
        // (tra ve 404 kem "error code: 1042"). Dia chi o day chi de dat duong
        // dan /admin/sua, ten mien bi bo qua khi di qua binding.
        const noiSang = env['SV_' + pm.tienTo];
        const goiDi = noiSang ? noiSang.fetch.bind(noiSang) : fetch;
        const r = await goiDi(duongGoi, {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: 'Apikey ' + env['QT_' + pm.tienTo] },
          body: JSON.stringify({ may, viec: 'congNgay', soNgay: goi.ngay }),
        });
        // Doc nguyen van roi moi thu doc JSON: hong o tang nao thi cau bao loi
        // van noi ro duoc, khong chi tro tron mot con so.
        const van = await r.text();
        let t = {};
        try { t = JSON.parse(van); } catch { /* khong phai JSON */ }
        if (!r.ok || !t.ok) {
          loiGoi = t.loi || ('ma ' + r.status + ' tu ' + duongGoi + ' - ' + van.slice(0, 150));
        }
      } catch (e) { loiGoi = 'khong goi duoc ' + duongGoi + ' - ' + e; }

      if (loiGoi) {
        // Khong cap duoc ngay -> tra lai tien ngay, khong de khach mat tien
        await ghiSo(env, toi.id, {
          loai: 'hoan', soTien: gia, maNgoai: 'hoan:' + donId,
          ghiChu: 'Hoàn tiền đơn ' + donId + ' (' + loiGoi + ')',
          themCau: () => [env.DB.prepare("UPDATE don_key SET trang_thai='huy' WHERE id=?").bind(donId)],
        });
        return J({ loi: 'Chưa cấp được bản quyền (' + loiGoi + '). Tiền đã hoàn lại vào ví.' }, 502);
      }

      const key = await taoKey(env[pm.bienSecret], pm.tienTo, goi.ma, may);
      await env.DB.prepare("UPDATE don_key SET trang_thai='xong', key=? WHERE id=?").bind(key, donId).run();
      await traHoaHong();
      return J({
        ok: true, don: donId, key, soNgay: goi.ngay, soDu: kq.soDu,
        nhan: 'Đã cộng ' + goi.ngay + ' ngày cho máy ' + may + '. Mở phần mềm là dùng được ngay.',
      });
    }

    // ---- Don cua toi ----
    if (p === '/don') {
      if (!toi) return canDN();
      const r = await env.DB.prepare(
        'SELECT id,ten_pm,goi,so_ngay,ma_may,gia,key,trang_thai,luc FROM don_key WHERE nguoi=? ORDER BY luc DESC LIMIT 50')
        .bind(toi.id).all();
      return J({ don: r.results || [] });
    }

    // ---- Rut tien ve ngan hang ----
    if (p === '/rut') {
      if (!toi) return canDN();

      if (req.method === 'GET') {
        const r = await env.DB.prepare(
          'SELECT id,so_tien,thuc_nhan,phi,ngan_hang,so_tk,chu_tk,trang_thai,ghi_chu,luc,xong_luc' +
          ' FROM yeu_cau_rut WHERE nguoi=? ORDER BY luc DESC LIMIT 50').bind(toi.id).all();
        return J({ yeuCau: r.results || [], toiThieu: Number(env.RUT_TOI_THIEU || 50000), phi: Number(env.PHI_RUT || 0) });
      }

      const b = await than();
      const soTien = Math.round(Number(b.soTien) || 0);
      const toiThieu = Number(env.RUT_TOI_THIEU || 50000);
      const phi = Number(env.PHI_RUT || 0);
      if (!toi.ngan_hang || !toi.so_tk || !toi.chu_tk) {
        return J({ loi: 'Chưa khai tài khoản ngân hàng. Vào mục Tài khoản để khai trước.' }, 400);
      }
      if (soTien < toiThieu) return J({ loi: 'Rút ít nhất ' + toiThieu.toLocaleString('vi-VN') + 'đ' }, 400);
      if (soTien % 1000) return J({ loi: 'Số tiền phải chẵn hàng nghìn' }, 400);
      if (soTien > Number(toi.so_du)) return J({ loi: 'Số dư không đủ' }, 400);

      const dangCho = await env.DB.prepare("SELECT COUNT(*) n FROM yeu_cau_rut WHERE nguoi=? AND trang_thai='cho'")
        .bind(toi.id).first();
      if (Number(dangCho.n) >= 3) return J({ loi: 'Đang có 3 yêu cầu rút chờ xử lý, xong rồi hãy gửi tiếp' }, 429);

      const rutId = 'R' + Date.now().toString(36).toUpperCase() + chuoiNgauNhien(4);
      // Tru ngay khi gui yeu cau (giu tien lai), tu choi thi hoan.
      const kq = await ghiSo(env, toi.id, {
        loai: 'rut', soTien: -soTien, maNgoai: 'rut:' + rutId,
        ghiChu: 'Yêu cầu rút ' + soTien.toLocaleString('vi-VN') + 'đ về ' + toi.ngan_hang + ' ' + toi.so_tk,
        themCau: (sau) => [
          env.DB.prepare('INSERT INTO yeu_cau_rut (id,nguoi,so_tien,thuc_nhan,phi,ngan_hang,so_tk,chu_tk,trang_thai,luc)' +
            " SELECT ?1,?2,?3,?4,?5,?6,?7,?8,'cho',?9 FROM nguoi_dung WHERE id=?2 AND so_du=?10")
            .bind(rutId, toi.id, soTien, soTien - phi, phi, toi.ngan_hang, toi.so_tk, toi.chu_tk, Date.now(), sau),
        ],
      });
      if (!kq.ok) return J({ loi: kq.loi }, 400);
      return J({ ok: true, id: rutId, soDu: kq.soDu, thucNhan: soTien - phi });
    }

    // ============ SEPAY BAO CO TIEN VAO ============
    if (req.method === 'POST' && p === '/webhook/sepay') {
      const auth = req.headers.get('authorization') || '';
      if (env.SEPAY_TOKEN && auth !== 'Apikey ' + env.SEPAY_TOKEN) {
        return J({ success: false, loi: 'sai token' }, 401);
      }
      const b = await than();
      if (b.transferType && b.transferType !== 'in') return J({ success: true });

      const tien = Math.round(Number(b.transferAmount || b.amount || 0));
      const s = String(b.content || b.description || b.transferContent || '')
        .toUpperCase().replace(/[^A-Z0-9]/g, '');
      // Chi an giao dich co "NAP<ma>" - tien mua truc tiep (BZ/ST/PMO...) de
      // may chu ban quyen cua tung phan mem lo, ben nay khong dung vao.
      const m = s.match(new RegExp('NAP([' + BO_KY_TU + ']{6})'));
      if (!m || tien <= 0) return J({ success: true, boQua: true });

      const nd = await env.DB.prepare('SELECT id FROM nguoi_dung WHERE ma_nap=?').bind(m[1]).first();
      if (!nd) return J({ success: true, boQua: 'khong co tai khoan ' + m[1] });

      const maGd = 'sepay:' + (String(b.id || b.referenceCode || '') || Date.now());
      const kq = await ghiSo(env, nd.id, {
        loai: 'nap', soTien: tien, maNgoai: maGd,
        ghiChu: 'Nạp tiền từ ' + (b.gateway || 'ngân hàng') + ' ' + (b.transactionDate || ''),
        setThem: 'da_nap = da_nap + ' + tien,
      });
      if (kq.trung) return J({ success: true, daXuLy: true });
      return J({ success: !!kq.ok, soDu: kq.soDu });
    }

    // ============ QUAN TRI ============
    if (p.startsWith('/admin/')) {
      if (!laQuanTri(req, env)) return J({ loi: 'khong co quyen' }, 401);

      // Danh sach khach
      if (p === '/admin/nguoi') {
        const q = '%' + String(url.searchParams.get('q') || '').trim().toLowerCase() + '%';
        const r = await env.DB.prepare(
          'SELECT id,email,ten_dn,dien_thoai,ip,lan_cuoi,so_du,vai_tro,ma_nap,' +
          'da_nap,da_rut,hh_kiem,khoa,tao_luc' +
          ' FROM nguoi_dung WHERE lower(email) LIKE ?1 OR lower(ten_dn) LIKE ?1 OR ma_nap LIKE ?1' +
          ' OR dien_thoai LIKE ?1' +
          ' ORDER BY id DESC LIMIT 100').bind(q).all();
        return J({ nguoi: r.results || [] });
      }

      // Cong / tru tien tay
      if (req.method === 'POST' && p === '/admin/tien') {
        const b = await than();
        const kq = await ghiSo(env, Number(b.nguoi), {
          loai: 'dieuchinh', soTien: Math.round(Number(b.soTien) || 0),
          ghiChu: String(b.ghiChu || 'Chủ shop điều chỉnh').slice(0, 200),
        });
        return J(kq.ok ? { ok: true, soDu: kq.soDu } : { loi: kq.loi }, kq.ok ? 200 : 400);
      }

      // Gui mot thu thu de biet dich vu gui thu con chay khong.
      // Khoa API cua Brevo tu het han sau 90 ngay khong dung den, nen thinh
      // thoang bam nut nay mot cai vua de kiem tra vua de giu khoa song.
      if (req.method === 'POST' && p === '/admin/thu-mail') {
        const b = await than();
        const den = String(b.den || '').trim();
        if (!emailHopLe(den)) return J({ loi: 'Email không hợp lệ' }, 400);
        const kq = await guiThu(env, den, 'Thư thử từ ví phanmemtq.com',
          '<p>Đây là thư thử. Nhận được thư này nghĩa là chức năng ' +
          '<b>quên mật khẩu</b> gửi thư được bình thường.</p>');
        return J(kq.ok ? { ok: true, den } : { loi: kq.loi }, kq.ok ? 200 : 502);
      }

      // Lay duong dan dat lai mat khau de gui tay cho khach (Zalo, Messenger...)
      // Dung khi chua khai bao dich vu gui thu, hoac thu khong den duoc.
      if (req.method === 'POST' && p === '/admin/link-dat-lai') {
        const b = await than();
        const nd = await env.DB.prepare('SELECT * FROM nguoi_dung WHERE id=?').bind(Number(b.nguoi)).first();
        if (!nd) return J({ loi: 'Không tìm thấy tài khoản' }, 404);
        const ma = await taoMaDatLai(env, nd);
        return J({
          ok: true,
          duongDan: (env.NGUON || 'https://phanmemtq.com') +
            '/tai-khoan/dat-lai-mat-khau/?ma=' + encodeURIComponent(ma),
        });
      }

      // Xoa han mot tai khoan.
      // Chan hai truong hop de khong xoa nham mat tien cua khach:
      //  - vi con tien: phai tra lai hoac tru ve 0 truoc
      //  - con yeu cau rut dang cho: xu ly xong roi hay xoa
      // Xoa la mat luon so cai va don key cua nguoi do, KHONG lay lai duoc.
      if (req.method === 'POST' && p === '/admin/xoa-nguoi') {
        const b = await than();
        const id = Number(b.nguoi);
        const nd = await env.DB.prepare('SELECT * FROM nguoi_dung WHERE id=?').bind(id).first();
        if (!nd) return J({ loi: 'Không tìm thấy tài khoản' }, 404);

        if (Number(nd.so_du) !== 0) {
          return J({
            loi: 'Ví còn ' + Number(nd.so_du).toLocaleString('vi-VN') +
              'đ. Trả lại tiền cho khách hoặc trừ về 0 rồi mới xoá được.',
          }, 400);
        }
        const cho = await env.DB.prepare(
          "SELECT COUNT(*) n FROM yeu_cau_rut WHERE nguoi=? AND trang_thai='cho'").bind(id).first();
        if (Number(cho.n) > 0) {
          return J({ loi: 'Còn yêu cầu rút đang chờ. Trả hoặc từ chối xong rồi mới xoá được.' }, 400);
        }

        await env.DB.batch([
          env.DB.prepare('DELETE FROM so_cai WHERE nguoi=?').bind(id),
          env.DB.prepare('DELETE FROM don_key WHERE nguoi=?').bind(id),
          env.DB.prepare('DELETE FROM yeu_cau_rut WHERE nguoi=?').bind(id),
          // Ai duoc nguoi nay gioi thieu thi go moi noi ra, khong xoa lay theo
          env.DB.prepare('UPDATE nguoi_dung SET nguoi_gt=NULL WHERE nguoi_gt=?').bind(id),
          env.DB.prepare('DELETE FROM nguoi_dung WHERE id=?').bind(id),
        ]);
        return J({ ok: true, tenDn: nd.ten_dn || nd.email });
      }

      // Khoa / mo khoa tai khoan
      if (req.method === 'POST' && p === '/admin/khoa') {
        const b = await than();
        await env.DB.prepare('UPDATE nguoi_dung SET khoa=? WHERE id=?')
          .bind(b.khoa ? 1 : 0, Number(b.nguoi)).run();
        return J({ ok: true });
      }

      // So cai cua mot khach
      if (p === '/admin/so-cai') {
        const r = await env.DB.prepare(
          'SELECT id,loai,so_tien,so_du_sau,ghi_chu,luc FROM so_cai WHERE nguoi=? ORDER BY id DESC LIMIT 100')
          .bind(Number(url.searchParams.get('nguoi'))).all();
        return J({ dong: r.results || [] });
      }

      // Don cho cap key tay
      if (p === '/admin/don') {
        if (req.method === 'GET') {
          const tt = url.searchParams.get('trangThai') || 'cho_tay';
          const r = await env.DB.prepare(
            'SELECT d.*, n.email, n.ten_dn FROM don_key d JOIN nguoi_dung n ON n.id=d.nguoi' +
            ' WHERE d.trang_thai=? ORDER BY d.luc DESC LIMIT 100').bind(tt).all();
          return J({ don: r.results || [] });
        }
        const b = await than();
        const key = String(b.key || '').trim().toUpperCase().slice(0, 40);
        if (!key) return J({ loi: 'thieu key' }, 400);
        await env.DB.prepare("UPDATE don_key SET key=?, trang_thai='xong' WHERE id=? AND trang_thai='cho_tay'")
          .bind(key, String(b.id || '')).run();
        return J({ ok: true });
      }

      // Yeu cau rut tien
      if (p === '/admin/rut') {
        if (req.method === 'GET') {
          const tt = url.searchParams.get('trangThai') || 'cho';
          const r = await env.DB.prepare(
            'SELECT y.*, n.email, n.ten_dn FROM yeu_cau_rut y JOIN nguoi_dung n ON n.id=y.nguoi' +
            ' WHERE y.trang_thai=? ORDER BY y.luc DESC LIMIT 100').bind(tt).all();
          return J({ yeuCau: r.results || [] });
        }
        const b = await than();
        const id = String(b.id || '');
        const yc = await env.DB.prepare("SELECT * FROM yeu_cau_rut WHERE id=? AND trang_thai='cho'").bind(id).first();
        if (!yc) return J({ loi: 'Không có yêu cầu này hoặc đã xử lý' }, 404);

        if (b.viec === 'tra') {
          // Tien da tru luc gui yeu cau roi, day chi danh dau da chuyen khoan
          await env.DB.batch([
            env.DB.prepare("UPDATE yeu_cau_rut SET trang_thai='da_tra', ghi_chu=?, xong_luc=? WHERE id=? AND trang_thai='cho'")
              .bind(String(b.ghiChu || '').slice(0, 200), Date.now(), id),
            env.DB.prepare('UPDATE nguoi_dung SET da_rut = da_rut + ? WHERE id=?').bind(Number(yc.so_tien), yc.nguoi),
          ]);
          return J({ ok: true });
        }
        if (b.viec === 'tuChoi') {
          const kq = await ghiSo(env, yc.nguoi, {
            loai: 'hoan', soTien: Number(yc.so_tien), maNgoai: 'hoanrut:' + id,
            ghiChu: 'Hoàn yêu cầu rút ' + id + (b.ghiChu ? ' - ' + String(b.ghiChu).slice(0, 150) : ''),
            themCau: () => [
              env.DB.prepare("UPDATE yeu_cau_rut SET trang_thai='tu_choi', ghi_chu=?, xong_luc=? WHERE id=? AND trang_thai='cho'")
                .bind(String(b.ghiChu || '').slice(0, 200), Date.now(), id),
            ],
          });
          return J(kq.ok ? { ok: true } : { loi: kq.loi }, kq.ok ? 200 : 400);
        }
        return J({ loi: 'viec la' }, 400);
      }

      // Tong quan
      if (p === '/admin/tong-quan') {
        const [a, c, d, e] = await env.DB.batch([
          env.DB.prepare('SELECT COUNT(*) so, COALESCE(SUM(so_du),0) tong FROM nguoi_dung'),
          env.DB.prepare("SELECT COUNT(*) so FROM yeu_cau_rut WHERE trang_thai='cho'"),
          env.DB.prepare("SELECT COUNT(*) so FROM don_key WHERE trang_thai='cho_tay'"),
          env.DB.prepare("SELECT COALESCE(SUM(so_tien),0) tong FROM so_cai WHERE loai='nap'"),
        ]);
        return J({
          khach: a.results[0].so, tienTrongVi: a.results[0].tong,
          rutCho: c.results[0].so, donChoTay: d.results[0].so, tongNap: e.results[0].tong,
        });
      }
    }

    return J({ loi: 'khong co duong nay' }, 404);
  },
};
