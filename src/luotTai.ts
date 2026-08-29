// ===== DEM LUOT TAI VE CHO MOI LINK TAI TREN WEBSITE =====
//
// Con so duoc lay NGAY LUC DUNG TRANG va in thang vao HTML, nen tien ich chan
// quang cao tren may khach khong lam mat o thong ke.
//
// Co hai nguon so lieu, tuy theo link tro di dau:
//
//  1. Link GitHub Releases  -> lay so that GitHub dem san (co ca lich su cu).
//  2. Link khac (file tu host o /tai/, TestFlight...) -> dem so cu BAM VAO NUT,
//     ghi nhan qua GoatCounter theo duong dan ao /tai-ve/<ma>/<kenh>.
//
// Khong cong don hai nguon cho cung mot link nen khong bi dem trung.
import { getCollection } from 'astro:content';
import { CAUHINH } from './config';

const KHO = 'doanngoclam3000-creator/doanngoclam3000-creator.github.io';
const CHO_TOI_DA = 8000;   // moi lenh goi cho toi da 8 giay
const TRANG_TOI_DA = 5;    // moi trang 100 ban phat hanh
const CUNG_LUC = 12;       // goi 12 duong mot luc cho build nhanh

// Chi dem file cai dat that su. Bo qua goi cap nhat nhanh (.goi) va file chu ky
// di kem, vi do la phan mem tu tai ve chu khong phai khach bam nut tai.
const DUOI_TINH = /\.(zip|dmg|exe|apk|pkg|msi|7z|rar|tar\.gz)$/i;

// Cac kenh tai, theo dung thu tu hien tren khoi tai ve
export const KENH_TAI = [
  { ma: 'mac', truong: 'linkTaiMac' },
  { ma: 'windows', truong: 'linkTaiWin' },
  { ma: 'ios', truong: 'linkTaiIOS' },
  { ma: 'android', truong: 'linkTaiAndroid' },
  { ma: 'chung', truong: 'linkTai' },
  { ma: 'du-phong', truong: 'linkTaiPhu' },
] as const;

export type MaKenh = (typeof KENH_TAI)[number]['ma'];

/** Duong dan ao gui len GoatCounter moi khi khach bam nut tai. */
export const duongDanDem = (maPhanMem: string, kenh: string) => `/tai-ve/${maPhanMem}/${kenh}`;

/** Link tro thang toi mot file trong GitHub Releases? */
export const laLinkGitHub = (u?: string) =>
  !!u && u.includes('github.com/') && u.includes('/releases/download/');

/** Link moi cai qua TestFlight: Apple khong cho biet so luot, khong dem. */
export const laLinkTestFlight = (u?: string) => !!u && u.includes('testflight.apple.com');

const coLink = (u?: string): u is string => !!u && u !== '#';

/** Chi dem nhung link tai file that su (macOS, Windows, Android...). */
const dangDemDuoc = (u?: string): u is string => coLink(u) && !laLinkTestFlight(u);

export interface LuotTai {
  tong: number;                        // tong moi phien ban, moi nen tang
  theoKenh: Partial<Record<MaKenh, number>>;  // rieng tung link dang gan tren web
}

interface TepPhatHanh { name: string; download_count: number; browser_download_url: string }
interface BanPhatHanh { tag_name: string; assets: TepPhatHanh[] }

// ----- Nguon 1: GitHub Releases -----
async function goiGitHub(trang: number): Promise<BanPhatHanh[]> {
  const dungLai = new AbortController();
  const hen = setTimeout(() => dungLai.abort(), CHO_TOI_DA);
  try {
    const dau: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'phanmemtq-website',
    };
    // Tren GitHub Actions co san token, dung de khoi bi chan vi goi qua nhieu
    const token = process.env.GITHUB_TOKEN;
    if (token) dau.Authorization = `Bearer ${token}`;

    const r = await fetch(
      `https://api.github.com/repos/${KHO}/releases?per_page=100&page=${trang}`,
      { headers: dau, signal: dungLai.signal },
    );
    if (!r.ok) return [];
    return (await r.json()) as BanPhatHanh[];
  } catch {
    return [];
  } finally {
    clearTimeout(hen);
  }
}

// ----- Nguon 2: so cu bam nut, ghi nhan qua GoatCounter -----
async function demMotDuong(goc: string, duong: string): Promise<number> {
  const dungLai = new AbortController();
  const hen = setTimeout(() => dungLai.abort(), CHO_TOI_DA);
  try {
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

async function dem(): Promise<Map<string, LuotTai>> {
  const dsPhanMem = await getCollection('phan-mem');
  // Xep ma dai truoc de tag khop dung ma cu the nhat
  const maSapXep = dsPhanMem.map((p) => p.id).sort((a, b) => b.length - a.length);

  const tongGitHub = new Map<string, number>();   // ma phan mem -> tong moi ban
  const theoTep = new Map<string, number>();      // link file -> so luot cua rieng file do

  for (let trang = 1; trang <= TRANG_TOI_DA; trang++) {
    const ds = await goiGitHub(trang);
    if (ds.length === 0) break;

    for (const ban of ds) {
      const ma = maSapXep.find((m) => ban.tag_name === m || ban.tag_name.startsWith(`${m}-`));
      for (const tep of ban.assets ?? []) {
        if (!DUOI_TINH.test(tep.name)) continue;
        const so = tep.download_count ?? 0;
        theoTep.set(tep.browser_download_url, so);
        if (ma) tongGitHub.set(ma, (tongGitHub.get(ma) ?? 0) + so);
      }
    }
    if (ds.length < 100) break;
  }

  // Gom cac kenh KHONG phai GitHub de hoi GoatCounter
  const canHoi: { ma: string; kenh: MaKenh; duong: string }[] = [];
  for (const pm of dsPhanMem) {
    for (const k of KENH_TAI) {
      const link = (pm.data as Record<string, unknown>)[k.truong] as string | undefined;
      if (!dangDemDuoc(link) || laLinkGitHub(link)) continue;
      canHoi.push({ ma: pm.id, kenh: k.ma, duong: duongDanDem(pm.id, k.ma) });
    }
  }

  const soBam = new Map<string, number>();  // "ma|kenh" -> so luot bam
  if (CAUHINH.goatCounter && canHoi.length > 0) {
    const goc = `https://${CAUHINH.goatCounter}.goatcounter.com`;
    for (let i = 0; i < canHoi.length; i += CUNG_LUC) {
      const nhom = canHoi.slice(i, i + CUNG_LUC);
      const ket = await Promise.all(nhom.map((c) => demMotDuong(goc, c.duong)));
      nhom.forEach((c, j) => soBam.set(`${c.ma}|${c.kenh}`, ket[j]));
    }
  }

  // ----- Gop lai -----
  const bang = new Map<string, LuotTai>();
  for (const pm of dsPhanMem) {
    const theoKenh: Partial<Record<MaKenh, number>> = {};
    let tongNgoaiGitHub = 0;

    for (const k of KENH_TAI) {
      const link = (pm.data as Record<string, unknown>)[k.truong] as string | undefined;
      if (!dangDemDuoc(link)) continue;
      if (laLinkGitHub(link)) {
        const so = theoTep.get(link) ?? 0;
        if (so > 0) theoKenh[k.ma] = so;
      } else {
        const so = soBam.get(`${pm.id}|${k.ma}`) ?? 0;
        if (so > 0) {
          theoKenh[k.ma] = so;
          tongNgoaiGitHub += so;
        }
      }
    }

    // Co the khai bao them so tai o noi khac trong file .md (luotTaiThem)
    const them = (pm.data as { luotTaiThem?: number }).luotTaiThem ?? 0;
    const tong = (tongGitHub.get(pm.id) ?? 0) + tongNgoaiGitHub + them;
    if (tong > 0 || Object.keys(theoKenh).length > 0) bang.set(pm.id, { tong, theoKenh });
  }

  return bang;
}

// Goi mot lan duy nhat cho ca lan dung trang, cac trang sau dung lai ket qua
let dangDem: Promise<Map<string, LuotTai>> | null = null;

export function layBangLuotTai(): Promise<Map<string, LuotTai>> {
  dangDem ??= dem();
  return dangDem;
}

/** So luot tai cua mot phan mem. Tra ve null neu khong co so lieu -> an di. */
export async function demLuotTai(ma: string): Promise<LuotTai | null> {
  return (await layBangLuotTai()).get(ma) ?? null;
}

export const dinhDangLuot = (n: number) => n.toLocaleString('vi-VN');
