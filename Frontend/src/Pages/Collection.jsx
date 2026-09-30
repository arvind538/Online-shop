import React, { useMemo, useState } from "react";
import { useAuth } from "../Store/auth";
import { toast } from "react-toastify";
import { FaShoppingBag, FaSearch, FaStar } from "react-icons/fa";

// image: apni images ka URL/path daal (abhi color block dikhega agar image empty hai)
const PRODUCTS = [
    // ---------- MEN WINTER ----------
    { id: "m-w-1", title: "Classic Wool Overcoat", gender: "men", season: "winter", type: "Coat", price: 5999, mrp: 8999, rating: 4.8, tone: "from-stone-700 to-stone-900", image: "" },
    { id: "m-w-2", title: "Merino Turtleneck Sweater", gender: "men", season: "winter", type: "Sweater", price: 2499, mrp: 3999, rating: 4.6, tone: "from-slate-600 to-slate-800", image: "" },
    { id: "m-w-3", title: "Quilted Puffer Jacket", gender: "men", season: "winter", type: "Jacket", price: 3999, mrp: 5999, rating: 4.7, tone: "from-emerald-800 to-emerald-950", image: "" },
    { id: "m-w-4", title: "Leather Biker Jacket", gender: "men", season: "winter", type: "Jacket", price: 7499, mrp: 11999, rating: 4.9, tone: "from-neutral-800 to-black", image: "" },
    // ---------- MEN SUMMER ----------
    { id: "m-s-1", title: "Linen Classic Shirt", gender: "men", season: "summer", type: "Shirt", price: 1499, mrp: 2499, rating: 4.5, tone: "from-sky-200 to-sky-400", image: "" },
    { id: "m-s-2", title: "Cotton Polo T-Shirt", gender: "men", season: "summer", type: "T-Shirt", price: 899, mrp: 1499, rating: 4.4, tone: "from-amber-200 to-amber-400", image: "" },
    { id: "m-s-3", title: "Chino Shorts", gender: "men", season: "summer", type: "Shorts", price: 1199, mrp: 1999, rating: 4.3, tone: "from-lime-200 to-lime-400", image: "" },
    { id: "m-s-4", title: "Premium Linen Trousers", gender: "men", season: "summer", type: "Trousers", price: 1999, mrp: 3199, rating: 4.6, tone: "from-orange-100 to-orange-300", image: "" },
    // ---------- WOMEN WINTER ----------
    { id: "w-w-1", title: "Camel Wool Long Coat", gender: "women", season: "winter", type: "Coat", price: 6499, mrp: 9999, rating: 4.9, tone: "from-amber-700 to-amber-900", image: "" },
    { id: "w-w-2", title: "Cashmere Blend Cardigan", gender: "women", season: "winter", type: "Sweater", price: 3299, mrp: 4999, rating: 4.7, tone: "from-rose-300 to-rose-500", image: "" },
    { id: "w-w-3", title: "Faux Fur Winter Jacket", gender: "women", season: "winter", type: "Jacket", price: 4799, mrp: 7499, rating: 4.8, tone: "from-zinc-300 to-zinc-500", image: "" },
    { id: "w-w-4", title: "Knitted Woolen Shawl", gender: "women", season: "winter", type: "Shawl", price: 1799, mrp: 2799, rating: 4.6, tone: "from-purple-400 to-purple-700", image: "" },
    // ---------- WOMEN SUMMER ----------
    { id: "w-s-1", title: "Floral Maxi Dress", gender: "women", season: "summer", type: "Dress", price: 2299, mrp: 3699, rating: 4.7, tone: "from-pink-200 to-pink-400", image: "" },
    { id: "w-s-2", title: "Cotton Kurti Set", gender: "women", season: "summer", type: "Kurti", price: 1599, mrp: 2599, rating: 4.5, tone: "from-teal-200 to-teal-400", image: "" },
    { id: "w-s-3", title: "Flowy Linen Co-ord Set", gender: "women", season: "summer", type: "Co-ord", price: 2799, mrp: 4299, rating: 4.8, tone: "from-yellow-100 to-yellow-300", image: "" },
    { id: "w-s-4", title: "Breezy Wrap Skirt", gender: "women", season: "summer", type: "Skirt", price: 1299, mrp: 2099, rating: 4.4, tone: "from-fuchsia-200 to-fuchsia-400", image: "" },
];

const Pill = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${active
            ? "bg-gray-900 text-white border-gray-900 dark:bg-orange-500 dark:border-orange-500"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-900"
            }`}
    >
        {children}
    </button>
);

const Collection = () => {
    const { addToCart } = useAuth();
    const [gender, setGender] = useState("all");
    const [season, setSeason] = useState("all");
    const [sort, setSort] = useState("popular");
    const [query, setQuery] = useState("");

    const list = useMemo(() => {
        let items = PRODUCTS.filter(
            (p) =>
                (gender === "all" || p.gender === gender) &&
                (season === "all" || p.season === season) &&
                p.title.toLowerCase().includes(query.trim().toLowerCase())
        );
        if (sort === "low") items = [...items].sort((a, b) => a.price - b.price);
        if (sort === "high") items = [...items].sort((a, b) => b.price - a.price);
        if (sort === "popular") items = [...items].sort((a, b) => b.rating - a.rating);
        return items;
    }, [gender, season, sort, query]);

    const handleAdd = (p) => {
        addToCart({ id: p.id, title: p.title, name: p.title, price: p.price, image: p.image });
        toast.success(`${p.title} cart mein add ho gaya`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Hero */}
            <div className="text-center mb-10">
                <p className="tracking-[0.3em] text-xs text-orange-500 font-semibold">PREMIUM COLLECTION</p>
                <h1 className="text-3xl md:text-5xl font-bold mt-2 text-gray-900 dark:text-white">
                    Classic Style, Every Season
                </h1>
                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                    Men aur Women ke liye winter aur summer ki handpicked premium clothing.
                </p>
            </div>

            {/* Filters */}
            <div className="space-y-4 mb-8">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {["all", "men", "women"].map((g) => (
                        <Pill key={g} active={gender === g} onClick={() => setGender(g)}>
                            {g === "all" ? "All" : g === "men" ? "Men" : "Women"}
                        </Pill>
                    ))}
                    <span className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />
                    {[
                        ["all", "All Seasons"],
                        ["winter", "❄️ Winter"],
                        ["summer", "☀️ Summer"],
                    ].map(([v, label]) => (
                        <Pill key={v} active={season === v} onClick={() => setSeason(v)}>
                            {label}
                        </Pill>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search coat, dress, shirt..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none"
                    >
                        <option value="popular">Top Rated</option>
                        <option value="low">Price: Low to High</option>
                        <option value="high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">{list.length} products</p>

            {/* Grid */}
            {list.length === 0 ? (
                <div className="text-center py-20 text-gray-500">Koi product nahi mila 😕</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {list.map((p) => {
                        const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
                        return (
                            <div
                                key={p.id}
                                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition"
                            >
                                <div className={`relative aspect-[3/4] bg-gradient-to-br ${p.tone} overflow-hidden`}>
                                    {p.image && (
                                        <img
                                            src={p.image}
                                            alt={p.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    )}
                                    <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] tracking-widest px-2 py-1 rounded">
                                        {p.season === "winter" ? "WINTER" : "SUMMER"}
                                    </span>
                                    <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {off}% OFF
                                    </span>
                                </div>

                                <div className="p-4">
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                                        {p.gender} · {p.type}
                                    </p>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mt-1 text-sm md:text-base line-clamp-1">
                                        {p.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
                                        <FaStar /> <span className="text-gray-500">{p.rating}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="font-bold text-lg text-gray-900 dark:text-white">₹{p.price}</span>
                                        <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(p)}
                                        className="w-full mt-3 flex items-center justify-center gap-2 bg-gray-900 hover:bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                                    >
                                        <FaShoppingBag /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Collection;