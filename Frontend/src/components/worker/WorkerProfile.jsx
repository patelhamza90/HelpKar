import React, { useEffect, useState } from "react";
import "../../styles/WorkerProfile.css";
import axios from "axios";
import { handleError, handleSuccess } from "../../utils/utils";

const BASE_URL = import.meta.env.VITE_API_URL;

const WorkerProfile = ({ user }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        gender: "",
        address: "",
        phone: "",
        availability: "Offline",
        isActive: false
    });
    useEffect(() => {
        if (user?.worker) {
            setProfileData({
                fullName: user.worker.fullName,
                email: user.worker.email,
                gender: user.worker.gender,
                address: user.worker.address,
                phone: user.worker.phone,
                availability: user.worker.isActive ? "Active" : "Offline",
            })
        }
    }, [user])
    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {

        try {
            const url = `${BASE_URL}/api/worker/worker-profile-update`;

            const token = localStorage.getItem("workerToken");

            const updatePayload = {
                fullName: profileData.fullName,
                gender: profileData.gender,
                address: profileData.address,
                isActive: profileData.isActive
            };

            const { data } = await axios.put(url, updatePayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const { message, success, error } = data;

            if (success) {
                handleSuccess(message);
                setIsEditing(false);
            } else {
                handleError(error?.message || "Something went wrong");
            }

        } catch (err) {
            handleError(err.response?.data?.message || err.message);
        }

    };

    return (
        <div className="simple-box profile-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h2 style={{ margin: 0 }}>Worker Profile</h2>
                <button className="accept" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                    {isEditing ? "Save Profile" : "Edit Profile"}
                </button>
            </div>

            <div className="profile-fields">

                {/* Full Name */}
                <div className="profile-row">
                    <label className="profile-label">Full Name:</label>
                    <div className="profile-value">
                        {isEditing ? (
                            <input
                                className="profile-input"
                                type="text"
                                name="fullName"
                                value={profileData.fullName}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{profileData.fullName}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="profile-row">
                    <label className="profile-label">Email Address:</label>
                    <div className="profile-value">
                        {isEditing ? (
                            <input
                                className="profile-input disabled-input"
                                type="email"
                                value={profileData.email}
                                disabled
                            />
                        ) : (
                            <p>{profileData.email}</p>
                        )}
                    </div>
                </div>

                {/* Gender */}
                <div className="profile-row">
                    <label className="profile-label">Gender:</label>
                    <div className="profile-value">
                        {isEditing ? (
                            <select
                                className="profile-input"
                                name="gender"
                                value={profileData.gender}
                                onChange={handleChange}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <p>{profileData.gender}</p>
                        )}
                    </div>
                </div>

                {/* Phone */}
                <div className="profile-row">
                    <label className="profile-label">Phone Number:</label>
                    <div className="profile-value">
                        {isEditing ? (
                            <input
                                className="profile-input disabled-input"
                                type="text"
                                value={profileData.phone}
                                disabled
                            />
                        ) : (
                            <p>{profileData.phone}</p>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div className="profile-row">
                    <label className="profile-label">Address:</label>
                    <div className="profile-value">
                        {isEditing ? (
                            <textarea
                                className="profile-input profile-textarea"
                                name="address"
                                value={profileData.address}
                                onChange={handleChange}
                            />
                        ) : (
                            <p>{profileData.address}</p>
                        )}
                    </div>
                </div>

                {/* Availability */}
                <div className="profile-row">
                    <label className="profile-label">Availability:</label>
                    <div className="profile-value">
                        {isEditing ? (
                            <select
                                className="profile-input"
                                value={profileData.isActive}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        isActive: e.target.value === "true"
                                    })
                                }
                            >
                                <option value="true">Active</option>
                                <option value="false">Offline</option>
                            </select>
                        ) : (
                            <p className="availability-display">
                                <span className={`status-dot ${profileData.availability.toLowerCase()}`}></span>
                                {profileData.availability}
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WorkerProfile;