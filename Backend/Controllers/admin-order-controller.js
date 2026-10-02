const Order = require("../models/order-model");
const User = require("../models/user-model");

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

// Saare orders (customer ki details ke saath)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "username email phone")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Admin Get Orders Error:", error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

// Status badalna (Confirm / Ship / Deliver / Cancel)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findById(req.params.id).populate("user", "username email phone");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;

        // COD order deliver hote hi paid maana jayega
        if (status === "Delivered" && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = new Date();
        }

        await order.save();
        res.status(200).json({ message: `Order marked as ${status}`, order });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ message: "Failed to update status", error: error.message });
    }
};

// Dashboard ke numbers
const getStats = async (req, res) => {
    try {
        const [orders, totalUsers, recentOrders] = await Promise.all([
            Order.find().select("orderItems totalPrice status createdAt").lean(),
            User.countDocuments(),
            Order.find().populate("user", "username email").sort({ createdAt: -1 }).limit(5).lean(),
        ]);

        const statusCounts = { Pending: 0, Confirmed: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
        let revenue = 0;
        const productMap = {};

        // Pichhle 7 din
        const dayMap = {};
        const dayKeys = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString("en-CA");
            dayMap[key] = {
                label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
                revenue: 0,
                orders: 0,
            };
            dayKeys.push(key);
        }

        orders.forEach((o) => {
            const st = statusCounts[o.status] !== undefined ? o.status : "Pending";
            statusCounts[st]++;
            if (st === "Cancelled") return; // cancelled ka paisa revenue mein nahi

            revenue += o.totalPrice || 0;

            const key = new Date(o.createdAt).toLocaleDateString("en-CA");
            if (dayMap[key]) {
                dayMap[key].revenue += o.totalPrice || 0;
                dayMap[key].orders += 1;
            }

            (o.orderItems || []).forEach((i) => {
                if (!productMap[i.name]) {
                    productMap[i.name] = { name: i.name, image: i.image, qty: 0, revenue: 0 };
                }
                productMap[i.name].qty += i.qty;
                productMap[i.name].revenue += i.price * i.qty;
            });
        });

        const activeOrders = orders.length - statusCounts.Cancelled;

        res.status(200).json({
            totalOrders: orders.length,
            totalUsers,
            revenue,
            pending: statusCounts.Pending,
            statusCounts,
            avgOrderValue: activeOrders ? Math.round(revenue / activeOrders) : 0,
            last7: dayKeys.map((k) => dayMap[k]),
            topProducts: Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5),
            recentOrders,
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ message: "Failed to fetch stats", error: error.message });
    }
};

module.exports = { getAllOrders, updateOrderStatus, getStats };