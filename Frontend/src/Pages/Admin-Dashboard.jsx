import { Link, useOutletContext } from "react-router-dom";
import { FaRupeeSign, FaShoppingBag, FaClock, FaUsers } from "react-icons/fa";
import {
    STATUSES, STATUS_BAR, STATUS_STYLES, fmtDate, inr, onImgError, IMG_FALLBACK,
} from "../lib/adminUtils";
import InventoryOverview from "../components/InventoryOverview";

const StatCard = ({ icon, label, value, sub, tone }) => (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${tone} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
        {sub && <p className="text-xs text-gray-400 mt-3">{sub}</p>}
    </div>
);


// {/* Stat cards */} wale grid ke theek baad:
<InventoryOverview />

const Card = ({ title, action, children }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 dark:text-white">{title}</h3>
            {action}
        </div>
        {children}
    </div>
);

const AdminDashboard = () => {
    const { stats } = useOutletContext() || {};

    if (!stats) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                    ))}
                </div>
                <div className="h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            </div>
        );
    }

    // Safe defaults: backend ka koi field missing ho to bhi page crash nahi hoga
    const revenue = stats.revenue ?? 0;
    const avgOrderValue = stats.avgOrderValue ?? 0;
    const totalOrders = stats.totalOrders ?? 0;
    const pending = stats.pending ?? 0;
    const totalUsers = stats.totalUsers ?? 0;
    const statusCounts = stats.statusCounts || {};
    const last7 = Array.isArray(stats.last7) ? stats.last7 : [];
    const recentOrders = Array.isArray(stats.recentOrders) ? stats.recentOrders : [];
    const topProducts = Array.isArray(stats.topProducts) ? stats.topProducts : [];

    const maxRevenue = Math.max(...last7.map((d) => d.revenue || 0), 1);
    const totalForBars = Math.max(totalOrders, 1);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Your store performance at a glance</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    icon={<FaRupeeSign />}
                    label="Total Revenue"
                    value={inr(revenue)}
                    sub={`Avg. order value ${inr(avgOrderValue)}`}
                    tone="bg-green-50 text-green-600"
                />
                <StatCard
                    icon={<FaShoppingBag />}
                    label="Total Orders"
                    value={totalOrders}
                    sub={`${statusCounts.Delivered || 0} delivered`}
                    tone="bg-blue-50 text-blue-600"
                />
                <StatCard
                    icon={<FaClock />}
                    label="Pending Orders"
                    value={pending}
                    sub={pending ? "Waiting for your confirmation" : "All caught up"}
                    tone="bg-orange-50 text-orange-600"
                />
                <StatCard
                    icon={<FaUsers />}
                    label="Customers"
                    value={totalUsers}
                    sub="Registered users"
                    tone="bg-indigo-50 text-indigo-600"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Revenue chart */}
                <div className="xl:col-span-2">
                    <Card title="Revenue (last 7 days)">
                        {last7.length === 0 ? (
                            <p className="text-sm text-gray-400 py-16 text-center">No data yet</p>
                        ) : (
                            <div className="flex items-end gap-2 sm:gap-4 h-56">
                                {last7.map((d) => (
                                    <div key={d.label} className="group flex-1 h-full flex flex-col justify-end items-center gap-2">
                                        <div className="relative w-full flex-1 flex items-end">
                                            <div
                                                className="w-full rounded-t-lg bg-gradient-to-t from-orange-500 to-orange-300 group-hover:from-orange-600 group-hover:to-orange-400 transition-all duration-300"
                                                style={{ height: `${Math.max(((d.revenue || 0) / maxRevenue) * 100, 3)}%` }}
                                            />
                                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                {inr(d.revenue || 0)} · {d.orders || 0} orders
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-gray-500">{d.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Status breakdown */}
                <Card title="Order Status">
                    <div className="space-y-4">
                        {STATUSES.map((s) => {
                            const count = statusCounts[s] || 0;
                            return (
                                <div key={s}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-300">{s}</span>
                                        <span className="font-semibold text-gray-800 dark:text-white">{count}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${STATUS_BAR[s]} transition-all duration-700`}
                                            style={{ width: `${(count / totalForBars) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Recent orders */}
                <div className="xl:col-span-2">
                    <Card
                        title="Recent Orders"
                        action={
                            <Link to="/admin/orders" className="text-sm font-semibold text-orange-500 hover:text-orange-600">
                                View all
                            </Link>
                        }
                    >
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-gray-400 py-8 text-center">No orders yet</p>
                        ) : (
                            <div className="divide-y dark:divide-gray-800">
                                {recentOrders.map((o) => (
                                    <Link
                                        key={o._id}
                                        to="/admin/orders"
                                        className="flex items-center gap-3 py-3 px-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shrink-0">
                                            {(o.user?.username || "U").charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                                                {o.user?.username || "Unknown"} · #{String(o._id).slice(-6)}
                                            </p>
                                            <p className="text-xs text-gray-400">{fmtDate(o.createdAt)}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ring-inset ${STATUS_STYLES[o.status] || STATUS_STYLES.Pending}`}>
                                            {o.status}
                                        </span>
                                        <p className="font-bold text-gray-800 dark:text-white w-20 text-right">{inr(o.totalPrice)}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Top products */}
                <Card title="Top Selling Products">
                    {topProducts.length === 0 ? (
                        <p className="text-sm text-gray-400 py-8 text-center">No sales yet</p>
                    ) : (
                        <div className="space-y-3">
                            {topProducts.map((p, i) => (
                                <div key={p.name} className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                                    <span className="w-6 text-sm font-bold text-gray-400">{i + 1}</span>
                                    <img
                                        src={p.image || IMG_FALLBACK}
                                        onError={onImgError}
                                        alt={p.name}
                                        className="w-11 h-11 rounded-lg object-cover border dark:border-gray-700"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.qty} sold</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-800 dark:text-white">{inr(p.revenue)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;