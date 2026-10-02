const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

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

const app = express();

// CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",
    "https://online-shop-3-rali.onrender.com",


];

const corsOptions = {
    origin: function (origin, callback) {
        // Postman / curl / mobile apps ke liye (!origin) allow
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            const err = new Error("Blocked by CORS");
            err.status = 403;
            callback(err);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // preflight handle




// Body parser
app.use(express.json());

// Health check (sabse pehle, kisi middleware se block na ho)
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "success" });
});

// Routers (specific routes pehle, generic baad mein)
app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);
app.use("/api/data", serviceRoute);
app.use("/api/admin/orders", adminOrderRoute); // /api/admin se pehle
app.use("/api/admin", adminRoute);
app.use("/api/orders", orderRoute);
app.use("/api", inventoryRouter); // generic mount sabse last

// Error middleware (hamesha last mein)
app.use(errorMiddleware);

const PORT = process.env.PORT || 4041;

// DB connect + server start
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("DB connection failed:", err.message);
        process.exit(1);
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
