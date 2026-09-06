#!/usr/bin/env node
// Doc link tai cua tung phan mem trong src/content/phan-mem/*.md roi ghi ra
// lien-ket.json de nhet vao Worker.
//
// Vi sao phai lam vay: trang web la trang tinh, de link thang trong HTML thi
// ai cung chep duoc ma khong can dang nhap. Nay HTML chi con ma phan mem, con
// link that thi phai hoi Worker va Worker chi tra loi khi da dang nhap.
//
// Chay tu dong moi lan `npm run build` va moi lan `node cai-dat.cjs`.

const fs = require('fs');
const path = require('path');

const thuMucND = path.join(__dirname, '..', 'src', 'content', 'phan-mem');
const raTep = path.join(__dirname, 'lien-ket.json');

// kenh tren website  ->  ten truong trong tep .md
const KENH = {
  mac: 'linkTaiMac',
  windows: 'linkTaiWin',
  ios: 'linkTaiIOS',
  android: 'linkTaiAndroid',
  chung: 'linkTai',
  'du-phong': 'linkTaiPhu',
};

// Doc mot truong trong phan dau (frontmatter) YAML - du dung cho truong hop nay:
// moi truong nam gon mot dong, gia tri boc trong nhay doi hoac de tran.
function layTruong(dau, ten) {
  const d = dau.match(new RegExp('^' + ten + ':[ \\t]*(.*)$', 'm'));
  if (!d) return '';
  let v = d[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  return v;
}

const bang = {};
for (const tep of fs.readdirSync(thuMucND).filter((t) => t.endsWith('.md'))) {
  const noiDung = fs.readFileSync(path.join(thuMucND, tep), 'utf8');
  const khop = noiDung.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!khop) continue;
  const dau = khop[1];
  const ma = tep.replace(/\.md$/, '');
  const cua = {};
  for (const [kenh, truong] of Object.entries(KENH)) {
    const link = layTruong(dau, truong);
    if (link && link !== '#') cua[kenh] = link;
  }
  if (Object.keys(cua).length) bang[ma] = cua;
}

fs.writeFileSync(raTep, JSON.stringify(bang, null, 2) + '\n');
const soLink = Object.values(bang).reduce((t, c) => t + Object.keys(c).length, 0);
console.log('lien-ket.json: ' + Object.keys(bang).length + ' phan mem, ' + soLink + ' link');
