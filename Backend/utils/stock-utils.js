const Stock = require("../models/stock-model");

// Order items ko {id, qty, name} me badalta hai (productId / product / id kuch bhi ho)
const toLines = (items = []) =>
    items
        .map((i) => ({
            id: Number(i.productId ?? i.product ?? i.id),
            qty: Number(i.qty ?? i.quantity ?? 0),
            name: i.name || i.title || "Product",
        }))
        .filter((l) => Number.isFinite(l.id) && l.qty > 0);

// Stock wapas: stock +qty, sold -qty (sold kabhi 0 se neeche nahi jaata)
async function restoreStock(items) {
    for (const l of toLines(items)) {
        await Stock.updateOne({ productId: l.id }, [
            {
                $set: {
                    stock: { $add: ["$stock", l.qty] },
                    sold: { $max: [0, { $subtract: ["$sold", l.qty] }] },
                },
            },
        ]);
    }
}

// Stock kam: stock -qty, sold +qty. Kisi ek ka bhi stock kam ho to pehle ka sab wapas (rollback)
async function deductStock(items) {
    const done = [];
    try {
        for (const l of toLines(items)) {
            // Jo product sync nahi hua use track nahi karte, order allow
            if (!(await Stock.exists({ productId: l.id }))) continue;

            const r = await Stock.findOneAndUpdate(
                { productId: l.id, stock: { $gte: l.qty } },
                { $inc: { stock: -l.qty, sold: l.qty } },
                { new: true }
            );

            if (!r) {
                const err = new Error(`"${l.name}" is out of stock or has less quantity available`);
                err.status = 409;
                throw err;
            }
            done.push(l);
        }
    } catch (err) {
        await restoreStock(done);
        throw err;
    }
}

module.exports = { deductStock, restoreStock };