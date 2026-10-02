import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { FaEnvelope, FaPhoneAlt, FaShieldAlt, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { useAuth } from "../Store/auth";
import { fmtDate, inr } from "../lib/adminUtils";

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white break-all">{value || "-"}</p>
        </div>
    </div>
);

const AdminProfile = () => {
    const { user, LogoutUser } = useAuth();
    const { stats } = useOutletContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        LogoutUser();
        navigate("/login", { replace: true });
    };

    return (
        <section className="max-w-5xl mx-auto space-y-6">
            {/* Banner */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-orange-500 via-orange-400 to-pink-500" />
                <div className="px-6 pb-6 -mt-12 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex items-end gap-4">
                        <div className="w-24 h-24 rounded-full bg-indigo-500 text-white text-4xl font-bold flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-lg">
                            {user?.username?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="pb-1">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.username}</h2>
                            <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold bg-orange-50 text-orange-600 px-3 py-1 rounded-full">
                                <FaShieldAlt /> Administrator
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                            <FaStore /> View Store
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Details */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-3">
                    <h3 className="font-bold text-gray-800 dark:text-white px-4 pt-3 pb-2">Account Details</h3>
                    <InfoRow icon={<FaUser />} label="Full name" value={user?.username} />
                    <InfoRow icon={<FaEnvelope />} label="Email" value={user?.email} />
                    <InfoRow icon={<FaPhoneAlt />} label="Phone" value={user?.phone && `+91 ${user.phone}`} />
                    <InfoRow icon={<FaShieldAlt />} label="Role" value="Administrator (full access)" />
                    <InfoRow icon={<FaUser />} label="User ID" value={user?._id} />
                    {user?.createdAt && (
                        <InfoRow icon={<FaUser />} label="Member since" value={fmtDate(user.createdAt, false)} />
                    )}
                </div>

                {/* Store summary */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Store Summary</h3>
                    {!stats ? (
                        <div className="space-y-3 animate-pulse">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {[
                                ["Total orders", stats.totalOrders],
                                ["Pending orders", stats.pending],
                                ["Delivered", stats.statusCounts.Delivered],
                                ["Revenue", inr(stats.revenue)],
                                ["Customers", stats.totalUsers],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                                    <span className="font-bold text-gray-800 dark:text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link
                        to="/admin/orders"
                        className="block text-center mt-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
                    >
                        Manage Orders
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AdminProfile;