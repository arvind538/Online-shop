import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { FaStar, FaShoppingCart, FaCheck } from "react-icons/fa";
import { getByCategory } from "../data/products";

// Sirf specified subcategories ke products (shared data se)
const TYPE_ORDER = ["Audio", "Accessories", "Power"];

const ELECTRONICS = getByCategory("electronics").filter((p) =>
  TYPE_ORDER.includes(p.subCategory)
);

const PAGE_SIZE = 12;

const present = [...new Set(ELECTRONICS.map((p) => p.subCategory))];
const TYPES = [
  "All",
  ...TYPE_ORDER.filter((t) => present.includes(t)),
  ...present.filter((t) => !TYPE_ORDER.includes(t)),
];

// Chips ke counts
const TYPE_COUNTS = (() => {
  const c = { All: ELECTRONICS.length };
  ELECTRONICS.forEach((p) => {
    c[p.subCategory] = (c[p.subCategory] || 0) + 1;
  });
  return c;
})();

const SORTS = [
  { key: "default", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
  { key: "discount", label: "Biggest Discount" },
];

const sorters = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  discount: (a, b) => b.discount - a.discount,
};

const Electronic = () => {
  const { cart, addToCart, decreaseQty } = useAuth();
  const [params, setParams] = useSearchParams();
  const [addedMap, setAddedMap] = useState({});
  const [visible, setVisible] = useState(PAGE_SIZE);

  // URL se current filters (galat value aaye to default)
  const typeParam = params.get("type");
  const type = TYPES.includes(typeParam) ? typeParam : "All";
  const sortParam = params.get("sort");
  const sort = SORTS.some((s) => s.key === sortParam) ? sortParam : "default";

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (!v || v === "All" || v === "default") next.delete(k);
      else next.set(k, v);
    });
    setParams(next, { replace: true });
  };

  // Filter badalte hi wapas pehle 12 products
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [type, sort]);

  const list = useMemo(() => {
    const out = type === "All" ? ELECTRONICS : ELECTRONICS.filter((p) => p.subCategory === type);
    return sorters[sort] ? [...out].sort(sorters[sort]) : out;
  }, [type, sort]);

  const shown = list.slice(0, visible);

  const getQty = (id) => cart?.find((item) => item.id === id)?.quantity || 0;

  const handleAdd = (item) => {
    addToCart(item);
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <section className="py-10 sm:py-14 px-3 sm:px-6 bg-slate-50/70 dark:bg-gray-950 min-h-screen">
      <style>{`
        @keyframes elecFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .elec-in { animation: elecFadeIn .35s ease both; }
        @media (prefers-reduced-motion: reduce) { .elec-in { animation: none; } }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            Electronics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Electronics Collection
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Top gadgets and devices — explore the best electronics at great prices!
          </p>
        </div>

        {/* Type chips + sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => update({ type: t })}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${type === t
                  ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-400"
                  }`}
              >
                {t} <span className="opacity-70">({TYPE_COUNTS[t] || 0})</span>
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value })}
            aria-label="Sort products"
            className="w-full sm:w-auto text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none focus:border-orange-400"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-gray-400 mb-5">
          Showing {shown.length} of {list.length} products
        </p>

        {/* Grid */}
        <div
          key={`${type}-${sort}`}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {shown.map((item, idx) => {
            const qty = getQty(item.id);
            const justAdded = addedMap[item.id];

            return (
              <div
                key={item.id}
                style={{ animationDelay: `${Math.min(idx, 11) * 30}ms` }}
                className="elec-in bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className={`relative overflow-hidden h-44 sm:h-56 bg-gradient-to-br ${item.bgColor || "from-gray-100 to-gray-200"}`}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  )}

                  {item.badge && (
                    <span className={`absolute top-2.5 left-2.5 ${item.badgeColor || "bg-orange-500"} text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm`}>
                      {item.badge}
                    </span>
                  )}

                  {item.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-gray-950/70 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full">
                      -{item.discount}%
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <span className="text-[10px] sm:text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold uppercase tracking-wider mb-1">
                    {item.subCategory}
                  </span>

                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex items-center text-[10px] sm:text-xs">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.round(item.rating || 0) ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium">({item.reviews || 0})</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm mb-1 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-3 mt-auto">
                    <span className="text-orange-600 dark:text-orange-500 font-bold text-sm sm:text-base">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-gray-400 text-[11px] sm:text-xs line-through">₹{item.originalPrice}</span>
                    )}
                  </div>

                  <div>
                    {qty > 0 ? (
                      <div className="w-full flex items-center justify-between bg-orange-500 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-white font-bold text-xs sm:text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-white text-xs font-bold min-w-[1.5rem] text-center">{qty}</span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-white font-bold text-xs sm:text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAdd(item)}
                        className={`w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] ${justAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-white"
                          }`}
                      >
                        {justAdded ? (
                          <>
                            <FaCheck className="text-xs" /> Added!
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="text-xs" /> Add to Cart
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {list.length === 0 && (
          <p className="text-center text-gray-400 py-16 text-sm">No products found</p>
        )}

        {/* Show more */}
        {list.length > visible && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="px-6 py-2.5 rounded-xl border border-orange-500 text-orange-600 text-xs sm:text-sm font-semibold hover:bg-orange-50 dark:hover:bg-gray-900 active:scale-95 transition-all"
            >
              Show more ({list.length - visible} left)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Electronic;