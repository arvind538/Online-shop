const express = require("express");
const router = express.Router();

const { addOrder, getMyOrders, deleteOrder } = require("../Controllers/order-controller");
const authMiddleware = require("../Middlewares/auth-middleware");

console.log("order-router loaded (with delete)");

router.post("/add", authMiddleware, addOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.delete("/:id", authMiddleware, deleteOrder);

module.exports = router;