import api from "./api";

export const adminService = {
    // Orders
    getOrders: () => api.get("/admin/orders").then((r) => r.data),

    getStats: () => api.get("/admin/orders/stats").then((r) => r.data),

    updateOrderStatus: (id, status) =>
        api.patch(`/admin/orders/${id}/status`, { status }).then((r) => r.data),

    // Products page ke Sold / Revenue ke liye
    getProductSales: () => api.get("/admin/orders/sales").then((r) => r.data),

    // Inventory
    getInventory: () => api.get("/admin/inventory").then((r) => r.data),
    syncInventory: (products) => api.post("/admin/inventory/sync", { products }).then((r) => r.data),
    updateStock: (productId, stock) =>
        api.patch(`/admin/inventory/${productId}`, { stock }).then((r) => r.data),
};

export default adminService;