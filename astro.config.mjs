import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Doi lai thanh ten mien that sau khi mua (vi du: https://phanmemcuatoi.com)
export const SITE = 'https://doanngoclam3000-creator.github.io';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
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
