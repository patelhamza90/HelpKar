import React, { useState } from "react";
import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError, handleSuccess } from "../../utils/utils";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = "http://localhost:8000/api/admin/signin"; 

      const { data } = await axios.post(url, form);

      const { success, message, token, role } = data;

   if (success) {

  handleSuccess(message);

  // 🔥 sirf dusre tokens clear karo
  localStorage.removeItem("userToken");
  localStorage.removeItem("workerToken");

  // ✅ admin token store karo
  localStorage.setItem("token", token);

  setTimeout(() => {
    navigate("/admin");
  }, 1000);

} else {
  handleError(message);
}

    } catch (err) {
      handleError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* LEFT PANEL */}
        <div className="login-left">
          <h1>ADMIN PANEL</h1>
          <h2>
            <span className="blue">Help</span>
            <span className="orange">Kar</span>
          </h2>
          <p className="tagline">
            Manage platform users, workers & services efficiently.
          </p>
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <h2>Admin Sign In</h2>
          <p className="sub-text">
            Login to access admin dashboard
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <input
                type="email"
                placeholder="Admin Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Login"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;