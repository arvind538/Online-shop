import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaCalendarAlt,
    FaUser,
    FaClock,
    FaSearch,
    FaArrowRight,
    FaTag
} from "react-icons/fa";

// Dummy Blog Posts Data
const initialBlogPosts = [
    {
        id: 1,
        title: "Top 10 Fashion Trends You Need in Your Wardrobe This 2026",
        excerpt: "Discover the latest styles ruling the runway and streets this season, from minimalist neutrals to bold retro statement pieces.",
        category: "Fashion",
        author: "Sneha Sharma",
        date: "Sep 20, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
        featured: true,
    },
    {
        id: 2,
        title: "Best Noise-Cancelling Headphones: A Buyer’s Complete Guide",
        excerpt: "Looking for pure audio bliss? We reviewed the top Bluetooth audio gear for work, travel, and fitness to help you pick the best.",
        category: "Electronics",
        author: "Rahul Verma",
        date: "Sep 18, 2026",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        featured: false,
    },
    {
        id: 3,
        title: "Sustainable Clothing: How to Build an Eco-Friendly Wardrobe",
        excerpt: "Fast fashion is out, ethical styling is in. Learn how small choices in fabric and care can make a massive environmental impact.",
        category: "Lifestyle",
        author: "Pooja Mehta",
        date: "Sep 15, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop",
        featured: false,
    },
    {
        id: 4,
        title: "Next-Gen Smartwatches: Health Tracking Beyond Steps",
        excerpt: "From ECG sensors to sleep apnea detection, see how wearable gadgets are evolving into serious health companions.",
        category: "Electronics",
        author: "Amit Patel",
        date: "Sep 10, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
        featured: false,
    },
    {
        id: 5,
        title: "Menswear Essentials: 5 Jackets Every Man Should Own",
        excerpt: "Upgrade your style effortlessly with timeless outerwear that fits both casual weekend hangouts and formal evening dinners.",
        category: "Fashion",
        author: "Vikram Sen",
        date: "Sep 08, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
        featured: false,
    },
    {
        id: 6,
        title: "10 Daily Habits for a Calmer, More Productive Lifestyle",
        excerpt: "Simple work-from-home ergonomics, morning setups, and digital detox hacks to keep your mental energy high every day.",
        category: "Lifestyle",
        author: "Sneha Sharma",
        date: "Sep 02, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
        featured: false,
    },
];

const categories = ["All", "Fashion", "Electronics", "Lifestyle"];

const Blog = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Filter logic based on Category and Search text
    const filteredPosts = initialBlogPosts.filter((post) => {
        const matchesCategory =
            selectedCategory === "All" || post.category === selectedCategory;
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPost = initialBlogPosts.find((post) => post.featured);

    return (
        <div className="bg-gray-50 min-h-screen py-10 sm:py-16 text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-orange-500 font-semibold text-sm tracking-wider uppercase">
                        Our Journal & Updates
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                        Inside <span className="text-orange-500">Online Shop</span>
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-3">
                        Tips, guides, product reviews, and trends carefully curated by our industry experts.
                    </p>
                </div>

                {/* 2. Featured Post Hero Banner */}
                {featuredPost && selectedCategory === "All" && !searchQuery && (
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-0">
                        <div className="lg:col-span-7 h-64 sm:h-80 lg:h-full relative overflow-hidden group">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                                Featured
                            </span>
                        </div>

                        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        <FaTag className="text-orange-500" /> {featuredPost.category}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <FaCalendarAlt /> {featuredPost.date}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <FaClock /> {featuredPost.readTime}
                                    </span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-3 hover:text-orange-500 transition-colors">
                                    <Link to={`/blog/${featuredPost.id}`} onClick={handleScrollToTop}>
                                        {featuredPost.title}
                                    </Link>
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {featuredPost.excerpt}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <FaUser className="text-orange-500" />
                                    <span className="font-medium">{featuredPost.author}</span>
                                </div>
                                <Link
                                    to={`/#/${featuredPost.id}`}
                                    onClick={handleScrollToTop}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group"
                                >
                                    Read Article
                                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Search and Category Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-200">

                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${selectedCategory === category
                                    ? "bg-orange-500 text-white shadow-sm"
                                    : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500 border border-gray-200"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Search Box */}
                    <div className="relative w-full sm:w-72">
                        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                        />
                    </div>
                </div>

                {/* 4. Blog Posts Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
                            >
                                {/* Post Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-md">
                                        {post.category}
                                    </span>
                                </div>

                                {/* Post Body */}
                                <div className="p-6 flex flex-col flex-grow justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt className="text-orange-500" /> {post.date}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <FaClock /> {post.readTime}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug mb-2 group-hover:text-orange-500 transition-colors">
                                            <Link to={`/blog/${post.id}`} onClick={handleScrollToTop}>
                                                {post.title}
                                            </Link>
                                        </h3>

                                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    {/* Card Bottom Meta */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-500 font-medium">
                                            By {post.author}
                                        </span>
                                        <Link
                                            to={`/#/${post.id}`}
                                            onClick={handleScrollToTop}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                            Read More
                                            <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-base">No articles found matching your search criteria.</p>
                        <button
                            onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* 5. Newsletter / Subscription Card */}
                <div className="mt-20 bg-gray-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-xl mx-auto">
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                            Stay Ahead of the Trends
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Subscribe to get seasonal shopping recommendations, exclusive discounts, and fashion hacks directly in your inbox.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 justify-center">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="px-4 py-3 text-sm rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 flex-grow max-w-sm"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Blog;