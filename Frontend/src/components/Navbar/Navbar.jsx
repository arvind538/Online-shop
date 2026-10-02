import React, { useState, useRef, useEffect } from "react";
import Logo from "../../assets/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Store/auth";
import { FaBars, FaTimes, FaShoppingCart, FaSearch, FaUser, FaSignOutAlt, FaChevronDown, FaBoxOpen } from "react-icons/fa"; // Added FaBoxOpen for My Orders
import { MdDashboard } from "react-icons/md";
import DarkMode from "./DarkMode";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Products", link: "/products" },
  { id: 3, name: "Electronics", link: "/electronics" },
  { id: 4, name: "Cloths", link: "/cloths" },
  { id: 5, name: "For Mens", link: "/mens" },
  { id: 6, name: "For Girls", link: "/girls" },
  { id: 7, name: "Computer", link: "/computer" },
  { id: 8, name: "Mobile", link: "/mobile" },
  { id: 9, name: "Smart Watch", link: "/smartwatch" },
  { id: 10, name: "Camera", link: "/camera" },

];

const Navbar = () => {
  const { isLoggedIn, cart, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const totalItems = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Profile dropdown bahar click karne pe band ho
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (!value) return setSuggestions([]);
    const filtered = Menu.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    const match = Menu.find((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    if (match) navigate(match.link);
    else navigate(`/${search}`);
    setSearch("");
    setSuggestions([]);
    setMobileOpen(false);
  };

  // Username ka first letter avatar ke liye
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="shadow-md bg-white dark:bg-gray-900 dark:text-white sticky top-0 z-50">

      {/* TOP HEADER */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-7xl mx-auto gap-3 md:gap-4">

        {/* LOGO */}
        <Link to="/#" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <img src={Logo} alt="logo" className="w-8" />
          <span className="hidden sm:inline">Online_<span className="text-orange-500">Shop</span></span>
          <span className="sm:hidden">Online_<span className="text-orange-500">Shop</span></span>
        </Link>

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-xl relative mx-4">
          <form onSubmit={handleSearch} className="w-full flex items-center">
            <div className="relative w-full flex items-center">
              <FaSearch className="absolute left-4 text-gray-400 text-sm pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={handleChange}
                placeholder="Search products, categories..."
                className="w-full pl-10 pr-24 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-full outline-none
                           focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                           dark:bg-gray-800 dark:text-white dark:placeholder-gray-400
                           transition-all duration-200 text-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>

          {suggestions.length > 0 && (
            <div className="absolute top-14 w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    navigate(item.link);
                    setSearch("");
                    setSuggestions([]);
                  }}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-700 border-b last:border-0 dark:border-gray-700"
                >
                  <FaSearch className="text-orange-400 text-xs" />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">

          {/* CART ICON */}
          <NavLink to="/cart" className="relative p-2 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-full transition-colors duration-200">
            <FaShoppingCart className="text-xl hover:text-orange-500 transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1">
                {totalItems}
              </span>
            )}
          </NavLink>

          {/* DARK MODE */}
          <DarkMode />

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-4">
            {/* <NavLink to="/service" className="hover:text-orange-500 whitespace-nowrap text-sm font-medium transition-colors">
              Service
            </NavLink> */}
            <NavLink to="/contact" className="hover:text-orange-500 whitespace-nowrap text-sm font-medium transition-colors">
              Contact
            </NavLink>

            {isLoggedIn ? (
              <>
                {/* PROFILE DROPDOWN */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {/* Avatar circle */}
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {getInitials(user?.username)}
                    </div>
                    <span className="text-sm font-medium max-w-[80px] truncate">
                      {user?.username || "User"}
                    </span>
                    <FaChevronDown className={`text-xs text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">

                      {/* Profile Header */}
                      <div className="px-4 py-4 border-b dark:border-gray-700 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {getInitials(user?.username)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 dark:text-white text-sm truncate">
                              {user?.username || "User"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user?.email || ""}
                            </p>
                            {user?.isAdmin && (
                              <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="px-4 py-3 border-b dark:border-gray-700">
                        {user?.phone && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            📞 {user.phone}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          🛒 {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {user?.isAdmin && (
                          <NavLink
                            to="/admin/users"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium"
                          >
                            <MdDashboard className="text-base" />
                            Admin Panel
                          </NavLink>
                        )}
                        <NavLink
                          to="/myorders"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FaBoxOpen className="text-blue-500 text-base" />
                          My Orders
                        </NavLink>
                        <NavLink
                          to="/cart"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FaShoppingCart className="text-orange-500 text-base" />
                          My Cart
                          {totalItems > 0 && (
                            <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                              {totalItems}
                            </span>
                          )}
                        </NavLink>
                        <NavLink
                          to="/logout"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FaSignOutAlt className="text-base" />
                          Logout
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className="hover:text-orange-500 text-sm font-medium transition-colors">
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors whitespace-nowrap"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className="md:hidden text-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* MOBILE/TABLET ALWAYS-VISIBLE SEARCH BAR */}
      <div className="md:hidden px-4 pb-3 relative">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder="Search products, categories..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg outline-none
                         focus:border-orange-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-orange-100
                         dark:text-white dark:placeholder-gray-400 transition-all duration-200 text-sm"
            />
          </div>
        </form>

        {suggestions.length > 0 && (
          <div className="absolute left-4 right-4 top-[52px] bg-white dark:bg-gray-800 shadow-xl rounded-xl border dark:border-gray-700 z-50 overflow-hidden">
            {suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate(item.link);
                  setSearch("");
                  setSuggestions([]);
                }}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50 dark:hover:bg-gray-700 border-b last:border-0 dark:border-gray-700 text-sm"
              >
                <FaSearch className="text-orange-400 text-xs" />
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP NAV LINKS */}
      <nav className="hidden md:flex justify-center gap-6 lg:gap-10 py-2.5 border-t dark:border-gray-700">
        {Menu.map((item) => (
          <NavLink
            key={item.id}
            to={item.link}
            className={({ isActive }) =>
              `text-sm font-medium whitespace-nowrap transition-colors pb-0.5 ${isActive
                ? "text-orange-500 border-b-2 border-orange-500"
                : "hover:text-orange-500"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-900">

          {/* MOBILE NAV LINKS */}
          <div className="px-4 pt-2 pb-2">
            {Menu.map((item) => (
              <NavLink
                key={item.id}
                to={item.link}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-3 border-b dark:border-gray-700 text-sm font-medium ${isActive ? "text-orange-500" : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* MOBILE AUTH */}
          <div className="px-4 pt-2 pb-4 flex flex-col gap-2">
            <NavLink to="/service" onClick={() => setMobileOpen(false)} className="py-3 border-b dark:border-gray-700 text-sm font-medium">
              Service
            </NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)} className="py-3 border-b dark:border-gray-700 text-sm font-medium">
              Contact
            </NavLink>

            {isLoggedIn ? (
              <>
                {/* MOBILE PROFILE CARD */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 my-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {getInitials(user?.username)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 dark:text-white text-sm truncate">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || ""}
                      </p>
                      {user?.isAdmin && (
                        <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  {user?.phone && (
                    <p className="text-xs text-gray-500 mb-2">📞 {user.phone}</p>
                  )}
                  <p className="text-xs text-gray-400">🛒 {totalItems} item{totalItems !== 1 ? "s" : ""} in cart</p>
                </div>

                {user?.isAdmin && (
                  <NavLink
                    to="/admin/users"
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-full text-center hover:bg-indigo-700 transition-colors"
                  >
                    Admin Panel
                  </NavLink>
                )}
                <NavLink
                  to="/myorders"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-500 text-sm font-semibold rounded-full text-center hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FaBoxOpen /> My Orders
                </NavLink>
                <NavLink
                  to="/logout"
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 px-4 bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-semibold rounded-full text-center hover:bg-red-100 transition-colors flex items-center justify-center gap-2 mt-1"
                >
                  <FaSignOutAlt /> Logout
                </NavLink>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center border-2 border-orange-500 text-orange-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-50"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;