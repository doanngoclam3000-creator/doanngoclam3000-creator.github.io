-- Luoc do CSDL cua vi phanmemtq.com
-- Chay: npx wrangler d1 execute vi-phanmemtq --remote --file=luoc-do.sql

CREATE TABLE IF NOT EXISTS nguoi_dung (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL UNIQUE,
  ten_dn     TEXT,                     -- ten tai khoan, dang nhap duoc bang ten nay hoac email
  dien_thoai TEXT,
  mat_khau   TEXT    NOT NULL,          -- pbkdf2$vong$muoi$bam
  ma_nap     TEXT    NOT NULL UNIQUE,   -- 6 ky tu, noi dung chuyen khoan = NAP<ma_nap>
  so_du      INTEGER NOT NULL DEFAULT 0,
  vai_tro    TEXT    NOT NULL DEFAULT 'khach',
  nguoi_gt   INTEGER,                   -- ai gioi thieu nguoi nay
  da_nap     INTEGER NOT NULL DEFAULT 0,
  da_rut     INTEGER NOT NULL DEFAULT 0,
  hh_kiem    INTEGER NOT NULL DEFAULT 0,
  ngan_hang  TEXT,
  so_tk      TEXT,
  chu_tk     TEXT,
  khoa       INTEGER NOT NULL DEFAULT 0,
  sai_lan    INTEGER NOT NULL DEFAULT 0,
  khoa_den   INTEGER NOT NULL DEFAULT 0,
  phien_ver  INTEGER NOT NULL DEFAULT 1, -- doi mat khau thi tang len, token cu het hieu luc
  tao_luc    INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS nguoi_dung_ten_dn ON nguoi_dung(lower(ten_dn));

-- So cai: MOI dong tien deu co mot dong o day, khong bao gio sua/xoa.
CREATE TABLE IF NOT EXISTS so_cai (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nguoi     INTEGER NOT NULL,
  loai      TEXT    NOT NULL,   -- nap | mua | rut | hoan | hoahong | dieuchinh
  so_tien   INTEGER NOT NULL,   -- duong la cong, am la tru
  so_du_sau INTEGER NOT NULL,
  ghi_chu   TEXT,
  ma_ngoai  TEXT,               -- ma giao dich SePay / id don - de khong cong hai lan
  luc       INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS so_cai_ma_ngoai ON so_cai(ma_ngoai) WHERE ma_ngoai IS NOT NULL;
CREATE INDEX IF NOT EXISTS so_cai_nguoi ON so_cai(nguoi, id DESC);

CREATE TABLE IF NOT EXISTS don_key (
  id         TEXT PRIMARY KEY,
  nguoi      INTEGER NOT NULL,
  phan_mem   TEXT    NOT NULL,
  ten_pm     TEXT    NOT NULL,
  goi        TEXT    NOT NULL,
  so_ngay    INTEGER NOT NULL,
  ma_may     TEXT,
  gia        INTEGER NOT NULL,
  key        TEXT,
  trang_thai TEXT    NOT NULL,   -- xong | cho_tay | huy
  luc        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS don_nguoi ON don_key(nguoi, luc DESC);
CREATE INDEX IF NOT EXISTS don_trang_thai ON don_key(trang_thai, luc DESC);

CREATE TABLE IF NOT EXISTS yeu_cau_rut (
  id         TEXT PRIMARY KEY,
  nguoi      INTEGER NOT NULL,
  so_tien    INTEGER NOT NULL,   -- so tien da tru khoi vi (da gom phi)
  thuc_nhan  INTEGER NOT NULL,   -- so tien khach thuc su nhan duoc
  phi        INTEGER NOT NULL DEFAULT 0,
  ngan_hang  TEXT NOT NULL,
  so_tk      TEXT NOT NULL,
  chu_tk     TEXT NOT NULL,
  trang_thai TEXT NOT NULL,      -- cho | da_tra | tu_choi
  ghi_chu    TEXT,
  luc        INTEGER NOT NULL,
  xong_luc   INTEGER
);
CREATE INDEX IF NOT EXISTS rut_trang_thai ON yeu_cau_rut(trang_thai, luc DESC);
CREATE INDEX IF NOT EXISTS rut_nguoi ON yeu_cau_rut(nguoi, luc DESC);
