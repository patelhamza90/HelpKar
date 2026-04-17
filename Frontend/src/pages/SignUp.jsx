import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";
import { handleSuccess, handleError } from "../utils/utils";

const SignUp = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone:"",
    gender: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const url = "http://localhost:8000/api/auth/user/signup";
      const { data } = await axios.post(url, form);

      const { message, success } = data;

      if (success) {
        handleSuccess(message);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }

    } catch (err) {

      handleError(err.response?.data?.message || "Registration Failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-left">
          <h1>WELCOME</h1>

          <h2>
            <span className="blue">Help</span>
            <span className="orange">Kar</span>
          </h2>

          <p className="tagline">
            Join HelpKar today and connect with trusted professionals near you.
          </p>

          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
        </div>

        <div className="login-right">
          <h2>Register</h2>

          <p className="sub-text">
            Create your account to get started
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Your Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                autoFocus
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gender Select */}
            <div className="input-group">
              <select
               className="wrktbl-filter"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
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
              {loading ? <span className="spinner"></span> : "Register"}
            </button>

            <p className="signup-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>
                Sign In
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;