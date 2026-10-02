const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/auth-middleware");
const adminMiddleware = require("../Middlewares/admin-middleware");
const {
    getPublicStock, getInventory, syncCatalogue, updateStock,
} = require("../Controllers/inventory-controller");

router.get("/stock", getPublicStock);
router.get("/admin/inventory", authMiddleware, adminMiddleware, getInventory);
router.post("/admin/inventory/sync", authMiddleware, adminMiddleware, syncCatalogue);
router.patch("/admin/inventory/:productId", authMiddleware, adminMiddleware, updateStock);

module.exports = router;