import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaQuestionCircle,
    FaSearch,
    FaChevronDown,
    FaShippingFast,
    FaUndo,
    FaCreditCard,
    FaUserShield,
    FaEnvelope,
    FaPhoneAlt,
    FaThumbsUp,
    FaThumbsDown,
    FaFire,
    FaWhatsapp
} from "react-icons/fa";

const faqData = [
    {
        id: 1,
        category: "Orders & Delivery",
        isPopular: true,
        icon: FaShippingFast,
        question: "How do I track my order in real-time?",
        answer: "As soon as your order is dispatched from our Jaipur warehouse, you will receive a live AWB tracking link via SMS and email. You can also monitor real-time courier updates directly through the 'Track Order' page or the 'My Orders' section in your profile."
    },
    {
        id: 2,
        category: "Orders & Delivery",
        isPopular: true,
        icon: FaShippingFast,
        question: "How long does delivery take?",
        answer: "Standard delivery typically takes 3 to 5 business days. Deliveries to metro cities are usually completed within 48 to 72 hours."
    },
    {
        id: 3,
        category: "Orders & Delivery",
        isPopular: false,
        icon: FaShippingFast,
        question: "Can I change my delivery address after dispatch?",
        answer: "You can update your delivery address while your order is still in the 'Processing' stage. Once handed over to the courier partner, address modifications cannot be made due to logistics and security protocols."
    },
    {
        id: 4,
        category: "Returns & Refunds",
        isPopular: true,
        icon: FaUndo,
        question: "What is the return and exchange window?",
        answer: "You can initiate a hassle-free return or size exchange within 7 days of delivery. Items must remain unworn, unwashed, and in their original condition with all tags intact."
    },
    {
        id: 5,
        category: "Returns & Refunds",
        isPopular: false,
        icon: FaUndo,
        question: "When will I receive my refund?",
        answer: "Refunds are processed within 24 hours after the item is picked up and passes our quality check. It generally takes 3 to 5 business days for the funds to reflect in your original payment or bank account."
    },
    {
        id: 6,
        category: "Returns & Refunds",
        isPopular: false,
        icon: FaUndo,
        question: "Is there any fee for reverse pickup?",
        answer: "No, reverse pickups for approved returns and exchanges are 100% free. Our delivery partner will pick up the package directly from your doorstep."
    },
    {
        id: 7,
        category: "Payment & Discounts",
        isPopular: true,
        icon: FaCreditCard,
        question: "What payment methods do you accept?",
        answer: "We support UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards (Visa, RuPay, MasterCard), Net Banking, and Cash on Delivery (COD) for eligible pincodes."
    },
    {
        id: 8,
        category: "Payment & Discounts",
        isPopular: false,
        icon: FaCreditCard,
        question: "What happens if money was debited but the order failed?",
        answer: "Rest assured, any amount debited due to a banking network glitch is automatically reversed back to your source account within 24 to 48 hours."
    },
    {
        id: 9,
        category: "Account & Safety",
        isPopular: false,
        icon: FaUserShield,
        question: "Is it safe to use my card details on your platform?",
        answer: "Yes, absolutely. All transactions are processed through 256-bit SSL encrypted, PCI-DSS certified payment gateways. We never store your full card number or CVV."
    },
    {
        id: 10,
        category: "Account & Safety",
        isPopular: false,
        icon: FaUserShield,
        question: "How do I recover my account if I forget my password?",
        answer: "Click 'Forgot Password' on the login screen, enter your registered email address or mobile number, and follow the OTP verification step to create a new password."
    },
];

const categories = [
    "All Questions",
    "Orders & Delivery",
    "Returns & Refunds",
    "Payment & Discounts",
    "Account & Safety"
];

const Faqs = () => {
    const [activeCategory, setActiveCategory] = useState("All Questions");
    const [searchQuery, setSearchQuery] = useState("");
    const [openAccordion, setOpenAccordion] = useState(1);
    const [feedback, setFeedback] = useState({});

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const handleFeedback = (id, type) => {
        setFeedback((prev) => ({ ...prev, [id]: type }));
    };

    const filteredFaqs = faqData.filter((item) => {
        const matchesCategory =
            activeCategory === "All Questions" || item.category === activeCategory;
        const matchesSearch =
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-gray-50 min-h-screen py-10 sm:py-16 text-gray-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. Header Hero */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                        <FaQuestionCircle className="text-sm" />
                        <span>Help Center</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Frequently Asked <span className="text-orange-500">Questions</span>
                    </h1>

                    <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                        Find clear, step-by-step answers regarding shipping, returns, refunds, and payments.
                    </p>

                    {/* Search Box */}
                    <div className="mt-8 relative max-w-xl mx-auto">
                        <FaSearch className="absolute left-4 top-4 text-gray-400 text-base" />
                        <input
                            type="text"
                            placeholder="Search keywords (e.g., tracking, refund, UPI, address)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 text-sm bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* 2. Filter Pills with Counter */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                    {categories.map((cat) => {
                        const count =
                            cat === "All Questions"
                                ? faqData.length
                                : faqData.filter((i) => i.category === cat).length;

                        const isActive = activeCategory === cat;

                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2 ${isActive
                                    ? "bg-orange-500 text-white shadow-sm"
                                    : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500 border border-gray-200"
                                    }`}
                            >
                                <span>{cat}</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                                        }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 3. FAQ Accordion List */}
                {filteredFaqs.length > 0 ? (
                    <div className="space-y-4 mb-14">
                        {filteredFaqs.map((faq) => {
                            const Icon = faq.icon;
                            const isOpen = openAccordion === faq.id;

                            return (
                                <div
                                    key={faq.id}
                                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? "border-orange-300 shadow-sm" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => toggleAccordion(faq.id)}
                                        className="w-full flex items-center justify-between p-5 text-left gap-4"
                                    >
                                        <div className="flex items-center gap-3.5 flex-1">
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-500"
                                                    }`}
                                            >
                                                <Icon className="text-sm" />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                                                    {faq.question}
                                                </span>
                                                {faq.isPopular && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                                                        <FaFire className="text-amber-500" /> Popular
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-orange-50 text-orange-500" : "bg-gray-50 text-gray-400"
                                                }`}
                                        >
                                            <FaChevronDown className="text-xs" />
                                        </div>
                                    </button>

                                    {/* Smooth Collapse Content using CSS Grid */}
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                                                <p className="pl-12 pr-2 mb-4">{faq.answer}</p>

                                                {/* Was this helpful? */}
                                                <div className="pl-12 pt-3 border-t border-gray-200/60 flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Was this helpful?</span>

                                                    <button
                                                        onClick={() => handleFeedback(faq.id, "yes")}
                                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${feedback[faq.id] === "yes"
                                                            ? "bg-green-500 text-white border-green-500"
                                                            : "hover:bg-gray-100 border-gray-200 text-gray-600"
                                                            }`}
                                                    >
                                                        <FaThumbsUp className="text-[10px]" /> Yes
                                                    </button>

                                                    <button
                                                        onClick={() => handleFeedback(faq.id, "no")}
                                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors ${feedback[faq.id] === "no"
                                                            ? "bg-red-500 text-white border-red-500"
                                                            : "hover:bg-gray-100 border-gray-200 text-gray-600"
                                                            }`}
                                                    >
                                                        <FaThumbsDown className="text-[10px]" /> No
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 mb-14">
                        <FaQuestionCircle className="text-4xl text-gray-300 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-gray-800">No matching questions found</h3>
                        <p className="text-gray-500 text-sm mt-1">Try searching with a different term or select another category.</p>
                        <button
                            onClick={() => { setActiveCategory("All Questions"); setSearchQuery(""); }}
                            className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-full text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm"
                        >
                            Reset Search
                        </button>
                    </div>
                )}

                {/* 4. Instant Support Banner */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl sm:text-2xl font-bold mb-1">Still can't find your answer?</h2>
                        <p className="text-sm text-orange-100">
                            Reach out directly to our Jaipur support team, and we will assist you right away.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                        <a
                            href="mailto:supportShop@gmail.com"
                            className="flex items-center gap-2 bg-white text-orange-600 font-semibold px-4 py-2.5 rounded-full text-xs sm:text-sm hover:bg-orange-50 transition-colors shadow-sm"
                        >
                            <FaEnvelope />
                            <span>Email Us</span>
                        </a>

                        <a
                            href="tel:+919973215343"
                            className="flex items-center gap-2 bg-orange-700/60 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-full text-xs sm:text-sm transition-colors border border-white/20"
                        >
                            <FaPhoneAlt />
                            <span>+91 9973-21-5343</span>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Faqs;