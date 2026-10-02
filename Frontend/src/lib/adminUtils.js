export const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export const fmtDate = (d, withTime = true) =>
    new Date(d).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime && { hour: "numeric", minute: "2-digit", hour12: true }),
    });

export const STATUS_STYLES = {
    Pending: "bg-orange-50 text-orange-600 ring-orange-200",
    Confirmed: "bg-indigo-50 text-indigo-600 ring-indigo-200",
    Shipped: "bg-blue-50 text-blue-600 ring-blue-200",
    Delivered: "bg-green-50 text-green-600 ring-green-200",
    Cancelled: "bg-red-50 text-red-600 ring-red-200",
};

export const STATUS_BAR = {
    Pending: "bg-orange-500",
    Confirmed: "bg-indigo-500",
    Shipped: "bg-blue-500",
    Delivered: "bg-green-500",
    Cancelled: "bg-red-500",
};

export const IMG_FALLBACK =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='#e5e7eb'/></svg>`
    );

export const onImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = IMG_FALLBACK;
};