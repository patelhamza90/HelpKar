import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Payment.css";
import { handleError } from "../utils/utils";
import axios from "axios";

const Payment = () => {

    const [userDetails, setUserDetails] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [service, setService] = useState({
        workerName: "",
        service: "",
        address: "",
        price: 0
    });

    const [paymentMethod, setPaymentMethod] = useState("card");

    const [cardData, setCardData] = useState({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: ""
    });

    const { serviceId } = useParams();
    const token = localStorage.getItem("userToken");

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e) => {
        setCardData({
            ...cardData,
            [e.target.name]: e.target.value
        });
    };

    const handlePayment = () => {

        if (paymentMethod === "card") {

            if (
                !cardData.cardNumber ||
                !cardData.cardName ||
                !cardData.expiry ||
                !cardData.cvv
            ) {
                alert("Please fill card details first");
                return;
            }

        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            if (paymentMethod === "cod") {
                alert("Order placed with Cash on Delivery");
            } else {
                alert("Payment Successful");
            }

        }, 2000);
    };

    const fetchData = async () => {
        try {

            const [servicesRes, userRes] = await Promise.all([
                axios.get(`http://localhost:8000/api/booking/list-service/${serviceId}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:8000/api/booking/list/user-data", { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (!servicesRes.data.success || !userRes.data.success) {
                handleError(servicesRes.data.message || userRes.data.message);
            }

            setService(servicesRes.data.response[0]);
            setUserDetails(userRes.data.response);

        } catch (error) {
            handleError(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="payment-wrapper">

            <div className="payment-container">
                

                {/* RIGHT SIDE */}
                <div className="payment-right">

                    <h2>Payment Details</h2>

                    {/* ONLINE METHODS */}

                    <div className="payment-methods apps">

                        <button className="gpay-btn">Google Pay</button>

                        <button className="apple-btn">Apple Pay</button>

                        <button className="paypal-btn">PayPal</button>

                    </div>

                    {/* PAYMENT TYPE */}

                    <div className="payment-methods">

                        <label className="method">

                            <input
                                type="radio"
                                name="method"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />

                            Card Payment

                        </label>

                        <label className="method">

                            <input
                                type="radio"
                                name="method"
                                value="cod"
                                checked={paymentMethod === "cod"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />

                            Cash on Delivery

                        </label>

                    </div>

                    {/* CARD FORM */}

                    {paymentMethod === "card" && (

                        <div className="card-form">

                            <input
                                type="text"
                                placeholder="Card Number"
                                name="cardNumber"
                                value={cardData.cardNumber}
                                onChange={handleCardChange}
                            />

                            <input
                                type="text"
                                placeholder="Card Holder Name"
                                name="cardName"
                                value={cardData.cardName}
                                onChange={handleCardChange}
                            />

                            <div className="card-row">

                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                    name="expiry"
                                    value={cardData.expiry}
                                    onChange={handleCardChange}
                                />

                                <input
                                    type="text"
                                    placeholder="CVV"
                                    name="cvv"
                                    value={cardData.cvv}
                                    onChange={handleCardChange}
                                />

                            </div>

                        </div>

                    )}

                    <div className="total">

                        <span>Total Amount</span>

                        <strong>₹{service.price}</strong>

                    </div>

                    <button className="pay-main-btn" onClick={handlePayment}>
                        Pay ₹{service.price}
                    </button>

                </div>

                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                        <p>Processing Payment...</p>
                    </div>
                )}

            </div>

        </div>
    );
};

export default Payment;