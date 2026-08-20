import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Moi phan mem = 1 file trong src/content/phan-mem/
const phanMem = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/phan-mem' }),
  schema: z.object({
    ten: z.string(),
    moTa: z.string(),
    nenTang: z.array(z.string()).default([]),
    phienBan: z.string().optional(),
    ngayCapNhat: z.coerce.date(),
    gia: z.string().optional(),
    linkTai: z.string().optional(),
    linkTaiPhu: z.string().optional(),
    linkTaiMac: z.string().optional(),
    linkTaiWin: z.string().optional(),
    linkTaiIOS: z.string().optional(),
    linkTaiAndroid: z.string().optional(),
    dungLuong: z.string().optional(),
    anh: z.string().optional(),
    anhIcon: z.string().optional(),
    mauNen: z.string().default('#2563eb'),
    icon: z.string().default('📦'),
    noiBat: z.boolean().default(false),
    thuTu: z.number().default(99),
  }),
});

// Moi bai viet = 1 file trong src/content/bai-viet/
const baiViet = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bai-viet' }),
  schema: z.object({
    tieuDe: z.string(),
    moTa: z.string(),
    ngayDang: z.coerce.date(),
    chuyenMuc: z.enum(['cap-nhat', 'huong-dan', 'thu-thuat', 'tin-tuc']),
    thuocPhanMem: z.string().optional(),
    anh: z.string().optional(),
    video: z.string().optional(),
    tags: z.array(z.string()).default([]),
    noiBat: z.boolean().default(false),
  }),
});

export const collections = { 'phan-mem': phanMem, 'bai-viet': baiViet };
