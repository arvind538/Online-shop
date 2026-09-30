const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// 1. Sare products fetch karna
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to load products" });
    }
});

// 2. User ka Cart load karna
router.get("/cart/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
        res.status(200).json(cart ? cart.items : []);
    } catch (err) {
        res.status(500).json({ error: "Failed to load cart" });
    }
});

// 3. Cart me item Add ya Update karna
router.post("/cart/add", async (req, res) => {
    const { userId, productId, size, quantity = 1 } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId && item.size === size
        );

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, size, quantity });
        }

        await cart.save();
        const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
        res.status(200).json(updatedCart.items);
    } catch (err) {
        res.status(500).json({ error: "Failed to update cart" });
    }
});

// 4. Quantity kam karna ya remove karna
router.post("/cart/decrease", async (req, res) => {
    const { userId, productId, size } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId && item.size === size
        );

        if (itemIndex > -1) {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            } else {
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
        }

        const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
        res.status(200).json(updatedCart ? updatedCart.items : []);
    } catch (err) {
        res.status(500).json({ error: "Failed to decrease quantity" });
    }
});

module.exports = router;