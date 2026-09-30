import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaShieldAlt,
    FaUserSecret,
    FaLock,
    FaCookieBite,
    FaEnvelope,
    FaPhoneAlt,
    FaChevronDown,
    FaArrowRight
} from "react-icons/fa";

const sections = [
    { id: "collection", title: "Information We Collect" },
    { id: "usage", title: "How We Use Your Data" },
    { id: "sharing", title: "Third-Party Sharing" },
    { id: "cookies", title: "Cookies & Tracking" },
    { id: "security", title: "Data Protection & Security" },
    { id: "rights", title: "Your Rights & Choices" },
    { id: "contact", title: "Contact Our DPO" },
];

const Privacy = () => {
    const [activeTab, setActiveTab] = useState("collection");
    const [openFaq, setOpenFaq] = useState(null);

    const scrollToSection = (id) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -90; // Top header offset
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

                {/* 1. Header Hero */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                        <FaShieldAlt className="text-sm" />
                        <span>Trust & Compliance</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Privacy <span className="text-orange-500">Policy</span>
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-4 leading-relaxed">
                        At Online Shop, your privacy is our utmost priority. Learn how we handle, protect, and respect your personal details when you browse and purchase.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Last Updated: September 2026
                    </p>
                </div>

                {/* 2. Key Highlights Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 text-xl">
                            <FaLock />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 mb-1">End-to-End Encryption</h2>
                            <p className="text-xs text-gray-500 leading-relaxed">All card transactions and user authentication happen over secure 256-bit SSL protocols.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 text-xl">
                            <FaUserSecret />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 mb-1">Zero Data Selling</h2>
                            <p className="text-xs text-gray-500 leading-relaxed">We never sell your sensitive demographic or behavioral records to external advertisers.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 text-xl">
                            <FaCookieBite />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900 mb-1">Consent-Based Cookies</h2>
                            <p className="text-xs text-gray-500 leading-relaxed">You hold full control over performance, analytics, and marketing cookies directly from settings.</p>
                        </div>
                    </div>
                </div>

                {/* 3. Main Body: Sticky Sidebar + Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left: Sticky Quick Nav (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                            Table of Contents
                        </h3>
                        <nav className="space-y-1">
                            {sections.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${activeTab === item.id
                                        ? "bg-orange-500 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                                        }`}
                                >
                                    <span>{item.title}</span>
                                    <FaArrowRight className={`text-xs transition-transform ${activeTab === item.id ? "translate-x-0" : "-translate-x-1 opacity-0"}`} />
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Right: Policy Articles */}
                    <main className="lg:col-span-8 space-y-8">

                        {/* Section 1 */}
                        <article id="collection" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                1. Information We Collect
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                When you interact with Online Shop, we collect details essential to process your orders, ship your items, and enhance your user experience:
                            </p>
                            <ul className="space-y-2.5 text-sm text-gray-600 list-disc list-inside">
                                <li><strong className="text-gray-800">Account Details:</strong> Name, email address, password, phone number, and delivery addresses.</li>
                                <li><strong className="text-gray-800">Payment Information:</strong> Handled securely by encrypted payment gateways (Razorpay, Stripe, UPI). We do not store full card numbers on our servers.</li>
                                <li><strong className="text-gray-800">Technical Data:</strong> IP address, browser type, device information, and browsing sessions.</li>
                            </ul>
                        </article>

                        {/* Section 2 */}
                        <article id="usage" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                2. How We Use Your Data
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                We use collected information solely for legitimate business operations:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="font-semibold text-gray-900 block mb-1">Order Fulfillment</span>
                                    Processing transactions, sending OTPs, and dispatching orders with logistics partners.
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="font-semibold text-gray-900 block mb-1">Customer Support</span>
                                    Resolving order disputes, processing return requests, and answering inquiries.
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="font-semibold text-gray-900 block mb-1">Platform Security</span>
                                    Detecting fraud, abuse, unauthorized account access, and bot spam.
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="font-semibold text-gray-900 block mb-1">Personalized Feed</span>
                                    Showing relevant apparel, tech recommendations, and discount alerts.
                                </div>
                            </div>
                        </article>

                        {/* Section 3 */}
                        <article id="sharing" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                3. Third-Party Sharing
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                We share minimum viable details strictly with verified partners necessary to deliver your package:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                                <li><strong className="text-gray-800">Logistics & Courier Providers:</strong> Sharing shipping address and phone number for delivery coordination.</li>
                                <li><strong className="text-gray-800">Payment Processors:</strong> Tokenized transmission for safe checkouts.</li>
                                <li><strong className="text-gray-800">Legal Compliance:</strong> Only when strictly ordered by court warrants or statutory Indian authorities.</li>
                            </ul>
                        </article>

                        {/* Section 4 */}
                        <article id="cookies" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                4. Cookies & Tracking
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                Cookies keep your shopping bag intact while navigating through multiple products. You can disable non-essential tracking cookies via your web browser settings at any point without losing standard checkout capabilities.
                            </p>
                        </article>

                        {/* Section 5 */}
                        <article id="security" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                5. Data Protection & Security
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                We implement industry-grade technical firewalls and role-based internal access controls. Sensitive password hashes are stored using modern salted algorithms (bcrypt), preventing direct exposure even in the event of database dumps.
                            </p>
                        </article>

                        {/* Section 6: Interactive FAQs / Accordion */}
                        <article id="rights" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                6. Your Rights & Choices (FAQs)
                            </h2>
                            <div className="space-y-3">
                                {[
                                    {
                                        q: "Can I request complete deletion of my account?",
                                        a: "Yes. Reach out to our privacy officer or navigate to your Account Settings to trigger permanent profile wipeout within 7 working days."
                                    },
                                    {
                                        q: "How can I opt out of promotional SMS and emails?",
                                        a: "Every marketing communication contains an instant Unsubscribe link. Alternatively, toggle your preferences inside Profile > Notifications."
                                    },
                                    {
                                        q: "Can I download an export of my order history?",
                                        a: "Yes, you can request an archive of past transactions and invoices directly via customer care."
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

                        {/* Section 7: Contact Card */}
                        <article id="contact" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 sm:p-8 rounded-2xl shadow-md">
                            <h2 className="text-xl font-bold mb-2">Have Any Questions or Concerns?</h2>
                            <p className="text-sm text-orange-100 mb-6 leading-relaxed">
                                If you have queries regarding data handling or wish to exercise your statutory rights, our dedicated compliance team is available to assist you.
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

export default Privacy;