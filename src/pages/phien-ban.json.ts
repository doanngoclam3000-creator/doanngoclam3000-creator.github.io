// Danh sach phien ban moi nhat cua tung phan mem, dang may doc duoc.
// Cac phan mem tren Mac / Windows goi vao day de biet co ban moi hay khong.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CAUHINH } from '../config';

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
