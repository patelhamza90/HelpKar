import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import axios from "axios";
import { handleError } from "../utils/utils";
const BASE_URL = import.meta.env.VITE_API_URL || "https://helpkar.onrender.com";

function Home() {
  const navigate = useNavigate();

  const [serviceName, setServiceName] = useState("");
  const [city, setCity] = useState("");
  const [stats, setStats] = useState([])
  const [avgRating, setAvgRating] = useState(0);

  const fetchStats = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/services/home-stats`);
    console.log(BASE_URL);
    setStats(data.response.services);
    setAvgRating(data.response.avgRating);
  } catch (error) {
    handleError(error);
  }
};

  useEffect(() => {
    fetchStats();
  }, [])

  return (
    <>
      <div className="home-container">

        {/* HERO SECTION */}
        <div className="hero">
          <div className="hero-content">

            <div className="top-badge">
              • 2,400+ Verified Professionals
            </div>

            <h1>
              Find Trusted Services <br />
              <span>Near You</span>
            </h1>

            <p>
              Browse verified home service professionals. Filter by category,
              price & location — and book in seconds.
            </p>

            <div className="search-box">

              <input
                type="text"
                placeholder="Search service or worker name..."
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
              />

              <input
                type="text"
                placeholder="City or area..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <button
                onClick={() =>
                  navigate("/services", {
                    state: {
                      service: serviceName,
                      city: city
                    }
                  })
                }
              >
                Search
              </button>

            </div>

            <div className="stats">

              {stats.map(s => (
                <div key={s._id}>
                  {s.count}+ {s._id}
                </div>
              ))}

              <div>⭐ {avgRating ? avgRating.toFixed(1) : "0.0"} Avg Rating</div>

            </div>

          </div>
        </div>
        {/* HERO SECTION END */}

        {/* FEATURES SECTION */}
        <div className="features">
          <h2 className="features-title">Why Choose Us</h2>
          <div className="features-container">

            <div className="feature-card">
              <img
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1"
                alt="Verified Professionals"
              />
              <h3>Verified Professionals</h3>
              <ul>
                <li>✔ Background Checked Experts</li>
                <li>✔ Skilled & Certified Workers</li>
                <li>✔ Trusted Service Providers</li>
              </ul>
            </div>

            <div className="feature-card">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
                alt="Quick Booking"
              />
              <h3>Quick & Easy Booking</h3>
              <ul>
                <li>✔ Book in Minutes</li>
                <li>✔ Instant Confirmation</li>
                <li>✔ 24/7 Customer Support</li>
              </ul>
            </div>

            <div className="feature-card">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                alt="Affordable Pricing"
              />
              <h3>Affordable Pricing</h3>
              <ul>
                <li>✔ Transparent Pricing</li>
                <li>✔ No Hidden Charges</li>
                <li>✔ Best Market Rates</li>
              </ul>
            </div>

          </div>
        </div>

        {/* SERVICES SECTION */}
        <div className="services">
          <h2 className="section-title">Our Popular Services</h2>
          <div className="services-container">
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952" alt="Plumbing" />
              <h3>Plumbing</h3>
            </div>

            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1621905251918-48416bd8575a" alt="Electrician" />
              <h3>Electrician</h3>
            </div>

            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac" alt="Cleaning" />
              <h3>Home Cleaning</h3>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="how-it-works">
          <h2 className="section-title">How HelpKar Works</h2>
          <div className="workflow-container">

            <div className="workflow-card">
              <h3>1. Select Service</h3>
              <p>Choose the service you need from Plumbing, Electrician, Home Cleaning, and more.</p>
            </div>

            <div className="workflow-card">
              <h3>2. Book Technician</h3>
              <p>Book a verified professional with a few clicks. Instant confirmation and scheduling.</p>
            </div>

            <div className="workflow-card">
              <h3>3. Service Done</h3>
              <p>Technician arrives on time, completes the job, and you pay securely. Rate your experience!</p>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default Home;