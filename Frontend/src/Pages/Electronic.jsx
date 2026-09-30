import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Store/auth";
import { FaStar, FaShoppingCart, FaCheck } from "react-icons/fa";

const electronicsData = [
  { id: 201, title: "Smart Watch", description: "Advanced fitness tracking smartwatch", category: "Wearable", price: 1999, originalPrice: 2999, rating: 4, reviews: 142, badge: "Trending", badgeColor: "bg-blue-500", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500", bgColor: "from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40" },
  { id: 202, title: "Headphones", description: "Noise cancelling wireless headphones", category: "Audio", price: 1499, originalPrice: 2499, rating: 5, reviews: 268, badge: "Best Seller", badgeColor: "bg-orange-500", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", bgColor: "from-orange-50 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40" },
  { id: 203, title: "Laptop", description: "High performance laptop for work & gaming", category: "Computers", price: 45999, originalPrice: 59999, rating: 5, reviews: 97, badge: "Premium", badgeColor: "bg-indigo-500", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", bgColor: "from-indigo-50 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40" },
  { id: 204, title: "Mobile Phone", description: "Latest 5G smartphone", category: "Mobile", price: 12999, originalPrice: 17999, rating: 4, reviews: 356, badge: "Hot Deal", badgeColor: "bg-red-500", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", bgColor: "from-red-50 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40" },
  { id: 205, title: "Bluetooth Speaker", description: "Portable wireless speaker", category: "Audio", price: 2499, originalPrice: 3999, rating: 4, reviews: 213, badge: "Popular", badgeColor: "bg-green-500", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", bgColor: "from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40" },
  { id: 206, title: "Gaming Mouse", description: "High precision gaming mouse", category: "Accessories", price: 999, originalPrice: 1999, rating: 4, reviews: 156, badge: "New", badgeColor: "bg-teal-500", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500", bgColor: "from-teal-50 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40" },
  { id: 207, title: "Keyboard", description: "Mechanical gaming keyboard", category: "Accessories", price: 1499, originalPrice: 2499, rating: 4, reviews: 98, badge: "Sale", badgeColor: "bg-yellow-500", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500", bgColor: "from-yellow-50 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40" },
  { id: 208, title: "LED Monitor", description: "4K ultra wide monitor", category: "Display", price: 8999, originalPrice: 13999, rating: 5, reviews: 312, badge: "Top Rated", badgeColor: "bg-purple-500", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500", bgColor: "from-purple-50 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40" },
];

const Electronic = () => {
  const { cart, addToCart, removeFromCart, decreaseQty } = useAuth();
  const [bump, setBump] = useState(false);
  const [addedMap, setAddedMap] = useState({});
  const navigate = useNavigate();

  const getQty = (id) => cart.find((item) => item.id === id)?.quantity || 0;
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const discount = (original, price) =>
    Math.round(((original - price) / original) * 100);

  useEffect(() => {
    if (totalItems > 0) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 250);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <div className="py-14 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            Electronics
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Electronics Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Top gadgets and devices — explore the best electronics at great prices!
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {electronicsData.map((item) => {
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

                  {/* Quick Add hover */}
                  {/* <div className="absolute bottom-0 left-0 right-0 bg-orange-500/90 py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                    <button
                      onClick={() => handleAdd(item)}
                      className="flex items-center gap-2 text-white text-xs font-bold"
                    >
                      <FaShoppingCart />
                      Quick Add to Cart
                    </button>
                  </div> */}
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">

                  {/* Category */}
                  <span className="text-xs text-indigo-500 font-semibold mb-1">
                    {item.category}
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
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 truncate">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                    {item.description}
                  </p>

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
                          onClick={() => decreaseQty(item.id)}
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

export default Electronic;