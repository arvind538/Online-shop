import React from 'react';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    id: 1,
    title: "Men's Fashion",
    desc: "Premium quality shirts, jeans, jackets and more — style redefined for modern men.",
    badge: "New Arrivals",
    badgeColor: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=800&h=400&auto=format&fit=crop",
    position: "object-center",
    link: "/mens",
    discount: "Up to 40% Off",
  },
  {
    id: 2,
    title: "Women's Collection",
    desc: "Trendy kurtis, dresses, sarees and co-ord sets — fashion that speaks for itself.",
    badge: "Trending",
    badgeColor: "bg-pink-500",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&h=400&auto=format&fit=crop",
    position: "object-top",
    link: "/girls",
    discount: "Up to 50% Off",
  },
  {
    id: 3,
    title: "SmartWatch",
    desc: "Latest gadgets, smartphones, laptops and accessories at unbeatable prices.",
    badge: "Hot Deals",
    badgeColor: "bg-orange-500",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&h=400&auto=format&fit=crop",
    position: "object-center",
    link: "/smartwatch",
    discount: "Up to 35% Off",
  },
];

const BoxtoBox = () => {
  const navigate = useNavigate();

  return (
    <div className="py-12 px-4">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
          Featured Categories
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Shop Our Top Categories
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto leading-relaxed">
          Explore our handpicked collections — from fashion to electronics,
          find everything you need at the best prices.
        </p>
      </div>

      {/* DESKTOP — hover expand cards */}
      <div className="hidden md:flex items-center gap-4 h-[420px] w-full max-w-5xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative group flex-grow transition-all w-40 h-[420px] duration-500 hover:w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg"
            onClick={() => navigate(card.link)}
          >
            <img
              className={`h-full w-full object-cover ${card.position} transition-transform duration-500 group-hover:scale-105`}
              src={card.image}
              alt={card.title}
            />

            {/* Always visible badge */}
            <div className="absolute top-3 left-3">
              <span className={`${card.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                {card.badge}
              </span>
            </div>

            {/* Non-hover — title pill at bottom */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center group-hover:opacity-0 transition-opacity duration-300">
              <span className="bg-black/60 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                {card.title}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="mb-2">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {card.discount}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-1">{card.title}</h2>
              <p className="text-sm text-gray-200 leading-relaxed mb-4">{card.desc}</p>
              <button className="w-full bg-white text-gray-900 font-semibold py-2 rounded-xl text-sm hover:bg-orange-500 hover:text-white transition-colors duration-200">
                Shop Now →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE — vertical stack cards */}
      <div className="md:hidden flex flex-col gap-5 mt-4 max-w-lg mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative rounded-2xl overflow-hidden h-56 shadow-md cursor-pointer"
            onClick={() => navigate(card.link)}
          >
            <img
              src={card.image}
              alt={card.title}
              className={`w-full h-full object-cover ${card.position}`}
            />

            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className={`${card.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                {card.badge}
              </span>
            </div>

            {/* Discount badge */}
            <div className="absolute top-3 right-3">
              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {card.discount}
              </span>
            </div>

            {/* Bottom overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <h2 className="text-xl font-bold mb-1">{card.title}</h2>
              <p className="text-xs text-gray-200 leading-relaxed mb-3">{card.desc}</p>
              <button className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-2 rounded-xl text-xs hover:bg-orange-500 hover:border-orange-500 transition-colors duration-200">
                Shop Now →
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default BoxtoBox;