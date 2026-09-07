-- Mỗi tài khoản chỉ nhận mã dùng thử MỘT lần cho mỗi phần mềm.
CREATE TABLE IF NOT EXISTS dung_thu (
  nguoi     INTEGER NOT NULL,
  phan_mem  TEXT NOT NULL,
  ma_key    TEXT,
  ip        TEXT,
  luc       INTEGER NOT NULL,
  PRIMARY KEY (nguoi, phan_mem)
);
CREATE INDEX IF NOT EXISTS idx_dung_thu_ip ON dung_thu(ip, luc);
