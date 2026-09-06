import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Doi lai thanh ten mien that sau khi mua (vi du: https://phanmemcuatoi.com)
export const SITE = 'https://phanmemtq.com';

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      // Trang vi tien va quan tri khong dua len Google
      filter: (trang) => !trang.includes('/tai-khoan/'),
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
  vite: {
    server: {
      watch: {
        // Khong theo doi thu muc cong cu va ban dung app
        ignored: ['**/cong-cu/**', '**/dist/**'],
        followSymlinks: false,
      },
    },
  },
});
