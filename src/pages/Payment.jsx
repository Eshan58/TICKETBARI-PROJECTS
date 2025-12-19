import React, { useState, useEffect } from 'react';
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
  FaEnvelope,
  FaCalendarAlt,
  FaTicketAlt,
  FaClock
} from 'react-icons/fa';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("bkash");
    const [processingPayment, setProcessingPayment] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [paymentStep, setPaymentStep] = useState(1); // 1: Select method, 2: Enter details
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    
    // Default booking data
    const defaultBooking = {
        _id: '1',
        bookingReference: 'TB-1765726189204-ZZEGL3RW5',
        ticketTitle: 'Flight to Chittagong',
        totalPrice: 4500.00,
        quantity: 1,
        status: 'confirmed',
        createdAt: '2025-12-14T21:29:00Z',
        ticketId: {
            departureAt: '2025-12-15T00:00:00Z',
            from: 'Dhaka',
            to: 'Chittagong',
            airline: 'Bangladesh Airlines',
            flightNo: 'BG-203'
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

    useEffect(() => {
        // If no booking data, redirect to dashboard
        if (!location.state?.booking) {
            navigate('/dashboard');
        }
    }, [location.state, navigate]);

    const handlePayment = async () => {
        if (paymentStep === 1) {
            setPaymentStep(2);
            return;
        }

        if (!transactionId.trim()) {
            setPaymentError("Please enter your transaction ID");
            return;
        }

        if (transactionId.length < 8) {
            setPaymentError("Transaction ID must be at least 8 characters");
            return;
        }

        setProcessingPayment(true);
        setPaymentError("");
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Simulate successful payment
            const paymentData = {
                bookingId: booking._id,
                transactionId: transactionId,
                paymentMethod: paymentMethod,
                amount: booking.totalPrice,
                timestamp: new Date().toISOString(),
                status: 'success'
            };
            
            // Save payment to localStorage (for demo)
            const existingPayments = JSON.parse(localStorage.getItem('ticketbar_payments') || '[]');
            existingPayments.push(paymentData);
            localStorage.setItem('ticketbar_payments', JSON.stringify(existingPayments));
            
            // Update booking status in localStorage (for demo)
            const existingBookings = JSON.parse(localStorage.getItem('ticketbar_bookings') || '[]');
            const updatedBookings = existingBookings.map(b => 
                b._id === booking._id 
                    ? { ...b, status: 'paid', paymentMethod: paymentMethod, paidAt: new Date().toISOString() }
                    : b
            );
            localStorage.setItem('ticketbar_bookings', JSON.stringify(updatedBookings));
            
            // Show success
            setPaymentSuccess(true);
            
            // Auto redirect to MyBookings after 3 seconds
            setTimeout(() => {
                navigate('/my-bookings', { 
                    state: { 
                        paymentSuccess: true,
                        bookingReference: booking.bookingReference,
                        transactionId: transactionId,
                        amount: booking.totalPrice
                    } 
                });
            }, 3000);
            
        } catch (error) {
            setPaymentError("Payment failed. Please try again.");
            console.error("Payment error:", error);
        } finally {
            setProcessingPayment(false);
        }
    };

    const getPaymentIcon = (method) => {
        switch(method) {
            case 'bkash': return <span className="text-3xl font-bold text-pink-600">B</span>;
            case 'nagad': return <span className="text-3xl font-bold text-green-600">N</span>;
            case 'rocket': return <span className="text-3xl font-bold text-purple-600">R</span>;
            case 'card': return <FaCreditCard className="text-3xl text-blue-600" />;
            default: return <FaMobileAlt className="text-3xl text-gray-600" />;
        }
    };

    const getPaymentInstructions = (method) => {
        const instructions = {
            bkash: [
                "Dial *247# from your mobile",
                "Select 'Send Money'",
                "Enter merchant number: 017XXXXXXXX",
                `Enter amount: ${booking.totalPrice.toFixed(2)} Tk`,
                "Enter your PIN",
                `Enter reference: ${booking.bookingReference.slice(-8)}`
            ],
            nagad: [
                "Open Nagad app",
                "Tap on 'Send Money'",
                "Enter merchant number: 017XXXXXXXX",
                `Enter amount: ${booking.totalPrice.toFixed(2)} Tk`,
                "Enter your PIN",
                `Enter reference: ${booking.bookingReference.slice(-8)}`
            ],
            rocket: [
                "Dial *322# from your mobile",
                "Select 'Send Money'",
                "Enter merchant number: 017XXXXXXXX",
                `Enter amount: ${booking.totalPrice.toFixed(2)} Tk`,
                "Enter your PIN",
                `Enter reference: ${booking.bookingReference.slice(-8)}`
            ],
            card: [
                "Enter your card details securely",
                "Card number, expiry date, and CVV",
                `Amount: ${booking.totalPrice.toFixed(2)} Tk`,
                "Click 'Pay Now' to complete",
                "3D Secure verification",
                "Payment confirmation"
            ]
        };
        
        return instructions[method] || instructions.bkash;
    };

    const handleBack = () => {
        if (paymentStep === 2) {
            setPaymentStep(1);
            setPaymentError("");
        } else {
            navigate(-1);
        }
    };

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                    <div className="p-12 text-center">
                        <div className="relative inline-block mb-8">
                            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <FaCheckCircle className="text-white text-6xl" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                                <span className="text-2xl">🎉</span>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Your payment has been processed successfully.
                        </p>
                        
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-left">
                                        <p className="text-sm text-gray-500">Booking Reference</p>
                                        <p className="text-lg font-bold text-gray-900">{booking.bookingReference}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Amount Paid</p>
                                        <p className="text-2xl font-bold text-green-600 flex items-center">
                                            <TbCurrencyTaka className="mr-1" />
                                            {booking.totalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <div className="text-left">
                                        <p className="text-sm text-gray-500">Transaction ID</p>
                                        <p className="font-mono font-semibold text-gray-900">{transactionId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Payment Method</p>
                                        <p className="font-semibold capitalize text-gray-900">{paymentMethod}</p>
                                    </div>
                                </div>
                                
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="font-semibold text-green-600">Confirmed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <FaTicketAlt />
                                    View My Bookings
                                </span>
                            </button>
                            
                            <p className="text-gray-500 text-sm mt-4">
                                Redirecting to My Bookings in 3 seconds...
                            </p>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div className="bg-green-600 h-2 rounded-full animate-[progress_3s_ease-in-out]"></div>
                            </div>
                        </div>
                        
                        <p className="text-gray-500 mt-8 text-sm">
                            A confirmation email has been sent to {user.email}
                        </p>
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
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        {paymentStep === 1 ? 'Back to Dashboard' : 'Back to Payment Methods'}
                    </button>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                TicketBar
                            </span>
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
                                    <span className="font-medium">Booking:</span> {booking.bookingReference}
                                </p>
                                {booking.ticketId?.departureAt && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <TbPlaneDeparture />
                                        <span>
                                            Departure: {new Date(booking.ticketId.departureAt).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-bold flex items-center justify-end">
                                    <TbCurrencyTaka className="mr-2" />
                                    {booking.totalPrice.toFixed(2)}
                                </p>
                                <p className="text-blue-200 mt-1">Total Amount to Pay</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Payment Progress */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`flex items-center gap-2 ${paymentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                        1
                                    </div>
                                    <span className="font-semibold">Select Method</span>
                                </div>
                                
                                <div className="flex-1 h-1 mx-4 bg-gray-200">
                                    <div className={`h-full transition-all duration-300 ${paymentStep >= 2 ? 'bg-blue-600' : ''}`}></div>
                                </div>
                                
                                <div className={`flex items-center gap-2 ${paymentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                        2
                                    </div>
                                    <span className="font-semibold">Enter Details</span>
                                </div>
                            </div>
                        </div>

                        {paymentStep === 1 ? (
                            /* Step 1: Payment Method Selection */
                            <div className="space-y-8">
                                <div>
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
                                                    {getPaymentIcon(method.id)}
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
                                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaShieldAlt className="text-blue-500" />
                                        How to Pay with {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {getPaymentInstructions(paymentMethod).map((instruction, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-sm font-bold">{index + 1}</span>
                                                </div>
                                                <p className="text-gray-700 pt-1">{instruction}</p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <p className="text-sm text-yellow-800">
                                            <span className="font-semibold">Important:</span> 
                                            Please use the reference <span className="font-mono font-bold">{booking.bookingReference.slice(-8)}</span> 
                                            when making the payment.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Step 2: Transaction Details */
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Enter Payment Details</h3>
                                    
                                    <div className="mb-8">
                                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                                            Transaction ID / Reference Number
                                        </label>
                                        <input
                                            type="text"
                                            value={transactionId}
                                            onChange={(e) => {
                                                setTransactionId(e.target.value);
                                                setPaymentError("");
                                            }}
                                            placeholder="Enter the transaction ID you received"
                                            className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-lg ${
                                                paymentError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                        />
                                        {paymentError && (
                                            <p className="text-red-500 text-sm mt-2">{paymentError}</p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-2">
                                            Enter the exact transaction ID you received after completing the payment.
                                        </p>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Payment Summary</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Selected Method</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                                        {getPaymentIcon(paymentMethod)}
                                                    </div>
                                                    <span className="font-semibold capitalize">{paymentMethod}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Amount to Pay</span>
                                                <span className="text-xl font-bold text-gray-900 flex items-center">
                                                    <TbCurrencyTaka className="mr-1" />
                                                    {booking.totalPrice.toFixed(2)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Booking Reference</span>
                                                <span className="font-mono font-semibold">{booking.bookingReference}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Information */}
                                <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaUser className="text-blue-500" />
                                        Billing Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {user.displayName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.displayName}</p>
                                                <p className="text-gray-600">{user.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500">Contact Email</p>
                                                <p className="font-medium">{user.email}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500">Contact Phone</p>
                                                <p className="font-medium">{user.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-12 flex gap-4">
                            <button
                                onClick={handleBack}
                                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                                disabled={processingPayment}
                            >
                                <FaArrowLeft />
                                {paymentStep === 1 ? 'Cancel' : 'Back'}
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={processingPayment || (paymentStep === 2 && !transactionId.trim())}
                                className={`flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 ${
                                    processingPayment || (paymentStep === 2 && !transactionId.trim()) ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {processingPayment ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        Processing Payment...
                                    </>
                                ) : paymentStep === 1 ? (
                                    <>
                                        Continue with {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
                                        <FaArrowLeft className="rotate-180" />
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle />
                                        Confirm Payment
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {/* Security Info */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <FaLock className="text-green-500 text-xl" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Secure Payment</p>
                                        <p className="text-sm text-gray-500">256-bit SSL encryption</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <FaShieldAlt className="text-blue-500" />
                                        <span>PCI DSS Compliant</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMobileAlt className="text-green-500" />
                                        <span>Mobile Friendly</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Support Info */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-sm text-blue-800">
                                <span className="font-semibold">Need help?</span> 
                                Contact our support team at <span className="font-medium">support@ticketbar.com</span> 
                                or call <span className="font-medium">+880 9610-123456</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;