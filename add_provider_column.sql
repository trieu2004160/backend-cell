-- Thêm cột provider vào bảng users
-- Chạy: psql -h localhost -U postgres -d cellphones_database < add_provider_column.sql

-- 1. Tạo ENUM type nếu chưa có
DO $
$ 
BEGIN
    CREATE TYPE provider_type AS ENUM
    ('local', 'google', 'facebook');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Thêm cột provider
ALTER TABLE users 
ADD COLUMN
IF NOT EXISTS provider provider_type DEFAULT 'local';

-- 3. Kiểm tra kết quả
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'provider';
