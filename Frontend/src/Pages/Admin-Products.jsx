import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaStar } from "react-icons/fa";
import { PRODUCTS } from "../data/products";
import { adminService } from "../lib/services";
import { inr, onImgError, IMG_FALLBACK } from "../lib/adminUtils";

const Mini = ({ label, value }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
    </div>
);

const AdminProducts = () => {
    const [sales, setSales] = useState({});
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState("default");

    // Orders se sales nikalo (cancelled ko chhod ke)
    useEffect(() => {
        const load = async () => {
            try {
                const orders = await adminService.getOrders();
                const map = {};
                orders
                    .filter((o) => o.status !== "Cancelled")
                    .forEach((o) =>
                        o.orderItems.forEach((i) => {
                            map[i.name] = map[i.name] || { qty: 0, revenue: 0 };
                            map[i.name].qty += i.qty;
                            map[i.name].revenue += i.price * i.qty;
                        })
                    );
                setSales(map);
            } catch (error) {
                console.error("Sales load error:", error);
            }
        };
        load();
    }, []);

    const categories = useMemo(
        () => ["all", ...new Set(PRODUCTS.map((p) => p.category).filter(Boolean))],
        []
    );

    const list = useMemo(() => {
        let items = PRODUCTS.filter(
            (p) =>
                (category === "all" || p.category === category) &&
                p.title.toLowerCase().includes(query.trim().toLowerCase())
        );
        const sold = (p) => sales[p.title]?.qty || 0;
        if (sort === "low") items = [...items].sort((a, b) => a.price - b.price);
        if (sort === "high") items = [...items].sort((a, b) => b.price - a.price);
        if (sort === "best") items = [...items].sort((a, b) => sold(b) - sold(a));
        return items;
    }, [query, category, sort, sales]);

    const totalSold = Object.values(sales).reduce((s, v) => s + v.qty, 0);
    const avgPrice = PRODUCTS.length
        ? Math.round(PRODUCTS.reduce((s, p) => s + p.price, 0) / PRODUCTS.length)
        : 0;

    return (
        <section className="space-y-5">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Catalogue overview with live sales. Products are edited.
                </p>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <Mini label="Total Products" value={PRODUCTS.length} />
                <Mini label="Categories" value={categories.length - 1} />
                <Mini label="Average Price" value={inr(avgPrice)} />
                <Mini label="Units Sold" value={totalSold} />
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex flex-wrap gap-2 flex-1">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${category === c
                                ? "bg-gray-900 dark:bg-orange-500 text-white shadow"
                                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-400"
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    <div className="relative flex-1 lg:w-64">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search product"
                            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm outline-none"
                    >
                        <option value="default">Default</option>
                        <option value="best">Best selling</option>
                        <option value="low">Price: Low to High</option>
                        <option value="high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {list.length === 0 ? (
                <p className="text-center text-gray-400 py-16">No products found</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {list.map((p) => {
                        const s = sales[p.title];
                        const off = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
                        return (
                            <div
                                key={p.id}
                                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                    <img
                                        src={p.image || IMG_FALLBACK}
                                        onError={onImgError}
                                        alt={p.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] tracking-widest px-2 py-1 rounded capitalize">
                                        {p.category}
                                    </span>
                                    {off > 0 && (
                                        <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            {off}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1">{p.title}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-gray-900 dark:text-white">{inr(p.price)}</span>
                                            {p.mrp && <span className="text-xs text-gray-400 line-through">{inr(p.mrp)}</span>}
                                        </div>
                                        {p.rating && (
                                            <span className="flex items-center gap-1 text-xs text-yellow-500">
                                                <FaStar /> <span className="text-gray-500">{p.rating}</span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-3 pt-3 border-t dark:border-gray-800 flex justify-between text-xs">
                                        <span className="text-gray-500">
                                            Sold: <b className="text-gray-800 dark:text-white">{s?.qty || 0}</b>
                                        </span>
                                        <span className="text-gray-500">
                                            Revenue: <b className="text-gray-800 dark:text-white">{inr(s?.revenue || 0)}</b>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default AdminProducts;