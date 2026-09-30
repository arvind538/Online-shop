import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaUndoAlt,
    FaBoxOpen,
    FaTruck,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaQuestionCircle,
    FaChevronDown,
    FaEnvelope,
    FaPhoneAlt,
    FaSearch,
    FaArrowRight
} from "react-icons/fa";

const returnSteps = [
    {
        step: "01",
        title: "Initiate Request",
        desc: "Log into your account, open 'My Orders', select the delivered package, and click 'Request Return / Exchange'.",
        icon: FaBoxOpen,
    },
    {
        step: "02",
        title: "Doorstep Pickup",
        desc: "Our verified courier partner collects the package from your delivery address within 24 to 48 hours for free.",
        icon: FaTruck,
    },
    {
        step: "03",
        title: "Quality Verification",
        desc: "The item undergoes quality check at our warehouse to ensure tags, original boxes, and invoice copies are intact.",
        icon: FaCheckCircle,
    },
    {
        step: "04",
        title: "Instant Refund",
        desc: "Upon successful verification, full payment is released back to your original payment mode or UPI wallet within 3-5 days.",
        icon: FaUndoAlt,
    },
];

const returnFaqs = [
    {
        id: 1,
        q: "How many days do I have to return an item?",
        a: "You have a full 7-day window starting from the day your package is marked as delivered by our courier partner."
    },
    {
        id: 2,
        q: "Do I have to pay for the reverse pickup courier service?",
        a: "No. All return pickups and size exchanges are 100% free of charge. You do not need to pay the pickup delivery agent."
    },
    {
        id: 3,
        q: "Can I exchange for a different size instead of taking a refund?",
        a: "Yes. While submitting your request, choose 'Exchange' to swap for another size (subject to stock availability) at zero extra fee."
    },
    {
        id: 4,
        q: "What if I paid via Cash on Delivery (COD)?",
        a: "For COD orders, our portal prompts you to enter your UPI ID or Bank Account Details (Account Number + IFSC) to process direct bank transfers."
    }
];

const Returns = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [orderId, setOrderId] = useState("");
    const [checkStatus, setCheckStatus] = useState(null);

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const handleEligibilityCheck = (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        // Simulated check logic
        if (orderId.trim().toUpperCase().startsWith("ONL")) {
            setCheckStatus({
                status: "success",
                msg: `Order #${orderId.toUpperCase()} is eligible for a return or exchange pickup!`
            });
        } else {
            setCheckStatus({
                status: "info",
                msg: `Order found. Please make sure the order was delivered within the last 7 calendar days.`
            });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 sm:py-16 text-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. HERO HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                        <FaUndoAlt className="text-sm" />
                        <span>Hassle-Free Returns</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Returns & <span className="text-orange-500">Refund Policy</span>
                    </h1>

                    <p className="text-gray-600 text-sm sm:text-base mt-4 leading-relaxed">
                        We want you to love what you bought. If something isn't right with the size, fit, or condition, our simple 7-day return policy has you covered.
                    </p>
                </div>

                {/* 2. RETURN PROCESS STEPS */}
                <div className="mb-16">
                    <div className="text-center max-w-xl mx-auto mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            How Our Return Process Works
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Simple 4-step workflow to get your item collected and refund processed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {returnSteps.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-orange-300 hover:shadow-md transition-all duration-300"
                                >
                                    <span className="absolute top-4 right-4 text-3xl font-black text-gray-100 group-hover:text-orange-100 transition-colors">
                                        {item.step}
                                    </span>

                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                            <Icon />
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. RETURN ELIGIBILITY CHECKER */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm mb-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider">
                            Quick Self-Service
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 mb-2">
                            Check Your Return Eligibility
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Enter your Order Number to verify whether your package qualifies for a free pickup.
                        </p>

                        <form onSubmit={handleEligibilityCheck} className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                            <div className="relative flex-grow max-w-md">
                                <FaSearch className="absolute left-4 top-3.5 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="e.g. ONL-984712"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all uppercase"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-full transition-colors shadow-sm"
                            >
                                Verify Order
                            </button>
                        </form>

                        {checkStatus && (
                            <div className={`mt-4 p-4 rounded-2xl text-xs sm:text-sm text-left flex items-start gap-3 ${checkStatus.status === "success"
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-blue-50 text-blue-800 border border-blue-200"
                                }`}>
                                <FaCheckCircle className="shrink-0 text-base mt-0.5" />
                                <span>{checkStatus.msg}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. RETURN GUIDELINES: ALLOWED VS NOT ALLOWED */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Allowed Items */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">
                                <FaCheckCircle />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Items Eligible for Return</h3>
                                <p className="text-xs text-gray-500">Subject to standard 7-day pickup condition</p>
                            </div>
                        </div>

                        <ul className="space-y-3.5 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-500 text-xs shrink-0 mt-1" />
                                <span><strong>Apparel & Fashion:</strong> Unworn, unwashed clothes with original price tags and barcode seals attached.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-500 text-xs shrink-0 mt-1" />
                                <span><strong>Electronics & Gadgets:</strong> Complete with accessories, cables, user manuals, and brand box packaging.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaCheckCircle className="text-green-500 text-xs shrink-0 mt-1" />
                                <span><strong>Damaged on Arrival:</strong> Any item received defective or mismatched if reported within 48 hours.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Not Allowed Items */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg">
                                <FaTimesCircle />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Non-Returnable Items</h3>
                                <p className="text-xs text-gray-500">Due to hygiene and standard electronic constraints</p>
                            </div>
                        </div>

                        <ul className="space-y-3.5 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <FaTimesCircle className="text-red-500 text-xs shrink-0 mt-1" />
                                <span><strong>Innerwear & Lingerie:</strong> For personal hygiene reasons, innerwear cannot be returned once opened.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaTimesCircle className="text-red-500 text-xs shrink-0 mt-1" />
                                <span><strong>Personal Grooming:</strong> Shavers, trimmers, and cosmetics if the original seal has been broken.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaTimesCircle className="text-red-500 text-xs shrink-0 mt-1" />
                                <span><strong>Missing Serial Numbers:</strong> Items returning without original serial stickers or missing internal components.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 5. REFUND TIMELINES */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-16">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Refund Method & Timelines</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Time taken for funds to appear after our warehouse clears quality verification:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide block mb-1">
                                UPI / Wallets
                            </span>
                            <span className="text-lg font-bold text-gray-900 block">24 to 48 Hours</span>
                            <p className="text-xs text-gray-500 mt-1">Direct payout to Google Pay, PhonePe, or Paytm UPI ID.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide block mb-1">
                                Cards & Net Banking
                            </span>
                            <span className="text-lg font-bold text-gray-900 block">3 to 5 Working Days</span>
                            <p className="text-xs text-gray-500 mt-1">Reversal to original Visa, MasterCard, or RuPay account.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide block mb-1">
                                Cash on Delivery (COD)
                            </span>
                            <span className="text-lg font-bold text-gray-900 block">2 to 4 Working Days</span>
                            <p className="text-xs text-gray-500 mt-1">Direct IMPS transfer to customer-provided bank account.</p>
                        </div>
                    </div>
                </div>

                {/* 6. COMMON RETURN FAQS */}
                <div className="max-w-3xl mx-auto mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Return & Refund FAQs
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Quick answers about pickup reschedulings and size replacements.
                        </p>
                    </div>

                    <div className="space-y-3.5">
                        {returnFaqs.map((faq) => {
                            const isOpen = openFaq === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
                                >
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-gray-900 hover:text-orange-500 transition-colors gap-4"
                                    >
                                        <span>{faq.q}</span>
                                        <div
                                            className={`w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-orange-50 text-orange-500" : "text-gray-400"
                                                }`}
                                        >
                                            <FaChevronDown className="text-xs" />
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 7. BOTTOM CONTACT HELP BANNER */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl sm:text-2xl font-bold mb-1">
                            Need assistance with your return pickup?
                        </h3>
                        <p className="text-xs sm:text-sm text-orange-100">
                            Our support desk is ready to reschedule deliveries or assist with defective product claims.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                        <a
                            href="mailto:supportShop@gmail.com"
                            className="flex items-center gap-2 bg-white text-orange-600 font-semibold px-4 py-2.5 rounded-full text-xs sm:text-sm hover:bg-orange-50 transition-colors shadow-sm"
                        >
                            <FaEnvelope />
                            <span>Email Support</span>
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

export default Returns;