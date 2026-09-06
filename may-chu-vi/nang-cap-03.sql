-- Noi tai khoan voi Google: giu id nguoi dung ben Google (truong "sub").
-- Dung sub chu khong dung email vi email doi duoc, con sub thi khong.
ALTER TABLE nguoi_dung ADD COLUMN google_sub TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS nguoi_dung_google ON nguoi_dung(google_sub) WHERE google_sub IS NOT NULL;
