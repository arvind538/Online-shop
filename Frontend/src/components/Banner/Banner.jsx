import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaShieldAlt,
    FaShippingFast,
    FaCreditCard,
    FaPercent,
    FaCopy,
    FaCheck,
    FaArrowRight
} from "react-icons/fa";

// Direct high-resolution online e-commerce shopping image URL
const BannerImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIttZTdmVkK4Q74evu5ynI7_EOHhISoY8e4CWeChwd7Q&s=10";

const benefitsData = [
    {
        id: 1,
        icon: FaShieldAlt,
        title: "100% Genuine Quality",
        subtitle: "Direct verified warehouse sourcing",
        accent: "text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-400",
    },
    {
        id: 2,
        icon: FaShippingFast,
        title: "Express 48h Dispatch",
        subtitle: "Live tracking directly on your phone",
        accent: "text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-400",
    },
    {
        id: 3,
        icon: FaCreditCard,
        title: "Secure Checkout",
        subtitle: "UPI, Cards & Cash on Delivery",
        accent: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400",
    },
    {
        id: 4,
        icon: FaPercent,
        title: "Season Clearance Deals",
        subtitle: "Extra 10% instant discount at cart",
        accent: "text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400",
    },
];

const Banner = () => {
    const [activeBenefit, setActiveBenefit] = useState(1);
    const [copied, setCopied] = useState(false);

    const handleCopyCoupon = () => {
        navigator.clipboard.writeText("WINTER50");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

                    {/* Visual Showcase (5 Cols) */}
                    <div className="lg:col-span-5 flex justify-center items-center relative [transform:translateZ(0)]">
                        {/* Background Accent Glow */}
                        <div className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-orange-500/15 dark:bg-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

                        <div className="relative group w-full max-w-[360px] sm:max-w-[400px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                            <img
                                src={BannerImg}
                                alt="Winter Wardrobe Collection"
                                loading="eager"
                                decoding="sync"
                                className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105 transform-gpu will-change-transform backface-hidden"
                            />

                            {/* Float Clearance Badge */}
                            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                                Trending 2026
                            </div>

                            {/* Bottom Interactive Coupon Bar */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400">Coupon Code</p>
                                    <p className="text-xs font-mono font-bold text-gray-900 dark:text-white">WINTER50</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyCoupon}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all"
                                >
                                    {copied ? <FaCheck className="text-[10px]" /> : <FaCopy className="text-[10px]" />}
                                    <span>{copied ? "Copied" : "Copy"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Details & Interactive Benefits (7 Cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                        <div>
                            <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400 rounded-full mb-3">
                                Seasonal Clearance
                            </span>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                                Winter Wardrobe <br />
                                <span className="text-orange-500">Up to 50% Off</span>
                            </h2>

                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-3 leading-relaxed max-w-xl">
                                Discover ultra-soft knitwear, tailored overcoats, and everyday winter essentials built for warmth and everyday durability.
                            </p>
                        </div>

                        {/* Interactive 4-Grid Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                            {benefitsData.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeBenefit === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setActiveBenefit(item.id)}
                                        className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 select-none ${isActive
                                            ? "bg-white dark:bg-gray-800 border-orange-500 shadow-md ring-2 ring-orange-200 dark:ring-orange-900/40"
                                            : "bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 shadow-sm"
                                            }`}
                                    >
                                        <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-lg ${item.accent}`}>
                                            <Icon />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-orange-500/25 transition-all text-sm group"
                            >
                                <span>Shop Winter Deals</span>
                                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/deals"
                                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                View Catalog
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Banner;