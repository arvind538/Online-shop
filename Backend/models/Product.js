const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    rating: { type: Number, default: 4 },
    reviews: { type: Number, default: 0 },
    badge: { type: String, default: "" },
    badgeColor: { type: String, default: "bg-orange-500" },
    brand: { type: String, required: true },
    img: { type: String, required: true },
    availableSizes: { type: [String], default: ["S", "M", "L", "XL", "XXL"] },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);