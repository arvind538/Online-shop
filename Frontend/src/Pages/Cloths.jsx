import React, { useState } from "react";
import { useAuth } from "../Store/auth";
import { FaStar, FaShoppingCart, FaCheck } from "react-icons/fa";

const clothesData = [
  {
    id: 101,
    title: "Classic Minimalist T-Shirt",
    price: 799,
    originalPrice: 1299,
    rating: 4,
    reviews: 184,
    badge: "Popular",
    badgeColor: "bg-emerald-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-slate-50 to-gray-100 dark:from-slate-900/40 dark:to-gray-900/40"
  },
  {
    id: 102,
    title: "Oxford Cotton Shirt",
    price: 1199,
    originalPrice: 1999,
    rating: 4,
    reviews: 132,
    badge: "Trending",
    badgeColor: "bg-blue-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
  },
  {
    id: 103,
    title: "Slim-Fit Selvedge Denim",
    price: 1799,
    originalPrice: 2799,
    rating: 5,
    reviews: 276,
    badge: "Best Seller",
    badgeColor: "bg-orange-500",
    category: "men",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-sky-50 to-slate-100 dark:from-sky-900/40 dark:to-slate-900/40"
  },
  {
    id: 104,
    title: "Trucker Denim Jacket",
    price: 2499,
    originalPrice: 3999,
    rating: 5,
    reviews: 98,
    badge: "Premium",
    badgeColor: "bg-indigo-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-indigo-50 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40"
  },
  {
    id: 105,
    title: "Heavyweight Fleece Hoodie",
    price: 1599,
    originalPrice: 2499,
    rating: 4,
    reviews: 215,
    badge: "New",
    badgeColor: "bg-teal-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-stone-50 to-zinc-100 dark:from-stone-900/40 dark:to-zinc-900/40"
  },
  {
    id: 106,
    title: "Structured Italian Blazer",
    price: 2999,
    originalPrice: 4499,
    rating: 5,
    reviews: 76,
    badge: "Top Rated",
    badgeColor: "bg-purple-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-purple-50 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40"
  },
  {
    id: 107,
    title: "Tailored Tapered Joggers",
    price: 999,
    originalPrice: 1599,
    rating: 4,
    reviews: 154,
    badge: "Hot Deal",
    badgeColor: "bg-rose-500",
    category: "men",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-slate-50 to-gray-100 dark:from-slate-900/40 dark:to-gray-900/40"
  },
  {
    id: 108,
    title: "Relaxed Boxy Graphic Tee",
    price: 1299,
    originalPrice: 1999,
    rating: 4,
    reviews: 121,
    badge: "Trending",
    badgeColor: "bg-blue-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-blue-50 to-sky-100 dark:from-blue-900/40 dark:to-sky-900/40"
  },
  {
    id: 109,
    title: "Organic Pima Cotton Tee",
    price: 999,
    originalPrice: 1599,
    rating: 4,
    reviews: 143,
    badge: "Popular",
    badgeColor: "bg-emerald-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-emerald-50 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40"
  },
  {
    id: 110,
    title: "Modern Utility Cargo Pants",
    price: 1799,
    originalPrice: 2799,
    rating: 4,
    reviews: 167,
    badge: "Sale",
    badgeColor: "bg-amber-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40"
  },
  {
    id: 111,
    title: "Linen Resort Co-Ord Set",
    price: 2499,
    originalPrice: 3799,
    rating: 5,
    reviews: 89,
    badge: "New",
    badgeColor: "bg-teal-600",
    category: "boys",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-teal-50 to-emerald-100 dark:from-teal-900/40 dark:to-emerald-900/40"
  },
  {
    id: 112,
    title: "Lambskin Biker Jacket",
    price: 2999,
    originalPrice: 4599,
    rating: 5,
    reviews: 64,
    badge: "Premium",
    badgeColor: "bg-indigo-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-zinc-50 to-stone-100 dark:from-zinc-900/40 dark:to-stone-900/40"
  },
  {
    id: 113,
    title: "Urban Bomber Windbreaker",
    price: 2799,
    originalPrice: 4199,
    rating: 4,
    reviews: 112,
    badge: "Hot Deal",
    badgeColor: "bg-rose-500",
    category: "boys",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-rose-50 to-orange-100 dark:from-rose-900/40 dark:to-orange-900/40"
  },
  {
    id: 114,
    title: "Handcrafted Festive Kurta",
    price: 1599,
    originalPrice: 2399,
    rating: 4,
    reviews: 95,
    badge: "Trending",
    badgeColor: "bg-blue-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
  },
  {
    id: 115,
    title: "Performance Active Tracksuit",
    price: 2199,
    originalPrice: 3299,
    rating: 5,
    reviews: 138,
    badge: "Best Seller",
    badgeColor: "bg-orange-500",
    category: "boys",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-orange-50 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40"
  },
  {
    id: 116,
    title: "Camp-Collar Resort Shirt",
    price: 1199,
    originalPrice: 1899,
    rating: 4,
    reviews: 107,
    badge: "Popular",
    badgeColor: "bg-emerald-600",
    category: "men",
    image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80",
    bgColor: "from-teal-50 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40"
  }
];

const Cloths = () => {
  const { cart, addToCart, decreaseQty } = useAuth();
  const [addedMap, setAddedMap] = useState({});

  const getQty = (id) => cart?.find((item) => item.id === id)?.quantity || 0;

  const discount = (original, price) =>
    Math.round(((original - price) / original) * 100);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <section className="py-14 px-4 bg-slate-50/70 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            Fashion
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Clothing Collection
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Trendy outfits and everyday essentials — explore premium apparel at the best prices!
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {clothesData.map((item) => {
            const qty = getQty(item.id);
            const justAdded = addedMap[item.id];

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                {/* Image Container (Quick Add bar completely removed) */}
                <div className={`relative overflow-hidden h-52 sm:h-56 bg-gradient-to-br ${item.bgColor}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Badge */}
                  <span className={`absolute top-2.5 left-2.5 ${item.badgeColor} text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm`}>
                    {item.badge}
                  </span>

                  {/* Discount */}
                  <span className="absolute top-2.5 right-2.5 bg-gray-950/70 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    -{discount(item.originalPrice, item.price)}%
                  </span>
                </div>

                {/* Details */}
                <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                  {/* Category */}
                  {item.category && (
                    <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold uppercase tracking-wider mb-1">
                      {item.category}
                    </span>
                  )}

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex items-center text-amber-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < item.rating ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">({item.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2 line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3 mt-auto">
                    <span className="text-orange-600 dark:text-orange-500 font-bold text-base">
                      ₹{item.price}
                    </span>
                    <span className="text-gray-400 text-xs line-through">
                      ₹{item.originalPrice}
                    </span>
                  </div>

                  {/* Bottom Action Area */}
                  <div>
                    {qty > 0 ? (
                      <div className="w-full flex items-center justify-between bg-orange-500 rounded-xl overflow-hidden shadow-sm">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="px-3.5 py-2 text-white font-bold text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-white text-xs font-bold min-w-[1.5rem] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="px-3.5 py-2 text-white font-bold text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors"
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
      </div>
    </section>
  );
};

export default Cloths;