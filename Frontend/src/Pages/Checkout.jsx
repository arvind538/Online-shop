// src/Pages/Checkout.jsx (Jaha COD select hota hai)
import React, { useState } from 'react';
import { useAuth } from '../Store/auth';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, clearCart, token } = useAuth();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

    const handlePlaceOrder = async () => {
        // API Call to backend
        try {
            const response = await fetch('http://localhost:4041/api/orders/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // User auth token
                },
                body: JSON.stringify({
                    orderItems: cart,
                    shippingAddress: { address: "123 Main St", city: "Delhi", postalCode: "110001" }, // Form se le
                    paymentMethod: paymentMethod,
                    totalPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
                })
            });

            if (response.ok) {
                clearCart(); // Context API se cart empty karein
                navigate('/my-orders'); // Order history page par bhej dein
            }
        } catch (error) {
            console.error("Order placement failed", error);
        }
    };

    return (
        <div>
            {/* ... Your Payment Method UI ... */}
            <button onClick={handlePlaceOrder} className="bg-orange-500 text-white px-6 py-2 rounded">
                Place Order
            </button>
        </div>
    );
};

export default Checkout;