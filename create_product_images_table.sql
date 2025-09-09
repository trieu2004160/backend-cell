-- Tạo bảng product_images để quản lý hình ảnh sản phẩm
CREATE TABLE
IF NOT EXISTS product_images
(
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products
(id) ON
DELETE CASCADE,
    image_type VARCHAR(20)
NOT NULL CHECK
(image_type IN
('main', 'gallery', 'variant')),
    image_url TEXT NOT NULL,
    alt_text VARCHAR
(255) NOT NULL,
    sort_order INTEGER DEFAULT 1,
    variant_capacity VARCHAR
(10), -- Dung lượng cho ảnh variant (128GB, 256GB, etc.)
    variant_color VARCHAR
(50),    -- Màu sắc cho ảnh variant (Natural Titanium, Blue, etc.)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index để tăng hiệu suất truy vấn
CREATE INDEX
IF NOT EXISTS idx_product_images_product_id ON product_images
(product_id);
CREATE INDEX
IF NOT EXISTS idx_product_images_type ON product_images
(image_type);
CREATE INDEX
IF NOT EXISTS idx_product_images_variant ON product_images
(product_id, variant_capacity, variant_color);
CREATE INDEX
IF NOT EXISTS idx_product_images_active ON product_images
(is_active);

-- Thêm một số dữ liệu mẫu
INSERT INTO product_images
    (product_id, image_type, image_url, alt_text, sort_order, variant_capacity, variant_color, is_active)
VALUES
    -- iPhone 15 Pro Max - Ảnh chính
    (1, 'main', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 'iPhone 15 Pro Max - Ảnh chính', 1, NULL, NULL, true),

    -- iPhone 15 Pro Max - Gallery
    (1, 'gallery', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-gallery-1.png', 'iPhone 15 Pro Max - Mặt trước', 2, NULL, NULL, true),
    (1, 'gallery', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-gallery-2.png', 'iPhone 15 Pro Max - Mặt sau', 3, NULL, NULL, true),

    -- iPhone 15 Pro Max - Variants theo màu
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 'iPhone 15 Pro Max - Natural Titanium 256GB', 4, '256GB', 'Natural Titanium', true),
    (1, 'variant', 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_4_16_638488768368578332_2.jpg', 'iPhone 15 Pro Max - Blue Titanium 256GB', 5, '256GB', 'Blue Titanium', true),
    (1, 'variant', 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/2023_9_20_638307982103040290_iphone-15-promax-trang-1.jpg', 'iPhone 15 Pro Max - White Titanium 256GB', 6, '256GB', 'White Titanium', true),
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 'iPhone 15 Pro Max - Black Titanium 256GB', 7, '256GB', 'Black Titanium', true),

    -- iPhone 15 Pro Max - Variants 512GB
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 'iPhone 15 Pro Max - Natural Titanium 512GB', 8, '512GB', 'Natural Titanium', true),
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 'iPhone 15 Pro Max - Blue Titanium 512GB', 9, '512GB', 'Blue Titanium', true),
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 'iPhone 15 Pro Max - White Titanium 512GB', 10, '512GB', 'White Titanium', true),
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 'iPhone 15 Pro Max - Black Titanium 512GB', 11, '512GB', 'Black Titanium', true),

    -- iPhone 15 Pro Max - Variants 1TB
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 'iPhone 15 Pro Max - Natural Titanium 1TB', 12, '1TB', 'Natural Titanium', true),
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 'iPhone 15 Pro Max - Blue Titanium 1TB', 13, '1TB', 'Blue Titanium', true),
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 'iPhone 15 Pro Max - White Titanium 1TB', 14, '1TB', 'White Titanium', true),
    (1, 'variant', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 'iPhone 15 Pro Max - Black Titanium 1TB', 15, '1TB', 'Black Titanium', true)

ON CONFLICT DO NOTHING;

-- Trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column
()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_images_updated_at 
    BEFORE
UPDATE ON product_images 
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();
