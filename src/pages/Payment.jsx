import React, { useState } from 'react';
import { TbCurrencyTaka, TbPlaneDeparture } from "react-icons/tb";
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaShieldAlt, 
  FaMobileAlt,
  FaCreditCard,
  FaLock,
  FaUser,
  FaCalendarAlt
} from 'react-icons/fa';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("bkash");
    const [processingPayment, setProcessingPayment] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
    // Default booking data
    const defaultBooking = {
        _id: '1',
        bookingReference: 'TB-1765726189204-ZZEGL3RW5',
        ticketTitle: 'Flight to Chittagong',
        totalPrice: 4500.00,
        quantity: 1,
        status: 'confirmed',
        ticketId: {
            departureAt: '2025-12-15T00:00:00Z',
        }
    };

    // Default user data
    const defaultUser = {
        displayName: 'Eshan Islam',
        email: 'Islameshaw451@gmail.com',
        phone: '+88017XXXXXXXX'
    };

    const booking = location.state?.booking || defaultBooking;
    const user = location.state?.user || defaultUser;

    const handlePayment = async () => {
        if (!transactionId.trim()) {
            alert("Please enter your transaction ID");
            return;
        }

        setProcessingPayment(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success
            setPaymentSuccess(true);
            
            // Auto redirect after 2 seconds
            setTimeout(() => {
                navigate('/dashboard', { 
                    state: { 
                        paymentSuccess: true,
                        bookingReference: booking.bookingReference 
                    } 
                });
            }, 2000);
            
        } catch (error) {
            alert("Payment failed. Please try again.");
            console.error("Payment error:", error);
        } finally {
            setProcessingPayment(false);
        }
    };

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                    <div className="p-12 text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <FaCheckCircle className="text-white text-6xl" />
                        </div>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                        <p className="text-gray-600 mb-8">
                            Your booking <span className="font-semibold text-blue-600">{booking.bookingReference}</span> has been confirmed.
                        </p>
                        
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-left">
                                    <p className="text-sm text-gray-500">Amount Paid</p>
                                    <p className="text-2xl font-bold text-green-600 flex items-center">
                                        <TbCurrencyTaka className="mr-1" />
                                        {booking.totalPrice.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            TicketBar
                        </h1>
                        <p className="text-gray-600 text-lg">Travel with Confidence</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Top Section - Booking Info */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">{booking.ticketTitle}</h2>
                                <p className="text-blue-100 mt-2">
                                    Booking: {booking.bookingReference}
                                </p>
                                {booking.ticketId?.departureAt && (
                                    <p className="text-blue-100 mt-1 flex items-center gap-2">
                                        <FaCalendarAlt />
                                        Departure: {new Date(booking.ticketId.departureAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-bold flex items-center justify-end">
                                    <TbCurrencyTaka className="mr-2" />
                                    {booking.totalPrice.toFixed(2)}
                                </p>
                                <p className="text-blue-200 mt-1">Total Amount</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Payment Method Selection */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h3>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { id: 'bkash', label: 'Bkash', color: 'from-pink-500 to-pink-600' },
                                    { id: 'nagad', label: 'Nagad', color: 'from-green-500 to-green-600' },
                                    { id: 'rocket', label: 'Rocket', color: 'from-purple-500 to-purple-600' },
                                    { id: 'card', label: 'Card', color: 'from-blue-500 to-blue-600' }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                                            paymentMethod === method.id
                                                ? 'border-blue-500 shadow-lg transform scale-[1.02]'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                                            {method.id === 'bkash' && <span className="text-3xl font-bold text-white">B</span>}
                                            {method.id === 'nagad' && <span className="text-3xl font-bold text-white">N</span>}
                                            {method.id === 'rocket' && <span className="text-3xl font-bold text-white">R</span>}
                                            {method.id === 'card' && <FaCreditCard className="text-white text-3xl" />}
                                        </div>
                                        <span className="text-lg font-semibold text-gray-900">{method.label}</span>
                                        <div className="mt-3">
                                            <div className={`w-6 h-6 border-2 rounded-full mx-auto flex items-center justify-center ${
                                                paymentMethod === method.id 
                                                    ? 'border-blue-500 bg-blue-500' 
                                                    : 'border-gray-300'
                                            }`}>
                                                {paymentMethod === method.id && (
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FaShieldAlt className="text-blue-500" />
                                Payment Instructions
                            </h3>
                            
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">1</span>
                                    </div>
                                    <p className="text-gray-700 pt-1">Go to your {paymentMethod} app</p>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">2</span>
                                    </div>
                                    <p className="text-gray-700 pt-1">
                                        Send <span className="font-bold">{booking.totalPrice.toFixed(2)} Tk</span> to <span className="font-bold">017XXXXXXXX</span>
                                    </p>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">3</span>
                                    </div>
                                    <p className="text-gray-700 pt-1">Enter transaction ID after payment</p>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-bold">4</span>
                                    </div>
                                    <p className="text-gray-700 pt-1">Booking will be confirmed automatically</p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction ID Input */}
                        <div className="mb-8">
                            <label className="block text-lg font-semibold text-gray-900 mb-4">
                                Enter Transaction ID
                            </label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter your transaction ID here"
                                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-lg"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Enter the transaction ID you received after payment
                            </p>
                        </div>

                        {/* User Info */}
                        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FaUser className="text-blue-500" />
                                Bill To
                            </h3>
                            <div className="space-y-2">
                                <p className="text-gray-900 font-bold text-lg">{user.displayName}</p>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                            >
                                <FaArrowLeft />
                                Cancel
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={processingPayment || !transactionId.trim()}
                                className={`flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 ${
                                    processingPayment || !transactionId.trim() ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {processingPayment ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle />
                                        Confirm Payment
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <FaLock className="text-green-500" />
                                <span>Your payment is secured with 256-bit SSL encryption</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;