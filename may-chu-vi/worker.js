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

const BO_KY_TU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bo I O 0 1 cho khoi doc nham
const NGAY = 86400 * 1000;
const HAN_TOKEN = 30 * NGAY;
const VONG_BAM = 210000; // so vong PBKDF2

// ---- Danh muc phan mem ban duoc bang vi ----
// tienTo + secret: sinh key ngay tai day, giong het may chu ban quyen cua
// phan mem do. Khong co thi capTay = true -> don nam cho chu shop cap key.
const PHAN_MEM = {
  'bot-zalo':        { ten: 'Bot Zalo',                 goc: 150000, tienTo: 'BZ',  bienSecret: 'SECRET_BZ' },
  'shopee-tu-dong':  { ten: 'Shopee Tu Dong',           goc: 150000, tienTo: 'ST',  bienSecret: 'SECRET_ST' },
  // Phan Mem Order dang phat hanh MIEN PHI (website co nhan do "MIEN PHI") nen
  // khong ban key. Muon ban lai thi bo dau // o dong duoi.
  // 'phan-mem-order':  { ten: 'Phan Mem Order',        goc: 150000, tienTo: 'PMO', bienSecret: 'SECRET_PMO' },
  'bot-wechat':      { ten: 'Bot WeChat',               goc: 150000, capTay: true },
  'gia-lap-vi-tri':  { ten: 'Gia Lap Vi Tri',           goc: 300000, capTay: true },
  // Hai phan mem duoi day website CHUA cong bo gia - dang tam de 150k/thang,
  // sua so 'goc' o day roi chay lai cai-dat.cjs neu gia that khac.
  'ban-te':          { ten: 'Phan Mem Quan Ly Kho Te',  goc: 150000, capTay: true },
  'hoc-tieng-trung': { ten: 'Hoc Tieng Trung',          goc: 150000, capTay: true },
};

// He so gia: 1 thang x1, 3 thang x2, 6 thang x3.3333, 1 nam x6
// -> phan mem 150k ra dung bang gia cu 150/300/500/900.
const GOI = [
  { ma: 'M', ten: '1 thang', ngay: 30,  he: 1 },
  { ma: 'Q', ten: '3 thang', ngay: 90,  he: 2 },
  { ma: 'H', ten: '6 thang', ngay: 180, he: 3.3333 },
  { ma: 'Y', ten: '1 nam',   ngay: 365, he: 6 },
];
const giaGoi = (goc, he) => Math.round((goc * he) / 1000) * 1000;

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

// ---------------- Sinh key ban quyen ----------------
// Giong het ham taoKey ben may chu ban quyen tung phan mem.
async function taoKey(secret, tienTo, maGoi, maMay) {
  const than = maGoi + maMay;
  return tienTo + '-' + than + '-' + await hmacHex(secret, 'may:' + than, 8);
}
const maMayHopLe = (m) => /^[A-Z0-9]{6}$/.test(m) && [...m].every((c) => BO_KY_TU.includes(c));

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
  if (!soTien) return { ok: false, loi: 'so tien khong hop le' };

  for (let lan = 0; lan < 5; lan++) {
    const nd = await env.DB.prepare('SELECT so_du, khoa FROM nguoi_dung WHERE id=?').bind(uid).first();
    if (!nd) return { ok: false, loi: 'khong tim thay tai khoan' };
    const truoc = Number(nd.so_du);
    const sau = truoc + soTien;
    if (sau < 0) return { ok: false, loi: 'so du khong du', soDu: truoc };

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
      if (String(e).includes('UNIQUE')) return { ok: false, trung: true, loi: 'giao dich da xu ly' };
      throw e;
    }
    if (kq[0].meta.changes > 0) return { ok: true, soDu: sau, truoc };
  }
  return { ok: false, loi: 'may chu dang ban, thu lai sau vai giay' };
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
  id: nd.id, email: nd.email, ten: nd.ten || '', dienThoai: nd.dien_thoai || '',
  soDu: Number(nd.so_du), vaiTro: nd.vai_tro, maNap: nd.ma_nap,
  daNap: Number(nd.da_nap), daRut: Number(nd.da_rut), hhKiem: Number(nd.hh_kiem),
  nganHang: nd.ngan_hang || '', soTk: nd.so_tk || '', chuTk: nd.chu_tk || '',
  khoa: !!nd.khoa, taoLuc: Number(nd.tao_luc),
});

const emailHopLe = (e) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(e);

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname.replace(/\/+$/, '') || '/';
    const J = (o, s) => traJson(env, req, o, s);

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: dauCORS(env, req) });

    const than = async () => { try { return await req.json(); } catch { return {}; } };

    // ============ CONG KHAI ============

    if (p === '/' || p === '/khoe') return J({ ok: true, ten: 'vi-phanmemtq' });

    // ---- Bang gia ----
    if (p === '/bang-gia') {
      return J({
        phanMem: Object.entries(PHAN_MEM).map(([ma, m]) => ({
          ma, ten: m.ten,
          tuDong: !m.capTay && !!(env[m.bienSecret] && env['MC_' + m.tienTo] && env['QT_' + m.tienTo]),
          goi: GOI.map((g) => ({ ma: g.ma, ten: g.ten, ngay: g.ngay, gia: giaGoi(m.goc, g.he) })),
        })),
      });
    }

    // ---- Dang ky ----
    if (req.method === 'POST' && p === '/dk') {
      const b = await than();
      const email = String(b.email || '').trim().toLowerCase();
      const mk = String(b.matKhau || '');
      if (!emailHopLe(email)) return J({ loi: 'Email khong hop le' }, 400);
      if (mk.length < 8) return J({ loi: 'Mat khau phai tu 8 ky tu tro len' }, 400);

      const daCo = await env.DB.prepare('SELECT id FROM nguoi_dung WHERE email=?').bind(email).first();
      if (daCo) return J({ loi: 'Email nay da co tai khoan' }, 409);

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
            'INSERT INTO nguoi_dung (email,ten,dien_thoai,mat_khau,ma_nap,nguoi_gt,tao_luc)' +
            ' VALUES (?,?,?,?,?,?,?) RETURNING *')
            .bind(email, String(b.ten || '').trim().slice(0, 80), String(b.dienThoai || '').trim().slice(0, 20),
              bam, chuoiNgauNhien(6), nguoiGt, Date.now()).first();
        } catch (e) {
          if (!String(e).includes('UNIQUE')) throw e;   // trung ma_nap -> boc ma khac
          const lai = await env.DB.prepare('SELECT id FROM nguoi_dung WHERE email=?').bind(email).first();
          if (lai) return J({ loi: 'Email nay da co tai khoan' }, 409);
        }
      }
      if (!nd) return J({ loi: 'Khong tao duoc tai khoan, thu lai' }, 500);
      return J({ token: await taoToken(env, nd), nguoi: hoSo(nd) });
    }

    // ---- Dang nhap ----
    if (req.method === 'POST' && p === '/dn') {
      const b = await than();
      const email = String(b.email || '').trim().toLowerCase();
      const nd = await env.DB.prepare('SELECT * FROM nguoi_dung WHERE email=?').bind(email).first();
      // Van bam mat khau gia khi khong co tai khoan: tra loi nhanh/cham nhu nhau
      // thi ke la khong do duoc email nao da dang ky.
      const dung = nd ? await khopMatKhau(String(b.matKhau || ''), nd.mat_khau)
        : await khopMatKhau('x', 'pbkdf2$' + VONG_BAM + '$00$00');
      if (!nd) return J({ loi: 'Email hoac mat khau khong dung' }, 401);
      if (Number(nd.khoa_den) > Date.now()) {
        return J({ loi: 'Sai qua nhieu lan, thu lai sau ' + Math.ceil((nd.khoa_den - Date.now()) / 60000) + ' phut' }, 429);
      }
      if (!dung) {
        const lan = Number(nd.sai_lan) + 1;
        await env.DB.prepare('UPDATE nguoi_dung SET sai_lan=?, khoa_den=? WHERE id=?')
          .bind(lan, lan >= 8 ? Date.now() + 15 * 60000 : 0, nd.id).run();
        return J({ loi: 'Email hoac mat khau khong dung' }, 401);
      }
      if (nd.khoa) return J({ loi: 'Tai khoan dang bi khoa' }, 403);
      await env.DB.prepare('UPDATE nguoi_dung SET sai_lan=0, khoa_den=0 WHERE id=?').bind(nd.id).run();
      return J({ token: await taoToken(env, nd), nguoi: hoSo(nd) });
    }

    // ============ CAN DANG NHAP ============
    const toi = await layNguoi(env, req);
    const canDN = () => J({ loi: 'Chua dang nhap' }, 401);

    if (p === '/toi') {
      if (!toi) return canDN();
      return J({ nguoi: hoSo(toi) });
    }

    // ---- Doi mat khau ----
    if (req.method === 'POST' && p === '/doi-mat-khau') {
      if (!toi) return canDN();
      const b = await than();
      if (!await khopMatKhau(String(b.cu || ''), toi.mat_khau)) return J({ loi: 'Mat khau cu khong dung' }, 400);
      if (String(b.moi || '').length < 8) return J({ loi: 'Mat khau moi phai tu 8 ky tu' }, 400);
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
        return J({ loi: 'Thieu ten ngan hang, so tai khoan hoac ten chu tai khoan' }, 400);
      }
      await env.DB.prepare('UPDATE nguoi_dung SET ngan_hang=?, so_tk=?, chu_tk=? WHERE id=?')
        .bind(nh, stk, ctk, toi.id).run();
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
      if (toi.khoa) return J({ loi: 'Tai khoan dang bi khoa' }, 403);
      const b = await than();
      const maPm = String(b.phanMem || '');
      const pm = PHAN_MEM[maPm];
      const goi = GOI.find((g) => g.ma === String(b.goi || ''));
      if (!pm || !goi) return J({ loi: 'Khong co phan mem hoac goi nay' }, 400);

      const may = String(b.maMay || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const tuDong = !pm.capTay && env[pm.bienSecret] && env['MC_' + pm.tienTo] && env['QT_' + pm.tienTo];
      if (tuDong && !maMayHopLe(may)) {
        return J({ loi: 'Ma may khong dung. Mo phan mem, vao muc Ban quyen de chep ma may 6 ky tu.' }, 400);
      }

      const gia = giaGoi(pm.goc, goi.he);
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
      if (!kq.ok) return J({ loi: kq.loi === 'so du khong du' ? 'So du khong du. Can ' + gia.toLocaleString('vi-VN') + 'd, dang co ' + Number(kq.soDu || 0).toLocaleString('vi-VN') + 'd.' : kq.loi }, 400);

      // Thuong nguoi gioi thieu - loi o day khong duoc lam hong don
      const traHoaHong = async () => {
        const ti = Number(env.HOA_HONG || 0);
        if (!toi.nguoi_gt || !ti) return;
        const tien = Math.round((gia * ti) / 100 / 1000) * 1000;
        if (tien > 0) {
          await ghiSo(env, toi.nguoi_gt, {
            loai: 'hoahong', soTien: tien, maNgoai: 'hh:' + donId,
            ghiChu: 'Hoa hong ' + ti + '% don ' + pm.ten + ' cua ' + toi.email,
            setThem: 'hh_kiem = hh_kiem + ' + tien,
          }).catch(() => {});
        }
      };

      if (!tuDong) {
        await traHoaHong();
        return J({
          ok: true, don: donId, choTay: true, soDu: kq.soDu,
          nhan: 'Da nhan don. Phan mem nay chua cap key tu dong - chu shop se gui key trong it phut.',
        });
      }

      // Goi may chu ban quyen cong thang ngay vao ma may, dung duong ma
      // webhook SePay van dung. Khach khong phai nhap key.
      let loiGoi = '';
      try {
        const r = await fetch(env['MC_' + pm.tienTo].replace(/\/+$/, '') + '/admin/sua', {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: 'Apikey ' + env['QT_' + pm.tienTo] },
          body: JSON.stringify({ may, viec: 'congNgay', soNgay: goi.ngay }),
        });
        const t = await r.json().catch(() => ({}));
        if (!r.ok || !t.ok) loiGoi = t.loi || ('may chu ban quyen tra ma ' + r.status);
      } catch (e) { loiGoi = 'khong goi duoc may chu ban quyen'; }

      if (loiGoi) {
        // Khong cap duoc ngay -> tra lai tien ngay, khong de khach mat tien
        await ghiSo(env, toi.id, {
          loai: 'hoan', soTien: gia, maNgoai: 'hoan:' + donId,
          ghiChu: 'Hoan tien don ' + donId + ' (' + loiGoi + ')',
          themCau: () => [env.DB.prepare("UPDATE don_key SET trang_thai='huy' WHERE id=?").bind(donId)],
        });
        return J({ loi: 'Chua cap duoc ban quyen (' + loiGoi + '). Tien da hoan lai vao vi.' }, 502);
      }

      const key = await taoKey(env[pm.bienSecret], pm.tienTo, goi.ma, may);
      await env.DB.prepare("UPDATE don_key SET trang_thai='xong', key=? WHERE id=?").bind(key, donId).run();
      await traHoaHong();
      return J({
        ok: true, don: donId, key, soNgay: goi.ngay, soDu: kq.soDu,
        nhan: 'Da cong ' + goi.ngay + ' ngay cho may ' + may + '. Mo phan mem la dung duoc ngay.',
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
        return J({ loi: 'Chua khai tai khoan ngan hang. Vao muc Ngan hang de khai truoc.' }, 400);
      }
      if (soTien < toiThieu) return J({ loi: 'Rut it nhat ' + toiThieu.toLocaleString('vi-VN') + 'd' }, 400);
      if (soTien % 1000) return J({ loi: 'So tien phai chan hang nghin' }, 400);
      if (soTien > Number(toi.so_du)) return J({ loi: 'So du khong du' }, 400);

      const dangCho = await env.DB.prepare("SELECT COUNT(*) n FROM yeu_cau_rut WHERE nguoi=? AND trang_thai='cho'")
        .bind(toi.id).first();
      if (Number(dangCho.n) >= 3) return J({ loi: 'Dang co 3 yeu cau rut cho xu ly, xong roi hay gui tiep' }, 429);

      const rutId = 'R' + Date.now().toString(36).toUpperCase() + chuoiNgauNhien(4);
      // Tru ngay khi gui yeu cau (giu tien lai), tu choi thi hoan.
      const kq = await ghiSo(env, toi.id, {
        loai: 'rut', soTien: -soTien, maNgoai: 'rut:' + rutId,
        ghiChu: 'Yeu cau rut ' + soTien.toLocaleString('vi-VN') + 'd ve ' + toi.ngan_hang + ' ' + toi.so_tk,
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
        ghiChu: 'Nap tien tu ' + (b.gateway || 'ngan hang') + ' ' + (b.transactionDate || ''),
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
          'SELECT id,email,ten,dien_thoai,so_du,vai_tro,ma_nap,da_nap,da_rut,hh_kiem,khoa,tao_luc' +
          ' FROM nguoi_dung WHERE lower(email) LIKE ?1 OR lower(ten) LIKE ?1 OR ma_nap LIKE ?1' +
          ' ORDER BY id DESC LIMIT 100').bind(q).all();
        return J({ nguoi: r.results || [] });
      }

      // Cong / tru tien tay
      if (req.method === 'POST' && p === '/admin/tien') {
        const b = await than();
        const kq = await ghiSo(env, Number(b.nguoi), {
          loai: 'dieuchinh', soTien: Math.round(Number(b.soTien) || 0),
          ghiChu: String(b.ghiChu || 'Chu shop dieu chinh').slice(0, 200),
        });
        return J(kq.ok ? { ok: true, soDu: kq.soDu } : { loi: kq.loi }, kq.ok ? 200 : 400);
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
            'SELECT d.*, n.email FROM don_key d JOIN nguoi_dung n ON n.id=d.nguoi' +
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
            'SELECT y.*, n.email FROM yeu_cau_rut y JOIN nguoi_dung n ON n.id=y.nguoi' +
            ' WHERE y.trang_thai=? ORDER BY y.luc DESC LIMIT 100').bind(tt).all();
          return J({ yeuCau: r.results || [] });
        }
        const b = await than();
        const id = String(b.id || '');
        const yc = await env.DB.prepare("SELECT * FROM yeu_cau_rut WHERE id=? AND trang_thai='cho'").bind(id).first();
        if (!yc) return J({ loi: 'khong co yeu cau nay hoac da xu ly' }, 404);

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
            ghiChu: 'Hoan yeu cau rut ' + id + (b.ghiChu ? ' - ' + String(b.ghiChu).slice(0, 150) : ''),
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
