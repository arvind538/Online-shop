const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middlewares/auth-middleware");
const {
    getAllOrders,
    updateOrderStatus,
    getStats,
} = require("../Controllers/admin-order-controller");

// Sirf admin ke liye
const adminOnly = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};

router.use(authMiddleware, adminOnly);

router.get("/stats", getStats); // "/:id" se pehle hona zaroori hai
router.get("/", getAllOrders);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;