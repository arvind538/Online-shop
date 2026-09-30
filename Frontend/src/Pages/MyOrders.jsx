import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { toast } from "react-toastify";
import {
    FaArrowLeft, FaCheck, FaEllipsisV, FaTrash, FaClock,
    FaHome, FaBriefcase, FaMapMarkerAlt,
} from "react-icons/fa";

const fmtDate = (d) =>
    new Date(d).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

const statusInfo = (status) => {
    const s = (status || "Pending").toLowerCase();
    if (s === "delivered") return { text: "Delivered", tone: "green", ok: true };
    if (s === "cancelled") return { text: "Cancelled", tone: "red", ok: false };
    return { text: "Order placed", tone: "orange", ok: false };
};

const badgeClass = {
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-500",
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

const MyOrders = () => {
    const { token, API } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null); // detail view
    const [menuId, setMenuId] = useState(null); // kebab menu
    const [deleteTarget, setDeleteTarget] = useState(null); // confirm modal
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API}/api/orders/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) setOrders(Array.isArray(data) ? data : data.orders || []);
                else toast.error(data.message || "Could not load your orders");
            } catch (error) {
                console.error("Fetch Orders Error:", error);
                toast.error("Server connection failed!");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
        else setLoading(false);
    }, [token, API]);

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

    // Reorder: send the same items to the checkout page
    // NOTE: if your checkout route is not "/process", change the path here
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

        return (
            <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
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
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass[st.tone]}`}>
                        {st.text}
                    </span>
                    <span className="text-sm text-gray-500">{fmtDate(selected.createdAt)}</span>
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

                {/* Sticky Repeat button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 p-4">
                    <button
                        onClick={() => reorder(selected)}
                        className="max-w-2xl mx-auto block w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-bold"
                    >
                        Repeat Order
                        <span className="block text-xs font-normal opacity-90">GO TO CHECKOUT</span>
                    </button>
                </div>

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
    return (
        <div className="max-w-2xl mx-auto px-4 py-6" onClick={() => setMenuId(null)}>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order History</h2>
                <span className="text-sm text-gray-400">
                    {orders.length} order{orders.length > 1 ? "s" : ""}
                </span>
            </div>

            <div className="space-y-4">
                {orders.map((order) => {
                    const st = statusInfo(order.status);
                    const shown = order.orderItems.slice(0, 4);
                    const extra = order.orderItems.length - shown.length;

                    return (
                        <div
                            key={order._id}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-3 p-4 relative">
                                <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${badgeClass[st.tone]}`}
                                >
                                    {st.ok ? <FaCheck /> : <FaClock />}
                                </div>

                                <div className="flex-1 cursor-pointer" onClick={() => setSelected(order)}>
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
                                className="flex items-center gap-3 px-4 pb-4 cursor-pointer"
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
                                    View details
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

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