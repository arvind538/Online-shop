import { useEffect, useState } from "react";
import { useAuth } from "../Store/auth";
import { toast } from "react-toastify";

const AdminContacts = () => {
    const [contactData, setContactData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authorizationToken, API } = useAuth();

    const getContactsData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API}/api/admin/contacts`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setContactData(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    const deleteContactById = async (id) => {
        try {
            const response = await fetch(`${API}/api/admin/contacts/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
            });

            // ✅ response text dekho pehle
            const text = await response.text();
            console.log("Delete response:", response.status, text);

            if (!response.ok) {
                toast.error(`Delete Failed! Status: ${response.status}`);
                return;
            }

            toast.success("Deleted Successfully!");
            getContactsData();

        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Network error");
        }
    };

    useEffect(() => {
        getContactsData();
    }, []);

    return (
        <section className="p-2">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        All Contacts
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View and manage user contact messages
                    </p>
                </div>
                {!loading && contactData.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                        <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                            {contactData.length} {contactData.length === 1 ? "Message" : "Messages"}
                        </span>
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-500 text-sm">Loading contacts...</p>
                    </div>
                </div>

                /* Empty State */
            ) : contactData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">📭</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No contacts found</h3>
                    <p className="text-sm text-gray-400 mt-1">Contact messages will appear here</p>
                </div>

                /* Cards Grid */
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {contactData.map((curContactData, index) => (
                        <div
                            key={curContactData._id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-4"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {curContactData.username?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white text-sm">
                                            {curContactData.username || "N/A"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            #{index + 1}
                                        </p>
                                    </div>
                                </div>
                                {/* Message badge */}
                                <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                                    New
                                </span>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-14 shrink-0 pt-0.5">
                                    Email
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                                    {curContactData.email || "N/A"}
                                </p>
                            </div>

                            {/* Message */}
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-14 shrink-0 pt-0.5">
                                    Message
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                                    {curContactData.message || "No message"}
                                </p>
                            </div>

                            {/* Divider */}
                            <hr className="border-gray-100 dark:border-gray-700" />

                            {/* Delete Button */}
                            <button
                                onClick={() => deleteContactById(curContactData._id)}
                                className="w-full py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-800 transition-colors duration-200"
                            >
                                Delete Message
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer count */}
            {!loading && contactData.length > 0 && (
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        Total <span className="font-semibold text-gray-600 dark:text-gray-300">{contactData.length}</span> contact messages
                    </p>
                </div>
            )}
        </section>
    );
};

export default AdminContacts;