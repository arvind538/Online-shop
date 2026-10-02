import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "react-toastify";
import {
    FaArrowLeft, FaCheck, FaEllipsisV, FaTrash, FaClock,
    FaHome, FaBriefcase, FaMapMarkerAlt, FaTruck, FaBoxOpen, FaTimesCircle,
    FaSearch, FaTimes, FaStore,
} from "react-icons/fa";

const POLL_MS = 15000;     // har 15 sec me status check
const DELIVERY_DAYS = 5;   // "Expected by" ke liye (apne hisaab se badlo)

const fmtDate = (d) =>
    new Date(d).toLocaleString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true,
    });

const fmtShort = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const addDays = (d, n) => new Date(new Date(d).getTime() + n * 86400000);

/* ================= STATUS / TRACKING HELPERS ================= */
const STEPS = [
    { key: "Pending", label: "Order placed", desc: "We have received your order", icon: <FaClock /> },
    { key: "Confirmed", label: "Confirmed", desc: "Your order is confirmed and being packed", icon: <FaBoxOpen /> },
    { key: "Shipped", label: "Shipped", desc: "Your order is on the way", icon: <FaTruck /> },
    { key: "Delivered", label: "Delivered", desc: "Order delivered successfully", icon: <FaHome /> },
];

// Status filter chips
const FILTERS = [
    { key: "all", label: "All" },
    { key: "pending", label: "Placed" },
    { key: "confirmed", label: "Confirmed" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
];

const lower = (s) => (s || "Pending").toLowerCase();
const isCancelled = (status) => lower(status) === "cancelled";
const isFinished = (status) => ["delivered", "cancelled"].includes(lower(status));

const stepIndex = (status) => {
    const i = STEPS.findIndex((s) => s.key.toLowerCase() === lower(status));
    return i < 0 ? 0 : i;
};

const statusInfo = (status) => {
    const s = lower(status);
    if (s === "delivered") return { text: "Delivered", tone: "green" };
    if (s === "cancelled") return { text: "Cancelled", tone: "red" };
    if (s === "shipped") return { text: "Shipped", tone: "blue" };
    if (s === "confirmed") return { text: "Confirmed", tone: "indigo" };
    return { text: "Order placed", tone: "orange" };
};

const badgeClass = {
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-500",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
};

// Backend me statusHistory / confirmedAt / shippedAt / deliveredAt ho to wahan se time, warna fallback
const stepTime = (order, step, i, idx) => {
    const h = order.statusHistory?.find((x) => lower(x.status) === step.key.toLowerCase());
    if (h?.at) return h.at;
    if (step.key === "Pending") return order.createdAt;
    const f = { Confirmed: order.confirmedAt, Shipped: order.shippedAt, Delivered: order.deliveredAt }[step.key];
    if (f) return f;
    if (i === idx) return order.updatedAt;
    return null;
};

// Old orders may not have itemsPrice/discount, so fall back to calculating from items
const getBill = (order) => {
    const itemsPrice =
        order.itemsPrice || order.orderItems.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = order.discount || 0;
    return { itemsPrice, discount, total: order.totalPrice };
};

const addressIcon = (type) => {
    if (type === "Work") return <FaBriefcase />;
    if (type === "Other") return <FaMapMarkerAlt />;
    return <FaHome />;
};

/* ================= SEARCH HELPERS ================= */
// Ek order ka saara searchable text ek string me
const buildHaystack = (o) => {
    const a = o.shippingAddress || {};
    return [
        o._id,
        statusInfo(o.status).text,
        o.status,
        o.totalPrice,
        fmtDate(o.createdAt),
        o.paymentMethod,
        a.fullName,
        a.city,
        ...(o.orderItems || []).map((i) => i.name),
    ]
        .filter((v) => v !== undefined && v !== null && v !== "")
        .join(" ")
        .toLowerCase();
};

// "#a1b2c3", "₹1450", "shirt shipped" jaise queries chalenge (har word match hona chahiye)
const toTerms = (q) =>
    q.toLowerCase().replace(/[#₹,]/g, " ").split(/\s+/).filter(Boolean);

const FALLBACK_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%' fill='#e5e7eb'/></svg>`
    );

const Thumb = ({ src, alt, size = "w-16 h-16" }) => (
    <img
        src={src || FALLBACK_IMG}
        alt={alt}
        loading="lazy"
        onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMG;
        }}
        className={`${size} object-cover rounded-xl border dark:border-gray-700 shrink-0`}
    />
);

/* ================= SMALL UI PIECES ================= */
const LiveDot = ({ time }) => (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        Live{time ? ` · updated ${time.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}` : ""}
    </span>
);

// List card ke liye chhota progress bar (truck aage badhta hai)
const MiniTracker = ({ status }) => {
    if (isCancelled(status)) {
        return (
            <div className="px-4 pb-4">
                <p className="flex items-center gap-2 text-xs font-medium text-red-500">
                    <FaTimesCircle /> This order was cancelled
                </p>
            </div>
        );
    }

    const idx = stepIndex(status);
    const pct = (idx / (STEPS.length - 1)) * 100;

    return (
        <div className="px-4 pb-4">
            <div className="relative h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-3">
                <div
                    className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%` }}
                />
                <span
                    className="absolute -top-[9px] -translate-x-1/2 w-6 h-6 rounded-full bg-green-600 text-white text-[11px] flex items-center justify-center shadow transition-all duration-1000 ease-out"
                    style={{ left: `clamp(12px, ${pct}%, calc(100% - 12px))` }}
                >
                    {idx === STEPS.length - 1 ? <FaCheck /> : <FaTruck />}
                </span>
            </div>
            <div className="flex justify-between mt-4 text-[11px]">
                {STEPS.map((s, i) => (
                    <span
                        key={s.key}
                        className={i <= idx ? "font-semibold text-green-700" : "text-gray-400"}
                    >
                        {s.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

// Detail page ke liye vertical timeline
const Timeline = ({ order }) => {
    const cancelled = isCancelled(order.status);
    const idx = cancelled ? 0 : stepIndex(order.status);

    return (
        <div>
            {cancelled && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-5">
                    <FaTimesCircle /> This order was cancelled
                    {order.updatedAt && (
                        <span className="text-xs font-normal opacity-80">· {fmtDate(order.updatedAt)}</span>
                    )}
                </div>
            )}

            {STEPS.map((s, i) => {
                const reached = i <= idx;
                const current = i === idx && !cancelled;
                const showCheck = reached && (i < idx || (current && s.key === "Delivered") || (cancelled && i === 0));
                const last = i === STEPS.length - 1;
                const time = reached ? stepTime(order, s, i, idx) : null;

                return (
                    <div key={s.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 transition-all duration-500 ${reached
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                    } ${current && s.key !== "Delivered" ? "ring-4 ring-green-100 animate-pulse" : ""}`}
                            >
                                {showCheck ? <FaCheck /> : s.icon}
                            </div>
                            {!last && (
                                <div className="relative w-0.5 flex-1 min-h-[44px] bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <div
                                        className={`absolute inset-x-0 top-0 bg-green-600 transition-all duration-1000 ease-out ${i < idx ? "h-full" : "h-0"
                                            }`}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pb-6">
                            <p className={`font-semibold text-sm ${reached ? "text-gray-800 dark:text-white" : "text-gray-400"}`}>
                                {s.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                            {time && <p className="text-xs text-green-700 mt-1">{fmtDate(time)}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/* ================= PAGE ================= */
const MyOrders = () => {
    const { token, API } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null); // detail view
    const [menuId, setMenuId] = useState(null); // kebab menu
    const [deleteTarget, setDeleteTarget] = useState(null); // confirm modal
    const [deleting, setDeleting] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Search + filter
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const prevStatus = useRef({});
    const firstLoad = useRef(true);
    const hasActive = useRef(true);

    const fetchOrders = useCallback(
        async (silent = false) => {
            try {
                const res = await fetch(`${API}/api/orders/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (res.ok) {
                    const list = Array.isArray(data) ? data : data.orders || [];

                    // Admin ne status badla ho to user ko batao
                    if (!firstLoad.current) {
                        list.forEach((o) => {
                            const before = prevStatus.current[o._id];
                            if (before && before !== o.status) {
                                toast.info(`Order #${o._id.slice(-6)} is now ${statusInfo(o.status).text}`);
                            }
                        });
                    }
                    prevStatus.current = Object.fromEntries(list.map((o) => [o._id, o.status]));
                    firstLoad.current = false;
                    hasActive.current = list.some((o) => !isFinished(o.status));

                    setOrders(list);
                    // Detail page khula ho to wo bhi turant update ho
                    setSelected((sel) => (sel ? list.find((o) => o._id === sel._id) || null : sel));
                    setLastUpdated(new Date());
                } else if (!silent) {
                    toast.error(data.message || "Could not load your orders");
                }
            } catch (error) {
                console.error("Fetch Orders Error:", error);
                if (!silent) toast.error("Server connection failed!");
            } finally {
                if (!silent) setLoading(false);
            }
        },
        [API, token]
    );

    // Pehli baar load + auto refresh
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        fetchOrders(false);

        const id = setInterval(() => {
            // Tab dikh raha ho aur koi order abhi active ho tabhi poll karo
            if (!document.hidden && hasActive.current) fetchOrders(true);
        }, POLL_MS);

        // Tab me wapas aate hi turant refresh
        const onVisible = () => {
            if (!document.hidden) fetchOrders(true);
        };
        document.addEventListener("visibilitychange", onVisible);

        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [token, fetchOrders]);

    // Search ke liye har order ka text ek baar banao
    const indexed = useMemo(
        () => orders.map((o) => ({ order: o, hay: buildHaystack(o) })),
        [orders]
    );

    // Har status ke kitne orders hain (chips ke liye)
    const counts = useMemo(() => {
        const c = { all: orders.length, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
        orders.forEach((o) => {
            const k = lower(o.status);
            if (c[k] !== undefined) c[k] += 1;
        });
        return c;
    }, [orders]);

    // Final filtered list
    const filtered = useMemo(() => {
        const terms = toTerms(query);
        return indexed
            .filter(({ order, hay }) => {
                if (statusFilter !== "all" && lower(order.status) !== statusFilter) return false;
                return terms.every((t) => hay.includes(t));
            })
            .map(({ order }) => order);
    }, [indexed, query, statusFilter]);

    const clearAll = () => {
        setQuery("");
        setStatusFilter("all");
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API}/api/orders/${deleteTarget._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (res.ok) {
                setOrders((prev) => prev.filter((o) => o._id !== deleteTarget._id));
                if (selected?._id === deleteTarget._id) setSelected(null);
                toast.success("Order deleted");
            } else {
                toast.error(data.message || "Could not delete the order");
            }
        } catch (error) {
            console.error("Delete Order Error:", error);
            toast.error("Server connection failed!");
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const reorder = (order) => {
        const items = order.orderItems.map((i) => ({
            title: i.name,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.qty,
        }));
        navigate("/process", { state: items });
    };

    if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;

    if (!token || orders.length === 0)
        return (
            <div className="text-center py-20 px-4">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4">
                    {token ? "No orders yet" : "Please log in to view your orders"}
                </h2>
                <button
                    onClick={() => navigate(token ? "/" : "/login")}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                    {token ? "Start Shopping" : "Login"}
                </button>
            </div>
        );

    /* ================= DETAIL VIEW ================= */
    if (selected) {
        const bill = getBill(selected);
        const st = statusInfo(selected.status);
        const totalQty = selected.orderItems.reduce((s, i) => s + i.qty, 0);
        const addr = selected.shippingAddress || {};
        const fullAddress = [addr.address, addr.landmark, addr.city, addr.state, addr.postalCode]
            .filter(Boolean)
            .join(", ");
        const expected = !isFinished(selected.status)
            ? fmtShort(addDays(selected.createdAt, DELIVERY_DAYS))
            : null;

        return (
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-5">
                    <button
                        onClick={() => setSelected(null)}
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-white"
                        aria-label="Back"
                    >
                        <FaArrowLeft />
                    </button>
                    <button
                        onClick={() => setDeleteTarget(selected)}
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-red-500"
                        aria-label="Delete order"
                    >
                        <FaTrash />
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Summary</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${badgeClass[st.tone]}`}>
                        {st.text}
                    </span>
                    <span className="text-sm text-gray-500">{fmtDate(selected.createdAt)}</span>
                </div>

                {/* ===== Order tracking ===== */}
                <div className="flex items-center justify-between mt-6 mb-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Track Order</h3>
                    {!isFinished(selected.status) && <LiveDot time={lastUpdated} />}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                    {expected && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                            Expected delivery by <span className="font-bold text-gray-800 dark:text-white">{expected}</span>
                        </p>
                    )}
                    <Timeline order={selected} />
                </div>

                <h3 className="text-lg font-bold mt-6 mb-3 text-gray-800 dark:text-white">
                    {totalQty} item{totalQty > 1 ? "s" : ""} in this order
                </h3>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 divide-y dark:divide-gray-700">
                    {selected.orderItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4">
                            <Thumb src={item.image} alt={item.name} />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 dark:text-white text-sm">{item.name}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    ₹{item.price} x {item.qty}
                                </p>
                            </div>
                            <p className="font-bold text-gray-800 dark:text-white">₹{item.price * item.qty}</p>
                        </div>
                    ))}
                </div>

                {/* Bill details */}
                <h3 className="text-lg font-bold mt-6 mb-3 text-gray-800 dark:text-white">Bill Details</h3>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Item total</span>
                        <span>₹{bill.itemsPrice}</span>
                    </div>
                    {bill.discount > 0 && (
                        <div className="flex justify-between text-blue-600">
                            <span>Order discount</span>
                            <span>-₹{bill.discount}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span>Delivery charges</span>
                        <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between border-t dark:border-gray-700 pt-3 font-bold text-base text-gray-800 dark:text-white">
                        <span>Bill total</span>
                        <span>₹{bill.total}</span>
                    </div>
                </div>

                {/* Order details */}
                <h3 className="text-lg font-bold mt-6 mb-3 text-gray-800 dark:text-white">Order Details</h3>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 text-sm">
                    <div>
                        <p className="text-xs text-gray-400">Order ID</p>
                        <p className="text-gray-800 dark:text-white break-all">#{selected._id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Payment</p>
                        <p className="text-gray-800 dark:text-white">
                            {selected.paymentMethod} ·{" "}
                            <span className={selected.isPaid ? "text-green-600" : "text-orange-500"}>
                                {selected.isPaid ? "Paid" : "Pay on delivery"}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Order placed</p>
                        <p className="text-gray-800 dark:text-white">{fmtDate(selected.createdAt)}</p>
                    </div>
                    {(addr.fullName || addr.address) && (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs text-gray-400">Delivering to</p>
                                {addr.addressType && (
                                    <span className="flex items-center gap-1 text-[11px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">
                                        {addressIcon(addr.addressType)} {addr.addressType}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-800 dark:text-white font-medium">
                                {addr.fullName}
                                {addr.phone && ` · +91 ${addr.phone}`}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">{fullAddress}</p>
                        </div>
                    )}
                </div>

                {/* Repeat button: ab fixed nahi hai, header/footer nahi dhakega */}
                <button
                    onClick={() => reorder(selected)}
                    className="mt-6 w-full bg-green-700 hover:bg-green-800 active:scale-[0.99] transition-all text-white py-3 rounded-xl font-bold"
                >
                    Repeat Order
                    <span className="block text-xs font-normal opacity-90">GO TO CHECKOUT</span>
                </button>

                {/* Website par wapas */}
                <button
                    onClick={() => navigate("/")}
                    className="mt-3 w-full flex items-center justify-center gap-2 border border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-800 active:scale-[0.99] transition-all py-3 rounded-xl font-semibold"
                >
                    <FaStore /> Continue Shopping
                </button>

                <DeleteModal
                    order={deleteTarget}
                    deleting={deleting}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            </div>
        );
    }

    /* ================= LIST VIEW ================= */
    const isFiltering = query.trim() !== "" || statusFilter !== "all";

    return (
        <div className="max-w-2xl mx-auto px-4 py-6" onClick={() => setMenuId(null)}>
            {/* Card fade-in animation */}
            <style>{`
                @keyframes orderFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .order-card-in { animation: orderFadeIn .3s ease both; }
                @media (prefers-reduced-motion: reduce) { .order-card-in { animation: none; } }
            `}</style>

            {/* Header + Back to website */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order History</h2>
                    <LiveDot time={lastUpdated} />
                </div>
                <button
                    onClick={() => navigate("/")}
                    className="shrink-0 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-sm transition-all"
                    aria-label="Continue shopping"
                >
                    <FaStore />
                    <span className="hidden sm:inline">Continue Shopping</span>
                    <span className="sm:hidden">Shop</span>
                </button>
            </div>

            {/* Search bar */}
            <div className="relative mb-3">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                <input
                    type="text"
                    inputMode="search"
                    enterKeyHint="search"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                    placeholder="Search product, order ID, status..."
                    aria-label="Search orders"
                    className="w-full pl-11 pr-11 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30 transition-shadow"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Clear search"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Status chips (mobile par side me scroll hote hain) */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-3 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {FILTERS.filter((f) => counts[f.key] > 0 || f.key === statusFilter).map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setStatusFilter(f.key)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${statusFilter === f.key
                            ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-400"
                            }`}
                    >
                        {f.label} <span className="opacity-70">({counts[f.key]})</span>
                    </button>
                ))}
            </div>

            {/* Result count */}
            <p className="text-xs text-gray-400 mb-4">
                {isFiltering
                    ? `${filtered.length} of ${orders.length} order${orders.length > 1 ? "s" : ""}`
                    : `${orders.length} order${orders.length > 1 ? "s" : ""}`}
            </p>

            {/* No result */}
            {filtered.length === 0 ? (
                <div className="text-center py-14 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="text-5xl mb-3">🔍</div>
                    <p className="font-semibold text-gray-800 dark:text-white">No orders found</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Try a different product name, order ID or status
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                        <button
                            onClick={clearAll}
                            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Clear search
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((order) => {
                        const st = statusInfo(order.status);
                        const shown = order.orderItems.slice(0, 4);
                        const extra = order.orderItems.length - shown.length;

                        return (
                            <div
                                key={order._id}
                                className="order-card-in bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
                            >
                                {/* Header */}
                                <div className="flex items-start gap-3 p-4 relative">
                                    <div
                                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${badgeClass[st.tone]}`}
                                    >
                                        {st.tone === "green" ? <FaCheck /> : st.tone === "blue" ? <FaTruck /> : st.tone === "indigo" ? <FaBoxOpen /> : st.tone === "red" ? <FaTimesCircle /> : <FaClock />}
                                    </div>

                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelected(order)}>
                                        <p className="font-bold text-gray-800 dark:text-white">{st.text}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            ₹{order.totalPrice} · {fmtDate(order.createdAt)}
                                        </p>
                                    </div>

                                    {/* Kebab menu */}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuId(menuId === order._id ? null : order._id);
                                            }}
                                            className="p-2 text-gray-500"
                                            aria-label="Menu"
                                        >
                                            <FaEllipsisV />
                                        </button>
                                        {menuId === order._id && (
                                            <div className="absolute right-0 top-9 z-10 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-xl shadow-lg w-40 overflow-hidden">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuId(null);
                                                        setDeleteTarget(order);
                                                    }}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-600"
                                                >
                                                    <FaTrash /> Delete order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Thumbnails */}
                                <div
                                    className="flex items-center gap-3 px-4 pb-3 cursor-pointer"
                                    onClick={() => setSelected(order)}
                                >
                                    {shown.map((item, i) => (
                                        <Thumb key={i} src={item.image} alt={item.name} />
                                    ))}
                                    {extra > 0 && (
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-200">
                                            +{extra}
                                        </div>
                                    )}
                                </div>

                                {/* Live progress */}
                                <MiniTracker status={order.status} />

                                {/* Actions */}
                                <div className="grid grid-cols-2 border-t dark:border-gray-700 text-sm font-semibold">
                                    <button
                                        onClick={() => reorder(order)}
                                        className="py-3 text-green-700 hover:bg-green-50 dark:hover:bg-gray-700 rounded-bl-2xl border-r dark:border-gray-700"
                                    >
                                        Reorder
                                    </button>
                                    <button
                                        onClick={() => setSelected(order)}
                                        className="py-3 text-green-700 hover:bg-green-50 dark:hover:bg-gray-700 rounded-br-2xl"
                                    >
                                        Track order
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <DeleteModal
                order={deleteTarget}
                deleting={deleting}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

const DeleteModal = ({ order, deleting, onCancel, onConfirm }) => {
    if (!order) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Delete this order?</h3>
                <p className="text-sm text-gray-500 mt-2">
                    Order #{order._id.slice(-8)} (₹{order.totalPrice}) will be permanently removed from your history.
                </p>
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={deleting}
                        className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white font-semibold"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;




// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Store/auth";
// import { toast } from "react-toastify";
// import {
//     FaArrowLeft, FaCheck, FaEllipsisV, FaTrash, FaClock,
//     FaHome, FaBriefcase, FaMapMarkerAlt,
// } from "react-icons/fa";

// const fmtDate = (d) =>
//     new Date(d).toLocaleString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//     });

// const statusInfo = (status) => {
//     const s = (status || "Pending").toLowerCase();
//     if (s === "delivered") return { text: "Delivered", tone: "green", ok: true };
//     if (s === "cancelled") return { text: "Cancelled", tone: "red", ok: false };
//     return { text: "Order placed", tone: "orange", ok: false };
// };

// const badgeClass = {
//     green: "bg-green-50 text-green-600",
//     red: "bg-red-50 text-red-600",
//     orange: "bg-orange-50 text-orange-500",
// };

// // Old orders may not have itemsPrice/discount, so fall back to calculating from items
// const getBill = (order) => {
//     const itemsPrice =
//         order.itemsPrice || order.orderItems.reduce((s, i) => s + i.price * i.qty, 0);
//     const discount = order.discount || 0;
//     return { itemsPrice, discount, total: order.totalPrice };
// };

// const addressIcon = (type) => {
//     if (type === "Work") return <FaBriefcase />;
//     if (type === "Other") return <FaMapMarkerAlt />;
//     return <FaHome />;
// };

// const FALLBACK_IMG =
//     "data:image/svg+xml;utf8," +
//     encodeURIComponent(
//         `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%' fill='#e5e7eb'/></svg>`
//     );

// const Thumb = ({ src, alt, size = "w-16 h-16" }) => (
//     <img
//         src={src || FALLBACK_IMG}
//         alt={alt}
//         loading="lazy"
//         onError={(e) => {
//             e.currentTarget.onerror = null;
//             e.currentTarget.src = FALLBACK_IMG;
//         }}
//         className={`${size} object-cover rounded-xl border dark:border-gray-700 shrink-0`}
//     />
// );

// const MyOrders = () => {
//     const { token, API } = useAuth();
//     const navigate = useNavigate();

//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selected, setSelected] = useState(null); // detail view
//     const [menuId, setMenuId] = useState(null); // kebab menu
//     const [deleteTarget, setDeleteTarget] = useState(null); // confirm modal
//     const [deleting, setDeleting] = useState(false);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const res = await fetch(`${API}/api/orders/my-orders`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 const data = await res.json();
//                 if (res.ok) setOrders(Array.isArray(data) ? data : data.orders || []);
//                 else toast.error(data.message || "Could not load your orders");
//             } catch (error) {
//                 console.error("Fetch Orders Error:", error);
//                 toast.error("Server connection failed!");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (token) fetchOrders();
//         else setLoading(false);
//     }, [token, API]);

//     const confirmDelete = async () => {
//         if (!deleteTarget) return;
//         setDeleting(true);
//         try {
//             const res = await fetch(`${API}/api/orders/${deleteTarget._id}`, {
//                 method: "DELETE",
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const data = await res.json();

//             if (res.ok) {
//                 setOrders((prev) => prev.filter((o) => o._id !== deleteTarget._id));
//                 if (selected?._id === deleteTarget._id) setSelected(null);
//                 toast.success("Order deleted");
//             } else {
//                 toast.error(data.message || "Could not delete the order");
//             }
//         } catch (error) {
//             console.error("Delete Order Error:", error);
//             toast.error("Server connection failed!");
//         } finally {
//             setDeleting(false);
//             setDeleteTarget(null);
//         }
//     };

//     // Reorder: send the same items to the checkout page
//     // NOTE: if your checkout route is not "/process", change the path here
//     const reorder = (order) => {
//         const items = order.orderItems.map((i) => ({
//             title: i.name,
//             name: i.name,
//             image: i.image,
//             price: i.price,
//             quantity: i.qty,
//         }));
//         navigate("/process", { state: items });
//     };

//     if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;

//     if (!token || orders.length === 0)
//         return (
//             <div className="text-center py-20 px-4">
//                 <div className="text-6xl mb-4">📦</div>
//                 <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4">
//                     {token ? "No orders yet" : "Please log in to view your orders"}
//                 </h2>
//                 <button
//                     onClick={() => navigate(token ? "/" : "/login")}
//                     className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
//                 >
//                     {token ? "Start Shopping" : "Login"}
//                 </button>
//             </div>
//         );

//     /* ================= DETAIL VIEW ================= */
//     if (selected) {
//         const bill = getBill(selected);
//         const st = statusInfo(selected.status);
//         const totalQty = selected.orderItems.reduce((s, i) => s + i.qty, 0);
//         const addr = selected.shippingAddress || {};
//         const fullAddress = [addr.address, addr.landmark, addr.city, addr.state, addr.postalCode]
//             .filter(Boolean)
//             .join(", ");

//         return (
//             <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
//                 <div className="flex items-center justify-between mb-5">
//                     <button
//                         onClick={() => setSelected(null)}
//                         className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-white"
//                         aria-label="Back"
//                     >
//                         <FaArrowLeft />
//                     </button>
//                     <button
//                         onClick={() => setDeleteTarget(selected)}
//                         className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-red-500"
//                         aria-label="Delete order"
//                     >
//                         <FaTrash />
//                     </button>
//                 </div>

//                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Summary</h2>
//                 <div className="flex items-center gap-2 mt-2">
//                     <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass[st.tone]}`}>
//                         {st.text}
//                     </span>
//                     <span className="text-sm text-gray-500">{fmtDate(selected.createdAt)}</span>
//                 </div>

//                 <h3 className="text-lg font-bold mt-6 mb-3 text-gray-800 dark:text-white">
//                     {totalQty} item{totalQty > 1 ? "s" : ""} in this order
//                 </h3>

//                 <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 divide-y dark:divide-gray-700">
//                     {selected.orderItems.map((item, i) => (
//                         <div key={i} className="flex items-center gap-3 p-4">
//                             <Thumb src={item.image} alt={item.name} />
//                             <div className="flex-1 min-w-0">
//                                 <p className="font-medium text-gray-800 dark:text-white text-sm">{item.name}</p>
//                                 <p className="text-xs text-gray-400 mt-1">
//                                     ₹{item.price} x {item.qty}
//                                 </p>
//                             </div>
//                             <p className="font-bold text-gray-800 dark:text-white">₹{item.price * item.qty}</p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Bill details */}
//                 <h3 className="text-lg font-bold mt-6 mb-3 text-gray-800 dark:text-white">Bill Details</h3>
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 text-sm">
//                     <div className="flex justify-between text-gray-600 dark:text-gray-300">
//                         <span>Item total</span>
//                         <span>₹{bill.itemsPrice}</span>
//                     </div>
//                     {bill.discount > 0 && (
//                         <div className="flex justify-between text-blue-600">
//                             <span>Order discount</span>
//                             <span>-₹{bill.discount}</span>
//                         </div>
//                     )}
//                     <div className="flex justify-between text-gray-600 dark:text-gray-300">
//                         <span>Delivery charges</span>
//                         <span className="text-green-600 font-medium">FREE</span>
//                     </div>
//                     <div className="flex justify-between border-t dark:border-gray-700 pt-3 font-bold text-base text-gray-800 dark:text-white">
//                         <span>Bill total</span>
//                         <span>₹{bill.total}</span>
//                     </div>
//                 </div>

//                 {/* Order details */}
//                 <h3 className="text-lg font-bold mt-6 mb-3 text-gray-800 dark:text-white">Order Details</h3>
//                 <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 text-sm">
//                     <div>
//                         <p className="text-xs text-gray-400">Order ID</p>
//                         <p className="text-gray-800 dark:text-white break-all">#{selected._id}</p>
//                     </div>
//                     <div>
//                         <p className="text-xs text-gray-400">Payment</p>
//                         <p className="text-gray-800 dark:text-white">
//                             {selected.paymentMethod} ·{" "}
//                             <span className={selected.isPaid ? "text-green-600" : "text-orange-500"}>
//                                 {selected.isPaid ? "Paid" : "Pay on delivery"}
//                             </span>
//                         </p>
//                     </div>
//                     <div>
//                         <p className="text-xs text-gray-400">Order placed</p>
//                         <p className="text-gray-800 dark:text-white">{fmtDate(selected.createdAt)}</p>
//                     </div>
//                     {(addr.fullName || addr.address) && (
//                         <div>
//                             <div className="flex items-center gap-2 mb-1">
//                                 <p className="text-xs text-gray-400">Delivering to</p>
//                                 {addr.addressType && (
//                                     <span className="flex items-center gap-1 text-[11px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full">
//                                         {addressIcon(addr.addressType)} {addr.addressType}
//                                     </span>
//                                 )}
//                             </div>
//                             <p className="text-gray-800 dark:text-white font-medium">
//                                 {addr.fullName}
//                                 {addr.phone && ` · +91 ${addr.phone}`}
//                             </p>
//                             <p className="text-gray-600 dark:text-gray-300">{fullAddress}</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Sticky Repeat button */}
//                 <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 p-4">
//                     <button
//                         onClick={() => reorder(selected)}
//                         className="max-w-2xl mx-auto block w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-bold"
//                     >
//                         Repeat Order
//                         <span className="block text-xs font-normal opacity-90">GO TO CHECKOUT</span>
//                     </button>
//                 </div>

//                 <DeleteModal
//                     order={deleteTarget}
//                     deleting={deleting}
//                     onCancel={() => setDeleteTarget(null)}
//                     onConfirm={confirmDelete}
//                 />
//             </div>
//         );
//     }

//     /* ================= LIST VIEW ================= */
//     return (
//         <div className="max-w-2xl mx-auto px-4 py-6" onClick={() => setMenuId(null)}>
//             <div className="flex items-center justify-between mb-5">
//                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order History</h2>
//                 <span className="text-sm text-gray-400">
//                     {orders.length} order{orders.length > 1 ? "s" : ""}
//                 </span>
//             </div>

//             <div className="space-y-4">
//                 {orders.map((order) => {
//                     const st = statusInfo(order.status);
//                     const shown = order.orderItems.slice(0, 4);
//                     const extra = order.orderItems.length - shown.length;

//                     return (
//                         <div
//                             key={order._id}
//                             className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
//                         >
//                             {/* Header */}
//                             <div className="flex items-start gap-3 p-4 relative">
//                                 <div
//                                     className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${badgeClass[st.tone]}`}
//                                 >
//                                     {st.ok ? <FaCheck /> : <FaClock />}
//                                 </div>

//                                 <div className="flex-1 cursor-pointer" onClick={() => setSelected(order)}>
//                                     <p className="font-bold text-gray-800 dark:text-white">{st.text}</p>
//                                     <p className="text-sm text-gray-500 mt-0.5">
//                                         ₹{order.totalPrice} · {fmtDate(order.createdAt)}
//                                     </p>
//                                 </div>

//                                 {/* Kebab menu */}
//                                 <div className="relative">
//                                     <button
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             setMenuId(menuId === order._id ? null : order._id);
//                                         }}
//                                         className="p-2 text-gray-500"
//                                         aria-label="Menu"
//                                     >
//                                         <FaEllipsisV />
//                                     </button>
//                                     {menuId === order._id && (
//                                         <div className="absolute right-0 top-9 z-10 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-xl shadow-lg w-40 overflow-hidden">
//                                             <button
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     setMenuId(null);
//                                                     setDeleteTarget(order);
//                                                 }}
//                                                 className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-600"
//                                             >
//                                                 <FaTrash /> Delete order
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Thumbnails */}
//                             <div
//                                 className="flex items-center gap-3 px-4 pb-4 cursor-pointer"
//                                 onClick={() => setSelected(order)}
//                             >
//                                 {shown.map((item, i) => (
//                                     <Thumb key={i} src={item.image} alt={item.name} />
//                                 ))}
//                                 {extra > 0 && (
//                                     <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-200">
//                                         +{extra}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Actions */}
//                             <div className="grid grid-cols-2 border-t dark:border-gray-700 text-sm font-semibold">
//                                 <button
//                                     onClick={() => reorder(order)}
//                                     className="py-3 text-green-700 hover:bg-green-50 dark:hover:bg-gray-700 rounded-bl-2xl border-r dark:border-gray-700"
//                                 >
//                                     Reorder
//                                 </button>
//                                 <button
//                                     onClick={() => setSelected(order)}
//                                     className="py-3 text-green-700 hover:bg-green-50 dark:hover:bg-gray-700 rounded-br-2xl"
//                                 >
//                                     View details
//                                 </button>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             <DeleteModal
//                 order={deleteTarget}
//                 deleting={deleting}
//                 onCancel={() => setDeleteTarget(null)}
//                 onConfirm={confirmDelete}
//             />
//         </div>
//     );
// };

// const DeleteModal = ({ order, deleting, onCancel, onConfirm }) => {
//     if (!order) return null;
//     return (
//         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
//                 <h3 className="text-lg font-bold text-gray-800 dark:text-white">Delete this order?</h3>
//                 <p className="text-sm text-gray-500 mt-2">
//                     Order #{order._id.slice(-8)} (₹{order.totalPrice}) will be permanently removed from your history.
//                 </p>
//                 <div className="flex gap-3 mt-6">
//                     <button
//                         onClick={onCancel}
//                         disabled={deleting}
//                         className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white font-semibold"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={onConfirm}
//                         disabled={deleting}
//                         className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white font-semibold"
//                     >
//                         {deleting ? "Deleting..." : "Delete"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyOrders;