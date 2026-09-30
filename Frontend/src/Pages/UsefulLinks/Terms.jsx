import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaFileContract,
    FaShoppingBag,
    FaUndoAlt,
    FaShieldAlt,
    FaTruck,
    FaExclamationTriangle,
    FaChevronDown,
    FaArrowRight,
    FaEnvelope,
    FaPhoneAlt
} from "react-icons/fa";

const termsSections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "account", title: "2. Account & Eligibility" },
    { id: "pricing", title: "3. Pricing, Orders & Payment" },
    { id: "shipping", title: "4. Shipping & Delivery" },
    { id: "returns", title: "5. Returns, Refunds & Cancellations" },
    { id: "intellectual", title: "6. Intellectual Property" },
    { id: "liability", title: "7. Limitation of Liability" },
    { id: "faqs", title: "8. Common Questions" },
];

const Terms = () => {
    const [activeTab, setActiveTab] = useState("acceptance");
    const [openFaq, setOpenFaq] = useState(null);

    const scrollToSection = (id) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -90;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 sm:py-14 text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                        <FaFileContract className="text-sm" />
                        <span>Legal Agreement</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Terms & <span className="text-orange-500">Conditions</span>
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-4 leading-relaxed">
                        Please read these terms carefully before placing orders or browsing Online Shop. By using our website, you agree to comply with the rules outlined below.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Effective Date: September 2026 | Governing Law: India
                    </p>
                </div>

                {/* 2. Key Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 text-xl">
                            <FaShoppingBag />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 mb-1">Authentic Products</h2>
                            <p className="text-xs text-gray-500 leading-relaxed">100% verified genuine electronics, clothing, and accessories direct from brand partners.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 text-xl">
                            <FaTruck />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 mb-1">Insured Shipping</h2>
                            <p className="text-xs text-gray-500 leading-relaxed">Every dispatch is tracked and protected against in-transit loss or physical handling damages.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 text-xl">
                            <FaUndoAlt />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 mb-1">7-Day Easy Returns</h2>
                            <p className="text-xs text-gray-500 leading-relaxed">Hassle-free reverse pickups and swift refunds processed directly to source accounts.</p>
                        </div>
                    </div>
                </div>

                {/* 3. Main Body: Sticky Sidebar + Clauses */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Sticky Navigation */}
                    <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                            Table of Clauses
                        </h3>
                        <nav className="space-y-1">
                            {termsSections.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${activeTab === item.id
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                                        }`}
                                >
                                    <span className="truncate">{item.title}</span>
                                    <FaArrowRight className={`text-xs shrink-0 transition-transform ${activeTab === item.id ? "translate-x-0" : "-translate-x-1 opacity-0"}`} />
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Right Policy Articles */}
                    <main className="lg:col-span-8 space-y-8">

                        {/* 1. Acceptance */}
                        <article id="acceptance" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                By accessing, browsing, or shopping on <strong>Online Shop</strong>, you acknowledge that you have read, understood, and agreed to be legally bound by these terms. If you do not accept any portion of these conditions, please refrain from using our e-commerce platform.
                            </p>
                        </article>

                        {/* 2. Account & Eligibility */}
                        <article id="account" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                2. Account & Eligibility
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                To purchase goods on our platform, you must meet the following baseline conditions:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                                <li>You must be at least 18 years of age or accessing under the supervision of a parent/guardian.</li>
                                <li>You are solely responsible for maintaining the confidentiality of your credentials and OTP verification codes.</li>
                                <li>Online Shop reserves the right to terminate accounts that engage in fraudulent behavior, automated bot scraping, or unauthorized promotional abuse.</li>
                            </ul>
                        </article>

                        {/* 3. Pricing & Orders */}
                        <article id="pricing" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                3. Pricing, Orders & Payment
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                All prices displayed on Online Shop are in Indian Rupees (INR) and include applicable GST unless explicitly indicated otherwise.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="font-semibold text-gray-900 block mb-1">Pricing Accuracy</span>
                                    In the rare event of a technical pricing error, we reserve the right to cancel the order and process a full refund.
                                </div>
                                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="font-semibold text-gray-900 block mb-1">Secure Gateways</span>
                                    We accept UPI, Credit/Debit cards, Net Banking, and COD (where applicable) via certified 256-bit encrypted gateways.
                                </div>
                            </div>
                        </article>

                        {/* 4. Shipping & Delivery */}
                        <article id="shipping" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                4. Shipping & Delivery
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                Orders are dispatched within 24 to 48 hours from our logistics warehouses. Standard shipping across India generally takes <strong>3 to 7 working days</strong> depending on delivery pincodes.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Courier delays caused by regional natural conditions, festivals, or local authority restrictions are managed proactively with real-time SMS/Email dispatch updates.
                            </p>
                        </article>

                        {/* 5. Returns & Refunds */}
                        <article id="returns" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                5. Returns, Refunds & Cancellations
                            </h2>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 font-bold">•</span>
                                    <span><strong>7-Day Window:</strong> Clothing and selected electronics can be returned or exchanged within 7 days of package delivery.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 font-bold">•</span>
                                    <span><strong>Product Condition:</strong> Items must be unused, unwashed, and returned in their original packaging with intact brand tags.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 font-bold">•</span>
                                    <span><strong>Refund Turnaround:</strong> Once our warehouse inspects the return, the refund amount reflects in your original payment mode within 5-7 business days.</span>
                                </li>
                            </ul>
                        </article>

                        {/* 6. Intellectual Property */}
                        <article id="intellectual" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                6. Intellectual Property
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                All platform content including website design, logos, product descriptions, photography, graphics, and code is the exclusive property of Online Shop and protected under Indian Copyright and Trademark legislation. Commercial reproduction without prior written consent is strictly prohibited.
                            </p>
                        </article>

                        {/* 7. Limitation of Liability */}
                        <article id="liability" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                7. Limitation of Liability
                            </h2>
                            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-sm leading-relaxed">
                                <FaExclamationTriangle className="text-amber-500 shrink-0 mt-0.5 text-base" />
                                <p>
                                    To the maximum extent permitted by law, Online Shop shall not be liable for any indirect, incidental, or consequential damages resulting from product misuse, site downtime, or third-party courier actions beyond reasonable control.
                                </p>
                            </div>
                        </article>

                        {/* 8. Interactive FAQs */}
                        <article id="faqs" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                8. Common Questions (Terms FAQs)
                            </h2>
                            <div className="space-y-3">
                                {[
                                    {
                                        q: "Can I cancel my order before it ships?",
                                        a: "Yes. You can cancel orders directly from the 'My Orders' section before the package is marked as 'Dispatched'. Full refunds are triggered instantly upon cancellation."
                                    },
                                    {
                                        q: "What should I do if I receive a damaged product?",
                                        a: "Notify our customer team within 48 hours of delivery with photos of the damaged item and outer packaging. We arrange an immediate replacement at zero extra charge."
                                    },
                                    {
                                        q: "Are shipping fees refundable on returns?",
                                        a: "Standard shipping charges (if applicable) are non-refundable unless the return is due to a defective, expired, or incorrect item sent from our end."
                                    }
                                ].map((faq, idx) => (
                                    <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                                        >
                                            <span>{faq.q}</span>
                                            <FaChevronDown
                                                className={`text-xs text-gray-400 transition-transform duration-300 ${openFaq === idx ? "rotate-180 text-orange-500" : ""
                                                    }`}
                                            />
                                        </button>
                                        {openFaq === idx && (
                                            <div className="p-4 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50/50">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </article>

                        {/* Help / Contact Section */}
                        <article className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 sm:p-8 rounded-2xl shadow-md">
                            <h2 className="text-xl font-bold mb-2">Need Clarity on Our Terms?</h2>
                            <p className="text-sm text-orange-100 mb-6 leading-relaxed">
                                If you have queries regarding dispute resolution, merchant policies, or order terms, reach out to our legal and customer desk.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <a
                                    href="mailto:supportShop@gmail.com"
                                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3.5 rounded-xl backdrop-blur-sm transition-colors"
                                >
                                    <FaEnvelope className="text-lg shrink-0 text-white" />
                                    <span className="truncate">supportShop@gmail.com</span>
                                </a>

                                <a
                                    href="tel:+919973215343"
                                    className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3.5 rounded-xl backdrop-blur-sm transition-colors"
                                >
                                    <FaPhoneAlt className="text-base shrink-0 text-white" />
                                    <span>+91 9973-21-5343</span>
                                </a>
                            </div>
                        </article>

                    </main>
                </div>

            </div>
        </div>
    );
};

export default Terms;