import React, { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../../utils/utils";
import axios from "axios";
import "../../styles/UserProfile.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const UserProfile = ({ userData, setUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [frmData, setFrmData] = useState(userData);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0
  });

  const token = localStorage.getItem("userToken");

  const handleChange = (e) => {
    setFrmData({
      ...frmData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {

      const formData = new FormData();

      if (frmData.name && frmData.name.trim() !== "")
        formData.append("name", frmData.name.trim());

      if (frmData.phone && frmData.phone.trim() !== "")
        formData.append("phone", frmData.phone.trim());

      if (frmData.email && frmData.email.trim() !== "")
        formData.append("email", frmData.email.trim());

      if (frmData.gender && frmData.gender.trim() !== "")
        formData.append("gender", frmData.gender.trim());

      if (frmData.address && frmData.address.trim() !== "")
        formData.append("address", frmData.address.trim());

      if (frmData.profileImage instanceof File)
        formData.append("profileImage", frmData.profileImage);

      const url = `${BASE_URL}/api/user/user-profile/update`;

      const { data } = await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!data.success) {
        return handleError(error.response?.data?.message || error.message);;
      }

      handleSuccess(data.message);
      setUserData(data.response);
      setFrmData(data.response);
      localStorage.setItem("loggedInUser", data.response.name);
      window.dispatchEvent(new Event("userUpdated"));
      setIsEditing(false);

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  const fetchStats = async () => {

    try {

      const url = `${BASE_URL}/api/booking/user-stats`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!data.success) {
        return handleError(error.response?.data?.message || error.message);
      }

      setStats(data.response);

    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }

  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="user-profile-wrapper">

      <div className="stats">
        <div className="stat-card blue">
          <h2>{stats.totalBookings}</h2>
          <span>Services Booked</span>

        </div>

        <div className="stat-card purple">
          <h2>₹{stats.totalSpent}</h2>
          <span>Total Spent</span>
        </div>
      </div>

      <div className="simple-box">

        <div className="profile-header">
          <h2>My Profile</h2>

          <button
            className="accept"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setFrmData(userData);
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>

        </div>

        <div className="profile-fields">

          <div className="profile-row">
            <label className="profile-label">Profile Photo:</label>

            <div className="profile-flex">

              {isEditing ? (
                <input
                  className="profile-input"
                  type="file"
                  onChange={(e) =>
                    setFrmData({
                      ...frmData,
                      profileImage: e.target.files[0]
                    })
                  }
                />
              ) : (
                userData?.profileImage ? (
                  <img
                    src={
                      userData.profileImage?.fileUrl ||
                      (userData.profileImage instanceof File
                        ? URL.createObjectURL(userData.profileImage)
                        : "")
                    }
                    alt="profile"
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-avatar">
                    {userData?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )
              )}

            </div>
          </div>

          <div className="profile-row">
            <label className="profile-label">Full Name:</label>

            <div className="profile-flex">
              {isEditing ? (
                <input
                  className="profile-input"
                  type="text"
                  name="name"
                  value={frmData?.name || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{userData?.name || "N/A"}</p>
              )}
            </div>
          </div>

          <div className="profile-row">
            <label className="profile-label">Phone:</label>

            <div className="profile-flex">
              {isEditing ? (
                <input
                  className="profile-input"
                  type="number"
                  name="phone"
                  value={frmData?.phone || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{userData?.phone || "9123456780"}</p>
              )}
            </div>
          </div>

          <div className="profile-row">
            <label className="profile-label">Email:</label>

            <div className="profile-flex">
              {isEditing ? (
                <input
                  className="profile-input"
                  type="email"
                  name="email"
                  value={frmData?.email || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{userData?.email || "user@example.com"}</p>
              )}
            </div>
          </div>

          <div className="profile-row">
            <label className="profile-label">Gender:</label>

            <div className="profile-flex">
              {isEditing ? (
                <select
                  name="gender"
                  value={frmData?.gender || ""}
                  onChange={handleChange}
                  className="profile-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p>{userData?.gender?.[0]?.toUpperCase() + userData?.gender?.slice(1) || "N/A"}</p>)}
            </div>
          </div>

          <div className="profile-row">
            <label className="profile-label">Address:</label>

            <div className="profile-flex">
              {isEditing ? (
                <textarea
                  name="address"
                  className="profile-input"
                  value={frmData?.address || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{userData?.address || "N/A"}</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserProfile;