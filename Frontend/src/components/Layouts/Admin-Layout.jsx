import { useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { ImUsers } from "react-icons/im";
import { IoIosContacts } from "react-icons/io";
import { MdHomeRepairService, MdDashboard } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../Store/auth";

const AdminLayout = () => {
    const { user, isLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    if (!user || !user.isAdmin) {
        return <Navigate to="/" />;
    }

    const navItems = [
        { to: "/admin/users", icon: <ImUsers />, label: "Users" },
        { to: "/admin/contacts", icon: <IoIosContacts />, label: "Contacts" },
        // { to: "/service", icon: <MdHomeRepairService />, label: "Services" },
        // { to: "/", icon: <AiFillHome />, label: "Home" },
    ];

    //  Sidebar content alag component mein — reuse hoga
    const SidebarContent = () => (
        <div className="flex flex-col h-full">

            {/* Sidebar Header */}
            <div className="px-6 py-5 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                            <MdDashboard className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">Admin Panel</p>
                            <p className="text-xs text-gray-400">Online Shop</p>
                        </div>
                    </div>
                    {/* Close — sirf mobile pe */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white p-1"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>
            </div>

            {/* Admin Info */}
            <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white">
                        {user?.username?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                            {user?.username || "Admin"}
                        </p>
                        <p className="text-xs text-orange-400">Administrator</p>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-orange-500 text-white shadow-md"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="px-6 py-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 text-center">Online_Shop © 2026</p>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/*  DESKTOP SIDEBAR — hamesha visible, fixed nahi */}
            <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-900 text-white shadow-xl shrink-0">
                <SidebarContent />
            </aside>

            {/*  MOBILE SIDEBAR — slide in/out */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-xl z-50 flex flex-col
                    transform transition-transform duration-300 lg:hidden
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <SidebarContent />
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* TOP BAR */}
                <header className="bg-white dark:bg-gray-900 shadow-sm px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        {/* Hamburger — sirf mobile pe */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Open menu"
                        >
                            <FaBars className="text-xl text-gray-700 dark:text-white" />
                        </button>
                        <h1 className="text-base md:text-lg font-bold text-gray-800 dark:text-white">
                            Admin Dashboard
                        </h1>
                    </div>

                    {/* Email Badge */}
                    <div className="flex items-center gap-2 bg-orange-50 dark:bg-gray-800 px-3 md:px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                        <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium truncate max-w-[120px] md:max-w-none">
                            {user?.email || "admin@shop.com"}
                        </span>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;