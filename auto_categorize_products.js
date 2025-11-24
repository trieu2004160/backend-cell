require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
    }
);

// Mapping rules based on product name
const categorizationRules = [
    // Phones by brand
    { keywords: ["iPhone", "iphone", "IPHONE"], category_id: 2, category_name: "iPhone" },
    { keywords: ["Samsung", "samsung", "Galaxy"], category_id: 3, category_name: "Samsung Galaxy" },
    { keywords: ["Xiaomi", "xiaomi", "Redmi", "POCO"], category_id: 4, category_name: "Xiaomi" },
    { keywords: ["OPPO", "Oppo", "oppo"], category_id: 5, category_name: "Oppo" },
    { keywords: ["Vivo", "vivo", "VIVO"], category_id: 6, category_name: "Vivo" },

    // Other categories
    { keywords: ["Laptop", "laptop", "MacBook", "ThinkPad", "Pavilion"], category_id: 11, category_name: "Laptop" },
    { keywords: ["Màn hình", "Monitor", "Screen"], category_id: 12, category_name: "Màn hình" },
    { keywords: ["Tai nghe", "Headphone", "Earphone", "AirPods"], category_id: 8, category_name: "Tai nghe" },
    { keywords: ["Sạc", "Charger", "Pin", "Battery"], category_id: 9, category_name: "Sạc dự phòng" },
    { keywords: ["Ốp lưng", "Case", "Bao da"], category_id: 10, category_name: "Ốp lưng" },
];

function categorizeProduct(productName) {
    for (const rule of categorizationRules) {
        for (const keyword of rule.keywords) {
            if (productName.includes(keyword)) {
                return { category_id: rule.category_id, category_name: rule.category_name };
            }
        }
    }
    // Default to general "Điện thoại" category if no match
    return { category_id: 1, category_name: "Điện thoại (default)" };
}

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to database.\n");

        // Get all products
        const [products] = await sequelize.query("SELECT id, name, category_id FROM products");

        console.log(`📦 Found ${products.length} products to categorize\n`);

        let updateCount = 0;
        const updates = [];

        for (const product of products) {
            const result = categorizeProduct(product.name);

            if (product.category_id !== result.category_id) {
                updates.push({
                    id: product.id,
                    name: product.name,
                    old_category: product.category_id,
                    new_category: result.category_id,
                    category_name: result.category_name
                });

                await sequelize.query(
                    "UPDATE products SET category_id = :category_id WHERE id = :id",
                    {
                        replacements: { category_id: result.category_id, id: product.id }
                    }
                );
                updateCount++;
            }
        }

        console.log(`✅ Updated ${updateCount} products\n`);

        if (updates.length > 0) {
            console.log("📋 Changes made:");
            console.log("ID | Product Name | Old Cat | New Cat | Category Name");
            console.log("---|--------------|---------|---------|---------------");
            updates.forEach(u => {
                console.log(`${u.id} | ${u.name.substring(0, 30)}... | ${u.old_category} | ${u.new_category} | ${u.category_name}`);
            });
        }

        // Show summary by category
        const [summary] = await sequelize.query(`
      SELECT c.id, c.name, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY c.id
    `);

        console.log("\n📊 Products per category:");
        console.log("Category ID | Category Name | Product Count");
        console.log("------------|---------------|---------------");
        summary.forEach(s => {
            console.log(`${s.id} | ${s.name} | ${s.product_count}`);
        });

        await sequelize.close();
        console.log("\n✅ Categorization complete!");
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
})();
