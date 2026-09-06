-- Link rut gon cua cong tac vien.
-- ma: phan duoi cua duong dan ngan, vi du go.../AbC123
-- dich: dia chi goc khach dan vao (Shopee / TikTok)
CREATE TABLE IF NOT EXISTS lien_ket (
  ma       TEXT PRIMARY KEY,
  nguoi    INTEGER NOT NULL,
  dich     TEXT    NOT NULL,
  nen      TEXT,                          -- shopee | tiktok
  ten      TEXT,                          -- ten cong tac vien tu dat cho de nho
  luot     INTEGER NOT NULL DEFAULT 0,    -- so lan co nguoi bam vao
  bam_cuoi INTEGER NOT NULL DEFAULT 0,
  tao_luc  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS lien_ket_nguoi ON lien_ket(nguoi, tao_luc DESC);
