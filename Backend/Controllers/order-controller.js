const Order = require("../models/order-model");

const addOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items found" });
        }

        const itemsPrice = orderItems.reduce(
            (sum, i) => sum + Number(i.price) * Number(i.qty || 1),
            0
        );
        const discount = itemsPrice > 499 ? 49 : 0;
        const totalPrice = itemsPrice - discount;
        const isCOD = paymentMethod === "Cash on Delivery";

        const newOrder = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            discount,
            totalPrice,
            isPaid: !isCOD,
            paidAt: isCOD ? undefined : new Date(),
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: savedOrder });
    } catch (error) {
        console.error("Add Order Error:", error);
        res.status(500).json({ message: "Failed to place order", error: error.message });
    }
};

// Admin -> sabke orders (customer details ke saath), user -> sirf apne
const getMyOrders = async (req, res) => {
    try {
        const filter = req.user.isAdmin ? {} : { user: req.user._id };

        const orders = await Order.find(filter)
            .populate("user", "username email phone")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Get My Orders Error:", error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

// User -> sirf apna, admin -> koi bhi order delete kar sakta hai
const deleteOrder = async (req, res) => {
    try {
        const filter = req.user.isAdmin
            ? { _id: req.params.id }
            : { _id: req.params.id, user: req.user._id };

        const order = await Order.findOne(filter);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        await order.deleteOne();
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Delete Order Error:", error);
        res.status(500).json({ message: "Failed to delete order", error: error.message });
    }
};

module.exports = { addOrder, getMyOrders, deleteOrder };

// const Order = require("../models/order-model");

// // YA agar aapke folder ka naam 'Models' (Capital 'M') hai:
// // const Order = require("../Models/order-model");

// const addOrder = async (req, res) => {
//     try {
//         const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

//         if (!orderItems || orderItems.length === 0) {
//             return res.status(400).json({ message: "No order items found" });
//         }

//         const newOrder = new Order({
//             user: req.user._id, // Auth middleware se aayi user ID
//             orderItems,
//             shippingAddress,
//             paymentMethod,
//             totalPrice,
//         });

//         const savedOrder = await newOrder.save();
//         res.status(201).json({ message: "Order placed successfully", order: savedOrder });
//     } catch (error) {
//         console.error("Add Order Error:", error);
//         res.status(500).json({ message: "Failed to place order", error: error.message });
//     }
// };

// const getMyOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
//         res.status(200).json(orders);
//     } catch (error) {
//         console.error("Get My Orders Error:", error);
//         res.status(500).json({ message: "Failed to fetch orders", error: error.message });
//     }
// };

// module.exports = { addOrder, getMyOrders };
