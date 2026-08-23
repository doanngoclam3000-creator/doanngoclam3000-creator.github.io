// Lay so luot truy cap tu GoatCounter NGAY LUC DUNG TRANG.
// Lam vay thi con so duoc in thang vao HTML, khong phu thuoc vao trinh duyet
// nen tien ich chan quang cao khong lam mat o thong ke.
import { getCollection } from 'astro:content';
import { CAUHINH, CHUYEN_MUC } from './config';

const CHO_TOI_DA = 6000;      // moi lenh goi cho toi da 6 giay
const CUNG_LUC = 24;          // goi 24 duong mot luc cho build nhanh

async function demMotDuong(goc: string, duong: string): Promise<number> {
  const dungLai = new AbortController();
  const hen = setTimeout(() => dungLai.abort(), CHO_TOI_DA);
  try {
    // GoatCounter nhan duong dan da bo dau gach dau
    const d = duong.replace(/^\//, '');
    const r = await fetch(`${goc}/counter/${d}.json`, { signal: dungLai.signal });
    if (!r.ok) return 0;
    const j = await r.json();
    return Number(String(j.count).replace(/[^0-9]/g, '')) || 0;
  } catch {
    return 0;
  } finally {
    clearTimeout(hen);
  }
}

/** Tra ve tong so luot truy cap, hoac null neu khong lay duoc. */
export async function demLuotTruyCap(): Promise<number | null> {
  if (!CAUHINH.goatCounter) return null;
  const goc = `https://${CAUHINH.goatCounter}.goatcounter.com`;

  // Gom moi duong dan cua website
  const baiViet = await getCollection('bai-viet');
  const phanMem = await getCollection('phan-mem');
  const duong = [
    '/', '/phan-mem/', '/bai-viet/', '/gioi-thieu/', '/lien-he/',
    ...Object.keys(CHUYEN_MUC).map((m) => `/chuyen-muc/${m}/`),
    ...phanMem.map((p) => `/phan-mem/${p.id}/`),
    ...baiViet.map((b) => `/bai-viet/${b.id}/`),
  ];

  let tong = 0;
  let laySach = false;
  for (let i = 0; i < duong.length; i += CUNG_LUC) {
    const nhom = duong.slice(i, i + CUNG_LUC);
    const so = await Promise.all(nhom.map((d) => demMotDuong(goc, d)));
    for (const n of so) {
      tong += n;
      if (n > 0) laySach = true;
    }
  }

  // Khong lay duoc gi ca thi coi nhu that bai, an o thong ke di
  return laySach ? tong : null;
}
