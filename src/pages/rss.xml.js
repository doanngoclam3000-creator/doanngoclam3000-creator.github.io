import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { CAUHINH } from '../config';

export async function GET(context) {
  const baiViet = (await getCollection('bai-viet')).sort((a, b) => +b.data.ngayDang - +a.data.ngayDang);
  return rss({
    title: CAUHINH.tenSite,
    description: CAUHINH.moTa,
    site: context.site,
    items: baiViet.map((b) => ({
      title: b.data.tieuDe,
      description: b.data.moTa,
      pubDate: b.data.ngayDang,
      link: `/bai-viet/${b.id}/`,
    })),
    customData: '<language>vi-VN</language>',
  });
}
