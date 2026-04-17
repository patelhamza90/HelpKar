import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError, handleSuccess } from "../utils/utils";
const BASE_URL = "https://helpkar.onrender.com";

const Login = () => {

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
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
      setLoading(true);

    try {
      const url = `https://helpkar.onrender.com/api/auth/user/signin`;

      const { data } = await axios.post(url, form)

      const { success, message, userToken, user } = data;

      if (success) {

        handleSuccess(message);

        localStorage.removeItem("workerToken");
        localStorage.removeItem("token");

        localStorage.setItem("userToken", userToken);
        localStorage.setItem("loggedInUser", user.name);

        window.dispatchEvent(new Event("userUpdated"));

        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);

      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">

        {/* LEFT PANEL */}
        <div className="login-left">
          <h1>WELCOME</h1>
          <h2>
            <span className="blue">Help</span>
            <span className="orange">Kar</span>
          </h2>
          <p className="tagline">
            Your trusted platform for reliable home services.
            Book professionals instantly & get things done stress-free.
          </p>
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <h2>Sign In</h2>
          <p className="sub-text">
            Login to continue booking trusted services
          </p>

          <form onSubmit={handleSubmit} method="POST">

            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                name="email"
                onChange={handleChange}
                autoFocus
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                name="password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="remember-row">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <span className="forgot">Forgot Password?</span>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Sign In"}
            </button>

            <p className="signup-link">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/signup")}>
                Sign up
              </span>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;