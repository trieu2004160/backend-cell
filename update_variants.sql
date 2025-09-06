-- Update existing records and add missing variants
DELETE FROM product_variants WHERE product_id = 12;

INSERT INTO product_variants
    (product_id, storage, color, image_url, price_adjustment, is_active)
VALUES
    (12, '256GB', 'Natural Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 0, true),
    (12, '256GB', 'Blue Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 0, true),
    (12, '256GB', 'White Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 0, true),
    (12, '256GB', 'Black Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 0, true);
