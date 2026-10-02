const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");

// Routers import
const authRoute = require("./Router/auth-router");
const contactRoute = require("./Router/contact-router");
const serviceRoute = require("./Router/service-router");
const adminRoute = require("./Router/admin-router");
const orderRoute = require("./Router/order-router");
const adminOrderRoute = require("./Router/admin-order-router");
const inventoryRouter = require("./Router/inventory-router");

// Middleware import
const errorMiddleware = require("./Middlewares/error-middleware");

// 1. Sabse pehle Express app ko initialize karna zaroori hai!
const app = express();

// 2. CORS Configuration
// app.use(
//     cors({
//         origin:
//             'http://localhost:5173',
//         'https://online-shop-website-lake.vercel.app'
//         methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//         credentials: true,
//     })
// );

const allowedOrigins = [
    'http://localhost:5173',
    'https://online-shop-website-lake.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Mobile apps ya curl/postman ke liye (!origin) allow karein
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS'));
        }
    },
    credentials: true, // Cookies aur auth headers bhejne ke liye zaroori hai
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 3. Express JSON body parser
app.use(express.json());

// 4. Mount Routers
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/data", serviceRoute);
app.use("/api/admin", adminRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/orders", orderRoute);
app.use("/api", inventoryRouter);




// 5. Default Route
app.use("/api/health", (req, res) => {
    res.status(200).json({ message: "success" });
});

// 6. Error Handling Middleware (Hamesha saare routes ke baad aakhri me aayega)
app.use(errorMiddleware);

const PORT = process.env.PORT || 4041;

// 7. Database Connection & Server Start
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});





// const dns = require('dns');
// dns.setServers(['8.8.8.8', '8.8.4.4']);

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./utils/db");
// const authRoute = require("./Router/auth-router");
// const contactRoute = require("./Router/contact-router");
// const serviceRoute = require("./Router/service-router");
// const adminRoute = require("./Router/admin-router");
// const orderRoute = require("./routes/order-route");
// const errorMiddleware = require("./Middlewares/error-middleware");

// const app = express();

// app.use(
//     cors({
//         origin: process.env.FRONTEND_URI,
//         methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//         credentials: true, // "withCredentials" cors option nahi hai, sahi naam "credentials" hai
//     })
// );

// app.use(express.json());

// app.use("/api/auth", authRoute);
// app.use("/api/form", contactRoute);
// app.use("/api/data", serviceRoute);
// app.use("/api/admin", adminRoute);
// app.use("/api/orders", orderRoute);

// // Catch-all route (koi bhi unmatched GET/etc request yahan aayega)
// app.use("/", (req, res) => {
//     res.status(200).json({ message: "success" });
// });

// // Error handling middleware hamesha sabse aakhri me lagta hai
// app.use(errorMiddleware);

// const PORT = process.env.PORT || 4041;

// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// });