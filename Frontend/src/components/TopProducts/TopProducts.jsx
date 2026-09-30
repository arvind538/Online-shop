import React, { useState } from "react";
import { FaStar, FaShoppingCart, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Store/auth";
import Img1 from "../../assets/shirt/shirt.png";
import Img2 from "../../assets/shirt/shirt2.png";
import Img3 from "../../assets/shirt/shirt3.png";

const ProductsData = [
  {
    id: 101,
    img: Img1,
    title: "Men T-Shirt",
    price: 799,
    originalPrice: 1299,
    rating: 4,
    reviews: 128,
    badge: "Best Seller",
    badgeColor: "bg-orange-500",
    link: "/cloths",
    brand: "Nike",
    bgColor: "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600",
  },
  {
    id: 102,
    img: Img2,
    title: "Casual Shirt",
    price: 1199,
    originalPrice: 1999,
    rating: 5,
    reviews: 89,
    badge: "Trending",
    badgeColor: "bg-pink-500",
    link: "/cloths",
    brand: "H&M",
    bgColor: "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600",
  },
  {
    id: 103,
    img: Img3,
    title: "Women Shirt",
    price: 1499,
    originalPrice: 2499,
    rating: 5,
    reviews: 204,
    badge: "Top Rated",
    badgeColor: "bg-purple-500",
    link: "/girls",
    brand: "Zara",
    bgColor: "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600",
  },
  {
    id: 104,
    img: Img1,
    title: "Hoodie",
    price: 1599,
    originalPrice: 2799,
    rating: 4,
    reviews: 67,
    badge: "New",
    badgeColor: "bg-green-500",
    link: "/cloths",
    brand: "Adidas",
    bgColor: "from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600",
  },
  {
    id: 105,
    img: "https://rukminim2.flixcart.com/image/612/612/xif0q/shopsy-shirt/z/v/n/s-psset-094-rudraasavari-creation-original-imahhqajr2hmgt4h.jpeg?q=70",
    title: "Shirt",
    price: 799,
    originalPrice: 999,
    rating: 4,
    reviews: 156,
    badge: "Popular",
    badgeColor: "bg-blue-500",
    link: "/cloths",
    brand: "Levis",
    bgColor: "from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40",
  },
  {
    id: 106,
    img: "https://rukminim2.flixcart.com/image/612/612/xif0q/shirt/6/q/w/m-fl-fl-2046-dishank-creation-original-imahhwcgyk7ybacr.jpeg?q=70",
    title: "Mens Shirt",
    price: 399,
    originalPrice: 999,
    rating: 5,
    reviews: 312,
    badge: "Hot Deal",
    badgeColor: "bg-red-500",
    link: "/girls",
    brand: "FabIndia",
    bgColor: "from-pink-50 to-rose-100 dark:from-pink-900/40 dark:to-rose-900/40",
  },
  {
    id: 107,
    img: "https://rukminim2.flixcart.com/image/612/612/xif0q/blazer/2/h/c/l-ee-qj1-seelai-34-darbar-in-original-imahf8jxd9nzy5aa.jpeg?q=70",
    title: "Coat",
    price: 1999,
    originalPrice: 3999,
    rating: 5,
    reviews: 98,
    badge: "Premium",
    badgeColor: "bg-indigo-500",
    link: "/cloths",
    brand: "Wrangler",
    bgColor: "from-indigo-50 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40",
  },
  {
    id: 108,
    img: "https://rukminim2.flixcart.com/image/612/612/xif0q/coat/s/z/s/m-sw10241225nov-rigo-original-imahhq94uaaqvhca.jpeg?q=70",
    title: "Polar Solid Coat",
    price: 1299,
    originalPrice: 2199,
    rating: 4,
    reviews: 73,
    badge: "Sale",
    badgeColor: "bg-yellow-500",
    link: "/mens",
    brand: "Raymond",
    bgColor: "from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40",
  },
];

const TopProducts = () => {
  const navigate = useNavigate();
  const { addToCart, cart, decreaseQty } = useAuth();
  const [addedMap, setAddedMap] = useState({});

  const discount = (original, price) =>
    Math.round(((original - price) / original) * 100);

  const getCartQty = (id) =>
    cart?.find((item) => item.id === id)?.quantity || 0;

  const handleAdd = (data) => {
    addToCart({
      id: data.id,
      title: data.title,
      price: data.price,
      image: data.img,
      brand: data.brand,
    });
    setAddedMap((prev) => ({ ...prev, [data.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [data.id]: false }));
    }, 1500);
  };

  const handleDecrease = (data) => {
    decreaseQty(data.id);
  };

  return (
    <div className="py-14 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            Top Rated
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Best Selling Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Handpicked top products loved by thousands — shop now before they sell out!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {ProductsData.map((data) => {
            const qty = getCartQty(data.id);
            const justAdded = addedMap[data.id];

            return (
              <div
                key={data.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* ✅ Image size bada kiya — h-56 sm:h-64 md:h-72 */}
                <div className={`relative overflow-hidden h-56 sm:h-64 md:h-72 bg-gradient-to-br ${data.bgColor}`}>
                  <img
                    src={data.img}
                    alt={data.title}
                    className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Badge */}
                  <span className={`absolute top-2 left-2 ${data.badgeColor} text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow`}>
                    {data.badge}
                  </span>

                  {/* Discount */}
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{discount(data.originalPrice, data.price)}%
                  </span>


                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">

                  {/* Brand */}
                  <span className="text-xs text-indigo-500 font-semibold mb-1">
                    {data.brand}
                  </span>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-xs ${i < data.rating ? "text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({data.reviews})</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-2 truncate">
                    {data.title}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3 mt-auto">
                    <span className="text-orange-500 font-bold text-sm md:text-base">
                      ₹{data.price}
                    </span>
                    <span className="text-gray-400 text-xs line-through">
                      ₹{data.originalPrice}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {qty > 0 ? (
                      // Quantity control shown when item is already in cart
                      <div className="flex-1 flex items-center justify-between bg-orange-500 rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleDecrease(data)}
                          className="px-3 py-1.5 text-white font-bold text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-white text-xs font-semibold min-w-[1.5rem] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleAdd(data)}
                          className="px-3 py-1.5 text-white font-bold text-sm hover:bg-orange-600 active:bg-orange-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      // Add button shown when item is not in cart yet
                      <button
                        onClick={() => handleAdd(data)}
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

        {/* View All */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/products")}
            className="bg-gray-800 dark:bg-white dark:text-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            View All Products →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;