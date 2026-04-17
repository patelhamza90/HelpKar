import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../components/user/UserProfile";
import "../styles/User.css";
import { handleError, handleSuccess } from "../utils/utils";
import axios from "axios";
const BASE_URL = "https://helpkar.onrender.com";

const User = () => {

  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");

  const [bookingData, setBookingData] = useState([]);

  const [reviewOpen, setReviewOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  const [userData, setUserData] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    profileImage: null,
    address: ""
  });

  const fetchData = async () => {
    try {

      const url = `${BASE_URL}/api/user/user-profile`;

      const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })

      setUserData(data.response);

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  }

  const fetchService = async () => {
    try {
      const url = `${BASE_URL}/api/booking/service-for-user`;

      const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })

      if (!data.success) {
        return `<h2>${data.message}</h2>`
      }

      setBookingData(data.response);

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  }


  useEffect(() => {
    const name = localStorage.getItem("userName") || "Customer";
    setUserName(name);
    fetchData();
    fetchService();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="simple-box">
            <h2>Welcome back, {userData.name}!</h2>
            <p>Looking for a service? Search from our top-rated professionals.</p>
            <button className="accept" style={{ marginTop: "15px" }} onClick={() => navigate("/Services")}>Find Services</button>
          </div>
        );
      case "profile":
        return <UserProfile userData={userData} setUserData={setUserData} />;
      case "bookings":
        return (
          <div className="user-bookings-container">

            <h2 className="user-bookings-title">Active Bookings</h2>

            <div className="user-bookings-grid">

              {bookingData.length > 0 ? (
                bookingData.map((b) => (

                  <div className="booking-card" key={b._id}>

                    <img
                      className="booking-icon"
                      src={b.serviceId?.icon?.fileUrl || "/default.png"}
                      alt="service"
                    />

                    <div className="booking-info">

                      <p className="booking-service">
                        {b.workerId?.service || "N/A"}
                      </p>

                      <h3 className="booking-title">
                        {b.serviceId?.title || "N/A"}
                      </h3>

                      <p className="booking-meta">
                        Worker : <span>{b.workerId?.fullName || "N/A"}</span>
                      </p>

                      <p className="booking-meta">
                        Status : <span className={`status-${b.status}`}>
                          {b.status}
                        </span>
                      </p>

                      <p className="booking-price">
                        ₹ {b.serviceId?.price || 0}
                      </p>

                      {b.status === "completed" && (b.rating === 0 || b.rating === undefined) && (
                        <button
                          className="review-btn"
                          onClick={() => {
                            setSelectedBooking(b._id);
                            setReviewOpen(true);
                          }}
                        >
                          Add Review
                        </button>
                      )}

                    </div>

                  </div>

                ))
              ) : (
                <p>No bookings found</p>
              )}

            </div>

          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="USR-worker-wrapper">
      <div className="worker-sidebar">
        <div className="menu-section">
          <ul>
            <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Home</li>
            <li className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>My Bookings</li>
            <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Profile & Stats</li>
          </ul>
        </div>
        <div className="worker-profile-box">
          <div className="worker-avatar">
            {userData.profileImage?.fileUrl ? (
              <img
                src={userData.profileImage.fileUrl}
                alt="profile"
                style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              userData.name?.charAt(0)?.toUpperCase()
            )}
          </div>
          <div>
            <p className="worker-name">{userData.name}</p>
            <button className="logout-btn1" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="worker-main">
        <h1 className="title">User Panel</h1>
        {renderContent()}
      </div>

      {reviewOpen && (

        <div className="review-overlay">

          <div className="review-box">

            <h3>Add Review</h3>

            <select
              className="wrktbl-filter"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="">Select Rating</option>
              <option value="1">1 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="5">5 ⭐</option>
            </select>

            <textarea
              placeholder="Write review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

              <button
                className="accept"
                onClick={async () => {
                  try {
                    const url = `${BASE_URL}/api/booking/add-review`;

                    const { data } = await axios.put(url, {
                      bookingId: selectedBooking,
                      rating,
                      review
                    }, {
                      headers: { Authorization: `Bearer ${token}` }
                    })

                    if (!data.success) {
                      return handleError(data.message)
                    }

                    handleSuccess(data.message)

                    setReviewOpen(false)
                    setRating(0)
                    setReview("")

                    fetchService()
                  } catch (err) {
                    handleError(err.response?.data?.message || err.message);
                  }
                }}
              >
                Submit
              </button>

              <button
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  setReviewOpen(false)
                  setRating(0)
                  setReview("")
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default User;