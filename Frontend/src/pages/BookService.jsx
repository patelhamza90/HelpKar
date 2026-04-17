import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/BookService.css";
import { handleError, handleSuccess } from "../utils/utils";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faStar } from "@fortawesome/free-solid-svg-icons";
const BASE_URL = "https://helpkar.onrender.com";

const BookService = () => {

    const navigate = useNavigate();
    const { serviceId } = useParams();

    const token = localStorage.getItem("userToken");

    const [editUser, setEditUser] = useState(false);

    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const [service, setService] = useState({
        workerName: "",
        service: "",
        address: "",
        price: 0
    });

    const [order, setOrder] = useState({
        date: "",
        time: ""
    });

    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleOrderChange = (e) => {
        setOrder({
            ...order,
            [e.target.name]: e.target.value
        });
    };

    const fetchData = async () => {

        try {

            const [servicesRes, userRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/booking/list-service/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${BASE_URL}/api/booking/list/user-data`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
            ]);

            if (!servicesRes.data.success || !userRes.data.success) {
                return handleError(servicesRes.data.message || userRes.data.message);
            }

            setService(servicesRes.data.response[0]);
            setUserDetails(userRes.data.response);
            console.log(userRes.data.response);

        } catch (error) {
            handleError(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePay = async () => {

        if (
            !userDetails.name ||
            !userDetails.email ||
            !userDetails.phone ||
            !userDetails.address
        ) {
            handleError("Please fill user details");
            return;
        }

        if (!order.date || !order.time) {
            handleError("Please select date and time");
            return;
        }


        try {

            const url = `${BASE_URL}/api/booking/create`;


            const { data } = await axios.post(url, {
                serviceId,
                workerId: service.workerId,
                price: service.price,
                address: userDetails.address,
                bookingDate: order.date,
                bookingTime: order.time
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })



            if (!data.success) {
                handleError(data.message);
            }

            setTimeout(() => {
                handleSuccess(data.message);
                navigate('/user-dashboard');
            }, 1000);

        } catch (error) {
            handleError(error.message);
        }

        /* navigate(`/payment/${serviceId}`); */

    };

    return (

        <div className="book-wrapper">

            <div className="book-container">

                {/* LEFT SIDE */}

                <div className="book-left">

                    <h4 className="wd">Service Details</h4>
                    <div className="card">

                        <h2>{service.service}</h2>
                        <hr />

                        <p><strong>Worker :</strong> {service.workerName}</p>
                        <p><strong>City :</strong> {service.address}</p>
                        <p><strong>Rating :</strong> {service.rating}★</p>

                    </div>

                    <div className="user-header">

                        <h4>User Details</h4>

                    </div>

                    <div className="card">

                        <span
                            className="editIcon"
                            onClick={() => setEditUser(!editUser)}
                        >
                            <FontAwesomeIcon icon={faPen} />
                        </span>

                        {editUser ? (

                            <div className="user-form">

                                <input
                                    type="text"
                                    name="name"
                                    value={userDetails.name || ""}
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                />

                                <input
                                    type="email"
                                    name="email"
                                    value={userDetails.email || ""}
                                    placeholder="Email"
                                    onChange={handleChange}
                                />

                                <input
                                    type="text"
                                    name="phone"
                                    value={userDetails.phone || ""}
                                    placeholder="Phone"
                                    onChange={handleChange}
                                />

                                <textarea
                                    name="address"
                                    value={userDetails.address || ""}
                                    placeholder="Address"
                                    onChange={handleChange}
                                />

                            </div>

                        ) : (

                            <div className="user-view">

                                <p><strong>Name :</strong> {userDetails.name || "Not provided"}</p>
                                <p><strong>Email :</strong> {userDetails.email || "Not provided"}</p>
                                <p><strong>Phone :</strong> {userDetails.phone || "Not provided"}</p>
                                <p><strong>Address :</strong> {userDetails.address || "Not provided"}</p>

                            </div>

                        )}

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="book-right">

                    <h4>Order Details</h4>

                    <div className="order-card">

                        <label>Select Date</label>

                        <input
                            type="date"
                            name="date"
                            value={order.date}
                            onChange={handleOrderChange}
                        />

                        <label>Select Time</label>

                        <input
                            type="time"
                            name="time"
                            value={order.time}
                            onChange={handleOrderChange}
                        />

                        <div className="price">

                            <span>Total Price</span>

                            <strong>₹{service.price}</strong>

                        </div>

                        <button
                            className="continue-btn"
                            onClick={handlePay}
                        >
                            Continue →
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default BookService;