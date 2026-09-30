import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { FaStar, FaShoppingCart, FaCheck } from "react-icons/fa";

const productData = [
  { id: 501, title: "Backpack", price: 999, originalPrice: 1799, rating: 4, reviews: 89, badge: "Trending", badgeColor: "bg-blue-500", brand: "Wildcraft", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", bgColor: "from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40" },
  { id: 502, title: "Bluetooth Speaker", price: 2499, originalPrice: 3999, rating: 5, reviews: 213, badge: "Best Seller", badgeColor: "bg-orange-500", brand: "JBL", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", bgColor: "from-orange-50 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40" },
  { id: 503, title: "Gaming Mouse", price: 999, originalPrice: 1999, rating: 4, reviews: 156, badge: "Hot Deal", badgeColor: "bg-red-500", brand: "Logitech", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500", bgColor: "from-red-50 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40" },
  { id: 504, title: "Keyboard", price: 1499, originalPrice: 2499, rating: 4, reviews: 98, badge: "Popular", badgeColor: "bg-green-500", brand: "Corsair", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500", bgColor: "from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40" },
  { id: 505, title: "LED Monitor", price: 8999, originalPrice: 13999, rating: 5, reviews: 312, badge: "Top Rated", badgeColor: "bg-purple-500", brand: "LG", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500", bgColor: "from-purple-50 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40" },
  { id: 506, title: "Camera", price: 25999, originalPrice: 34999, rating: 5, reviews: 67, badge: "Premium", badgeColor: "bg-indigo-500", brand: "Canon", image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500", bgColor: "from-indigo-50 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40" },
  { id: 507, title: "Power Bank", price: 1299, originalPrice: 2199, rating: 4, reviews: 445, badge: "New", badgeColor: "bg-teal-500", brand: "Anker", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500", bgColor: "from-teal-50 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40" },
  { id: 508, title: "Tablet", price: 18999, originalPrice: 24999, rating: 5, reviews: 178, badge: "Sale", badgeColor: "bg-yellow-500", brand: "Samsung", image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500", bgColor: "from-yellow-50 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40" },
  { id: 509, title: "Smart TV", price: 32999, originalPrice: 44999, rating: 5, reviews: 234, badge: "Best Seller", badgeColor: "bg-orange-500", brand: "Sony", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500", bgColor: "from-gray-50 to-slate-100 dark:from-gray-700 dark:to-slate-700" },
  { id: 510, title: "Printer", price: 7499, originalPrice: 10999, rating: 4, reviews: 56, badge: "Popular", badgeColor: "bg-blue-500", brand: "HP", image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=500", bgColor: "from-blue-50 to-sky-100 dark:from-blue-900/40 dark:to-sky-900/40" },
  { id: 511, title: "Router", price: 1999, originalPrice: 3499, rating: 4, reviews: 123, badge: "Hot Deal", badgeColor: "bg-red-500", brand: "TP-Link", image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500", bgColor: "from-red-50 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40" },
  { id: 512, title: "External Hard Drive", price: 5499, originalPrice: 7999, rating: 5, reviews: 289, badge: "Top Rated", badgeColor: "bg-purple-500", brand: "WD", image: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=500", bgColor: "from-purple-50 to-fuchsia-100 dark:from-purple-900/40 dark:to-fuchsia-900/40" },
];

const NewProducts = () => {
  const { cart, addToCart, decreaseQty } = useAuth();
  const [addedMap, setAddedMap] = useState({});
  const navigate = useNavigate();

  const discount = (original, price) =>
    Math.round(((original - price) / original) * 100);

  const getQty = (id) => cart.find((item) => item.id === id)?.quantity || 0;

  const handleAdd = (item) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      brand: item.brand,
    });
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const handleDecrease = (item) => {
    decreaseQty(item.id);
  };

  return (
    <div className="py-14 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            New Arrivals
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            New Products Items
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Latest gadgets and accessories — explore what's new at the best prices!
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {productData.map((item) => {
            const qty = getQty(item.id);
            const justAdded = addedMap[item.id];

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className={`relative overflow-hidden h-48 sm:h-52 bg-gradient-to-br ${item.bgColor}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Badge */}
                  <span className={`absolute top-2 left-2 ${item.badgeColor} text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow`}>
                    {item.badge}
                  </span>

                  {/* Discount */}
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{discount(item.originalPrice, item.price)}%
                  </span>


                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">

                  {/* Brand */}
                  <span className="text-xs text-indigo-500 font-semibold mb-1">
                    {item.brand}
                  </span>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs ${i < item.rating ? "text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({item.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-2 truncate">
                    {item.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3 mt-auto">
                    <span className="text-orange-500 font-bold text-sm md:text-base">
                      ₹{item.price}
                    </span>
                    <span className="text-gray-400 text-xs line-through">
                      ₹{item.originalPrice}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {qty > 0 ? (
                      // Quantity control shown when item is already in cart
                      <div className="flex-1 flex items-center justify-between bg-orange-500 rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="px-3 py-1.5 text-white font-bold text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-white text-xs font-semibold min-w-[1.5rem] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="px-3 py-1.5 text-white font-bold text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      // Add button shown when item is not in cart yet
                      <button
                        onClick={() => handleAdd(item)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${justAdded
                          ? "bg-green-500 text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-white"
                          }`}
                      >
                        {justAdded ? (
                          <><FaCheck className="text-xs" /> Added!</>
                        ) : (
                          <><FaShoppingCart className="text-xs" />Add</>
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
    </div>
  );
};

export default NewProducts;