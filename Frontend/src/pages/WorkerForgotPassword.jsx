import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils/utils";
import axios from "axios";

const WorkerForgotPassword = () => {

    const navigate = useNavigate();
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifyStatus, setVerifyStatus] = useState("idle");


    const [form, setForm] = useState({
        workerUID: '',
        email: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setVerifyStatus("sending");

        try {
            const { data } = await axios.post(
                "http://localhost:8000/api/auth/worker/signin/verify-uid",
                {
                    workerUID: form.workerUID,
                    email: form.email
                }
            );

            if (data.success) {

                setVerifyStatus("sent");

                setTimeout(() => {
                    setVerifyStatus("verified");

                    setTimeout(() => {
                        setVerified(true);
                    }, 1500);

                }, 1500);
            }

        } catch (err) {
            handleError(err.response?.data?.message || "Something went wrong");
            setVerifyStatus("idle"); // ❗ reset
        } finally {
            setLoading(false); // ❗ spinner stop
        }
    };

    const handleForgot = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (form.newPassword !== form.confirmPassword) {
            handleError("Password doesn't match!");
            setLoading(false); // 🔥 IMPORTANT
            return;
        }

        try {

            const url = "http://localhost:8000/api/auth/worker/signin/forgot-password";

            const { data } = await axios.post(url, {
                workerUID: form.workerUID,
                email: form.email,
                password: form.newPassword
            });

            const { message, error, success } = data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/worker-login");
                }, 1000);

            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else {
                handleError(error)
            }


        } catch (err) {
            handleError(err);
        }
        finally {
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
                        Reset your password securely.
                        Verify your identity to continue.
                    </p>
                    <div className="circle circle1"></div>
                    <div className="circle circle2"></div>
                </div>

                {/* RIGHT PANEL */}
                <div className="login-right">
                    <h2>Forgot Password</h2>
                    <p className="sub-text">
                        Enter your Worker UID & Email to reset password
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Worker UID"
                                value={form.workerUID}
                                name="workerUID"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Registered Email"
                                value={form.email}
                                name="email"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {!verified && (
                            <button
                                type="submit"
                                className={`login-btn  
    ${verifyStatus === "verified" ? "verified" : ""}
    ${verifyStatus === "sending" ? "sending" : ""}
  `}
                                disabled={loading || verifyStatus === "verified"}
                            >
                                {verifyStatus === "sending" && (
                                    <>
                                        <div className="spinner"></div>
                                        <span style={{ marginLeft: "8px" }}>Sending...</span>
                                    </>
                                )}

                                {verifyStatus === "idle" && "Verify"}

                                {verifyStatus === "sent" && "Verification Sent"}

                                {verifyStatus === "verified" && "✔ Verified"}
                            </button>
                        )}
                        {verified && (
                            <>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="login-btn"
                                    style={{ marginTop: "10px" }}
                                    onClick={handleForgot}
                                    disabled={loading}
                                >
                                    {loading ? <div className="spinner"></div> : "Reset Password"}
                                </button>
                            </>
                        )}
                        <p
                            style={{ marginTop: "15px", cursor: "pointer", color: "#1e4fa3" }}
                            onClick={() => navigate("/worker-login")}
                        >
                            Back to Login
                        </p>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default WorkerForgotPassword;