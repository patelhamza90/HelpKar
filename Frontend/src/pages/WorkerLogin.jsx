import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleError, handleSuccess } from "../utils/utils";
const WorkerLogin = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        workerUID: '',
        password: ''
    })
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            const url = "http://localhost:8000/api/auth/worker/signin";

            const { data } = await axios.post(url, form);

            const { message, error, success, workerToken, worker } = data;

           if (success) {
    handleSuccess(message);

    // 🔥 sab purane tokens clear karo
    localStorage.removeItem("userToken"); 
    localStorage.removeItem("token"); // admin token

    // ✅ sirf worker token store karo
    localStorage.setItem("workerToken", workerToken);
    localStorage.setItem("workerName", worker.name);

    window.dispatchEvent(new Event("userUpdated"));

    setTimeout(() => {
        navigate("/worker");
    }, 1000);
} else {
                const details = error?.details[0].message;
                handleError(details);
            }

        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">

                {/* LEFT PANEL */}
                <div className="login-left">
                    <h1>WORKER PANEL</h1>
                    <h2>
                        <span className="blue">Help</span>
                        <span className="orange">Kar</span>
                    </h2>
                    <p className="tagline">
                        Manage your service requests efficiently.
                        Accept jobs, update status & grow your earnings.
                    </p>
                    <div className="circle circle1"></div>
                    <div className="circle circle2"></div>
                </div>

                {/* RIGHT PANEL */}
                <div className="login-right">
                    <h2>Worker Sign In</h2>
                    <p className="sub-text">
                        Login to manage your service requests
                    </p>

                    <form onSubmit={handleSubmit} method="POST">

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Worker UID"
                                value={form.workerUID}
                                name="workerUID"
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
                            <span
                                className="forgot"
                                onClick={() => navigate("/worker-forgot")}
                                style={{ cursor: "pointer" }}
                            >
                                Forgot Password?
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? <div className="spinner"></div> : "Sign In"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default WorkerLogin;