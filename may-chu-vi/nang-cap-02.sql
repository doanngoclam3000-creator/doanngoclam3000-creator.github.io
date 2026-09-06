-- Doi sang dang ky bang TEN TAI KHOAN (dang nhap duoc bang ten nay hoac email).
-- Bo cot "ten" (ho ten) va "noi" (thanh pho Cloudflare doan) - khong dung nua.
ALTER TABLE nguoi_dung ADD COLUMN ten_dn TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS nguoi_dung_ten_dn ON nguoi_dung(lower(ten_dn));
ALTER TABLE nguoi_dung DROP COLUMN ten;
ALTER TABLE nguoi_dung DROP COLUMN noi;
