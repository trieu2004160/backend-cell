-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id BIGINT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_variant_id ON cart_items(variant_id);

-- Create unique constraint to prevent duplicate items
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_unique 
ON cart_items(user_id, product_id, variant_id);

COMMENT ON TABLE cart_items IS 'Shopping cart items for users';
COMMENT ON COLUMN cart_items.user_id IS 'Reference to user who owns this cart item';
COMMENT ON COLUMN cart_items.product_id IS 'Reference to product';
COMMENT ON COLUMN cart_items.variant_id IS 'Reference to product variant';
COMMENT ON COLUMN cart_items.quantity IS 'Quantity of items in cart';
