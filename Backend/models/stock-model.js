const { Schema, model } = require("mongoose");

const stockSchema = new Schema(
    {
        productId: { type: Number, required: true, unique: true, index: true }, // products.data.js ki id
        name: String,
        category: String,
        price: Number,
        stock: { type: Number, default: 0, min: 0 },        // abhi shelf par
        initialStock: { type: Number, default: 0 },          // shuru ka stock
        sold: { type: Number, default: 0, min: 0 },          // kitna bika (cancel hone par ghat-ta hai)
        lowStockAt: { type: Number, default: 10 },           // is se kam ho to "low stock"
    },
    { timestamps: true }
);

module.exports = model("Stock", stockSchema);