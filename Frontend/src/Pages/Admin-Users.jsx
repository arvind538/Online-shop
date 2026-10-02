import { useAuth } from "../Store/auth";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authorizationToken, API } = useAuth();

    // Details modal state
    const [selectedUser, setSelectedUser] = useState(null); // mounted user
    const [isOpen, setIsOpen] = useState(false); // drives the animation
    const dialogRef = useRef(null);
    const closeTimer = useRef(null);

    const getAllUsersData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API}/api/admin/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
            });

            if (!response.ok) {
                toast.error("Failed to load users");
                setUsers([]);
                return;
            }

            const data = await response.json();
            const usersList = Array.isArray(data)
                ? data
                : Array.isArray(data.users)
                    ? data.users
                    : [];

            setUsers(usersList);
        } catch (error) {
            console.error("Network error:", error);
            toast.error("Network error while loading users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API}/api/admin/users/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
            });

            if (!response.ok) {
                toast.error("Failed to delete user");
                return;
            }

            toast.success("User deleted successfully!");
            if (selectedUser?._id === id) closeDetails();
            getAllUsersData();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Something went wrong while deleting");
        }
    };

    // ---- Modal open / close (smooth) ----
    const openDetails = (user) => {
        clearTimeout(closeTimer.current);
        setSelectedUser(user);
        // wait one frame so the "closed" styles paint first, then animate in
        requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)));
    };

    const closeDetails = () => {
        setIsOpen(false);
        // unmount after the transition finishes
        closeTimer.current = setTimeout(() => setSelectedUser(null), 250);
    };

    useEffect(() => {
        getAllUsersData();
    }, [authorizationToken]);

    // Esc to close + lock background scroll + focus the dialog
    useEffect(() => {
        if (!selectedUser) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") closeDetails();
        };
        document.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialogRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [selectedUser]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    const onRowKey = (e, user) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDetails(user);
        }
    };

    return (
        <section className="p-2 md:p-4">

            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        All Users
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Select a user to see their details
                    </p>
                </div>
                {!loading && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                            {users.length} {users.length === 1 ? "User" : "Users"}
                        </span>
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-500 text-sm">Loading users...</p>
                    </div>
                </div>

            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">👤</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No users found</h3>
                    <p className="text-sm text-gray-400 mt-1">Users will appear here once registered</p>
                </div>

            ) : (
                <>
                    {/* DESKTOP TABLE */}
                    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                                            #
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {users.map((curUser, index) => {
                                        const active = selectedUser?._id === curUser._id;
                                        return (
                                            <tr
                                                key={curUser._id}
                                                tabIndex={0}
                                                onClick={() => openDetails(curUser)}
                                                onKeyDown={(e) => onRowKey(e, curUser)}
                                                className={`cursor-pointer transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 ${active
                                                    ? "bg-indigo-50 dark:bg-indigo-900/30"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                                    }`}
                                            >
                                                <td className="px-6 py-4 text-gray-400 text-xs font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                            {curUser.username?.charAt(0).toUpperCase() || "U"}
                                                        </div>
                                                        <span className="font-medium text-gray-800 dark:text-white">
                                                            {curUser.username || "N/A"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                    {curUser.email || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                    {curUser.phone || "N/A"}
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link to={`/admin/users/${curUser._id}/edit`}>
                                                            <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors">
                                                                Edit
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteUser(curUser._id)}
                                                            className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-400">
                                Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{users.length}</span> registered users
                            </p>
                        </div>
                    </div>

                    {/* MOBILE CARDS */}
                    <div className="md:hidden space-y-3">
                        {users.map((curUser, index) => {
                            const active = selectedUser?._id === curUser._id;
                            return (
                                <div
                                    key={curUser._id}
                                    tabIndex={0}
                                    onClick={() => openDetails(curUser)}
                                    onKeyDown={(e) => onRowKey(e, curUser)}
                                    className={`cursor-pointer border rounded-2xl p-4 shadow-sm transition-all duration-150 active:scale-[0.99] outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${active
                                        ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700"
                                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {curUser.username?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-white text-sm">
                                                    {curUser.username || "N/A"}
                                                </p>
                                                <p className="text-xs text-gray-400">#{index + 1}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 mb-2">
                                        <span className="text-xs font-semibold text-gray-400 uppercase w-12 shrink-0 pt-0.5">Email</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{curUser.email || "N/A"}</p>
                                    </div>

                                    <div className="flex items-start gap-2 mb-4">
                                        <span className="text-xs font-semibold text-gray-400 uppercase w-12 shrink-0 pt-0.5">Phone</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{curUser.phone || "N/A"}</p>
                                    </div>

                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Link to={`/admin/users/${curUser._id}/edit`} className="flex-1">
                                            <button className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-xl hover:bg-indigo-100 transition-colors">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => deleteUser(curUser._id)}
                                            className="flex-1 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <p className="text-xs text-gray-400 text-center pt-2">
                            Total {users.length} registered users
                        </p>
                    </div>
                </>
            )}

            {/* USER DETAILS MODAL (centered, animated) */}
            {selectedUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="presentation"
                >
                    {/* Backdrop */}
                    <div
                        onClick={closeDetails}
                        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${isOpen ? "opacity-100" : "opacity-0"
                            }`}
                    />

                    {/* Dialog */}
                    <div
                        ref={dialogRef}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Details for ${selectedUser.username || "user"}`}
                        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 outline-none transition-all duration-200 ease-out motion-reduce:transition-none ${isOpen
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 translate-y-2"
                            }`}
                    >
                        {/* Close */}
                        <button
                            onClick={closeDetails}
                            aria-label="Close"
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                        >
                            ✕
                        </button>

                        {/* Profile */}
                        <div className="flex flex-col items-center text-center px-6 pt-8 pb-5">
                            <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                                {selectedUser.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white break-all">
                                {selectedUser.username || "N/A"}
                            </h2>
                            <span
                                className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold ${selectedUser.isAdmin
                                    ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    }`}
                            >
                                {selectedUser.isAdmin ? "Admin" : "Customer"}
                            </span>
                        </div>

                        {/* Details */}
                        <dl className="px-6 divide-y divide-gray-100 dark:divide-gray-700 border-t border-gray-100 dark:border-gray-700">
                            <div className="py-3 flex items-start justify-between gap-4">
                                <dt className="text-sm text-gray-400 shrink-0">Email</dt>
                                <dd className="text-sm text-gray-800 dark:text-gray-200 text-right break-all">
                                    {selectedUser.email || "N/A"}
                                </dd>
                            </div>
                            <div className="py-3 flex items-start justify-between gap-4">
                                <dt className="text-sm text-gray-400 shrink-0">Phone</dt>
                                <dd className="text-sm text-gray-800 dark:text-gray-200 text-right">
                                    {selectedUser.phone || "N/A"}
                                </dd>
                            </div>
                            <div className="py-3 flex items-start justify-between gap-4">
                                <dt className="text-sm text-gray-400 shrink-0">User ID</dt>
                                <dd className="text-xs text-gray-500 dark:text-gray-400 text-right break-all font-mono">
                                    {selectedUser._id}
                                </dd>
                            </div>
                        </dl>

                        {/* Actions */}
                        <div className="flex gap-3 p-6">
                            <Link to={`/admin/users/${selectedUser._id}/edit`} className="flex-1">
                                <button className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                                    Edit user
                                </button>
                            </Link>
                            <button
                                onClick={() => deleteUser(selectedUser._id)}
                                className="flex-1 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors"
                            >
                                Delete user
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminUsers;




// import { useAuth } from "../Store/auth";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const AdminUsers = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { authorizationToken, API } = useAuth();

//     const getAllUsersData = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(`${API}/api/admin/users`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: authorizationToken,
//                 },
//             });

//             if (!response.ok) {
//                 toast.error("Failed to load users");
//                 setUsers([]);
//                 return;
//             }

//             const data = await response.json();
//             const usersList = Array.isArray(data)
//                 ? data
//                 : Array.isArray(data.users)
//                 ? data.users
//                 : [];

//             setUsers(usersList);
//         } catch (error) {
//             console.error("Network error:", error);
//             toast.error("Network error while loading users");
//             setUsers([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const deleteUser = async (id) => {
//         const confirmDelete = window.confirm("Are you sure you want to delete this user?");
//         if (!confirmDelete) return;

//         try {
//             const response = await fetch(`${API}/api/admin/users/delete/${id}`, {
//                 method: "DELETE",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: authorizationToken,
//                 },
//             });

//             if (!response.ok) {
//                 toast.error("Failed to delete user");
//                 return;
//             }

//             toast.success("User deleted successfully!");
//             getAllUsersData();
//         } catch (error) {
//             console.error("Delete error:", error);
//             toast.error("Something went wrong while deleting");
//         }
//     };

//     useEffect(() => {
//         getAllUsersData();
//     }, [authorizationToken]);

//     return (
//         <section className="p-2 md:p-4">

//             {/* Header */}
//             <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//                 <div>
//                     <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
//                         All Users
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-1">
//                         Manage and monitor all registered users
//                     </p>
//                 </div>
//                 {!loading && (
//                     <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
//                         <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
//                             {users.length} {users.length === 1 ? "User" : "Users"}
//                         </span>
//                     </div>
//                 )}
//             </div>

//             {/* Loading */}
//             {loading ? (
//                 <div className="flex items-center justify-center py-20">
//                     <div className="text-center">
//                         <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
//                         <p className="text-gray-500 text-sm">Loading users...</p>
//                     </div>
//                 </div>

//             ) : users.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-center">
//                     <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
//                         <span className="text-3xl">👤</span>
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No users found</h3>
//                     <p className="text-sm text-gray-400 mt-1">Users will appear here once registered</p>
//                 </div>

//             ) : (
//                 <>
//                     {/* DESKTOP TABLE */}
//                     <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

//                         {/* ✅ Max height + scroll sirf tbody pe — thead sticky rahega */}
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-sm">

//                                 {/* ✅ STICKY THEAD */}
//                                 <thead className="sticky top-0 z-10">
//                                     <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
//                                         <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
//                                             #
//                                         </th>
//                                         <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                             Name
//                                         </th>
//                                         <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                             Email
//                                         </th>
//                                         <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                             Phone
//                                         </th>
//                                         <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                                             Actions
//                                         </th>
//                                     </tr>
//                                 </thead>

//                                 <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                                     {users.map((curUser, index) => (
//                                         <tr
//                                             key={curUser._id}
//                                             className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
//                                         >
//                                             <td className="px-6 py-4 text-gray-400 text-xs font-medium">
//                                                 {index + 1}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
//                                                         {curUser.username?.charAt(0).toUpperCase() || "U"}
//                                                     </div>
//                                                     <span className="font-medium text-gray-800 dark:text-white">
//                                                         {curUser.username || "N/A"}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
//                                                 {curUser.email || "N/A"}
//                                             </td>
//                                             <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
//                                                 {curUser.phone || "N/A"}
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="flex items-center justify-center gap-2">
//                                                     <Link to={`/admin/users/${curUser._id}/edit`}>
//                                                         <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition-colors">
//                                                             Edit
//                                                         </button>
//                                                     </Link>
//                                                     <button
//                                                         onClick={() => deleteUser(curUser._id)}
//                                                         className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Table Footer */}
//                         <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
//                             <p className="text-xs text-gray-400">
//                                 Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{users.length}</span> registered users
//                             </p>
//                         </div>
//                     </div>

//                     {/* MOBILE CARDS — same as before */}
//                     <div className="md:hidden space-y-3">
//                         {users.map((curUser, index) => (
//                             <div
//                                 key={curUser._id}
//                                 className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm"
//                             >
//                                 <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
//                                             {curUser.username?.charAt(0).toUpperCase() || "U"}
//                                         </div>
//                                         <div>
//                                             <p className="font-semibold text-gray-800 dark:text-white text-sm">
//                                                 {curUser.username || "N/A"}
//                                             </p>
//                                             <p className="text-xs text-gray-400">#{index + 1}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-start gap-2 mb-2">
//                                     <span className="text-xs font-semibold text-gray-400 uppercase w-12 shrink-0 pt-0.5">Email</span>
//                                     <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{curUser.email || "N/A"}</p>
//                                 </div>

//                                 <div className="flex items-start gap-2 mb-4">
//                                     <span className="text-xs font-semibold text-gray-400 uppercase w-12 shrink-0 pt-0.5">Phone</span>
//                                     <p className="text-sm text-gray-600 dark:text-gray-300">{curUser.phone || "N/A"}</p>
//                                 </div>

//                                 <div className="flex gap-2">
//                                     <Link to={`/admin/users/${curUser._id}/edit`} className="flex-1">
//                                         <button className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-xl hover:bg-indigo-100 transition-colors">
//                                             Edit
//                                         </button>
//                                     </Link>
//                                     <button
//                                         onClick={() => deleteUser(curUser._id)}
//                                         className="flex-1 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl hover:bg-red-100 transition-colors"
//                                     >
//                                         Delete
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}

//                         <p className="text-xs text-gray-400 text-center pt-2">
//                             Total {users.length} registered users
//                         </p>
//                     </div>
//                 </>
//             )}
//         </section>
//     );
// };

// export default AdminUsers;