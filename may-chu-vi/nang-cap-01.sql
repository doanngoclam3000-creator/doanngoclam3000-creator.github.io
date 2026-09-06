-- Them thong tin nguoi dung de chu shop de kiem tra
ALTER TABLE nguoi_dung ADD COLUMN dia_chi TEXT;
ALTER TABLE nguoi_dung ADD COLUMN ip TEXT;
ALTER TABLE nguoi_dung ADD COLUMN noi TEXT;
ALTER TABLE nguoi_dung ADD COLUMN lan_cuoi INTEGER NOT NULL DEFAULT 0;
