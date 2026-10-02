import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChevronDown, FaSearch, FaSyncAlt } from "react-icons/fa";
import { getErrorMessage } from "../lib/api";
import { adminService } from "../lib/services";

import {
    STATUSES, STATUS_STYLES, fmtDate, inr, onImgError, IMG_FALLBACK,
} from "../lib/adminUtils";

// Har status ke baad admin kya kya kar sakta hai
const NEXT_ACTIONS = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
};

const ACTION_LABEL = {
    Confirmed: "Confirm Order",
    Shipped: "Mark as Shipped",
    Delivered: "Mark as Delivered",
    Cancelled: "Cancel Order",
};

const ACTION_STYLE = {
    Confirmed: "bg-green-600 hover:bg-green-700 text-white",
    Shipped: "bg-blue-600 hover:bg-blue-700 text-white",
    Delivered: "bg-emerald-600 hover:bg-emerald-700 text-white",
    Cancelled: "bg-red-50 hover:bg-red-100 text-red-600",
};

const AdminOrders = () => {
    const { refreshStats } = useOutletContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [query, setQuery] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await adminService.getOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Load orders error:", error);
            toast.error(getErrorMessage(error, "Failed to load orders"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const changeStatus = async (order, status) => {
        if (status === "Cancelled" && !window.confirm("Cancel this order? This cannot be undone.")) return;

        setUpdatingId(order._id);
        try {
            const data = await adminService.updateOrderStatus(order._id, status);
            setOrders((prev) =>
                prev.map((o) =>
                    o._id === order._id
                        ? { ...o, status: data.order?.status ?? status, isPaid: data.order?.isPaid ?? o.isPaid }
                        : o
                )
            );
            toast.success(data.message || `Order ${status}`);
            refreshStats?.();
        } catch (error) {
            console.error("Update status error:", error);
            toast.error(getErrorMessage(error, "Could not update status"));
        } finally {
            setUpdatingId(null);
        }
    };

    const counts = useMemo(() => {
        const c = { All: orders.length };
        STATUSES.forEach((s) => (c[s] = orders.filter((o) => (o.status || "Pending") === s).length));
        return c;
    }, [orders]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return orders.filter((o) => {
            const st = o.status || "Pending";
            if (filter !== "All" && st !== filter) return false;
            if (!q) return true;
            return [
                o._id,
                o.user?.username,
                o.user?.email,
                o.shippingAddress?.fullName,
                o.shippingAddress?.phone,
            ]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q));
        });
    }, [orders, filter, query]);

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h2>
                    <p className="text-sm text-gray-500 mt-1">Review, confirm and track customer orders</p>
                </div>
                <button
                    onClick={loadOrders}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:shadow-md transition"
                >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex flex-wrap gap-2 flex-1">
                    {["All", ...STATUSES].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === s
                                ? "bg-gray-900 dark:bg-orange-500 text-white shadow"
                                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-400"
                                }`}
                        >
                            {s} <span className="opacity-70">({counts[s] || 0})</span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-72">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name, email, phone, order ID"
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                    ))}
                </div>
            ) : visible.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-5xl mb-3">📦</div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No orders found</h3>
                    <p className="text-sm text-gray-400 mt-1">Try a different filter or search</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {visible.map((o) => {
                        const status = o.status || "Pending";
                        const addr = o.shippingAddress || {};
                        const open = expandedId === o._id;
                        const busy = updatingId === o._id;
                        const actions = NEXT_ACTIONS[status] || [];
                        const customer = o.user?.username || addr.fullName || "Unknown";

                        return (
                            <div
                                key={o._id}
                                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            >
                                {/* Top */}
                                <div className="p-5 flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">
                                            {customer.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 dark:text-white truncate">
                                                {customer}{" "}
                                                <span className="text-xs font-normal text-gray-400">#{o._id.slice(-8)}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {o.user?.email || "-"} · {fmtDate(o.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ring-1 ring-inset ${STATUS_STYLES[status]}`}>
                                            {status}
                                        </span>
                                        <p className="text-xl font-bold text-gray-800 dark:text-white">{inr(o.totalPrice)}</p>
                                    </div>
                                </div>

                                {/* Items + payment */}
                                <div className="px-5 pb-4 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        {o.orderItems.slice(0, 5).map((it, i) => (
                                            <img
                                                key={i}
                                                src={it.image || IMG_FALLBACK}
                                                onError={onImgError}
                                                alt={it.name}
                                                title={`${it.name} x ${it.qty}`}
                                                className="w-12 h-12 rounded-lg object-cover border dark:border-gray-700"
                                            />
                                        ))}
                                        {o.orderItems.length > 5 && (
                                            <span className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                +{o.orderItems.length - 5}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-wrap items-center gap-2">
                                        <span>{o.paymentMethod}</span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${o.isPaid ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                                            {o.isPaid ? "Paid" : "Pay on delivery"}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-5 py-3 border-t dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex flex-wrap gap-2">
                                        {actions.map((next) => (
                                            <button
                                                key={next}
                                                disabled={busy}
                                                onClick={() => changeStatus(o, next)}
                                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-60 ${ACTION_STYLE[next]}`}
                                            >
                                                {busy ? "Updating..." : ACTION_LABEL[next]}
                                            </button>
                                        ))}
                                        {actions.length === 0 && (
                                            <span className="text-sm text-gray-400 py-2">No further actions</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setExpandedId(open ? null : o._id)}
                                        className="flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600"
                                    >
                                        {open ? "Hide details" : "View details"}
                                        <FaChevronDown className={`text-xs transition-transform ${open ? "rotate-180" : ""}`} />
                                    </button>
                                </div>

                                {/* Details */}
                                {open && (
                                    <div className="px-5 pb-5 pt-1 grid grid-cols-1 lg:grid-cols-2 gap-5 border-t dark:border-gray-800">
                                        <div>
                                            <p className="text-xs font-semibold tracking-widest text-gray-400 mb-3 mt-4">ITEMS</p>
                                            <div className="space-y-3">
                                                {o.orderItems.map((it, i) => (
                                                    <div key={i} className="flex items-center gap-3">
                                                        <img
                                                            src={it.image || IMG_FALLBACK}
                                                            onError={onImgError}
                                                            alt={it.name}
                                                            className="w-12 h-12 rounded-lg object-cover border dark:border-gray-700"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{it.name}</p>
                                                            <p className="text-xs text-gray-400">{inr(it.price)} x {it.qty}</p>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-800 dark:text-white">{inr(it.price * it.qty)}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 pt-3 border-t dark:border-gray-800 space-y-1.5 text-sm">
                                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                                    <span>Item total</span>
                                                    <span>{inr(o.itemsPrice || o.orderItems.reduce((s, i) => s + i.price * i.qty, 0))}</span>
                                                </div>
                                                {o.discount > 0 && (
                                                    <div className="flex justify-between text-blue-600">
                                                        <span>Discount</span>
                                                        <span>-{inr(o.discount)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-bold text-gray-800 dark:text-white text-base">
                                                    <span>Bill total</span>
                                                    <span>{inr(o.totalPrice)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold tracking-widest text-gray-400 mb-3 mt-4">DELIVERY</p>
                                            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4 text-sm space-y-1">
                                                <p className="font-semibold text-gray-800 dark:text-white">
                                                    {addr.fullName || customer}
                                                    {addr.addressType && (
                                                        <span className="ml-2 text-[11px] font-semibold bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                                            {addr.addressType}
                                                        </span>
                                                    )}
                                                </p>
                                                {addr.phone && <p className="text-gray-600 dark:text-gray-300">+91 {addr.phone}</p>}
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    {[addr.address, addr.landmark, addr.city, addr.state, addr.postalCode]
                                                        .filter(Boolean)
                                                        .join(", ") || "No address saved"}
                                                </p>
                                            </div>

                                            <p className="text-xs font-semibold tracking-widest text-gray-400 mb-3 mt-5">ORDER INFO</p>
                                            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                                                <p>Order ID: <span className="text-gray-800 dark:text-white break-all">#{o._id}</span></p>
                                                <p>Placed: {fmtDate(o.createdAt)}</p>
                                                {o.paidAt && <p>Paid on: {fmtDate(o.paidAt)}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default AdminOrders;