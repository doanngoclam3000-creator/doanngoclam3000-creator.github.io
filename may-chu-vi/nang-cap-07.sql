-- Chan lap tai khoan hang loat de xin key dung thu.
--
-- Y do: moi THIET BI chi mo duoc 2 tai khoan, va moi thiet bi chi nhan duoc
-- MOT ma dung thu cho moi phan mem (du mo 2 tai khoan cung the).
--
-- "ma_tb" la dau van thiet bi:
--   tb:<32 hex>  - trinh duyet tu tinh ra (cau hinh may + man hinh + card do
--                  hoa...). Xoa cache hay mo an danh van ra dung ma do.
--   may:<ma may> - phan mem tren may khach gui len (dia chi MAC tren Windows,
--                  UID may tren Mac). Chac chan hon dau van trinh duyet nen
--                  duoc uu tien khi co.
--
-- Chay: npx wrangler d1 execute vi-phanmemtq --remote --file=nang-cap-07.sql

ALTER TABLE nguoi_dung ADD COLUMN ma_tb TEXT;
CREATE INDEX IF NOT EXISTS nguoi_dung_ma_tb ON nguoi_dung(ma_tb);

ALTER TABLE nhat_ky_dk ADD COLUMN ma_tb TEXT;

-- Moi lan mot thiet bi mo mot tai khoan thi them mot dong o day. Giu rieng
-- ra bang nay chu khong chi dua vao cot nguoi_dung.ma_tb, vi xoa tai khoan
-- ben quan tri la mat dau vet, ke gian xoa di roi dang ky lai duoc ngay.
CREATE TABLE IF NOT EXISTS thiet_bi (
  ma_tb  TEXT    NOT NULL,
  nguoi  INTEGER NOT NULL,
  kieu   TEXT,                      -- trinh_duyet | may
  ip     TEXT,
  luc    INTEGER NOT NULL,
  PRIMARY KEY (ma_tb, nguoi)
);
CREATE INDEX IF NOT EXISTS thiet_bi_ma ON thiet_bi(ma_tb);
CREATE INDEX IF NOT EXISTS thiet_bi_nguoi ON thiet_bi(nguoi);

-- Dung thu: chan theo thiet bi chu khong chi theo tai khoan
ALTER TABLE dung_thu ADD COLUMN ma_tb TEXT;
CREATE INDEX IF NOT EXISTS dung_thu_ma_tb ON dung_thu(ma_tb, phan_mem);
