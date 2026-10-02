// Format: [name, gender, price, mrp, rating, stock]
// Image ka naam automatic banta hai: shirt-01 ... shirt-20, tshirt-01 ... electronic-60 etc.
// RULE: naye products hamesha apni category ki list ke END me jodo (beech me nahi),
// warna neeche ke products ki photos khisak jaati hain.
const make = (category, slug, rows) =>
    rows.map(([name, gender, price, mrp, rating, stock], i) => ({
        name,
        category,
        gender, // Men | Women | All
        price,
        mrp,
        rating,
        stock,
        image: `${slug}-${String(i + 1).padStart(2, "0")}`,
        description: `${name} - premium quality ${category.toLowerCase()}, comfortable and durable.`,
    }));

const all = [
    ...make("Shirts", "shirt", [
        ["Linen Classic Shirt", "Men", 1499, 2499, 4.5, 40],
        ["Oxford Button-Down Shirt", "Men", 1799, 2999, 4.6, 35],
        ["Checked Flannel Shirt", "Men", 1599, 2699, 4.4, 30],
        ["Slim Fit Formal Shirt", "Men", 1399, 2499, 4.3, 50],
        ["Denim Casual Shirt", "Men", 1999, 3299, 4.5, 28],
        ["Cuban Collar Shirt", "Men", 1299, 2199, 4.2, 45],
        ["Striped Cotton Shirt", "Men", 1199, 1999, 4.3, 60],
        ["Mandarin Collar Shirt", "Men", 1099, 1899, 4.1, 38],
        ["Printed Resort Shirt", "Men", 1399, 2399, 4.4, 33],
        ["Corduroy Overshirt", "Men", 2299, 3799, 4.6, 22],
        ["White Formal Shirt", "Men", 1299, 2199, 4.5, 70],
        ["Half Sleeve Linen Shirt", "Men", 1199, 1999, 4.2, 42],
        ["Floral Print Shirt", "Women", 1399, 2299, 4.5, 36],
        ["Satin Office Shirt", "Women", 1599, 2599, 4.6, 30],
        ["Oversized Cotton Shirt", "Women", 1499, 2499, 4.4, 41],
        ["Puff Sleeve Shirt", "Women", 1699, 2799, 4.7, 25],
        ["Tie-Up Crop Shirt", "Women", 1199, 1999, 4.3, 37],
        ["Striped Boyfriend Shirt", "Women", 1399, 2299, 4.4, 32],
        ["Denim Button Shirt", "Women", 1799, 2999, 4.5, 27],
        ["Linen Relaxed Shirt", "Women", 1599, 2599, 4.6, 34],
    ]),

    ...make("T-Shirts", "tshirt", [
        ["Classic Crew Neck Tee", "Men", 599, 999, 4.4, 120],
        ["Graphic Print Tee", "Men", 699, 1199, 4.3, 90],
        ["Polo T-Shirt", "Men", 899, 1499, 4.5, 75],
        ["Oversized Drop Shoulder Tee", "Men", 799, 1399, 4.6, 85],
        ["V-Neck Cotton Tee", "Men", 549, 899, 4.2, 110],
        ["Henley Full Sleeve Tee", "Men", 849, 1399, 4.4, 60],
        ["Striped Polo Tee", "Men", 949, 1599, 4.3, 55],
        ["Sports Dry-Fit Tee", "Men", 699, 1199, 4.5, 95],
        ["Pocket Tee", "Men", 649, 1099, 4.3, 80],
        ["Acid Wash Tee", "Men", 899, 1499, 4.4, 48],
        ["Basic Crop Tee", "Women", 499, 899, 4.3, 100],
        ["Ribbed Fitted Tee", "Women", 599, 999, 4.5, 88],
        ["Oversized Graphic Tee", "Women", 799, 1299, 4.6, 70],
        ["Boxy Cotton Tee", "Women", 699, 1199, 4.4, 66],
        ["Baby Tee", "Women", 549, 899, 4.2, 92],
        ["Striped Long Sleeve Tee", "Women", 749, 1249, 4.4, 54],
        ["Tie-Dye Tee", "Women", 649, 1099, 4.3, 58],
        ["Gym Racerback Tee", "Women", 599, 999, 4.5, 77],
        ["Slogan Print Tee", "Women", 699, 1199, 4.2, 63],
        ["Puff Sleeve Tee", "Women", 799, 1299, 4.5, 44],
    ]),

    ...make("Pants", "pant", [
        ["Slim Fit Chinos", "Men", 1699, 2799, 4.5, 45],
        ["Regular Fit Jeans", "Men", 1899, 2999, 4.4, 60],
        ["Cargo Pants", "Men", 1999, 3299, 4.6, 38],
        ["Formal Trousers", "Men", 1599, 2699, 4.3, 50],
        ["Jogger Pants", "Men", 1299, 2199, 4.5, 70],
        ["Tapered Fit Jeans", "Men", 2099, 3399, 4.5, 34],
        ["Linen Drawstring Pants", "Men", 1499, 2499, 4.3, 40],
        ["Track Pants", "Men", 999, 1699, 4.4, 85],
        ["Pleated Trousers", "Men", 1799, 2999, 4.4, 29],
        ["Ripped Denim Jeans", "Men", 2199, 3599, 4.2, 31],
        ["High Waist Jeans", "Women", 1899, 2999, 4.6, 42],
        ["Wide Leg Trousers", "Women", 1799, 2899, 4.5, 36],
        ["Straight Fit Jeans", "Women", 1799, 2899, 4.4, 48],
        ["Palazzo Pants", "Women", 1199, 1999, 4.3, 65],
        ["Utility Cargo Pants", "Women", 1999, 3299, 4.5, 33],
        ["Culottes", "Women", 1399, 2299, 4.2, 39],
        ["Paperbag Waist Pants", "Women", 1599, 2599, 4.4, 27],
        ["Yoga Leggings", "Women", 899, 1499, 4.6, 100],
        ["Flared Jeans", "Women", 1999, 3199, 4.5, 30],
        ["Formal Cigarette Pants", "Women", 1699, 2799, 4.4, 35],
    ]),

    ...make("Cloths", "cloth", [
        ["Classic Wool Overcoat", "Men", 5999, 8999, 4.8, 18],
        ["Denim Jacket", "Men", 2999, 4999, 4.5, 26],
        ["Zip-Up Hoodie", "Men", 1999, 3299, 4.6, 55],
        ["Bomber Jacket", "Men", 3499, 5499, 4.6, 20],
        ["Cotton Kurta", "Men", 1499, 2499, 4.4, 44],
        ["Sherwani Set", "Men", 7999, 12999, 4.7, 10],
        ["Quilted Puffer Jacket", "Men", 3999, 6499, 4.5, 24],
        ["Knitted Sweater", "Men", 1799, 2999, 4.4, 38],
        ["Nehru Jacket", "Men", 2999, 4999, 4.5, 16],
        ["Formal Blazer", "Men", 4499, 7499, 4.6, 19],
        ["Camel Wool Long Coat", "Women", 6499, 9999, 4.9, 14],
        ["Floral Maxi Dress", "Women", 2499, 3999, 4.7, 28],
        ["Anarkali Kurta Set", "Women", 2799, 4499, 4.6, 22],
        ["Silk Saree", "Women", 4999, 7999, 4.8, 12],
        ["Cropped Hoodie", "Women", 1799, 2999, 4.5, 40],
        ["A-Line Midi Dress", "Women", 2199, 3599, 4.5, 31],
        ["Wrap Dress", "Women", 2399, 3899, 4.6, 26],
        ["Cardigan Sweater", "Women", 1999, 3299, 4.4, 35],
        ["Co-ord Set", "Women", 2999, 4799, 4.6, 21],
        ["Leather Biker Jacket", "Women", 4999, 7999, 4.7, 15],
    ]),

    ...make("Electronics", "electronic", [
        // ---------- Original 20 (electronic-01 se 20) ----------
        ["Wireless Bluetooth Earbuds", "All", 1999, 3999, 4.4, 80],
        ["Smart Watch Pro", "All", 3999, 7999, 4.5, 50],
        ["Bluetooth Speaker", "All", 2499, 4499, 4.6, 60],
        ["Power Bank 20000mAh", "All", 1799, 2999, 4.5, 75],
        ["Wireless Mouse", "All", 699, 1299, 4.3, 120],
        ["Mechanical Keyboard", "All", 3299, 5499, 4.6, 40],
        ["Noise Cancelling Headphones", "All", 5999, 9999, 4.7, 30],
        ["Fast Charger 65W", "All", 1299, 2199, 4.4, 90],
        ["Laptop Stand", "All", 999, 1799, 4.3, 65],
        ["Webcam Full HD", "All", 2199, 3699, 4.2, 45],
        ["Gaming Mouse Pad", "All", 499, 899, 4.4, 100],
        ["USB-C Hub 7-in-1", "All", 1899, 3299, 4.5, 55],
        ["Smart LED Bulb", "All", 599, 999, 4.3, 140],
        ["Portable SSD 512GB", "All", 4999, 7999, 4.7, 35],
        ["Fitness Band", "All", 1999, 3499, 4.3, 70],
        ["Action Camera 4K", "All", 6499, 10999, 4.4, 25],
        ["Tablet 10 inch", "All", 14999, 19999, 4.5, 20],
        ["Wireless Charger Pad", "All", 1199, 1999, 4.2, 58],
        ["Neckband Earphones", "All", 999, 1799, 4.3, 85],
        ["Ring Light with Tripod", "All", 1499, 2599, 4.4, 48],

        // ---------- Watches (electronic-21 se 28) ----------
        ["Smart Watch Ultra", "All", 4999, 8999, 4.6, 40],
        ["Sports Smart Watch", "All", 2999, 5499, 4.4, 55],
        ["Classic Analog Watch", "All", 1999, 3999, 4.5, 60],
        ["Luxury Chronograph Watch", "All", 6999, 11999, 4.7, 20],
        ["Rose Gold Smart Watch", "All", 3499, 5999, 4.5, 35],
        ["Digital Sports Watch", "All", 1299, 2299, 4.3, 70],
        ["Rugged Outdoor Watch", "All", 3999, 6999, 4.6, 28],
        ["Slim Fitness Band", "All", 1499, 2499, 4.2, 80],

        // ---------- Smartphones (29 se 34) ----------
        ["Budget Smartphone 64GB", "All", 7999, 10999, 4.1, 60],
        ["5G Smartphone 128GB", "All", 12999, 17999, 4.4, 45],
        ["Flagship 5G Smartphone", "All", 29999, 39999, 4.7, 18],
        ["Gaming Smartphone 8GB", "All", 19999, 26999, 4.5, 25],
        ["Slim Smartphone 6GB", "All", 9999, 13999, 4.2, 50],
        ["Rugged Smartphone", "All", 11999, 15999, 4.3, 22],

        // ---------- Laptop, monitor, tablet (35 se 40) ----------
        ["Laptop 15 inch", "All", 45999, 59999, 4.5, 15],
        ["Student Laptop 14 inch", "All", 32999, 42999, 4.3, 20],
        ["Gaming Laptop", "All", 69999, 89999, 4.6, 10],
        ["Ultrabook Laptop", "All", 54999, 69999, 4.6, 12],
        ["LED Monitor 24 inch", "All", 8999, 13999, 4.4, 30],
        ["Kids Learning Tablet", "All", 5999, 8999, 4.2, 38],

        // ---------- Audio (41 se 46) ----------
        ["True Wireless Earbuds Pro", "All", 2499, 4999, 4.5, 90],
        ["Over-Ear Headphones", "All", 2999, 5499, 4.4, 45],
        ["Gaming Headphones", "All", 1999, 3499, 4.3, 55],
        ["Mini Bluetooth Speaker", "All", 999, 1999, 4.2, 100],
        ["Party Speaker 40W", "All", 5999, 9999, 4.6, 24],
        ["Wired Earphones with Mic", "All", 499, 999, 4.0, 150],

        // ---------- Camera (47 se 49) ----------
        ["Dash Camera Full HD", "All", 3499, 5999, 4.3, 30],
        ["Wi-Fi Security Camera", "All", 1999, 3499, 4.4, 60],
        ["Webcam 2K Streaming", "All", 2799, 4499, 4.3, 40],

        // ---------- Power (50 se 52) ----------
        ["Power Bank 10000mAh", "All", 1199, 1999, 4.4, 110],
        ["Fast Wall Charger 33W", "All", 799, 1499, 4.3, 120],
        ["Car Charger Dual USB", "All", 599, 999, 4.1, 90],

        // ---------- Storage (53 se 55) ----------
        ["Pen Drive 64GB", "All", 499, 899, 4.2, 200],
        ["Portable Hard Disk 1TB", "All", 3999, 5999, 4.5, 35],
        ["SSD 1TB Internal", "All", 5499, 8999, 4.7, 28],

        // ---------- Smart bulbs (56 se 58) ----------
        ["RGB Smart Bulb", "All", 699, 1299, 4.3, 130],
        ["Wi-Fi Smart Bulb 12W", "All", 599, 1099, 4.2, 140],
        ["Rechargeable Emergency Bulb", "All", 349, 699, 4.1, 160],

        // ---------- Accessories (59 se 60) ----------
        ["Gaming Mouse", "All", 999, 1499, 4.3, 75],
        ["Wireless Keyboard Mouse Combo", "All", 1299, 2199, 4.2, 65],
    ]),
];

// id 1 se 140 tak automatic (80 clothing + 60 electronics)
const products = all.map((p, i) => ({ id: i + 1, ...p }));

export default products;