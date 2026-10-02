const Stock = require("../models/stock-model");
const Order = require("../models/order-model");

// Store pages ke liye (public): { "1": 40, "2": 0, ... }
const getPublicStock = async (req, res, next) => {
    try {
        const rows = await Stock.find({}, "productId stock").lean();
        res.json(Object.fromEntries(rows.map((r) => [r.productId, r.stock])));
    } catch (err) {
        next(err);
    }
};

// Admin: poora inventory + summary
const getInventory = async (req, res, next) => {
    try {
        const rows = await Stock.find().sort({ productId: 1 }).lean();

        // Cancelled ko chhodkar har product ka revenue
        const revenueRows = await Order.aggregate([
            { $match: { status: { $ne: "Cancelled" } } },
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.productId",
                    revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.qty"] } },
                },
            },
        ]);
        const revMap = Object.fromEntries(revenueRows.map((r) => [String(r._id), r.revenue]));

        const items = rows.map((s) => ({
            ...s,
            revenue: revMap[String(s.productId)] || 0,
            status: s.stock <= 0 ? "out" : s.stock <= s.lowStockAt ? "low" : "ok",
        }));

        const summary = {
            totalProducts: items.length,
            unitsInStock: items.reduce((a, i) => a + i.stock, 0),
            unitsSold: items.reduce((a, i) => a + i.sold, 0),
            lowStock: items.filter((i) => i.status === "low").length,
            outOfStock: items.filter((i) => i.status === "out").length,
        };

        res.json({ items, summary });
    } catch (err) {
        next(err);
    }
};

// Admin: products.data.js ka catalogue backend me bhejo. Naye products ban jaate hain,
// purane ka stock/sold nahi chhua jaata
const syncCatalogue = async (req, res, next) => {
    try {
        const { products } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "products array required" });
        }

        const ops = products.map((p) => ({
            updateOne: {
                filter: { productId: Number(p.id) },
                update: {
                    $set: { name: p.name, category: p.category, price: Number(p.price) || 0 },
                    $setOnInsert: {
                        stock: Number(p.stock) || 0,
                        initialStock: Number(p.stock) || 0,
                        sold: 0,
                    },
                },
                upsert: true,
            },
        }));

        const r = await Stock.bulkWrite(ops);
        res.json({ message: `Catalogue synced. ${r.upsertedCount} new product(s) added.` });
    } catch (err) {
        next(err);
    }
};

// Admin: stock haath se set karo (restock)
const updateStock = async (req, res, next) => {
    try {
        const stock = Number(req.body.stock);
        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({ message: "Stock must be a whole number (0 or more)" });
        }

        const doc = await Stock.findOneAndUpdate(
            { productId: Number(req.params.productId) },
            { $set: { stock } },
            { new: true }
        );
        if (!doc) return res.status(404).json({ message: "Product not found in inventory" });

        res.json({ message: "Stock updated", item: doc });
    } catch (err) {
        next(err);
    }
};

module.exports = { getPublicStock, getInventory, syncCatalogue, updateStock };