import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const API = import.meta.env.VITE_APP_URL_API || "https://online-shop-website-21.onrender.com";

    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState([]);

    // CART: localStorage se load (kharab data ho to crash nahi hoga)
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem("cart");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // ---------- CART FUNCTIONS (Fixed for Size & Multiple Quantity) ----------
    const addToCart = (product) => {
        setCart((prev) => {
            // Product ki unique cart key banate hain (ID + Size agar size available ho)
            const itemKey = product.selectedSize
                ? `${product.id}-${product.selectedSize}`
                : product.id;

            const exist = prev.find((item) => {
                const currentKey = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id;
                return currentKey === itemKey;
            });

            if (exist) {
                return prev.map((item) => {
                    const currentKey = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id;
                    return currentKey === itemKey
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item;
                });
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id, selectedSize) => {
        setCart((prev) =>
            prev.filter((item) => {
                if (selectedSize) {
                    return !(item.id === id && item.selectedSize === selectedSize);
                }
                return item.id !== id;
            })
        );
    };

    const decreaseQty = (id, selectedSize) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    const match = selectedSize
                        ? (item.id === id && item.selectedSize === selectedSize)
                        : (item.id === id);

                    return match ? { ...item, quantity: item.quantity - 1 } : item;
                })
                .filter((item) => item.quantity > 0)
        );
    };

    const clearCart = () => setCart([]);

    // ---------- AUTH ----------
    const authorizationToken = token ? `Bearer ${token}` : "";
    const isLoggedIn = !!token;

    const storeTokenInLS = (serverToken) => {
        if (!serverToken) return;
        localStorage.setItem("token", serverToken);
        setToken(serverToken);
    };

    const LogoutUser = () => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
    };

    const userAuthentication = async () => {
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API}/api/auth/user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.userdata || data.userData || data.user || null);
            } else if ([400, 401, 403].includes(response.status)) {
                LogoutUser();
            }
        } catch (error) {
            console.error("User auth error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getServices = async () => {
        try {
            const response = await fetch(`${API}/api/data/service`);
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Service fetch error:", error);
        }
    };

    useEffect(() => {
        userAuthentication();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        getServices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                isLoggedIn,
                storeTokenInLS,
                LogoutUser,
                user,
                services,
                authorizationToken,
                isLoading,
                API,
                cart,
                addToCart,
                removeFromCart,
                decreaseQty,
                clearCart,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};




// import { createContext, useContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const API = import.meta.env.VITE_APP_URL_API;

//     const [token, setToken] = useState(localStorage.getItem("token") || "");
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [services, setServices] = useState([]);

//     // CART: localStorage se load (kharab data ho to crash nahi hoga)
//     const [cart, setCart] = useState(() => {
//         try {
//             const saved = localStorage.getItem("cart");
//             return saved ? JSON.parse(saved) : [];
//         } catch {
//             return [];
//         }
//     });

//     useEffect(() => {
//         localStorage.setItem("cart", JSON.stringify(cart));
//     }, [cart]);

//     // ---------- CART FUNCTIONS ----------
//     const addToCart = (product) => {
//         setCart((prev) => {
//             const exist = prev.find((item) => item.id === product.id);
//             if (exist) {
//                 return prev.map((item) =>
//                     item.id === product.id
//                         ? { ...item, quantity: item.quantity + 1 }
//                         : item
//                 );
//             }
//             return [...prev, { ...product, quantity: 1 }];
//         });
//     };

//     const removeFromCart = (id) => {
//         setCart((prev) => prev.filter((item) => item.id !== id));
//     };

//     const decreaseQty = (id) => {
//         setCart((prev) =>
//             prev
//                 .map((item) =>
//                     item.id === id ? { ...item, quantity: item.quantity - 1 } : item
//                 )
//                 .filter((item) => item.quantity > 0)
//         );
//     };

//     const clearCart = () => setCart([]);

//     // ---------- AUTH ----------
//     const authorizationToken = token ? `Bearer ${token}` : "";
//     const isLoggedIn = !!token;

//     const storeTokenInLS = (serverToken) => {
//         if (!serverToken) return;
//         localStorage.setItem("token", serverToken);
//         setToken(serverToken);
//     };

//     const LogoutUser = () => {
//         localStorage.removeItem("token");
//         setToken("");
//         setUser(null);
//     };

//     const userAuthentication = async () => {
//         if (!token) {
//             setUser(null);
//             setIsLoading(false);
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const response = await fetch(`${API}/api/auth/user`, {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setUser(data.userdata || data.userData || data.user || null);
//             } else if ([400, 401, 403].includes(response.status)) {
//                 // token invalid/expire hai to hi logout
//                 LogoutUser();
//             }
//         } catch (error) {
//             // backend band ho to logout mat karo
//             console.error("User auth error:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const getServices = async () => {
//         try {
//             const response = await fetch(`${API}/api/data/service`);
//             if (response.ok) {
//                 const data = await response.json();
//                 setServices(data);
//             }
//         } catch (error) {
//             console.error("Service fetch error:", error);
//         }
//     };

//     useEffect(() => {
//         userAuthentication();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token]);

//     useEffect(() => {
//         getServices();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     return (
//         <AuthContext.Provider
//             value={{
//                 token,
//                 isLoggedIn,
//                 storeTokenInLS,
//                 LogoutUser,
//                 user,
//                 services,
//                 authorizationToken,
//                 isLoading,
//                 API,
//                 cart,
//                 addToCart,
//                 removeFromCart,
//                 decreaseQty,
//                 clearCart,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };





// import { createContext, useContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
    
//     const API = import.meta.env.VITE_APP_URL_API;

//     const [token, setToken] = useState(localStorage.getItem("token") || "");
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [services, setServices] = useState([]);

//     // CART STATE — localStorage se load hoga taaki refresh pe bhi rahe
//     const [cart, setCart] = useState(() => {
//         const saved = localStorage.getItem("cart");
//         return saved ? JSON.parse(saved) : [];
//     });

//     // Cart change hone pe localStorage mein save karo
//     useEffect(() => {
//         localStorage.setItem("cart", JSON.stringify(cart));
//     }, [cart]);

//     // CART FUNCTIONS
//     const addToCart = (product) => {
//         setCart((prev) => {
//             const exist = prev.find((item) => item.id === product.id);
//             if (exist) {
//                 return prev.map((item) =>
//                     item.id === product.id
//                         ? { ...item, quantity: item.quantity + 1 }
//                         : item
//                 );
//             }
//             return [...prev, { ...product, quantity: 1 }];
//         });
//     };

//     const removeFromCart = (id) => {
//         setCart((prev) => prev.filter((item) => item.id !== id));
//     };

//     const decreaseQty = (id) => {
//         setCart((prev) =>
//             prev
//                 .map((item) =>
//                     item.id === id ? { ...item, quantity: item.quantity - 1 } : item
//                 )
//                 .filter((item) => item.quantity > 0)
//         );
//     };

//     const clearCart = () => setCart([]);

//     const authorizationToken = token ? `Bearer ${token}` : "";
//     const isLoggedIn = !!token;

//     const storeTokenInLS = (serverToken) => {
//         if (!serverToken) return;
//         localStorage.setItem("token", serverToken);
//         setToken(serverToken);
//     };

//     const LogoutUser = () => {
//         localStorage.removeItem("token");
//         setToken("");
//         setUser(null);
//     };

//     const userAuthentication = async () => {
//         try {
//             if (!token) {
//                 setIsLoading(false);
//                 return;
//             }
//             const response = await fetch(`${API}/api/auth/user`, {
//                 method: "GET",
//                 headers: {
//                     Authorization: authorizationToken,
//                     "Content-Type": "application/json",
//                 },
//             });
//             const data = await response.json();
//             if (response.ok) {
//                 setUser(data.userdata);
//             } else {
//                 LogoutUser();
//             }
//         } catch (error) {
//             console.error("User auth error:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const getServices = async () => {
//         try {
//             const response = await fetch(`${API}/api/data/service`);
//             if (response.ok) {
//                 const data = await response.json();
//                 setServices(data);
//             }
//         } catch (error) {
//             console.error("Service fetch error:", error);
//         }
//     };

//     useEffect(() => {
//         userAuthentication();
//     }, [token]);

//     useEffect(() => {
//         getServices();
//     }, []);

//     return (
//         <AuthContext.Provider
//             value={{
//                 isLoggedIn,
//                 storeTokenInLS,
//                 LogoutUser,
//                 user,
//                 services,
//                 authorizationToken,
//                 isLoading,
//                 API,
//                 cart,
//                 addToCart,
//                 removeFromCart,
//                 decreaseQty,
//                 clearCart,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };


// // import { createContext, useContext, useState, useEffect } from "react";

// // export const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
    
// //     const API = import.meta.env.VITE_APP_URL_API;

    
// //     const [token, setToken] = useState(localStorage.getItem("token") || "");
// //     const [user, setUser] = useState(null);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [services, setServices] = useState([]);

// //     const authorizationToken = token ? `Bearer ${token}` : "";

// //     const isLoggedIn = !!token;
// //     console.log("isLoggedIN", isLoggedIn);


// //     // ------ STORE TOKEN -------
// //     const storeTokenInLS = (serverToken) => {
// //         if (!serverToken) return;
// //         localStorage.setItem("token", serverToken);
// //         setToken(serverToken);
// //     };

// //     // ----- LOGOUT ------
// //     const LogoutUser = () => {
// //         localStorage.removeItem("token");
// //         setToken("");
// //         setUser(null);
// //     };

// //     // ----- USER AUTH CHECK -----
// //     const userAuthentication = async () => {
// //         try {
// //             if (!token) {
// //                 setIsLoading(false);
// //                 return;
// //             }

// //             const response = await fetch(`${API}/api/auth/user`, {
// //                 method: "GET",
// //                 headers: {
// //                     Authorization: authorizationToken,
// //                     "Content-Type": "application/json",
// //                 },
// //             });

// //             const data = await response.json();

// //             if (response.ok) {
// //                 setUser(data.userdata);
// //             } else {
// //                 LogoutUser();
// //             }
// //         } catch (error) {
// //             console.error("User auth error:", error);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     // ---- SERVICES FETCH ----
// //     const getServices = async () => {
// //         try {
// //             const response = await fetch(`${API}/api/data/service`);

// //             if (response.ok) {
// //                 const data = await response.json();
// //                 setServices(data);
// //             }
// //         } catch (error) {
// //             console.error("Service fetch error:", error);
// //         }
// //     };

// //     // ---- USE EFFECTS -----
// //     useEffect(() => {
// //         userAuthentication();
// //     }, [token]);

// //     useEffect(() => {
// //         getServices();
// //     }, []);

// //     // ---- CONTEXT VALUE ---
// //     return (
// //         <AuthContext.Provider
// //             value={{
// //                 isLoggedIn,
// //                 storeTokenInLS,
// //                 LogoutUser,
// //                 user,
// //                 services,
// //                 authorizationToken,
// //                 isLoading,
// //                 API,
// //             }}
// //         >
// //             {children}
// //         </AuthContext.Provider>
// //     );
// // };


// // export const useAuth = () => {
// //     return useContext(AuthContext);
// // };










