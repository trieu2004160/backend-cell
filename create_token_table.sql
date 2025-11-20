-- Tạo bảng tokens để lưu access_token và refresh_token
-- PostgreSQL syntax
CREATE TABLE IF NOT EXISTS token (
    id BIGSERIAL PRIMARY KEY,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kiểm tra kết quả
SELECT * FROM token LIMIT 5;
