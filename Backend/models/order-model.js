const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true, default: 1 },
                image: { type: String, default: "" },
                price: { type: Number, required: true },
            },
        ],
        shippingAddress: {
            fullName: { type: String, default: "" },
            phone: { type: String, default: "" },
            address: { type: String, default: "" },
            landmark: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            postalCode: { type: String, default: "" },
            addressType: {
                type: String,
                enum: ["Home", "Work", "Other"],
                default: "Home",
            },
        },
        paymentMethod: { type: String, required: true },
        itemsPrice: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        totalPrice: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        status: { type: String, default: "Pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);



// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//     {
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User", // user-model mein mongoose.model("User", ...) hona chahiye
//             required: true,
//         },
//         orderItems: [
//             {
//                 name: { type: String, required: true },
//                 qty: { type: Number, required: true, default: 1 },
//                 image: { type: String, default: "" },
//                 price: { type: Number, required: true },
//             },
//         ],
//         shippingAddress: {
//             address: { type: String, default: "" },
//             city: { type: String, default: "" },
//             postalCode: { type: String, default: "" },
//         },
//         paymentMethod: { type: String, required: true },
//         totalPrice: { type: Number, required: true },
//         isPaid: { type: Boolean, default: false },
//         status: { type: String, default: "Pending" },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);