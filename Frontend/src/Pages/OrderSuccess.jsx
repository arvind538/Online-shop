import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order; // Checkout se bheja gaya order data

    if (!order) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 mb-4">Koi order details nahi mili.</p>
                <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-6 py-2 rounded">
                    Home jayein
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 py-12">
            <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 text-center">

                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <FaCheckCircle className="text-green-500 text-5xl" />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Order Successfully Placed!</h1>
                <p className="text-gray-500 text-sm mb-6">Aapka Cash on Delivery (COD) order confirm ho gaya hai.</p>

                {/* Order Meta Info */}
                <div className="bg-gray-50 p-4 rounded-xl text-left mb-6 flex flex-col md:flex-row justify-between text-sm">
                    <div>
                        <p className="text-gray-500">Order ID:</p>
                        <p className="font-semibold text-black">{order._id}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                        <p className="text-gray-500">Payment Method:</p>
                        <p className="font-semibold text-orange-500">{order.paymentMethod}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                        <p className="text-gray-500">Total Amount:</p>
                        <p className="font-semibold text-black">₹{order.totalPrice}</p>
                    </div>
                </div>

                {/* Selected Items List */}
                <div className="text-left mb-8">
                    <h3 className="font-bold text-gray-800 mb-3 text-base border-b pb-2">Aapne kya-kya select kiya hai (Items):</h3>
                    <div className="space-y-3">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 bg-white border p-3 rounded-xl shadow-xs">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 text-sm md:text-base">{item.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Quantity: <span className="font-bold text-black">{item.qty}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800 text-sm md:text-base">₹{item.price * item.qty}</p>
                                    <p className="text-xs text-gray-400">(₹{item.price} each)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/myorders')}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                        View All Orders
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccess;