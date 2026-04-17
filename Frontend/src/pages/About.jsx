import React from "react";
import "../styles/About.css";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <div className="about-container">

        {/* HERO SECTION */}
        <div className="about-hero">
          <h1 className="brand-name">
            Help<span>Kar</span>
          </h1>
          <p>
            India’s trusted platform connecting skilled workers with people who need reliable home services.
          </p>
        </div>

        {/* ABOUT DESCRIPTION */}
        <div className="about-section">
          <h2>Who We Are</h2>
          <p>
            HelpKar is a modern service platform designed to make life easier.
            Whether you need an electrician, plumber, cleaner, or any skilled worker —
            HelpKar connects you with trusted professionals near you.
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="mission-vision">
          <div className="card">
            <h3>Our Mission</h3>
            <p>
              To provide fast, reliable and affordable services while creating
              job opportunities for skilled workers across India.
            </p>
          </div>

          <div className="card">
            <h3>Our Vision</h3>
            <p>
              To become India's most trusted home service platform where
              quality and trust always come first.
            </p>
          </div>
        </div>

        {/* WHY CHOOSE US */}
        <div className="about-section">
          <h2>Why Choose HelpKar?</h2>

          <div className="features1">
            <div className="feature-box1">
              <h4>Verified Workers</h4>
              <p>All workers are verified before approval.</p>
            </div>

            <div className="feature-box1">
              <h4>Easy Booking</h4>
              <p>Book services in just a few clicks.</p>
            </div>

            <div className="feature-box1">
              <h4>Affordable Pricing</h4>
              <p>Transparent pricing with no hidden charges.</p>
            </div>

            <div className="feature-box1">
              <h4>24/7 Support</h4>
              <p>Customer support available anytime.</p>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="stats-section">
          <div className="stat-box">
            <h2>500+</h2>
            <p>Verified Workers</p>
          </div>

          <div className="stat-box">
            <h2>1000+</h2>
            <p>Services Completed</p>
          </div>

          <div className="stat-box">
            <h2>4.8★</h2>
            <p>Average Rating</p>
          </div>

          <div className="stat-box">
            <h2>50+</h2>
            <p>Cities Covered</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;