-- Chu shop doc duoc mat khau khach dat (chu shop yeu cau, de doc lai cho khach
-- khi ho quen). Cot nay chi co tu luc bat len: tai khoan cu chua co gi, phai
-- doi khach dang nhap / doi mat khau mot lan moi ghi vao duoc.
ALTER TABLE nguoi_dung ADD COLUMN mk_ro TEXT;

-- Nhat ky dang ky: ghi CA nhung lan dang ky HONG. Truoc day khach bao
-- "toi dang ky roi" ma trong danh sach khong co ten thi khong con dau vet nao
-- de biet vi sao; tu gio moi lan bam Dang ky deu de lai mot dong.
CREATE TABLE IF NOT EXISTS nhat_ky_dk (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  luc        INTEGER NOT NULL,
  kieu       TEXT    NOT NULL,           -- mat_khau | google
  duoc       INTEGER NOT NULL DEFAULT 0, -- 1 = tao duoc tai khoan
  email      TEXT,
  ten_dn     TEXT,
  dien_thoai TEXT,
  loi        TEXT,                       -- vi sao hong
  ip         TEXT
);
CREATE INDEX IF NOT EXISTS nhat_ky_dk_luc ON nhat_ky_dk(luc DESC);
