import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../lib/services";

const InventoryOverview = () => {
    const [inv, setInv] = useState(null);

    useEffect(() => {
        let alive = true;
        const load = () =>
            adminService.getInventory().then((d) => alive && setInv(d)).catch(() => { });
        load();
        const id = setInterval(() => !document.hidden && load(), 30000);
        return () => {
            alive = false;
            clearInterval(id);
        };
    }, []);

    if (!inv || !inv.summary) return null;

    const { summary, items } = inv;
    const top = [...items].sort((a, b) => b.sold - a.sold).filter((i) => i.sold > 0).slice(0, 5);
    const attention = items.filter((i) => i.status !== "ok").sort((a, b) => a.stock - b.stock).slice(0, 5);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 dark:text-white">Stock Overview</h3>
                    <Link to="/admin/inventory" className="text-sm font-semibold text-orange-500">Manage</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl bg-blue-50 p-3"><p className="text-xl font-bold text-blue-600">{summary.unitsInStock}</p><p className="text-xs text-gray-500">In stock</p></div>
                    <div className="rounded-xl bg-green-50 p-3"><p className="text-xl font-bold text-green-600">{summary.unitsSold}</p><p className="text-xs text-gray-500">Sold</p></div>
                    <div className="rounded-xl bg-orange-50 p-3"><p className="text-xl font-bold text-orange-600">{summary.lowStock}</p><p className="text-xs text-gray-500">Low stock</p></div>
                    <div className="rounded-xl bg-red-50 p-3"><p className="text-xl font-bold text-red-600">{summary.outOfStock}</p><p className="text-xs text-gray-500">Out of stock</p></div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">Best Sellers</h3>
                {top.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">No sales yet</p>
                ) : (
                    <div className="space-y-3">
                        {top.map((i) => (
                            <div key={i.productId} className="flex items-center justify-between gap-3 text-sm">
                                <span className="truncate text-gray-700 dark:text-gray-200">{i.name}</span>
                                <span className="shrink-0 font-bold text-gray-800 dark:text-white">{i.sold} sold</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">Needs Restock</h3>
                {attention.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">All products are well stocked</p>
                ) : (
                    <div className="space-y-3">
                        {attention.map((i) => (
                            <div key={i.productId} className="flex items-center justify-between gap-3 text-sm">
                                <span className="truncate text-gray-700 dark:text-gray-200">{i.name}</span>
                                <span className={`shrink-0 font-bold ${i.status === "out" ? "text-red-500" : "text-orange-500"}`}>
                                    {i.status === "out" ? "Out" : `${i.stock} left`}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryOverview;