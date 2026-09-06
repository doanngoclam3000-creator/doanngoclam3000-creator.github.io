#!/usr/bin/env node
// Cai dat may chu vi len Cloudflare bang MOT lenh:  node cai-dat.cjs
//
// Script nay lam ba viec:
//   1. Boc cac chuoi bi mat (lan dau boc ngau nhien, luu lai o .bi-mat.json
//      de lan sau chay lai van ra dung chuoi cu - doi chuoi la khach dang
//      dang nhap bi vang het).
//   2. Lay secret / dia chi / ma quan tri cua ba may chu ban quyen tu
//      "%APPDATA%\Tao Key\san-pham.json" - de vi tu cong ngay duoc cho khach.
//   3. Nap het len Worker roi trien khai.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const thuMuc = __dirname;
const tepBiMat = path.join(thuMuc, '.bi-mat.json');
const tepSanPham = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData/Roaming'),
  'Tao Key', 'san-pham.json');

const ngauNhien = (n) => require('crypto').randomBytes(n).toString('base64url');

// ---- 1. Chuoi bi mat cua rieng vi ----
let biMat = {};
if (fs.existsSync(tepBiMat)) biMat = JSON.parse(fs.readFileSync(tepBiMat, 'utf8'));
let moi = false;
for (const [ten, dai] of [['KHOA_PHIEN', 48], ['MA_QUAN_TRI', 24], ['SEPAY_TOKEN', 24]]) {
  if (!biMat[ten]) { biMat[ten] = ngauNhien(dai); moi = true; }
}
if (moi) fs.writeFileSync(tepBiMat, JSON.stringify(biMat, null, 2));

// ---- 2. Noi sang ba may chu ban quyen ----
const bien = { ...biMat };
if (fs.existsSync(tepSanPham)) {
  for (const sp of JSON.parse(fs.readFileSync(tepSanPham, 'utf8'))) {
    if (!sp.tienTo || !sp.secret || !sp.mayChu || !sp.maQuanTri) continue;
    bien['SECRET_' + sp.tienTo] = sp.secret;
    bien['MC_' + sp.tienTo] = sp.mayChu;
    bien['QT_' + sp.tienTo] = sp.maQuanTri;
    console.log('  + noi duoc may chu ban quyen ' + sp.tienTo + ' (' + sp.ten + ')');
  }
} else {
  console.log('  ! khong thay ' + tepSanPham + ' - cac phan mem se phai cap key tay');
}

// ---- 3. Nap len Worker roi trien khai ----
const tepTam = path.join(os.tmpdir(), 'vi-bien-' + Date.now() + '.json');
fs.writeFileSync(tepTam, JSON.stringify(bien));
const chay = (...tv) => execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['--yes', 'wrangler@latest', ...tv], { cwd: thuMuc, stdio: 'inherit' });
try {
  console.log('\n== Nap bien bi mat ==');
  chay('secret', 'bulk', tepTam);
  console.log('\n== Trien khai ==');
  chay('deploy');
} finally {
  fs.rmSync(tepTam, { force: true });   // xoa ngay, khong de chuoi bi mat nam lai
}

console.log('\n=========================================================');
console.log(' XONG. Hai chuoi duoi day CAN dung, chep ra cho ky:');
console.log('   Ma quan tri (dang nhap trang /tai-khoan/quan-tri/):');
console.log('     ' + biMat.MA_QUAN_TRI);
console.log('   Token webhook SePay (dan vao SePay khi tao webhook):');
console.log('     ' + biMat.SEPAY_TOKEN);
console.log('\n Hai chuoi nay cung nam trong ' + tepBiMat + ' (da chan khong day len GitHub).');
console.log('=========================================================');
