import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const offers = [
  "🚚 Free Shipping on Orders Above ₹500",
  "🔐 Use Code: WELCOME10 — Get 10% Off",
  "⚡ Flash Sale — Up to 50% Off on Electronics",
  "🎁 Buy 2 Get 1 Free on Clothing",
];

const HeaderUp = () => {
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState(0);

  //  Auto scroll — har 3 second mein next offer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % offers.length);
    }, 3000);

    return () => clearInterval(timer); // cleanup
  }, []);

  if (!visible) return null;

  return (
    <div
      className="relative w-full py-2.5 text-white text-sm font-medium overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #f97316, #ec4899, #8b5cf6, #3b82f6, #f97316)",
        backgroundSize: "300% 100%",
        animation: "gradientMove 6s linear infinite",
      }}
    >
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .offer-text {
          animation: fadeSlide 0.4s ease forwards;
        }
      `}</style>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto flex items-center justify-center gap-6 px-8 text-center">

        {/* Left arrow */}
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + offers.length) % offers.length)}
          className="text-white/70 hover:text-white transition-colors text-base shrink-0"
        >
          ‹
        </button>

        {/* Offer text */}
        <p key={current} className="offer-text flex-1 text-xs sm:text-sm">
          {offers[current]}
        </p>

        {/* Right arrow */}
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % offers.length)}
          className="text-white/70 hover:text-white transition-colors text-base shrink-0"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-1">
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current
                ? "w-4 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/40"
              }`}
          />
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1"
        aria-label="Close"
      >
        <FaTimes className="text-xs" />
      </button>
    </div>
  );
};

export default HeaderUp;