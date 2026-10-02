import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
    FaBoxOpen, FaShoppingBag, FaExclamationTriangle, FaTimesCircle, FaSearch, FaSyncAlt,
} from "react-icons/fa";
import { adminService } from "../lib/services";
import { getErrorMessage } from "../lib/api";
import { inr, onImgError, IMG_FALLBACK } from "../lib/adminUtils";
import { PRODUCTS } from "../data/products";
import rawProducts from "../data/products.data";

const META = Object.fromEntries(PRODUCTS.map((p) => [p.id, p])); // image ke liye

const FILTERS = [
    { key: "all", label: "All" },
    { key: "ok", label: "In stock" },
    { key: "low", label: "Low stock" },
    { key: "out", label: "Out of stock" },
];

const STATUS_STYLE = {
    ok: "bg-green-50 text-green-600",
    low: "bg-orange-50 text-orange-600",
    out: "bg-red-50 text-red-600",
};
const STATUS_TEXT = { ok: "In stock", low: "Low stock", out: "Out of stock" };

const SummaryCard = ({ icon, label, value, tone }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${tone}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const Stat = ({ label, value, className = "" }) => (
    <div>
        <p className="text-[11px] text-gray-400">{label}</p>
        <p className={`text-sm font-bold text-gray-800 dark:text-white ${className}`}>{value}</p>
    </div>
);

const AdminInventory = () => {
    const [data, setData] = useState({ items: [], summary: null });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [query, setQuery] = useState("");
    const [edits, setEdits] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [syncing, setSyncing] = useState(false);

    const load = useCallback(async (silent = false) => {
        try {
            const res = await adminService.getInventory();
            setData({ items: res.items || [], summary: res.summary || null });
        } catch (err) {
            if (!silent) toast.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    // Pehli baar + har 20 sec me refresh (naye orders ke saath stock live ghatega)
    useEffect(() => {
        load();
        const id = setInterval(() => !document.hidden && load(true), 20000);
        return () => clearInterval(id);
    }, [load]);

    const counts = useMemo(() => {
        const c = { all: data.items.length, ok: 0, low: 0, out: 0 };
        data.items.forEach((i) => (c[i.status] += 1));
        return c;
    }, [data.items]);

    const list = useMemo(() => {
        const q = query.trim().toLowerCase();
        return data.items.filter(
            (i) =>
                (filter === "all" || i.status === filter) &&
                (!q || `${i.name} ${i.category} ${i.productId}`.toLowerCase().includes(q))
        );
    }, [data.items, filter, query]);

    const save = async (item) => {
        const value = Number(edits[item.productId]);
        if (!Number.isInteger(value) || value < 0) {
            return toast.error("Stock must be a whole number (0 or more)");
        }
        setSavingId(item.productId);
        try {
            await adminService.updateStock(item.productId, value);
            toast.success(`${item.name}: stock set to ${value}`);
            setEdits((e) => {
                const { [item.productId]: _, ...rest } = e;
                return rest;
            });
            await load(true);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setSavingId(null);
        }
    };

    const sync = async () => {
        setSyncing(true);
        try {
            const payload = rawProducts.map((p) => ({
                id: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock,
            }));
            const res = await adminService.syncInventory(payload);
            toast.success(res.message || "Catalogue synced");
            await load(true);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setSyncing(false);
        }
    };

    const s = data.summary;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Inventory</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Stock and sales update automatically. Cancelled orders return to stock.
                    </p>
                </div>
                <button
                    onClick={sync}
                    disabled={syncing}
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                    <FaSyncAlt className={syncing ? "animate-spin" : ""} />
                    {syncing ? "Syncing..." : "Sync catalogue"}
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard icon={<FaBoxOpen />} label="Units in stock" value={s ? s.unitsInStock : "-"} tone="bg-blue-50 text-blue-600" />
                <SummaryCard icon={<FaShoppingBag />} label="Units sold" value={s ? s.unitsSold : "-"} tone="bg-green-50 text-green-600" />
                <SummaryCard icon={<FaExclamationTriangle />} label="Low stock" value={s ? s.lowStock : "-"} tone="bg-orange-50 text-orange-600" />
                <SummaryCard icon={<FaTimesCircle />} label="Out of stock" value={s ? s.outOfStock : "-"} tone="bg-red-50 text-red-600" />
            </div>

            {/* Search + filter */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="relative md:w-80">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search product, category, ID..."
                        className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:border-orange-400"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === f.key
                                ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900"
                                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-400"
                                }`}
                        >
                            {f.label} <span className="opacity-70">({counts[f.key]})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <p className="text-center text-gray-400 py-16">Loading...</p>
            ) : data.items.length === 0 ? (
                <div className="text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 py-14 px-4">
                    <div className="text-5xl mb-3">📦</div>
                    <p className="font-semibold text-gray-800 dark:text-white">Inventory is empty</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Click <b>Sync catalogue</b> once to load all products with their starting stock.
                    </p>
                </div>
            ) : list.length === 0 ? (
                <p className="text-center text-gray-400 py-16">No products match</p>
            ) : (
                <div className="space-y-3">
                    {list.map((it) => {
                        const meta = META[it.productId];
                        const total = it.sold + it.stock;
                        const pct = total ? Math.round((it.sold / total) * 100) : 0;
                        const edited = edits[it.productId];
                        const dirty = edited !== undefined && Number(edited) !== it.stock;

                        return (
                            <div
                                key={it.productId}
                                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Product */}
                                    <div className="flex items-center gap-3 md:w-[34%] min-w-0">
                                        <img
                                            src={meta?.image || IMG_FALLBACK}
                                            onError={onImgError}
                                            alt={it.name}
                                            className="w-14 h-14 rounded-xl object-cover border dark:border-gray-700 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{it.name}</p>
                                            <p className="text-xs text-gray-400">#{it.productId} · {it.category}</p>
                                            <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[it.status]}`}>
                                                {STATUS_TEXT[it.status]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Numbers */}
                                    <div className="grid grid-cols-3 gap-3 md:flex-1">
                                        <Stat label="In stock" value={it.stock} className={it.status === "out" ? "text-red-500" : it.status === "low" ? "text-orange-500" : ""} />
                                        <Stat label="Sold" value={it.sold} />
                                        <Stat label="Revenue" value={inr(it.revenue)} />
                                    </div>

                                    {/* Restock */}
                                    <div className="flex items-center gap-2 md:w-52">
                                        <input
                                            type="number"
                                            min="0"
                                            inputMode="numeric"
                                            value={edited ?? it.stock}
                                            onChange={(e) => setEdits((p) => ({ ...p, [it.productId]: e.target.value }))}
                                            onKeyDown={(e) => e.key === "Enter" && dirty && save(it)}
                                            aria-label={`Stock for ${it.name}`}
                                            className="w-full min-w-0 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-orange-400"
                                        />
                                        <button
                                            onClick={() => save(it)}
                                            disabled={!dirty || savingId === it.productId}
                                            className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-900 text-white dark:bg-white dark:text-gray-900 disabled:opacity-30 transition-opacity"
                                        >
                                            {savingId === it.productId ? "..." : "Save"}
                                        </button>
                                    </div>
                                </div>

                                {/* Sold share bar */}
                                <div className="mt-3">
                                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1">{pct}% sold ({it.sold} of {total})</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminInventory;