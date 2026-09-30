import React from "react";
import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/website/footer-pattern.jpg";
import { FaGithub, FaLinkedin, FaLocationArrow, FaMobileAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  width: "100%",
};

const FooterLinks = [
  { title: "Home", link: "/" },
  { title: "Products", link: "/products" },
  { title: "Electronics", link: "/electronics" },
  { title: "Cloths", link: "/cloths" },
  { title: "For Mens", link: "/mens" },
  { title: "For Girls", link: "/girls" },
];

const UsefulLinks = [
  { title: "Blog", link: "/blog" },
  { title: "Privacy", link: "/privacy" },
  { title: "Terms", link: "/terms" },
  { title: "FAQs", link: "/faqs" },
  { title: "Security", link: "/security" },
];

const CustomerService = [
  { title: "Service", link: "/service" },
  { title: "Contact Us", link: "/contact" },
  { title: "Login", link: "/login" },
  { title: "Register", link: "/register" },
  { title: "Cart", link: "/cart" },
];

const Footer = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer style={BannerImg} className="relative text-white mt-12 overflow-hidden">
        {/* Background Overlay for better readability */}
        <div className="bg-black/60 backdrop-blur-[2px] w-full h-full py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* MAIN GRID */}
            {/* Mobile: 1 col | Tablet: 2 & 3 col | Desktop: 5 col balanced */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 text-left">

              {/* 1 — Company Info */}
              <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-start">
                <Link
                  to="/"
                  onClick={handleScrollToTop}
                  className="flex items-center gap-3 mb-4 group inline-flex"
                >
                  <img
                    src={footerLogo}
                    alt="logo"
                    className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
                    Online <span className="text-orange-500">Shop</span>
                  </h1>
                </Link>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
                  Your one-stop destination for quality products at affordable prices.
                  Browse, order, and get it delivered — all in a few clicks.
                </p>


              </div>

              {/* 2 — Quick Links */}
              <div className="flex flex-col items-start">
                <h2 className="text-base font-semibold mb-4 pb-1 border-b-2 border-orange-500 inline-block tracking-wider">
                  Quick Links
                </h2>
                <ul className="space-y-2.5 w-full">
                  {FooterLinks.map((link) => (
                    <li key={link.title}>
                      <Link
                        to={link.link}
                        onClick={handleScrollToTop}
                        className="text-gray-300 text-sm hover:text-orange-400 transition-all duration-200 flex items-center gap-2 group"
                      >
                        <span className="text-orange-500 text-xs transition-transform duration-200 group-hover:translate-x-1">
                          ›
                        </span>
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3 — Customer Service */}
              <div className="flex flex-col items-start">
                <h2 className="text-base font-semibold mb-4 pb-1 border-b-2 border-orange-500 inline-block tracking-wider">
                  Customer Service
                </h2>
                <ul className="space-y-2.5 w-full">
                  {CustomerService.map((link) => (
                    <li key={link.title}>
                      <Link
                        to={link.link}
                        onClick={handleScrollToTop}
                        className="text-gray-300 text-sm hover:text-orange-400 transition-all duration-200 flex items-center gap-2 group"
                      >
                        <span className="text-orange-500 text-xs transition-transform duration-200 group-hover:translate-x-1">
                          ›
                        </span>
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4 — Useful Links */}
              <div className="flex flex-col items-start">
                <h2 className="text-base font-semibold mb-4 pb-1 border-b-2 border-orange-500 inline-block tracking-wider">
                  Useful Links
                </h2>
                <ul className="space-y-2.5 w-full">
                  {UsefulLinks.map((link) => (
                    <li key={link.title}>
                      <Link
                        to={link.link}
                        onClick={handleScrollToTop}
                        className="text-gray-300 text-sm hover:text-orange-400 transition-all duration-200 flex items-center gap-2 group"
                      >
                        <span className="text-orange-500 text-xs transition-transform duration-200 group-hover:translate-x-1">
                          ›
                        </span>
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5 — Contact */}
              <div className="flex flex-col items-start w-full">
                <h2 className="text-base font-semibold mb-4 pb-1 border-b-2 border-orange-500 inline-block tracking-wider">
                  Contact Us
                </h2>
                <div className="space-y-3.5 text-sm text-gray-300 w-full">
                  <div className="flex items-start gap-3 group">
                    <FaLocationArrow className="mt-1 shrink-0 text-orange-400 group-hover:scale-110 transition-transform" />
                    <span className="leading-snug">Jaipur, Rajasthan, India</span>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <FaMobileAlt className="shrink-0 text-orange-400 group-hover:scale-110 transition-transform" />
                    <a
                      href="tel:+919973215343"
                      className="hover:text-orange-400 transition-colors"
                    >
                      +91 9973-21-5343
                    </a>
                  </div>

                  <div className="flex items-center gap-3 group">
                    <IoIosMail className="shrink-0 text-orange-400 text-lg group-hover:scale-110 transition-transform" />
                    <a
                      href="mailto:supportShop@gmail.com"
                      className="hover:text-orange-400 transition-colors break-all"
                    >
                      supportShop@gmail.com
                    </a>
                  </div>
                </div>
                {/* Social Icons */}
                <div className="flex items-center gap-3 mt-5">
                  <a
                    href="https://github.com/arvind538?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-200 hover:text-white hover:bg-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FaGithub className="text-lg" />
                  </a>
                  <a
                    href="https://www.linkedin.com/feed/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-200 hover:text-white hover:bg-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FaLinkedin className="text-lg" />
                  </a>
                  <a
                    href="https://maps.app.goo.gl/QRnBRTKxgk5jz5Xj6"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Location"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-200 hover:text-white hover:bg-orange-500 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <FaLocationDot className="text-lg" />
                  </a>
                </div>
              </div>

            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-gray-700/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Online Shop. All rights reserved.</p>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs">
                <Link
                  to="/privacy"
                  onClick={handleScrollToTop}
                  className="hover:text-orange-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  to="/terms"
                  onClick={handleScrollToTop}
                  className="hover:text-orange-400 transition-colors"
                >
                  Terms & Conditions
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  to="/returns"
                  onClick={handleScrollToTop}
                  className="hover:text-orange-400 transition-colors"
                >
                  Returns
                </Link>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;