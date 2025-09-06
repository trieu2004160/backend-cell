-- Create product_variants table
CREATE TABLE
IF NOT EXISTS product_variants
(
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products
(id) ON
DELETE CASCADE,
    storage VARCHAR(50),
    color VARCHAR
(50),
    image_url TEXT,
    price DECIMAL
(15,2),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for iPhone 15 Pro Max
INSERT INTO product_variants
    (product_id, storage, color, image_url, price)
VALUES
    (12, '256GB', 'Đen', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 32990000),
    (12, '256GB', 'Trắng', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 32990000),
    (12, '256GB', 'Xám', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 32990000),
    (12, '256GB', 'Xanh', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 32990000);
