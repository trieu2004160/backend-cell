const { Sequelize, DataTypes, Op } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
    }
);

const Product = sequelize.define('Product', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING },
}, { tableName: 'products', timestamps: true, underscored: true });

async function scanDuplicates() {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'slug'],
            order: [['name', 'ASC']]
        });

        const groups = {};

        // Helper to clean name and extract storage
        const parseName = (name) => {
            const lower = name.toLowerCase();
            // Remove common suffixes/prefixes
            let clean = lower
                .replace(/chính hãng/g, '')
                .replace(/vn\/a/g, '')
                .replace(/điện thoại/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            // Extract storage
            const storageMatch = clean.match(/(\d+)(gb|tb)/);
            let storage = storageMatch ? storageMatch[0] : null;

            // Remove storage from name to get "base name"
            let baseName = clean;
            if (storage) {
                baseName = clean.replace(storage, '').trim();
            }

            return { baseName, storage, originalName: name };
        };

        products.forEach(p => {
            const { baseName, storage } = parseName(p.name);
            if (!groups[baseName]) {
                groups[baseName] = [];
            }
            groups[baseName].push({
                id: p.id,
                name: p.name,
                slug: p.slug,
                storage: storage
            });
        });

        // Filter for groups with more than 1 product
        const duplicates = {};
        for (const [baseName, items] of Object.entries(groups)) {
            if (items.length > 1) {
                duplicates[baseName] = items;
            }
        }

        fs.writeFileSync('duplicate_groups.json', JSON.stringify(duplicates, null, 2));
        console.log(`Found ${Object.keys(duplicates).length} groups of potential duplicates.`);
        console.log('Saved to duplicate_groups.json');

    } catch (error) {
        console.error('Error scanning:', error);
    } finally {
        await sequelize.close();
    }
}

scanDuplicates();
