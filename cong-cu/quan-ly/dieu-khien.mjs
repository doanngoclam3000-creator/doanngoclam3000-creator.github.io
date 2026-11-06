// QUAN LY TREN DIEN THOAI — phia may Mac.
// Noi WebSocket toi may chu chuyen tiep (chuyen-tiep/worker.js). Moi yeu cau HTTP cua dien
// thoai di qua do ve day, duoc goi lai vao chinh may chu noi bo (cong 4500) roi tra nguoc ve.
// Ma quan tri vi, git, wrangler… deu nam nguyen tren Mac; dien thoai chi la man hinh.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const MAY_CHU = 'dieu-khien-web.ay-hu.workers.dev';
const KHUC = 512 * 1024;                 // giong worker.js
const THAN_TOI_DA = 45 * 1024 * 1024;
const TRA_LOI_TOI_DA = 60 * 1024 * 1024;
const BANG_CHU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // bo I O 0 1 cho de doc

// Dien thoai KHONG duoc dung toi nhung duong nay, ke ca khi da co ma ghep
const CAM = [
  /^\/api\/dien-thoai(\/|$)/,      // tu doi ma ghep / tu tat minh
  /^\/api\/vi\/ma-quan-tri$/,      // thay ma quan tri vi
  /^\/api\/tai-phan-mem$/,         // day file cai dat len GitHub: file lon, lam tren Mac
];
const CHO_PHEP = /^\/($|index\.html$|api\/|anh\/|video\/|icon\/)/;

const HAN_PHIEN = 30 * 86400 * 1000;      // nhap mat khau mot lan dung duoc 30 ngay tren dien thoai do
const PHIEN_TOI_DA = 10;
const SAI_TOI_DA = 5;                     // sai qua so nay thi khoa nhap mot luc, moi lan khoa lau gap doi

const bam256 = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
const bamMatKhau = (mk, muoi) => crypto.scryptSync(String(mk), Buffer.from(muoi, 'hex'), 32).toString('hex');

const taoMa = () => Array.from(crypto.randomBytes(32), (b) => BANG_CHU[b % 32]).join('');

export function taoDieuKhien({ cong, thuMuc, docBiMat, ghiBiMat }) {
  let ws = null, henNoi = null, henPing = null, lanThu = 0;
  let daNoi = false, lucPong = 0, loiCuoi = '';
  let lanCuoiYc = 0, soYc = 0;
  const dangNhan = new Map();   // id -> { goi, khuc[] }

  const caiDat = () => ({ bat: false, ma: '', ...(docBiMat().dienThoai || {}) });
  const luuCaiDat = (moi) => ghiBiMat({ ...docBiMat(), dienThoai: { ...caiDat(), ...moi } });

  function khoaChuyenTiep() {
    const b = docBiMat();
    if (/^[0-9a-f]{64}$/i.test(b.khoaChuyenTiep || '')) return b.khoaChuyenTiep;
    try {
      const j = JSON.parse(fs.readFileSync(path.join(thuMuc, 'cong-cu/quan-ly/chuyen-tiep/.bi-mat.json'), 'utf8'));
      if (/^[0-9a-f]{64}$/i.test(j.khoaChuyenTiep || '')) {
        // Chep mot ban vao thu muc nha: rut o ngoai ra van con khoa
        ghiBiMat({ ...docBiMat(), khoaChuyenTiep: j.khoaChuyenTiep });
        return j.khoaChuyenTiep;
      }
    } catch {}
    return '';
  }

  // ---- Mat khau dien thoai: lop khoa thu hai sau ma ghep ----
  // Chi luu ban bam (scrypt) trong ~/.quan-ly-website.json. Dien thoai nhap dung thi nhan mot
  // phien ngau nhien, may chi giu ban bam SHA-256 cua phien.
  let soLanSai = 0, khoaToi = 0, lanKhoa = 0;
  const coMatKhau = () => { const c = caiDat(); return !!(c.mkBam && c.mkMuoi); };

  function phienHopLe(phien) {
    if (!phien || typeof phien !== 'string' || phien.length > 128) return false;
    const b = bam256(phien), luc = Date.now();
    return (caiDat().phien || []).some((x) => x.bam === b && x.han > luc);
  }

  function moKhoa(goi, than) {
    if (!coMatKhau()) return traLoi_json(goi.id, 401, { loi: 'Chưa đặt mật khẩu điện thoại. Đặt trong app Quản Lý Website trên Mac, mục 📱 Điện thoại.', canMatKhau: true, chuaDat: true });
    const luc = Date.now();
    if (luc < khoaToi) return traLoi_json(goi.id, 429, { loi: `Nhập sai quá nhiều lần. Thử lại sau ${Math.ceil((khoaToi - luc) / 60000)} phút.` });
    let mk = '';
    try { mk = String(JSON.parse((than || Buffer.alloc(0)).toString('utf8')).matKhau || ''); } catch {}
    const c = caiDat();
    const dung = mk.length > 0 && mk.length <= 200
      && crypto.timingSafeEqual(Buffer.from(bamMatKhau(mk, c.mkMuoi), 'hex'), Buffer.from(c.mkBam, 'hex'));
    if (!dung) {
      soLanSai++;
      if (soLanSai >= SAI_TOI_DA) { soLanSai = 0; lanKhoa++; khoaToi = luc + Math.min(60, 5 * 2 ** (lanKhoa - 1)) * 60000; }
      return traLoi_json(goi.id, 401, { loi: 'Mật khẩu không đúng.', canMatKhau: true });
    }
    soLanSai = 0; lanKhoa = 0;
    const phien = crypto.randomBytes(32).toString('hex');
    const con = (c.phien || []).filter((x) => x.han > luc).slice(-(PHIEN_TOI_DA - 1));
    luuCaiDat({ phien: [...con, { bam: bam256(phien), han: luc + HAN_PHIEN }] });
    traLoi_json(goi.id, 200, { ok: true, phien });
  }

  const gui = (goi) => { try { ws?.send(JSON.stringify(goi)); } catch {} };

  function traLoi(id, ma, kieu, than) {
    const n = than && than.length ? Math.ceil(than.length / KHUC) : 0;
    gui({ k: 'tl', id, ma, kieu, n });
    for (let i = 0; i < n; i++) {
      gui({ k: 'tlt', id, i, b: than.subarray(i * KHUC, Math.min(than.length, (i + 1) * KHUC)).toString('base64') });
    }
  }
  const traLoi_json = (id, ma, obj) => traLoi(id, ma, 'application/json; charset=utf-8', Buffer.from(JSON.stringify(obj)));

  async function thucHien(goi, than) {
    const d = String(goi.d || '/');
    const duong = d.split('?')[0];
    lanCuoiYc = Date.now(); soYc++;
    if (!d.startsWith('/') || d.startsWith('//') || !CHO_PHEP.test(duong)) {
      return traLoi_json(goi.id, 404, { loi: 'Không có đường dẫn này' });
    }
    if (CAM.some((c) => c.test(duong))) {
      return traLoi_json(goi.id, 403, { loi: 'Việc này chỉ làm được ngay trên máy Mac, không làm từ điện thoại.' });
    }
    // Trang va anh la thu cong khai; con moi duong /api/ deu phai qua mat khau
    if (duong.startsWith('/api/')) {
      if (duong === '/api/mo-khoa') return moKhoa(goi, than);
      if (!phienHopLe(goi.phien)) {
        const chuaDat = !coMatKhau();
        return traLoi_json(goi.id, 401, { canMatKhau: true, chuaDat,
          loi: chuaDat ? 'Chưa đặt mật khẩu điện thoại. Đặt trong app Quản Lý Website trên Mac, mục 📱 Điện thoại.' : 'Cần nhập mật khẩu.' });
      }
    }
    try {
      const pt = String(goi.pt || 'GET').toUpperCase();
      const dau = { 'X-Tu-Xa': '1' };
      if (goi.kieu) dau['Content-Type'] = goi.kieu;
      const r = await fetch(`http://127.0.0.1:${cong}${d}`, {
        method: pt, headers: dau, body: pt === 'GET' || pt === 'HEAD' ? undefined : (than || Buffer.alloc(0)),
      });
      const ra = Buffer.from(await r.arrayBuffer());
      if (ra.length > TRA_LOI_TOI_DA) return traLoi_json(goi.id, 502, { loi: 'Tệp này quá lớn để xem trên điện thoại.' });
      traLoi(goi.id, r.status, r.headers.get('content-type') || 'application/octet-stream', ra);
    } catch (e) {
      traLoi_json(goi.id, 500, { loi: 'Máy Mac không xử lý được: ' + String(e.message || e) });
    }
  }

  function nhanTin(tin) {
    if (tin === 'pong') { lucPong = Date.now(); return; }
    let goi; try { goi = JSON.parse(tin); } catch { return; }
    if (goi.k === 'yc') {
      if (!goi.n) return void thucHien(goi, null);
      dangNhan.set(goi.id, { goi, khuc: [], tong: 0 });
    } else if (goi.k === 'yct') {
      const m = dangNhan.get(goi.id); if (!m) return;
      const doan = Buffer.from(String(goi.b || ''), 'base64');
      m.tong += doan.length;
      if (m.tong > THAN_TOI_DA) { dangNhan.delete(goi.id); return traLoi_json(goi.id, 413, { loi: 'File quá lớn' }); }
      m.khuc.push(doan);
      if (m.khuc.length >= m.goi.n) { dangNhan.delete(goi.id); thucHien(m.goi, Buffer.concat(m.khuc)); }
    }
  }

  function dong() {
    clearTimeout(henNoi); clearInterval(henPing); henNoi = henPing = null;
    const cu = ws; ws = null; daNoi = false; dangNhan.clear();
    if (cu) { cu.onclose = cu.onerror = cu.onmessage = cu.onopen = null; try { cu.close(); } catch {} }
  }

  function henNoiLai() {
    clearTimeout(henNoi);
    if (!caiDat().bat) return;
    lanThu++;
    henNoi = setTimeout(noi, Math.min(30000, 1500 * lanThu));
  }

  function noi() {
    dong();
    const { bat, ma } = caiDat();
    if (!bat || !ma) return;
    const khoa = khoaChuyenTiep();
    if (!khoa) { loiCuoi = 'Thiếu khoá chuyển tiếp (cong-cu/quan-ly/chuyen-tiep/.bi-mat.json). Cắm ổ chứa mã nguồn website rồi bật lại.'; return; }
    if (typeof WebSocket === 'undefined') { loiCuoi = 'Node.js trên máy quá cũ, cần bản 22 trở lên.'; return; }
    const xKhoa = crypto.createHmac('sha256', Buffer.from(khoa, 'hex')).update(ma).digest('hex');
    let moi;
    try { moi = new WebSocket(`wss://${MAY_CHU}/noi?vai=may&ma=${ma}`, { headers: { 'X-Khoa': xKhoa } }); }
    catch (e) { loiCuoi = String(e.message || e); return henNoiLai(); }
    ws = moi;
    moi.onopen = () => {
      if (ws !== moi) return;
      daNoi = true; lanThu = 0; loiCuoi = ''; lucPong = Date.now();
      clearInterval(henPing);
      henPing = setInterval(() => {
        // Mac ngu day: ket noi cu la xac chet, khong con pong → noi lai
        if (Date.now() - lucPong > 70000) return noi();
        try { moi.send('ping'); } catch {}
      }, 25000);
    };
    moi.onmessage = (e) => { if (ws === moi && typeof e.data === 'string') nhanTin(e.data); };
    moi.onerror = () => { if (ws === moi) loiCuoi = 'Không nối được máy chủ chuyển tiếp (kiểm tra mạng).'; };
    moi.onclose = () => { if (ws !== moi) return; daNoi = false; clearInterval(henPing); henNoiLai(); };
  }

  // Bao may chu xoa phong cu → link cu chet ngay, roi moi dong
  function huyPhong() {
    if (ws && daNoi) { gui({ k: 'xoa' }); const cu = ws; setTimeout(() => { try { cu.close(); } catch {} }, 400); ws = null; }
    dong();
  }

  return {
    khoiDong() { if (caiDat().bat) noi(); },
    trangThai() {
      const c = caiDat();
      return {
        bat: !!c.bat, ma: c.ma || '', daNoi, coMatKhau: coMatKhau(),
        soPhien: (c.phien || []).filter((x) => x.han > Date.now()).length, loi: daNoi ? '' : loiCuoi,
        link: c.ma ? `https://${MAY_CHU}/?m=${c.ma}` : '',
        lanCuoiYc, soYc,
      };
    },
    datBat(bat) {
      if (bat) { luuCaiDat({ bat: true, ma: caiDat().ma || taoMa() }); lanThu = 0; noi(); }
      else { luuCaiDat({ bat: false }); huyPhong(); }
    },
    /// Dat / doi mat khau: moi dien thoai dang dang nhap deu bi day ra
    datMatKhau(mk) {
      const muoi = crypto.randomBytes(16).toString('hex');
      luuCaiDat({ mkMuoi: muoi, mkBam: bamMatKhau(mk, muoi), phien: [] });
      soLanSai = 0; khoaToi = 0; lanKhoa = 0;
    },
    dangXuatHet() { luuCaiDat({ phien: [] }); },
    doiMa() {
      huyPhong();
      luuCaiDat({ ma: taoMa(), phien: [] });
      lanCuoiYc = 0; soYc = 0; lanThu = 0;
      if (caiDat().bat) setTimeout(noi, 600);
    },
    tat() { dong(); },
  };
}
