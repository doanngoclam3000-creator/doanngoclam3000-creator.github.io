// May chu cuc bo cho phan mem QUAN LY WEBSITE.
// Chay tren may, khong mo ra ngoai mang. Giao dien la cong-cu/quan-ly/giao-dien.html
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execFile } from 'node:child_process';
import { taoDieuKhien } from './dieu-khien.mjs';

const CHAY_TRONG_APP = process.env.QLWEB_APP === '1';
const GOC_MA = path.dirname(fileURLToPath(import.meta.url));
const THUMUC = process.env.QLWEB_THUMUC
  ? path.resolve(process.env.QLWEB_THUMUC)
  : path.resolve(GOC_MA, '../..');
const D_BAI = path.join(THUMUC, 'src/content/bai-viet');
const D_PM = path.join(THUMUC, 'src/content/phan-mem');
const D_ANH = path.join(THUMUC, 'public/anh');
const D_VIDEO = path.join(THUMUC, 'public/video');
const T_CAUHINH = path.join(THUMUC, 'src/config.ts');
const D_VI = path.join(THUMUC, 'may-chu-vi');
const T_LIENKET = path.join(D_VI, 'lien-ket.json');
const CONG = Number(process.env.QLWEB_CONG) || 4500;
const CONG_WEB = Number(process.env.QLWEB_CONG_WEB) || 4322;
const KHO_GITHUB = 'doanngoclam3000-creator/doanngoclam3000-creator.github.io';

if (!fs.existsSync(D_BAI) || !fs.existsSync(D_PM)) {
  console.error('KHONG-TIM-THAY-WEBSITE: ' + THUMUC);
  process.exit(2);
}
for (const d of [D_ANH, D_VIDEO]) fs.mkdirSync(d, { recursive: true });

// ============ Doc / ghi phan dau tep .md ============
// Chuoi kep da dong het chua? Dem so gach cheo nguoc truoc dau nhay cuoi.
function chuoiDaDong(v) {
  if (v.length < 2 || !v.startsWith('"')) return true;
  if (!v.endsWith('"')) return false;
  let n = 0;
  for (let i = v.length - 2; i >= 0 && v[i] === '\\'; i--) n++;
  return n % 2 === 0;
}

function docGiaTri(v) {
  if (v.startsWith('[') && v.endsWith(']')) {
    return v.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
  }
  if (v === 'true' || v === 'false') return v === 'true';
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v.startsWith('"') && v.endsWith('"') && v.length > 1) {
    try { return JSON.parse(v); } catch {}
    // Chuoi trai qua nhieu dong that: doi xuong dong that thanh \n roi doc lai
    try { return JSON.parse(v.replace(/\r?\n/g, '\\n')); } catch {}
    return v.slice(1, -1);
  }
  return v.replace(/^'|'$/g, '');
}

function tachFrontmatter(vanBan) {
  const m = vanBan.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, noiDung: vanBan };
  const data = {};
  const dong = m[1].split(/\r?\n/);
  for (let i = 0; i < dong.length; i++) {
    const k = dong[i].match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!k) continue;
    let v = k[2].trim();
    // Chuoi kep viet tran ra nhieu dong: gom het lai roi moi doc
    while (!chuoiDaDong(v) && i + 1 < dong.length) { i++; v += '\n' + dong[i]; }
    data[k[1]] = docGiaTri(v);
  }
  return { data, noiDung: m[2] };
}

function ghepFrontmatter(data, noiDung) {
  const dong = [];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      if (!v.length) continue;
      dong.push(`${k}: [${v.map((x) => JSON.stringify(String(x))).join(', ')}]`);
    } else if (typeof v === 'boolean') {
      dong.push(`${k}: ${v}`);
    } else if (typeof v === 'number' && Number.isFinite(v)) {
      dong.push(`${k}: ${v}`);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(String(v))) {
      dong.push(`${k}: ${v}`);
    } else {
      // JSON.stringify go gon ca xuong dong thanh \n -> luon nam tron mot dong,
      // khong bao gio lam vo phan dau tep nhu cach ghi tran truoc day
      dong.push(`${k}: ${JSON.stringify(String(v))}`);
    }
  }
  return `---\n${dong.join('\n')}\n---\n\n${noiDung.trim()}\n`;
}

function taoMa(tieuDe) {
  const dau = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
  const khong = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
  let s = String(tieuDe).toLowerCase();
  s = s.replace(/./g, (c) => { const i = dau.indexOf(c); return i >= 0 ? khong[i] : c; });
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
  return s || 'muc-moi';
}

// ============ Tien ich HTTP ============
const doc = (res, ma, kieu, than) => { res.writeHead(ma, { 'Content-Type': kieu, 'Cache-Control': 'no-store' }); res.end(than); };
const json = (res, obj, ma = 200) => doc(res, ma, 'application/json; charset=utf-8', JSON.stringify(obj));

function docThan(req, gioiHan = 600 * 1024 * 1024) {
  return new Promise((ok, loi) => {
    const phan = []; let n = 0;
    req.on('data', (c) => { n += c.length; if (n > gioiHan) { loi(new Error('File qua lon')); req.destroy(); } else phan.push(c); });
    req.on('end', () => ok(Buffer.concat(phan)));
    req.on('error', loi);
  });
}

function timGh() {
  const cho = [
    path.join(process.env.HOME || '', 'bin/gh'),
    '/opt/homebrew/bin/gh', '/usr/local/bin/gh', '/usr/bin/gh',
  ];
  for (const d of cho) { try { if (fs.statSync(d).isFile()) return d; } catch {} }
  return null;
}

const chayLenh = (lenh, thamSo, thuMuc = THUMUC) => new Promise((ok) => {
  execFile(lenh, thamSo, { cwd: thuMuc, maxBuffer: 20 * 1024 * 1024 }, (e, ra, loi) =>
    ok({ ma: e ? (e.code ?? 1) : 0, ra: (ra || '') + (loi || '') }));
});

// ============ Doc du lieu website ============
async function docThuMucMd(thuMuc) {
  const ds = [];
  for (const f of (await fsp.readdir(thuMuc)).filter((x) => x.endsWith('.md'))) {
    const { data } = tachFrontmatter(await fsp.readFile(path.join(thuMuc, f), 'utf8'));
    ds.push({ id: f.replace(/\.md$/, ''), ...data });
  }
  return ds;
}

async function danhSach() {
  const baiViet = (await docThuMucMd(D_BAI)).sort((a, b) => {
    if (!!a.ghim !== !!b.ghim) return a.ghim ? -1 : 1;
    return String(b.ngayDang).localeCompare(String(a.ngayDang));
  });
  const phanMem = (await docThuMucMd(D_PM)).sort((a, b) => (a.thuTu ?? 99) - (b.thuTu ?? 99));
  return { baiViet, phanMem };
}

// So phien ban doc tu ten tep trong link tai, giong het cach website lam
function soTuLink(link) {
  if (!link) return null;
  const ten = String(link).split('/').pop() || '';
  const m = ten.match(/([0-9]+(?:\.[0-9]+)+)/);
  return m ? m[1] : null;
}

// So sanh hai chuoi phien ban kieu 1.2.10 > 1.2.9
function soSanhBan(a, b) {
  const p = (x) => String(x || '0').split('.').map((n) => Number(n) || 0);
  const A = p(a), B = p(b);
  for (let i = 0; i < Math.max(A.length, B.length); i++) {
    const x = A[i] || 0, y = B[i] || 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

const KENH = [
  { ma: 'mac', ten: 'macOS', link: 'linkTaiMac', epBuoc: 'banToiThieuMac', nhan: /mac/i },
  { ma: 'windows', ten: 'Windows', link: 'linkTaiWin', epBuoc: 'banToiThieuWin', nhan: /win/i },
  { ma: 'ios', ten: 'iPhone / iPad', link: 'linkTaiIOS', epBuoc: 'banToiThieuIOS', nhan: /ios|iphone|ipad/i },
  { ma: 'android', ten: 'Android', link: 'linkTaiAndroid', epBuoc: null, nhan: /android/i },
];

// Phan mem nay co ban cho he dieu hanh do khong
const coNenTang = (p, k) => (p.nenTang || []).some((x) => k.nhan.test(String(x)));

// Soat loi hay gap truoc khi phat hanh
function soatLoi(phanMem) {
  const canh = [];
  for (const p of phanMem) {
    for (const k of KENH) {
      const link = p[k.link];
      const soLink = soTuLink(link);
      const muc = k.epBuoc ? (p[k.epBuoc] ?? p.banToiThieu) : p.banToiThieu;
      // Ep khach cap nhat len ban ma link tai chua co -> khach ket cung
      if (muc && soLink && soSanhBan(muc, soLink) > 0) {
        canh.push({ muc: 'nang', ma: p.id, ten: p.ten,
          chu: `${k.ten}: bắt cập nhật lên ${muc} nhưng link tải mới có bản ${soLink}. Khách sẽ bị khoá mà không tải được bản mới.` });
      }
      // Chi nhac khi phan mem that su co ban cho he dieu hanh do
      if (muc && !link && coNenTang(p, k)) {
        canh.push({ muc: 'nang', ma: p.id, ten: p.ten,
          chu: `${k.ten}: có ép cập nhật (${muc}) nhưng chưa điền link tải.` });
      }
      // Link tai da moi hon so phien ban ghi tren trang
      if (soLink && p.phienBan && soSanhBan(soLink, p.phienBan) > 0) {
        canh.push({ muc: 'nhe', ma: p.id, ten: p.ten,
          chu: `${k.ten}: file tải là bản ${soLink} nhưng ô Phiên bản vẫn ghi ${p.phienBan}.` });
      }
    }
    if (!p.mienPhi && !p.gia) {
      canh.push({ muc: 'nhe', ma: p.id, ten: p.ten, chu: 'Chưa điền giá bán, trang phần mềm sẽ để trống ô giá.' });
    }
  }
  return canh;
}

// lien-ket.json (Worker vi doc) co con khop voi cac tep .md khong
function soLechLienKet(phanMem) {
  let dangCo = {};
  try { dangCo = JSON.parse(fs.readFileSync(T_LIENKET, 'utf8')); } catch {}
  const canPhai = {};
  const bang = { mac: 'linkTaiMac', windows: 'linkTaiWin', ios: 'linkTaiIOS',
                 android: 'linkTaiAndroid', chung: 'linkTai', 'du-phong': 'linkTaiPhu' };
  for (const p of phanMem) {
    const cua = {};
    for (const [kenh, truong] of Object.entries(bang)) {
      const l = p[truong];
      if (l && l !== '#') cua[kenh] = l;
    }
    if (Object.keys(cua).length) canPhai[p.id] = cua;
  }
  const lech = [];
  for (const ma of new Set([...Object.keys(canPhai), ...Object.keys(dangCo)])) {
    const a = canPhai[ma] || {}, b = dangCo[ma] || {};
    for (const kenh of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (a[kenh] !== b[kenh]) lech.push({ ma, kenh, trongTep: a[kenh] || '(trống)', trongWorker: b[kenh] || '(trống)' });
    }
  }
  return lech;
}

// ============ Cau hinh website (src/config.ts) ============
const O_CAUHINH = [
  { khoa: 'tenSite', nhan: 'Tên website', kieu: 'chu' },
  { khoa: 'khauHieu', nhan: 'Khẩu hiệu', kieu: 'chu' },
  { khoa: 'moTa', nhan: 'Mô tả trang (Google đọc)', kieu: 'dai' },
  { khoa: 'tacGia', nhan: 'Tác giả', kieu: 'chu' },
  { khoa: 'facebook', nhan: 'Facebook', kieu: 'chu' },
  { khoa: 'zalo', nhan: 'Zalo', kieu: 'chu' },
  { khoa: 'wechat', nhan: 'WeChat', kieu: 'chu' },
  { khoa: 'wechatQR', nhan: 'Ảnh QR WeChat', kieu: 'chu' },
  { khoa: 'goatCounter', nhan: 'Mã GoatCounter (đếm lượt xem)', kieu: 'chu' },
  { khoa: 'email', nhan: 'Email', kieu: 'chu' },
  { khoa: 'youtube', nhan: 'YouTube', kieu: 'chu' },
  { khoa: 'thongBaoBanMoi', nhan: 'Hiện popup báo bản mới', kieu: 'co' },
  { khoa: 'mayChuVi', nhan: 'Địa chỉ máy chủ ví', kieu: 'chu' },
  { khoa: 'anhBanner', nhan: 'Ảnh banner trang chủ', kieu: 'chu' },
];

function docCauHinh() {
  const vb = fs.readFileSync(T_CAUHINH, 'utf8');
  const ra = {};
  for (const o of O_CAUHINH) {
    const m = vb.match(new RegExp(`^\\s*${o.khoa}:\\s*(.*?),?\\s*$`, 'm'));
    if (!m) continue;
    let v = m[1].trim().replace(/,$/, '');
    if (o.kieu === 'co') ra[o.khoa] = v === 'true';
    else ra[o.khoa] = v.replace(/^['"]|['"]$/g, '');
  }
  return ra;
}

function ghiCauHinh(moi) {
  let vb = fs.readFileSync(T_CAUHINH, 'utf8');
  for (const o of O_CAUHINH) {
    if (!(o.khoa in moi)) continue;
    const giaTri = o.kieu === 'co' ? String(moi[o.khoa] === true)
      : "'" + String(moi[o.khoa] ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    const bieuThuc = new RegExp(`(^\\s*${o.khoa}:\\s*)(.*?)(,?\\s*)$`, 'm');
    if (bieuThuc.test(vb)) vb = vb.replace(bieuThuc, (_, a, __, c) => a + giaTri + (c.includes(',') ? c : ',' + c));
  }
  fs.writeFileSync(T_CAUHINH, vb, 'utf8');
}

// ============ Dem luot xem tu GoatCounter ============
async function demMotDuong(goc, duong, tuNgay) {
  const dungLai = new AbortController();
  const hen = setTimeout(() => dungLai.abort(), 6000);
  try {
    const d = duong.replace(/^\//, '');
    const them = tuNgay ? `?start=${tuNgay}` : '';
    const r = await fetch(`${goc}/counter/${d}.json${them}`, { signal: dungLai.signal });
    if (!r.ok) return 0;
    const j = await r.json();
    return Number(String(j.count).replace(/[^0-9]/g, '')) || 0;
  } catch { return 0; } finally { clearTimeout(hen); }
}

async function thongKeTruyCap(ds) {
  const ma = docCauHinh().goatCounter;
  if (!ma) return { co: false, duong: [], tong: 0, homNay: 0 };
  const goc = `https://${ma}.goatcounter.com`;
  const gioVN = new Date(Date.now() + 7 * 3600 * 1000);
  const ngay = gioVN.toISOString().slice(0, 10);
  const duong = [
    { d: '/', ten: 'Trang chủ' },
    { d: '/phan-mem/', ten: 'Danh sách phần mềm' },
    { d: '/bai-viet/', ten: 'Danh sách bài viết' },
    ...ds.phanMem.filter((p) => !p.an).map((p) => ({ d: `/phan-mem/${p.id}/`, ten: p.ten })),
    ...ds.baiViet.map((b) => ({ d: `/bai-viet/${b.id}/`, ten: b.tieuDe })),
  ];
  const ra = [];
  let tong = 0, homNay = 0;
  for (let i = 0; i < duong.length; i += 12) {
    const nhom = duong.slice(i, i + 12);
    const [a, b] = await Promise.all([
      Promise.all(nhom.map((x) => demMotDuong(goc, x.d))),
      Promise.all(nhom.map((x) => demMotDuong(goc, x.d, ngay))),
    ]);
    nhom.forEach((x, j) => {
      ra.push({ ...x, tong: a[j], homNay: b[j] });
      tong += a[j]; homNay += b[j];
    });
  }
  ra.sort((x, y) => y.tong - x.tong);
  return { co: true, duong: ra, tong, homNay };
}

// ============ Dem luot tai tu GitHub Releases ============
async function thongKeLuotTai(phanMem) {
  const gh = timGh();
  if (!gh) return { co: false, ds: [] };
  const dem = {};
  for (let trang = 1; trang <= 3; trang++) {
    const kq = await chayLenh(gh, ['api', `repos/${KHO_GITHUB}/releases?per_page=100&page=${trang}`]);
    if (kq.ma !== 0) break;
    let ds = [];
    try { ds = JSON.parse(kq.ra); } catch { break; }
    if (!ds.length) break;
    for (const ban of ds) {
      const the = String(ban.tag_name || '');
      // Tim phan mem co ma la dau cua the, lay ma dai nhat cho khoi nham
      let chu = null;
      for (const p of phanMem) if (the.startsWith(p.id) && (!chu || p.id.length > chu.id.length)) chu = p;
      if (!chu) continue;
      for (const tep of ban.assets || []) {
        if (!/\.(zip|dmg|exe|apk|pkg|msi|7z|rar)$/i.test(tep.name)) continue;
        dem[chu.id] = dem[chu.id] || { ma: chu.id, ten: chu.ten, tong: 0, tep: [] };
        dem[chu.id].tong += tep.download_count || 0;
        dem[chu.id].tep.push({ ten: tep.name, the, so: tep.download_count || 0 });
      }
    }
    if (ds.length < 100) break;
  }
  const ra = Object.values(dem).map((x) => {
    x.tep.sort((a, b) => b.so - a.so);
    x.tep = x.tep.slice(0, 6);
    return x;
  }).sort((a, b) => b.tong - a.tong);
  return { co: true, ds: ra };
}

// ============ Kiem tra mot link tai con song khong ============
async function kiemLink(link) {
  if (!link) return { ok: false, chu: 'Chưa có link' };
  if (/testflight\.apple\.com/.test(link)) return { ok: true, chu: 'Link TestFlight (không kiểm được dung lượng)' };
  const dungLai = new AbortController();
  const hen = setTimeout(() => dungLai.abort(), 12000);
  try {
    let r = await fetch(link, { method: 'HEAD', redirect: 'follow', signal: dungLai.signal });
    if (r.status === 403 || r.status === 405) r = await fetch(link, { method: 'GET', redirect: 'follow', signal: dungLai.signal, headers: { Range: 'bytes=0-1' } });
    const co = Number(r.headers.get('content-length') || 0);
    if (!r.ok && r.status !== 206) return { ok: false, chu: `Lỗi ${r.status}` };
    return { ok: true, chu: co ? `${(co / 1048576).toFixed(1)} MB` : 'Tải được', kichThuoc: co };
  } catch (e) {
    return { ok: false, chu: e.name === 'AbortError' ? 'Quá lâu không trả lời' : 'Không nối được' };
  } finally { clearTimeout(hen); }
}

// ============ Noi chuyen voi may chu vi (Cloudflare Worker) ============
// Ma quan tri KHONG duoc nam trong kho ma nguon. Tim lan luot cac cho sau,
// khong thay thi app hoi mot lan roi ghi vao tep rieng trong thu muc nha.
const T_BI_MAT = path.join(process.env.HOME || '', '.quan-ly-website.json');

function docBiMat() {
  try { return JSON.parse(fs.readFileSync(T_BI_MAT, 'utf8')); } catch { return {}; }
}
function ghiBiMat(o) {
  fs.writeFileSync(T_BI_MAT, JSON.stringify(o, null, 2), { encoding: 'utf8', mode: 0o600 });
}
function maQuanTri() {
  if (process.env.QLWEB_MA_QT) return process.env.QLWEB_MA_QT.trim();
  const b = docBiMat();
  if (b.maQuanTri) return String(b.maQuanTri).trim();
  try {
    const j = JSON.parse(fs.readFileSync(path.join(D_VI, '.bi-mat.json'), 'utf8'));
    if (j.MA_QUAN_TRI) return String(j.MA_QUAN_TRI).trim();
  } catch {}
  for (const t of ['/Volumes/CHUNG/ma-quan-tri-vi.txt', path.join(process.env.HOME || '', 'ma-quan-tri-vi.txt')]) {
    try {
      const v = fs.readFileSync(t, 'utf8').trim().split(/\s+/)[0];
      if (v) return v;
    } catch {}
  }
  return '';
}
// QLWEB_VI: chi dung khi thu nghiem, binh thuong lay dia chi trong src/config.ts
const diaChiVi = () => String(process.env.QLWEB_VI || docCauHinh().mayChuVi || '').replace(/\/+$/, '');

// Goi mot duong dan quan tri cua may chu vi
async function goiVi(duong, tuyChon = {}, maTam) {
  const goc = diaChiVi();
  const ma = maTam || maQuanTri();
  if (!goc) return { loi: 'Chưa khai địa chỉ máy chủ ví trong mục Cấu hình' };
  if (!ma) return { loi: 'CHUA_CO_MA' };
  const dungLai = new AbortController();
  const hen = setTimeout(() => dungLai.abort(), 20000);
  try {
    const r = await fetch(goc + duong, {
      ...tuyChon,
      signal: dungLai.signal,
      headers: { Authorization: 'Apikey ' + ma, 'Content-Type': 'application/json', ...(tuyChon.headers || {}) },
    });
    const vb = await r.text();
    let du; try { du = JSON.parse(vb); } catch { du = { loi: vb.slice(0, 200) }; }
    if (r.status === 401) return { loi: 'MA_SAI' };
    return du;
  } catch (e) {
    return { loi: e.name === 'AbortError' ? 'Máy chủ ví không trả lời' : 'Không nối được máy chủ ví' };
  } finally { clearTimeout(hen); }
}

// ============ Cac duong dan API ============
// Quan ly tren dien thoai: xem dieu-khien.mjs
const dieuKhien = taoDieuKhien({ cong: CONG, thuMuc: THUMUC, docBiMat, ghiBiMat });
const TEN_MAY_HOP_LE = new Set([`localhost:${CONG}`, `127.0.0.1:${CONG}`]);

const may = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${CONG}`);
  const duong = u.pathname;
  try {
    // Chi nhan yeu cau goi dung ten may noi bo: chan trang web la tro ten mien ve 127.0.0.1
    if (!TEN_MAY_HOP_LE.has(String(req.headers.host || '').toLowerCase())) return json(res, { loi: 'Tên máy không hợp lệ' }, 403);
    const tuXa = req.headers['x-tu-xa'] === '1';   // yeu cau di tu dien thoai qua may chu chuyen tiep

    // ---- Quan ly tren dien thoai: chi bat / tat / doi ma ngay tren may Mac ----
    if (duong.startsWith('/api/dien-thoai')) {
      if (tuXa) return json(res, { loi: 'Việc này chỉ làm được ngay trên máy Mac.' }, 403);
      if (duong === '/api/dien-thoai' && req.method === 'GET') return json(res, dieuKhien.trangThai());
      if (duong === '/api/dien-thoai' && req.method === 'POST') {
        const { bat } = JSON.parse((await docThan(req)).toString() || '{}');
        dieuKhien.datBat(bat === true);
        return json(res, dieuKhien.trangThai());
      }
      if (duong === '/api/dien-thoai/mat-khau' && req.method === 'POST') {
        const { matKhau } = JSON.parse((await docThan(req)).toString() || '{}');
        const mk = String(matKhau || '');
        if (mk.length < 6) return json(res, { loi: 'Mật khẩu phải từ 6 ký tự trở lên' }, 400);
        if (mk.length > 200) return json(res, { loi: 'Mật khẩu quá dài' }, 400);
        dieuKhien.datMatKhau(mk);
        return json(res, dieuKhien.trangThai());
      }
      if (duong === '/api/dien-thoai/dang-xuat' && req.method === 'POST') {
        dieuKhien.dangXuatHet();
        return json(res, dieuKhien.trangThai());
      }
      if (duong === '/api/dien-thoai/doi-ma' && req.method === 'POST') {
        dieuKhien.doiMa();
        return json(res, dieuKhien.trangThai());
      }
    }

    if (duong === '/' || duong === '/index.html') {
      const tep = fs.existsSync(path.join(GOC_MA, 'giao-dien.html'))
        ? path.join(GOC_MA, 'giao-dien.html')
        : path.join(THUMUC, 'cong-cu/quan-ly/giao-dien.html');
      return doc(res, 200, 'text/html; charset=utf-8', await fsp.readFile(tep, 'utf8'));
    }

    // Anh, video, icon cua website: doc thang tu thu muc public de xem thu ngay trong app
    if (/^\/(anh|video|icon|tai)\//.test(duong)) {
      const tep = path.join(THUMUC, 'public', decodeURIComponent(duong));
      if (!tep.startsWith(path.join(THUMUC, 'public') + path.sep)) return json(res, { loi: 'Đường dẫn không hợp lệ' }, 400);
      if (!fs.existsSync(tep) || !fs.statSync(tep).isFile()) return json(res, { loi: 'Không có tệp này' }, 404);
      const duoi = path.extname(tep).toLowerCase();
      const KIEU = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif',
        '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.mov': 'video/quicktime',
        '.webm': 'video/webm', '.ico': 'image/x-icon' };
      res.writeHead(200, { 'Content-Type': KIEU[duoi] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      return fs.createReadStream(tep).on('error', () => res.destroy()).pipe(res);
    }

    if (duong === '/api/danh-sach') return json(res, await danhSach());

    if (duong === '/api/bai') {
      const thuMuc = u.searchParams.get('loai') === 'phan-mem' ? D_PM : D_BAI;
      const tep = path.join(thuMuc, path.basename(u.searchParams.get('id') || '') + '.md');
      if (!fs.existsSync(tep)) return json(res, { loi: 'Không tìm thấy mục này' }, 404);
      const { data, noiDung } = tachFrontmatter(await fsp.readFile(tep, 'utf8'));
      return json(res, { data, noiDung });
    }

    if (duong === '/api/luu' && req.method === 'POST') {
      const { id, idCu, loai, data, noiDung } = JSON.parse((await docThan(req)).toString());
      const thuMuc = loai === 'phan-mem' ? D_PM : D_BAI;
      const ma = path.basename(id || taoMa(data.tieuDe || data.ten));
      await fsp.writeFile(path.join(thuMuc, ma + '.md'), ghepFrontmatter(data, noiDung || ''), 'utf8');
      if (idCu && idCu !== ma) {
        const cu = path.join(thuMuc, path.basename(idCu) + '.md');
        if (fs.existsSync(cu)) await fsp.unlink(cu);
      }
      return json(res, { ok: true, id: ma });
    }

    if (duong === '/api/xoa' && req.method === 'POST') {
      const { id, loai } = JSON.parse((await docThan(req)).toString());
      const tep = path.join(loai === 'phan-mem' ? D_PM : D_BAI, path.basename(id) + '.md');
      if (fs.existsSync(tep)) await fsp.unlink(tep);
      return json(res, { ok: true });
    }

    if (duong === '/api/tai-len' && req.method === 'PUT') {
      const laVideo = u.searchParams.get('loai') === 'video';
      const tenGoc = path.basename(u.searchParams.get('ten') || 'tep');
      const duoi = path.extname(tenGoc).toLowerCase() || (laVideo ? '.mp4' : '.jpg');
      const ten = taoMa(path.basename(tenGoc, path.extname(tenGoc))) + '-' + Date.now().toString(36) + duoi;
      const than = await docThan(req);
      await fsp.writeFile(path.join(laVideo ? D_VIDEO : D_ANH, ten), than);
      return json(res, { ok: true, url: `/${laVideo ? 'video' : 'anh'}/${ten}`, kichThuoc: than.length });
    }

    if (duong === '/api/gh') {
      const gh = timGh();
      if (!gh) return json(res, { coGh: false, daDangNhap: false });
      const tt = await chayLenh(gh, ['auth', 'status']);
      return json(res, { coGh: true, daDangNhap: tt.ma === 0 });
    }

    // ---- Day file cai dat len GitHub Releases ----
    if (duong === '/api/tai-phan-mem' && req.method === 'PUT') {
      const gh = timGh();
      if (!gh) return json(res, { loi: 'Máy chưa có công cụ gh của GitHub' }, 400);
      const ma = path.basename(u.searchParams.get('ma') || '');
      const phienBan = (u.searchParams.get('phienBan') || '').trim();
      const tenGoc = path.basename(u.searchParams.get('ten') || 'phanmem');
      if (!ma) return json(res, { loi: 'Chưa biết là phần mềm nào' }, 400);
      if (!phienBan) return json(res, { loi: 'Điền số phiên bản trước khi tải file lên' }, 400);

      const thuMucTam = path.join(THUMUC, 'cong-cu/tam');
      fs.mkdirSync(thuMucTam, { recursive: true });
      const tepTam = path.join(thuMucTam, tenGoc);
      await new Promise((xong, hong) => {
        const ghi = fs.createWriteStream(tepTam);
        req.pipe(ghi);
        ghi.on('finish', xong); ghi.on('error', hong); req.on('error', hong);
      });

      const the = `${ma}-${phienBan}`;
      let ket;
      const daCo = await chayLenh(gh, ['release', 'view', the]);
      if (daCo.ma === 0) ket = await chayLenh(gh, ['release', 'upload', the, tepTam, '--clobber']);
      else ket = await chayLenh(gh, ['release', 'create', the, tepTam, '--title', `Phiên bản ${phienBan}`, '--notes', `Bản phát hành ${phienBan}`]);

      if (ket.ma !== 0) {
        try { fs.unlinkSync(tepTam); } catch {}
        const raw = ket.ra || '';
        let loi;
        if (/gh auth login|GH_TOKEN/.test(raw)) loi = 'Chưa đăng nhập GitHub. Mở Terminal chạy: ~/bin/gh auth login';
        else if (/already exists/i.test(raw)) loi = 'File này đã có trong bản phát hành. Đổi tên file hoặc tăng số phiên bản.';
        else if (/rate limit|network|timeout|connection/i.test(raw)) loi = 'Mạng trục trặc khi đẩy lên GitHub, thử lại sau ít phút.';
        else loi = 'Không đẩy lên được: ' + raw.trim().split('\n').slice(-2).join(' ').slice(0, 200);
        return json(res, { loi }, 500);
      }

      const xem = await chayLenh(gh, ['release', 'view', the, '--json', 'assets']);
      let diaChi = null;
      try {
        const ds = JSON.parse(xem.ra).assets || [];
        const t = ds.find((x) => x.name === tenGoc);
        if (t) diaChi = t.url;
      } catch {}
      const kichThuoc = fs.statSync(tepTam).size;
      try { fs.unlinkSync(tepTam); } catch {}
      return json(res, { ok: true, url: diaChi, the, kichThuoc });
    }

    // ---- Tinh hinh chung ----
    if (duong === '/api/tong-quan') {
      const ds = await danhSach();
      const tt = await chayLenh('git', ['status', '--short']);
      const cho = await chayLenh('git', ['rev-list', '--count', 'origin/main..HEAD']);
      const chuaDay = cho.ma === 0 ? Number(cho.ra.trim()) || 0 : -1;
      const lanCuoi = await chayLenh('git', ['log', '-1', '--format=%cr|%s']);
      return json(res, {
        thayDoi: tt.ra.trim().split('\n').filter(Boolean),
        chuaDay,
        lanCuoi: lanCuoi.ma === 0 ? lanCuoi.ra.trim() : '',
        soBai: ds.baiViet.length,
        soPhanMem: ds.phanMem.length,
        soAn: ds.phanMem.filter((p) => p.an).length,
        canhBao: soatLoi(ds.phanMem),
        lechLienKet: soLechLienKet(ds.phanMem),
      });
    }

    // ---- Tinh hinh dung web tren GitHub ----
    if (duong === '/api/lan-dung') {
      const gh = timGh();
      if (!gh) return json(res, { co: false });
      const kq = await chayLenh(gh, ['run', 'list', '-R', KHO_GITHUB, '-L', '5',
        '--json', 'status,conclusion,displayTitle,createdAt,url']);
      if (kq.ma !== 0) return json(res, { co: false });
      try { return json(res, { co: true, ds: JSON.parse(kq.ra) }); }
      catch { return json(res, { co: false }); }
    }

    // ---- Kiem tra link tai ----
    if (duong === '/api/kiem-link' && req.method === 'POST') {
      const { link } = JSON.parse((await docThan(req)).toString());
      return json(res, await kiemLink(link));
    }

    if (duong === '/api/kiem-tat-ca' && req.method === 'POST') {
      const ds = (await danhSach()).phanMem;
      const ra = [];
      for (const p of ds) {
        for (const k of KENH) {
          const link = p[k.link];
          if (!link) continue;
          ra.push({ ma: p.id, ten: p.ten, kenh: k.ten, link, ...(await kiemLink(link)) });
        }
      }
      return json(res, { ds: ra });
    }

    // ---- Ep khach cap nhat len ban dang phat hanh ----
    if (duong === '/api/ep-cap-nhat' && req.method === 'POST') {
      const { ma, kenh } = JSON.parse((await docThan(req)).toString());
      const tep = path.join(D_PM, path.basename(ma) + '.md');
      if (!fs.existsSync(tep)) return json(res, { loi: 'Không tìm thấy phần mềm' }, 404);
      const { data, noiDung } = tachFrontmatter(await fsp.readFile(tep, 'utf8'));
      const dat = [];
      for (const k of KENH.filter((x) => x.epBuoc && (!kenh || kenh.includes(x.ma)))) {
        const so = soTuLink(data[k.link]);
        if (!so) continue;                       // khong co link ban moi thi khong ep
        data[k.epBuoc] = so;
        dat.push(`${k.ten} → ${so}`);
      }
      if (!dat.length) return json(res, { loi: 'Chưa có link tải nào đọc được số phiên bản, chưa ép được' }, 400);
      await fsp.writeFile(tep, ghepFrontmatter(data, noiDung), 'utf8');
      return json(res, { ok: true, chu: dat.join(' · ') });
    }

    // ---- Worker vi: dong bo link va trien khai ----
    if (duong === '/api/lien-ket' && req.method === 'POST') {
      const kq = await chayLenh('node', ['may-chu-vi/lay-lien-ket.cjs']);
      return json(res, { ok: kq.ma === 0, nhatKy: kq.ra.trim() });
    }

    if (duong === '/api/deploy-vi' && req.method === 'POST') {
      const b1 = await chayLenh('node', ['may-chu-vi/lay-lien-ket.cjs']);
      const b2 = await chayLenh('npx', ['--yes', 'wrangler', 'deploy'], D_VI);
      const ok = b2.ma === 0;
      return json(res, { ok, nhatKy: (b1.ra + '\n' + b2.ra).trim() });
    }

    // ---- Thong ke ----
    if (duong === '/api/thong-ke-xem') return json(res, await thongKeTruyCap(await danhSach()));
    if (duong === '/api/thong-ke-tai') return json(res, await thongKeLuotTai((await danhSach()).phanMem));

    // ---- Cau hinh website ----
    if (duong === '/api/cau-hinh' && req.method === 'GET') return json(res, { o: O_CAUHINH, giaTri: docCauHinh() });
    if (duong === '/api/cau-hinh' && req.method === 'POST') {
      ghiCauHinh(JSON.parse((await docThan(req)).toString()));
      return json(res, { ok: true });
    }

    // ---- Khach hang: doc tu may chu vi ----
    if (duong === '/api/vi/trang-thai') {
      return json(res, { diaChi: diaChiVi(), coMa: !!maQuanTri(), tepMa: T_BI_MAT });
    }
    if (duong === '/api/vi/ma-quan-tri' && req.method === 'POST') {
      const { ma } = JSON.parse((await docThan(req)).toString());
      const sach = String(ma || '').trim();
      if (!sach) return json(res, { loi: 'Chưa nhập mã' }, 400);
      // Thu ma TRUOC khi ghi de: ma cu con dung thi khong mat oan
      const thu = await goiVi('/admin/tong-quan', {}, sach);
      if (thu.loi === 'MA_SAI') return json(res, { loi: 'Mã quản trị không đúng, máy chủ ví không nhận' }, 400);
      if (thu.loi) return json(res, { loi: thu.loi }, 502);
      ghiBiMat({ ...docBiMat(), maQuanTri: sach });
      return json(res, { ok: true, ...thu });
    }
    if (duong === '/api/vi/tong-quan') return json(res, await goiVi('/admin/tong-quan'));
    if (duong === '/api/vi/khach') {
      const q = encodeURIComponent(u.searchParams.get('q') || '');
      return json(res, await goiVi('/admin/nguoi?q=' + q));
    }
    if (duong === '/api/vi/khach-chi-tiet') {
      const id = Number(u.searchParams.get('nguoi')) || 0;
      return json(res, await goiVi('/admin/khach?nguoi=' + id));
    }
    if (duong === '/api/vi/dang-ky') return json(res, await goiVi('/admin/nhat-ky-dk'));
    if (duong === '/api/vi/don') {
      const q = encodeURIComponent(u.searchParams.get('q') || '');
      const tt = encodeURIComponent(u.searchParams.get('trangThai') || '');
      return json(res, await goiVi('/admin/don-tim?q=' + q + '&trangThai=' + tt));
    }
    if (duong === '/api/vi/dat-mat-khau' && req.method === 'POST') {
      return json(res, await goiVi('/admin/dat-mat-khau', { method: 'POST', body: (await docThan(req)).toString() }));
    }
    if (duong === '/api/vi/link-dat-lai' && req.method === 'POST') {
      return json(res, await goiVi('/admin/link-dat-lai', { method: 'POST', body: (await docThan(req)).toString() }));
    }
    if (duong === '/api/vi/khoa' && req.method === 'POST') {
      return json(res, await goiVi('/admin/khoa', { method: 'POST', body: (await docThan(req)).toString() }));
    }
    // Cong / tru tien thang vao vi khach. May chu vi tu ghi so cai, tu chan
    // truong hop tru qua so du; o day chi kiem so so bo cho khoi goi bua.
    if (duong === '/api/vi/tien' && req.method === 'POST') {
      const b = JSON.parse((await docThan(req)).toString());
      const soTien = Math.round(Number(b.soTien) || 0);
      if (!b.nguoi || !soTien) return json(res, { loi: 'Thiếu người nhận hoặc số tiền' }, 400);
      if (Math.abs(soTien) > 50_000_000) return json(res, { loi: 'Mỗi lần tối đa 50.000.000đ, chia nhỏ ra nếu cần' }, 400);
      const ghiChu = String(b.ghiChu || '').trim() || (soTien > 0 ? 'Chủ shop cộng tiền' : 'Chủ shop trừ tiền');
      return json(res, await goiVi('/admin/tien', { method: 'POST', body: JSON.stringify({ nguoi: b.nguoi, soTien, ghiChu }) }));
    }
    if (duong === '/api/vi/cap-key' && req.method === 'POST') {
      return json(res, await goiVi('/admin/don', { method: 'POST', body: (await docThan(req)).toString() }));
    }

    // ---- Dua len web ----
    if (duong === '/api/dang' && req.method === 'POST') {
      const { loiNhan } = JSON.parse((await docThan(req)).toString());
      const buoc = [];
      buoc.push(await chayLenh('node', ['may-chu-vi/lay-lien-ket.cjs']));
      buoc.push(await chayLenh('git', ['add', '-A']));
      const c = await chayLenh('git', ['commit', '-m', loiNhan || 'Cap nhat website']);
      buoc.push(c);
      if (c.ra.includes('nothing to commit')) return json(res, { ok: false, nhatKy: 'Không có gì thay đổi để đăng.' });
      const p = await chayLenh('git', ['push', 'origin', 'main']);
      buoc.push(p);
      return json(res, { ok: p.ma === 0, nhatKy: buoc.map((b) => b.ra).join('\n').trim() });
    }

    return json(res, { loi: 'Không có đường dẫn này' }, 404);
  } catch (e) {
    return json(res, { loi: String(e.message || e) }, 500);
  }
});

// Chay kem may chu xem thu cua website
let web = null;
if (process.env.QLWEB_KHONG_XEM_THU !== '1') try {
  web = spawn('npm', ['run', 'dev', '--', '--port', String(CONG_WEB)], { cwd: THUMUC, stdio: 'ignore' });
} catch {}

may.listen(CONG, '127.0.0.1', () => {
  const dc = `http://localhost:${CONG}`;
  console.log('\n  QUAN LY WEBSITE dang chay');
  console.log('  Bang dieu khien: ' + dc);
  console.log('  Xem thu website: http://localhost:' + CONG_WEB + '\n');
  if (!CHAY_TRONG_APP) spawn('open', [dc]);
  dieuKhien.khoiDong();
  console.log('SAN-SANG');
});

const dong = () => { try { web?.kill(); } catch {} process.exit(0); };
process.on('SIGINT', dong);
process.on('SIGTERM', dong);
