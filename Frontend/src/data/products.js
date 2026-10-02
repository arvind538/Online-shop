import rawProducts from "./products.data";

/* ===== 1. Images: src/assets/products ki saari files auto load ===== */
const files = import.meta.glob("../assets/products/*.{jpg,jpeg,png,webp,svg}", {
    eager: true,
    import: "default",
});

const getExt = (p) => p.split(".").pop().toLowerCase();
const getName = (p) => p.split("/").pop().replace(/\.[^.]+$/, "");

// Same naam ki asli photo (jpg/png/webp) ho to wo svg placeholder ko override karegi
const RANK = { svg: 0, png: 1, jpeg: 2, jpg: 3, webp: 4 };

const imageMap = {};
Object.entries(files)
    .sort(([a], [b]) => RANK[getExt(a)] - RANK[getExt(b)])
    .forEach(([path, url]) => {
        imageMap[getName(path)] = url;
    });

/* ===== 2. Season (winter/summer) naam se nikalte hain ===== */
const WINTER = /(coat|jacket|hoodie|sweater|puffer|cardigan|blazer|flannel|corduroy|overshirt|sherwani)/i;

const getSeason = (p) => {
    if (p.category === "Electronics") return undefined;
    return WINTER.test(p.name) ? "winter" : "summer";
};

// Purane pages ke liye: Men / Women / Electronics ko "men" / "women" / "electronics" me badalna
const getGroup = (p) => (p.category === "Electronics" ? "electronics" : p.gender.toLowerCase());

/* ===== 2b. Electronics ki sub-category + description (naam se) ===== */
// Order matter karta hai: pehle wali pattern pehle match hoti hai
const ELEC_RULES = [
    ["Audio", /earbud|earphone|headphone|speaker|neckband/i],
    ["Power", /charger|power bank/i],
    ["Storage", /ssd|pen drive|hard disk/i],
    ["Camera", /camera|webcam|ring light/i],
    ["Computers", /tablet|laptop|monitor/i],
    ["Mobile", /phone|mobile/i],
    ["Smart Home", /bulb/i],
    ["Wearable", /watch|\bband\b/i],
];

const getElecSub = (name) => {
    const hit = ELEC_RULES.find(([, re]) => re.test(name));
    return hit ? hit[0] : "Accessories"; // mouse, keyboard, stand, hub, pad...
};

const ELEC_DESC = {
    Audio: "Clear sound and comfortable listening, wherever you go.",
    Power: "Fast and reliable charging for all your devices.",
    Storage: "Fast, portable storage for all your files.",
    Camera: "Capture sharp photos and video with ease.",
    Computers: "Reliable performance for work, study and entertainment.",
    Mobile: "Powerful performance with all-day battery.",
    "Smart Home": "Energy-efficient smart lighting for your home.",
    Wearable: "Fitness tracking and smart features on your wrist.",
    Accessories: "Everyday desk and gaming essentials built to last.",
};

/* ===== 3. Sabhi products ek jagah ===== */
// RULE: har product ka "id" UNIQUE hota hai (cart isi se chalta hai)
const BG_COLORS = [
    "from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40",
    "from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40",
    "from-orange-50 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40",
    "from-teal-50 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40",
    "from-purple-50 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40",
    "from-red-50 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40",
];

// rating / discount / id ke hisaab se badge
const getBadge = (p, discount) => {
    if (p.rating >= 4.7) return { badge: "Top Rated", badgeColor: "bg-purple-500" };
    if (discount >= 40) return { badge: "Hot Deal", badgeColor: "bg-red-500" };
    if (p.id % 5 === 0) return { badge: "New", badgeColor: "bg-teal-500" };
    if (p.id % 4 === 0) return { badge: "Trending", badgeColor: "bg-blue-500" };
    return { badge: "", badgeColor: "" };
};

export const PRODUCTS = rawProducts.map((p, i) => {
    const withId = { id: i + 1, ...p };
    const discount = withId.mrp > withId.price
        ? Math.round(((withId.mrp - withId.price) / withId.mrp) * 100)
        : 0;
    const isElec = withId.category === "Electronics";
    const subCategory = isElec ? getElecSub(withId.name) : withId.category;

    return {
        ...withId,
        title: withId.name,                        // purane pages p.title use karte hain
        originalPrice: withId.mrp,                 // purane pages p.originalPrice use karte hain
        discount,
        reviews: 40 + ((withId.id * 37) % 300),    // fake but fixed (har baar same rahega)
        ...getBadge(withId, discount),
        bgColor: BG_COLORS[withId.id % BG_COLORS.length],
        subCategory,                               // Electronics: Audio, Wearable... | baaki: Shirts, Pants...
        description: isElec ? ELEC_DESC[subCategory] : withId.description,
        group: getGroup(withId),                   // "men" | "women" | "electronics"
        season: getSeason(withId),                 // "winter" | "summer" | undefined
        image: imageMap[withId.image] || "",
    };
});

/* ===== 4. Sabhi site images (hero / logo) ===== */
export const IMAGES = {
    hero: {
        banner1: "/images/hero/banner1.jpg",
        banner2: "/images/hero/banner2.jpg",
    },
    logo: "/images/logo.png",
};

/* ===== 5. Helper functions ===== */
const norm = (s) => String(s).toLowerCase().replace(/[^a-z]/g, "");

// getByCategory("men"), ("women"), ("electronics"), ("shirts"), ("t-shirts"), ("pants"), ("cloths") sab chalenge
export const getByCategory = (category) => {
    const key = norm(category);
    return PRODUCTS.filter((p) => p.group === key || norm(p.category) === key);
};

export const getByGender = (gender) =>
    PRODUCTS.filter((p) => norm(p.gender) === norm(gender));

export const getById = (id) => PRODUCTS.find((p) => String(p.id) === String(id));

export const getBySeason = (season) =>
    PRODUCTS.filter((p) => p.season === season);

export const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))];

export default PRODUCTS;