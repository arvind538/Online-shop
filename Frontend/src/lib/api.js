const BASE_URL = import.meta.env.VITE_APP_URL_API || "https://online-shop-website-21.onrender.com";
const API_URL = `${BASE_URL}/api`;
const TIMEOUT = 15000; // 15 sec me response na aaye to error

// Query params banane ka helper: { page: 1, q: "abc" } -> ?page=1&q=abc
const buildQuery = (params) => {
    if (!params) return "";
    const clean = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const qs = new URLSearchParams(clean).toString();
    return qs ? `?${qs}` : "";
};

async function request(method, url, { body, params, headers: extraHeaders } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    const token = localStorage.getItem("token");
    const isFormData = body instanceof FormData;

    const headers = { ...extraHeaders };
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    let res;
    try {
        res = await fetch(`${API_URL}${url}${buildQuery(params)}`, {
            method,
            headers,
            body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
            signal: controller.signal,
        });
    } catch (err) {
        clearTimeout(timer);
        // timeout ya network down (server band hai)
        const error = new Error(err.name === "AbortError" ? "Request timed out" : "Network error");
        error.code = err.name === "AbortError" ? "ECONNABORTED" : "ERR_NETWORK";
        error.response = undefined;
        throw error;
    }
    clearTimeout(timer);

    // Response body safely parse karo (empty ya non-JSON bhi chalega)
    const text = await res.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: text };
    }

    if (!res.ok) {
        const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/register");

        // Token expire/invalid: logout karke login pe bhejo
        // (login/register ki galat password wali 401 pe logout nahi karna)
        if (res.status === 401 && !isAuthRoute) {
            localStorage.removeItem("token");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        const error = new Error(data?.message || `Request failed (${res.status})`);
        error.response = { status: res.status, data };
        throw error;
    }

    return { data, status: res.status };
}

const api = {
    get: (url, opts) => request("GET", url, opts),
    post: (url, body, opts) => request("POST", url, { ...opts, body }),
    put: (url, body, opts) => request("PUT", url, { ...opts, body }),
    patch: (url, body, opts) => request("PATCH", url, { ...opts, body }),
    delete: (url, opts) => request("DELETE", url, opts),
};

// Error se saaf message nikalne ka helper
export const getErrorMessage = (error, fallback = "Something went wrong") => {
    if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
    if (!error.response) return "Server connection failed! Please check your backend.";
    return error.response.data?.message || error.response.data?.extraDetails || fallback;
};

export default api;



// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_APP_URL_API || "http://localhost:4041";

// const api = axios.create({
//     baseURL: `${BASE_URL}/api`,
//     headers: { "Content-Type": "application/json" },
//     timeout: 15000, // 15 sec me response na aaye to error
// });

// // ---------- REQUEST: har request me token apne aap ----------
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// // ---------- RESPONSE: errors ek jagah handle ----------
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         const status = error.response?.status;
//         const url = error.config?.url || "";
//         const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/register");

//         // Token expire/invalid: logout karke login pe bhejo
//         // (login/register ki galat password wali 401 pe logout nahi karna)
//         if (status === 401 && !isAuthRoute) {
//             localStorage.removeItem("token");
//             if (window.location.pathname !== "/login") {
//                 window.location.href = "/login";
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// // Error se saaf message nikalne ka helper
// export const getErrorMessage = (error, fallback = "Something went wrong") => {
//     if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
//     if (!error.response) return "Server connection failed! Please check your backend.";
//     return error.response.data?.message || error.response.data?.extraDetails || fallback;
// };

// export default api;