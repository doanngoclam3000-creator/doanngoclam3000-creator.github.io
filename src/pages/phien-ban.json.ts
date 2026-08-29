// Danh sach phien ban moi nhat cua tung phan mem, dang may doc duoc.
// Cac phan mem tren Mac / Windows goi vao day de biet co ban moi hay khong.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CAUHINH } from '../config';

// Lay so phien ban tu ten tep tai ve, vi du:
//   ShopeeTuDong-5.5.1-Windows.zip -> 5.5.1
//   GiaLapViTri-5.15-Windows.zip   -> 5.15
// Link TestFlight khong co so -> tra null, ben goi tu lui ve phienBan chung.
function soTuLink(link: string | undefined | null): string | null {
  if (!link) return null;
  const ten = String(link).split('/').pop() || '';
  const m = ten.match(new RegExp('([0-9]+(?:[.][0-9]+)+)'));
  return m ? m[1] : null;
}

export const GET: APIRoute = async ({ site }) => {
  const ds = (await getCollection('phan-mem')).sort((a, b) => a.data.thuTu - b.data.thuTu);

  const duLieu = {
    capNhatLuc: ds.reduce((moiNhat, p) => {
      const t = p.data.ngayCapNhat.toISOString();
      return t > moiNhat ? t : moiNhat;
    }, ''),
    trangChu: site?.href ?? `https://${CAUHINH.tenSite}`,
    phanMem: ds.map((p) => ({
      ma: p.id,
      ten: p.data.ten,
      phienBan: p.data.phienBan ?? null,
      // Phien ban cu hon muc nay thi bat buoc phai cap nhat moi dung tiep duoc
      banToiThieu: p.data.banToiThieu ?? null,
      ngayCapNhat: p.data.ngayCapNhat.toISOString().slice(0, 10),
      ghiChuCapNhat: p.data.ghiChuCapNhat ?? null,
      nenTang: p.data.nenTang,
      tai: {
        mac: p.data.linkTaiMac || null,
        windows: p.data.linkTaiWin || null,
        ios: p.data.linkTaiIOS || null,
        android: p.data.linkTaiAndroid || null,
      },
      // Phien ban THEO TUNG NEN TANG, doc tu chinh ten tep tai ve.
      // Vi sao can: mot phan mem co the ra ban Windows truoc, ban Mac sau.
      // Chi co mot so phien ban chung thi may Mac bi bao "co ban moi" roi tai
      // ve dung ban cu dang chay - nhac di nhac lai mai khong het.
      phienBanTheoNenTang: {
        mac: soTuLink(p.data.linkTaiMac) || p.data.phienBan || null,
        windows: soTuLink(p.data.linkTaiWin) || p.data.phienBan || null,
        ios: p.data.phienBan || null,
        android: p.data.phienBan || null,
      },
      trang: new URL(`/phan-mem/${p.id}/`, site).href,
    })),
  };

  return new Response(JSON.stringify(duLieu, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
