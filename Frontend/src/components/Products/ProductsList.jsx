import React, { useState } from "react";
import { Link } from "react-router-dom";
import Img1 from "../../assets/women/women.png";
import Img2 from "../../assets/women/women2.jpg";
import Img3 from "../../assets/women/women3.jpg";
import Img4 from "../../assets/women/women4.jpg";
import { FaStar, FaXmark, FaCartShopping } from "react-icons/fa6";
import { useAuth } from "../../Store/auth";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Women Ethnic",
    rating: 5.0,
    color: "White",
    price: 1299,
    originalPrice: 1999,
    description: "Premium quality ethnic wear with beautiful embroidery work. Perfect for festive occasions and weddings.",
  },
  {
    id: 2,
    img: Img2,
    title: "Women Western",
    rating: 4.5,
    color: "Red",
    price: 999,
    originalPrice: 1499,
    description: "Stylish and comfortable western dress, ideal for casual outings or evening parties.",
  },
  {
    id: 3,
    img: Img3,
    title: "Polarized Goggles",
    rating: 4.7,
    color: "Brown",
    price: 749,
    originalPrice: 1299,
    description: "UV400 protected polarized sunglasses to keep your eyes safe with a trendy look.",
  },
  {
    id: 4,
    img: Img4,
    title: "Printed Graphic T-Shirt",
    rating: 4.4,
    color: "Yellow",
    price: 499,
    originalPrice: 899,
    description: "100% cotton breathable graphic t-shirt for your daily casual wear needs.",
  },
  {
    id: 5,
    img: Img2,
    title: "Fashion Casual Top",
    rating: 4.5,
    color: "Pink",
    price: 899,
    originalPrice: 1399,
    description: "Trendy pink casual top with a modern fit, goes perfectly with denim or skirts.",
  },
];

const availableSizes = ["S", "M", "L", "XL", "XXL"];

const ProductsList = () => {
  const { addToCart } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize("");
    setSuccessMsg("");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedSize("");
    setSuccessMsg("");
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }

    // Unique ID banana zaroori hai taaki size ke hisaab se quantity properly badh sake
    const cartItem = {
      id: `${selectedProduct.id}-${selectedSize}`,
      originalId: selectedProduct.id,
      title: selectedProduct.title,
      price: selectedProduct.price,
      image: selectedProduct.img,
      color: selectedProduct.color,
      description: selectedProduct.description,
      selectedSize: selectedSize,
    };

    addToCart(cartItem);
    setSuccessMsg(`Added to cart successfully (Size: ${selectedSize})!`);

    setTimeout(() => {
      handleCloseModal();
    }, 1000);
  };

  return (
    <section className="py-12 sm:py-16 bg-gray-50/50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header section */}
        <div className="text-center mb-10 sm:mb-14 max-w-xl mx-auto">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-2">
            Curated For You
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Top Selling <span className="text-orange-500">Products</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2.5 leading-relaxed">
            Explore our hand-picked collection of trending fashion and lifestyle essentials.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {ProductsData.map((data) => (
            <div
              key={data.id}
              onClick={() => handleOpenProduct(data)}
              className="group cursor-pointer rounded-2xl bg-white dark:bg-gray-900 p-3 sm:p-4 border border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col justify-between hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-md hover:-translate-y-1 select-none"
            >
              {/* Image Wrapper */}
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 mb-3">
                <img
                  src={data.img}
                  alt={data.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    Quick View
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1">
                <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate group-hover:text-orange-500 transition-colors">
                  {data.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                  <span>{data.color}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-medium">
                    <FaStar className="text-[10px] sm:text-xs" />
                    <span>{data.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white pt-1">
                  ₹{data.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10 sm:mt-12">
          <Link
            to="/girls"
            className="inline-flex items-center justify-center px-7 py-3 text-xs sm:text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all rounded-full shadow-sm hover:shadow"
          >
            View All Items
          </Link>
        </div>
      </div>

      {/* ============== PRODUCT DETAILS MODAL ============== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Blur Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto sm:overflow-hidden flex flex-col sm:flex-row shadow-2xl z-10">

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-orange-500 hover:text-white text-gray-600 dark:text-gray-300 rounded-full transition-colors shadow-sm"
              aria-label="Close modal"
            >
              <FaXmark className="text-base" />
            </button>

            {/* Left: Product Image */}
            <div className="w-full sm:w-1/2 h-[300px] sm:h-auto bg-gray-100 dark:bg-gray-800">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.title}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Right: Product Details & Cart */}
            <div className="w-full sm:w-1/2 p-5 sm:p-8 flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2 py-1 rounded-md">
                  New Arrival
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                {selectedProduct.title}
              </h2>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-amber-500 text-xs sm:text-sm">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar className="text-gray-300 dark:text-gray-700" />
                  <span className="text-gray-600 dark:text-gray-400 ml-1">({selectedProduct.rating})</span>
                </div>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Color: <span className="font-semibold text-gray-900 dark:text-white">{selectedProduct.color}</span></span>
              </div>

              <p className="text-xl sm:text-2xl font-extrabold text-orange-600 dark:text-orange-400 mb-3">
                ₹{selectedProduct.price}
              </p>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs sm:text-sm font-semibold">Select Size</h4>
                  <span className="text-xs text-orange-500 hover:underline cursor-pointer">Size Guide</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 ${selectedSize === size
                        ? "bg-orange-500 text-white border-orange-500 shadow-md scale-105"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:border-orange-500 hover:text-orange-500"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-[11px] text-red-500 mt-1.5">Please select a size to continue</p>
                )}
              </div>

              {successMsg && (
                <div className="mb-4 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl text-center">
                  {successMsg}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-lg active:scale-95"
              >
                <FaCartShopping />
                Add to Cart
              </button>

              <div className="mt-4 flex items-center justify-center gap-6 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">✅ Free Shipping</span>
                <span className="flex items-center gap-1">🔄 7 Days Return</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsList;