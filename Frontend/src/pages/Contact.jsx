import React, { useState, useRef } from "react";
import "../styles/Contact.css";
import axios from "axios";
import { handleError, handleSuccess } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { servicesData } from "../data/serviceData";
import Footer from "../components/Footer";
 const BASE_URL = "https://helpkar.onrender.com";;

const Contact = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [form, setForm] = useState({
    fullName: '',
    gender: '',
    email: '',
    phone: '',
    category: '',
    service: '',
    idProof: null,
    address: '',
    city: '',
  });
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const [complaint, setComplaint] = useState("");
  const token = localStorage.getItem("userToken");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.idProof) {
      return handleError("Please upload your ID proof.");
    }
    if (!form.fullName || !form.email || !form.gender || !form.category || !form.service || !form.phone || !form.address || !form.city) {
      return handleError("Please fill the all details.");
    }

    try {

      setLoading(true);

      const formData = new FormData();
      formData.append('fullName', form.fullName);
      formData.append('gender', form.gender);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('category', form.category);
      formData.append('service', form.service);
      formData.append('address', form.address);
      formData.append('city', form.city);
      formData.append('idProof', form.idProof);

      const url = `https://helpkar.onrender.com/api/auth/worker/signup`;

      const { data } = await axios.post(url, formData);

      if (!data.success) {
        return handleError(data.message);
      }

      handleSuccess(data.message);
      resetForm();
      setShowPopup(true);

    } catch (err) {
      handleError(err.response?.data?.message || "Something went wrong");
    }
    finally {
      setLoading(false);
    }
  }
  const closePopup = () => {
    setShowPopup(false);
  };
  const resetForm = () => {
    setForm({
      fullName: "",
      gender: "",
      email: "",
      phone: "",
      category: "",
      service: "",
      address: "",
      city: "",
      idProof: null
    });

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSubmitComplaint = async () => {
    try {

      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 800))

      const url = `https://helpkar.onrender.com/api/user/complaint/submit`;

      const { data } = await axios.post(url, { complaint }, { headers: { Authorization: `Bearer ${token}` } });

      const { message, success, error } = data;

      if (success) {
        handleSuccess(message);
        setComplaint("");
      }

    } catch (error) {
      handleError(error?.response.data?.message || error.message)
    }
    setLoading(false);
  }


  return (
    <>
      <div className="contact-wrapper">

        <h1 className="brand-title">
          Help<span>Kar</span>
        </h1>

        <p className="contact-subtitle">
          For <strong>Feedback</strong>, <strong>Complaint</strong> or if you want a
          <span className="job-highlight"> JOB with HelpKar</span>, contact us today.
        </p>

        <div className="contact-type-select">
          <button onClick={() => setType("complaint")}>Complaint</button>
          <button className="job-btn" onClick={() => setType("job")}>
            Apply For Job
          </button>
        </div>

        {type && (
          <form className="contact-form" onSubmit={handleSubmit}>

            {type === "complaint" && (
              <>
                <h3>Complaint Form</h3>
                <textarea
                  name="complaint"
                  placeholder="Write your complaint..."
                  required
                  onChange={(e) => setComplaint(e.target.value)}
                />
                <button type="button" onClick={handleSubmitComplaint} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </button>
              </>
            )}

            {type === "job" && (
              <>
                <h3 className="job-form-title">Worker Job Application</h3>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name (As per Aadhaar)"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                />

                <select
                  className="wrktbl-filter"
                  name="gender"
                  required
                  value={form.gender}
                  onChange={handleChange}>

                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Email ID"
                  required
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  placeholder="Contact Number"
                  maxLength={10}
                  required
                  onChange={handleChange}
                />

                <label>Select Work Category</label>

                <select
                  className="wrktbl-filter"
                  name="category"
                  value={form.category}
                  required
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value, service: "" })
                  }
                >

                  <option value="">Select Category</option>
                  {Object.keys(servicesData).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {form.category && (
                  <>
                    <label>Select Your Service</label>

                    <select
                      className="wrktbl-filter"
                      name="service"
                      required
                      value={form.service}
                      onChange={handleChange}
                    >
                      <option value="">Select Service</option>

                      {servicesData[form.category].map((srv, index) => (
                        <option key={index} value={srv}>
                          {srv}
                        </option>
                      ))}

                    </select>
                  </>
                )}

                <label>Upload any ID proof</label>

                <input
                  type="file"
                  ref={fileRef}
                  name="idProof"
                  required
                  onChange={(e) =>
                    setForm({ ...form, idProof: e.target.files[0] })
                  }
                />

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  placeholder="City"
                  required
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="address"
                  value={form.address}
                  placeholder="Address"
                  required
                  onChange={handleChange}
                />

                <button type="submit" className="job-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </>
            )}

          </form>
        )
        }

        {/* PROFESSIONAL SUCCESS POPUP */}
        {
          showPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <h2>Registration Request Submitted Successfully</h2>
                <p>
                  Your details have been successfully submitted to HelpKar.
                  <br /><br />
                  Our verification team will review your information shortly.
                  You will receive an email once your profile is approved.
                  <br /><br />
                  The email will include your Worker UID and login details,
                  which you can use to access your dashboard.
                  <br /><br />
                  Thank you for choosing HelpKar.
                </p>
                <button onClick={closePopup}>Okay</button>
              </div>
            </div>
          )
        }
      </div >
    </>
  );
};

export default Contact;