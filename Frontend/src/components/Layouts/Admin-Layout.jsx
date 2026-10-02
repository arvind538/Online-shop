import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ImUsers } from "react-icons/im";
import { IoIosContacts } from "react-icons/io";
import { MdDashboard, MdInventory2, MdShoppingBag, MdAssessment } from "react-icons/md";
import {
    FaBars, FaBell, FaChevronDown, FaSignOutAlt, FaStore, FaTimes, FaUserCircle,
} from "react-icons/fa";
import { useAuth } from "../../Store/auth";
import { adminService } from "../../lib/services";

const TITLES = {
    "/admin": "Dashboard",
    "/admin/orders": "Orders",
    "/admin/products": "Products",
    "/admin/inventory": "Inventory",
    "/admin/users": "Users",
    "/admin/contacts": "Contacts",
    "/admin/profile": "My Profile",
};

const AdminLayout = () => {
    const { user, isLoading, LogoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [stats, setStats] = useState(null);

    const isAdmin = !!user?.isAdmin;

    const refreshStats = useCallback(async () => {
        try {
            const res = await adminService.getStats();
            // Backend kisi wrapper me bheje to bhi chalega
            setStats(res?.stats || res?.data || res);
        } catch (error) {
            console.error("Stats error:", error?.response?.status, error?.response?.data || error.message);
        }
    }, []);

    // Stats abhi load karo, phir har 30 sec me (naye orders ka badge live rahega)
    useEffect(() => {
        if (!isAdmin) return;
        refreshStats();
        const id = setInterval(refreshStats, 30000);
        return () => clearInterval(id);
    }, [isAdmin, refreshStats]);

    // Page badalte hi mobile drawer aur menu band
    useEffect(() => {
        setSidebarOpen(false);
        setMenuOpen(false);
    }, [location.pathname]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) return <Navigate to="/" replace />;

    const pending = stats?.pending || 0;
    const title =
        TITLES[location.pathname] ||
        (location.pathname.includes("/users/") ? "Edit User" : "Admin");

    const handleLogout = () => {
        LogoutUser();
        navigate("/login", { replace: true });
    };

    const navItems = [
        { to: "/admin", end: true, icon: <MdDashboard />, label: "Dashboard" },
        { to: "/admin/orders", icon: <MdShoppingBag />, label: "Orders", badge: pending },
        { to: "/admin/products", icon: <MdInventory2 />, label: "Products" },
        { to: "/admin/inventory", icon: <MdAssessment />, label: "Inventory" },
        { to: "/admin/users", icon: <ImUsers />, label: "Users" },
        { to: "/admin/contacts", icon: <IoIosContacts />, label: "Contacts" },
        { to: "/admin/profile", icon: <FaUserCircle />, label: "My Profile" },
    ];

    const initial = user?.username?.charAt(0).toUpperCase() || "A";

    const sidebar = (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="px-6 py-5 border-b border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <MdDashboard className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">Admin Panel</p>
                            <p className="text-xs text-gray-400">Online Shop</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white p-1"
                        aria-label="Close menu"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>
            </div>

            {/* Admin card */}
            <Link
                to="/admin/profile"
                className="mx-4 mt-4 flex items-center gap-3 p-3 rounded-xl bg-gray-800/60 hover:bg-gray-800 transition-colors"
            >
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white">
                    {initial}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.username || "Admin"}</p>
                    <p className="text-xs text-orange-400">Administrator</p>
                </div>
            </Link>

            {/* Nav */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                <p className="px-3 pb-2 text-[11px] font-semibold tracking-widest text-gray-500">MENU</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white hover:translate-x-1"
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge > 0 && (
                            <span className="bg-red-500 text-white text-[11px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center animate-pulse">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer actions */}
            <div className="px-4 py-4 border-t border-gray-800 space-y-1">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <FaStore /> View Store
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <FaSignOutAlt /> Logout
                </button>
                <p className="text-[11px] text-gray-600 text-center pt-2">Online_Shop © 2026</p>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 text-white shadow-xl shrink-0 sticky top-0 h-screen">
                {sidebar}
            </aside>

            {/* Mobile sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {sidebar}
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-sm px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Open menu"
                        >
                            <FaBars className="text-xl text-gray-700 dark:text-white" />
                        </button>
                        <div>
                            <h1 className="text-base md:text-lg font-bold text-gray-800 dark:text-white leading-tight">
                                {title}
                            </h1>
                            <p className="text-xs text-gray-400 hidden sm:block">Admin / {title}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Pending orders bell */}
                        <Link
                            to="/admin/orders"
                            className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Pending orders"
                            title={`${pending} pending orders`}
                        >
                            <FaBell className="text-gray-600 dark:text-gray-300" />
                            {pending > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                    {pending}
                                </span>
                            )}
                        </Link>

                        {/* Profile dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-orange-50 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {initial}
                                </span>
                                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[140px] truncate">
                                    {user?.username}
                                </span>
                                <FaChevronDown className={`text-xs text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                            </button>

                            {menuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b dark:border-gray-700">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.username}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <FaUserCircle /> My Profile
                                        </Link>
                                        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <FaStore /> View Store
                                        </Link>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700">
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    <Outlet context={{ stats, refreshStats }} />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;