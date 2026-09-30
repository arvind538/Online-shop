import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaShieldAlt,
    FaLock,
    FaUserCheck,
    FaServer,
    FaCreditCard,
    FaBug,
    FaExclamationTriangle,
    FaCheckCircle,
    FaChevronDown,
    FaEnvelope,
    FaPhoneAlt,
    FaArrowRight
} from "react-icons/fa";

const securityFeatures = [
    {
        icon: FaLock,
        title: "256-Bit SSL/TLS Encryption",
        description: "Every data exchange between your browser and our servers is secured using bank-level cryptographic standards to prevent interception."
    },
    {
        icon: FaCreditCard,
        title: "PCI-DSS Level 1 Compliance",
        description: "Payment transactions are handled exclusively through certified gateways (Razorpay, Stripe). We never store raw card numbers or CVVs."
    },
    {
        icon: FaUserCheck,
        title: "Two-Factor Authentication",
        description: "Account logins, password changes, and high-value orders require instant one-time passwords (OTP) sent to your verified device."
    },
    {
        icon: FaServer,
        title: "DDoS Mitigation & Firewalls",
        description: "Our cloud infrastructure runs behind automated enterprise Web Application Firewalls (WAF) to block malicious bots and DDoS attacks."
    }
];

const bestPractices = [
    {
        title: "Use Unique Passwords",
        text: "Avoid reusing passwords across multiple websites. Create complex passphrases containing numbers, symbols, and uppercase letters."
    },
    {
        title: "Beware of Phishing",
        text: "Online Shop will never contact you asking for your bank PIN, card CVV, or one-time verification passwords over calls or SMS."
    },
    {
        title: "Check Order URLs",
        text: "Always confirm that the browser address bar displays a valid HTTPS padlock icon before completing any transaction."
    },
    {
        title: "Update Devices Regularly",
        text: "Keep your mobile operating system and web browser updated to the latest version to patch zero-day security vulnerabilities."
    }
];

const securityFaqs = [
    {
        id: 1,
        question: "How does Online Shop safeguard my payment information?",
        answer: "We utilize tokenized payment checkouts certified under PCI-DSS Level 1 specifications. Your credit card and UPI information pass directly through encrypted channels to financial institutions without ever touching our private database servers."
    },
    {
        id: 2,
        question: "What should I do if I detect unauthorized activity on my account?",
        answer: "Immediately reset your password using the 'Forgot Password' link on the login page. Then, contact our 24/7 Security Operations Center at supportShop@gmail.com to lock down pending transactions and terminate unauthorized active sessions."
    },
    {
        id: 3,
        question: "How do you protect customer data from ransomware and server failure?",
        answer: "All user records are backed up automatically across geographically redundant, SOC-2 compliant server nodes with real-time replication and strict identity access management (IAM) controls."
    },
    {
        id: 4,
        question: "Do you have a Responsible Bug Bounty Program?",
        answer: "Yes. Independent ethical hackers and security researchers can report valid platform vulnerabilities directly to our team for expedited review and coordinated disclosure."
    }
];

const Security = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 sm:py-16 text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. HERO HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                        <FaShieldAlt className="text-sm" />
                        <span>Enterprise Security & Trust</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Protecting Your <span className="text-orange-500">Digital Experience</span>
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-4 leading-relaxed">
                        At Online Shop, the confidentiality and safety of your personal data and payments are embedded into every layer of our platform infrastructure.
                    </p>

                    {/* Quick Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 text-xs font-semibold text-gray-600">
                        <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <FaCheckCircle className="text-green-500" /> 256-Bit SSL Active
                        </span>
                        <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <FaCheckCircle className="text-green-500" /> PCI-DSS Compliant
                        </span>
                        <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <FaCheckCircle className="text-green-500" /> Fraud Shield Enabled
                        </span>
                    </div>
                </div>

                {/* 2. CORE SECURITY PILLARS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {securityFeatures.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                        <Icon />
                                    </div>
                                    <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                                        {item.title}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 3. SAFETY TIPS & BEST PRACTICES */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm mb-16">
                    <div className="max-w-2xl mb-8">
                        <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider">
                            Customer Guidance
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                            Account Security Best Practices
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            Simple measures you can take to safeguard your credentials and private payment profiles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bestPractices.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">
                                    0{idx + 1}
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-1">{tip.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{tip.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. BUG BOUNTY & VULNERABILITY REPORTING */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
                    <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-4">
                            <FaBug />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            Responsible Vulnerability Disclosure
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            We welcome security engineers, ethical researchers, and industry specialists to audit our platform. If you have uncovered a security vulnerability on our web store, please report it directly through responsible channels before public release.
                        </p>
                        <ul className="space-y-2 text-xs sm:text-sm text-gray-600 mb-6 list-disc list-inside">
                            <li>Submit proof-of-concept steps along with impacted endpoints.</li>
                            <li>Allow our team reasonable time to verify and patch the vulnerability.</li>
                            <li>Do not compromise customer data or degrade server availability during testing.</li>
                        </ul>
                        <a
                            href="mailto:supportShop@gmail.com?subject=Vulnerability%20Report"
                            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                        >
                            Submit Vulnerability Report
                            <FaArrowRight className="text-xs" />
                        </a>
                    </div>

                    <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-sm">
                        <FaExclamationTriangle className="text-3xl text-orange-400 mb-4" />
                        <h3 className="text-lg font-bold mb-2">Urgent Incident Response</h3>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                            Suspect your account or credit card has been compromised on our platform? Our emergency incident team is standing by to freeze compromised sessions immediately.
                        </p>
                        <div className="space-y-3 text-xs sm:text-sm">
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-orange-400 shrink-0 text-base" />
                                <span>supportShop@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaPhoneAlt className="text-orange-400 shrink-0 text-sm" />
                                <span>+91 9973-21-5343</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. SECURITY FAQS */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Security Frequently Asked Questions
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2">
                            Common questions on encryption standards, credential safety, and data redundancy.
                        </p>
                    </div>

                    <div className="space-y-3.5">
                        {securityFaqs.map((faq) => {
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
                                        <span>{faq.question}</span>
                                        <div
                                            className={`w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-orange-50 text-orange-500" : "text-gray-400"
                                                }`}
                                        >
                                            <FaChevronDown className="text-xs" />
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 6. BOTTOM CONTACT BANNER */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl sm:text-2xl font-bold mb-1">
                            Have security-related inquiries?
                        </h3>
                        <p className="text-xs sm:text-sm text-orange-100">
                            Our Data Protection and Platform Compliance officers are available to assist you.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                        <a
                            href="mailto:supportShop@gmail.com"
                            className="flex items-center gap-2 bg-white text-orange-600 font-semibold px-4 py-2.5 rounded-full text-xs sm:text-sm hover:bg-orange-50 transition-colors shadow-sm"
                        >
                            <FaEnvelope />
                            <span>Email Compliance</span>
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

export default Security;