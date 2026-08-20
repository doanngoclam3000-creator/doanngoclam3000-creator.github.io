// Phan mem soan bai cho website - chay cuc bo tren may, khong can mang
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execFile } from 'node:child_process';

const CHAY_TRONG_APP = process.env.SOANBAI_APP === '1';
const THUMUC = process.env.SOANBAI_THUMUC
  ? path.resolve(process.env.SOANBAI_THUMUC)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const D_BAI = path.join(THUMUC, 'src/content/bai-viet');
const D_PM = path.join(THUMUC, 'src/content/phan-mem');
const D_ANH = path.join(THUMUC, 'public/anh');
const D_VIDEO = path.join(THUMUC, 'public/video');
const CONG = Number(process.env.SOANBAI_CONG) || 4400;
const CONG_WEB = 4321;

if (!fs.existsSync(D_BAI) || !fs.existsSync(D_PM)) {
  console.error('KHONG-TIM-THAY-WEBSITE: ' + THUMUC);
  process.exit(2);
}
for (const d of [D_ANH, D_VIDEO]) fs.mkdirSync(d, { recursive: true });

// ---------- Doc/ghi frontmatter ----------
function tachFrontmatter(vanBan) {
  const m = vanBan.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, noiDung: vanBan };
  const data = {};
  for (const dong of m[1].split(/\r?\n/)) {
    const k = dong.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!k) continue;
    let v = k[2].trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      v = v.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else if (v === 'true' || v === 'false') {
      v = v === 'true';
    } else if (v.startsWith('"') && v.endsWith('"') && v.length > 1) {
      // Chuoi co dau nhay: giai ma dung cach de khong bi nhan doi dau \\
      try { v = JSON.parse(v); } catch { v = v.slice(1, -1); }
    } else {
      v = v.replace(/^'|'$/g, '');
    }
    data[k[1]] = v;
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
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(String(v))) {
      dong.push(`${k}: ${v}`);
    } else {
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
  return s || 'bai-viet-moi';
}

// ---------- Tien ich HTTP ----------
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

const chayLenh = (lenh, thamSo) => new Promise((ok) => {
  execFile(lenh, thamSo, { cwd: THUMUC, maxBuffer: 10 * 1024 * 1024 }, (e, ra, loi) => ok({ ma: e ? 1 : 0, ra: (ra || '') + (loi || '') }));
});

// ---------- Cac API ----------
async function danhSach() {
  const docThuMuc = async (thuMuc) => {
    const ds = [];
    for (const f of (await fsp.readdir(thuMuc)).filter((x) => x.endsWith('.md'))) {
      const { data } = tachFrontmatter(await fsp.readFile(path.join(thuMuc, f), 'utf8'));
      ds.push({ id: f.replace(/\.md$/, ''), ...data });
    }
    return ds;
  };
  const baiViet = (await docThuMuc(D_BAI)).sort((a, b) => String(b.ngayDang).localeCompare(String(a.ngayDang)));
  const phanMem = (await docThuMuc(D_PM)).sort((a, b) => (a.thuTu ?? 99) - (b.thuTu ?? 99));
  return { baiViet, phanMem };
}

const may = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${CONG}`);
  const duong = u.pathname;
  try {
    if (duong === '/' || duong === '/index.html') {
      return doc(res, 200, 'text/html; charset=utf-8', await fsp.readFile(path.join(THUMUC, 'cong-cu/giao-dien.html'), 'utf8'));
    }
    if (duong === '/api/danh-sach') return json(res, await danhSach());

    if (duong === '/api/bai') {
      const loai = u.searchParams.get('loai') === 'phan-mem' ? D_PM : D_BAI;
      const tep = path.join(loai, path.basename(u.searchParams.get('id') || '') + '.md');
      if (!fs.existsSync(tep)) return json(res, { loi: 'Không tìm thấy bài' }, 404);
      const { data, noiDung } = tachFrontmatter(await fsp.readFile(tep, 'utf8'));
      return json(res, { data, noiDung });
    }

    if (duong === '/api/luu' && req.method === 'POST') {
      const { id, idCu, loai, data, noiDung } = JSON.parse((await docThan(req)).toString());
      const thuMuc = loai === 'phan-mem' ? D_PM : D_BAI;
      const ma = path.basename(id || taoMa(data.tieuDe || data.ten));
      const tep = path.join(thuMuc, ma + '.md');
      await fsp.writeFile(tep, ghepFrontmatter(data, noiDung || ''), 'utf8');
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

    if (duong === '/api/git') {
      const tt = await chayLenh('git', ['status', '--short']);
      const xa = await chayLenh('git', ['remote', '-v']);
      // Dem so ban ghi da luu nhung chua day len mang
      const cho = await chayLenh('git', ['rev-list', '--count', 'origin/main..HEAD']);
      const chuaDay = cho.ma === 0 ? Number(cho.ra.trim()) || 0 : -1;
      return json(res, {
        thayDoi: tt.ra.trim().split('\n').filter(Boolean),
        coRemote: xa.ra.includes('origin'),
        chuaDay,
      });
    }

    if (duong === '/api/dang' && req.method === 'POST') {
      const { loiNhan } = JSON.parse((await docThan(req)).toString());
      const buoc = [];
      buoc.push(await chayLenh('git', ['add', '-A']));
      const c = await chayLenh('git', ['commit', '-m', loiNhan || 'Cap nhat bai viet']);
      buoc.push(c);
      if (c.ra.includes('nothing to commit')) return json(res, { ok: false, nhatKy: 'Không có gì thay đổi để đăng.' });
      const p = await chayLenh('git', ['push', 'origin', 'main']);
      buoc.push(p);
      const thanhCong = p.ma === 0;
      return json(res, { ok: thanhCong, nhatKy: buoc.map((b) => b.ra).join('\n').trim() });
    }

    return json(res, { loi: 'Không có đường dẫn này' }, 404);
  } catch (e) {
    return json(res, { loi: String(e.message || e) }, 500);
  }
});

// Chay kem may chu xem thu cua website
let web = null;
try {
  web = spawn('npm', ['run', 'dev', '--', '--port', String(CONG_WEB)], { cwd: THUMUC, stdio: 'ignore', detached: false });
} catch {}

may.listen(CONG, () => {
  const dc = `http://localhost:${CONG}`;
  console.log('\n  ┌───────────────────────────────────────────────┐');
  console.log('  │   SOAN BAI WEBSITE - dang chay                │');
  console.log('  ├───────────────────────────────────────────────┤');
  console.log(`  │   Soan bai:  ${dc}          │`);
  console.log(`  │   Xem thu:   http://localhost:${CONG_WEB}          │`);
  console.log('  │                                               │');
  console.log('  │   Dong cua so nay la tat phan mem             │');
  console.log('  └───────────────────────────────────────────────┘\n');
  if (!CHAY_TRONG_APP) spawn('open', [dc]);
  console.log('SAN-SANG');
});

const dong = () => { try { web?.kill(); } catch {} process.exit(0); };
process.on('SIGINT', dong);
process.on('SIGTERM', dong);
