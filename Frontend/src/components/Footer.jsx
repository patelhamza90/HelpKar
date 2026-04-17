import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* About */}
        <div className="footer-col about">
          <h2>HelpKar</h2>
          <p>
            Find verified professionals for your home services quickly and easily.
            Reliable, fast, and affordable.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-col social">
          <h3>Follow Us</h3>

          <div className="social-icons">

            <a href="https://www.facebook.com/" title="Facebook">
              <img src="/icons/facebook.png" alt="facebook" />
            </a>

            <a href="https://www.instagram.com/" title="Instagram">
              <img src="/icons/instagram.png" alt="instagram" />
            </a>

            <a href="https://www.whatsapp.com/" title="WhatsApp">
              <img src="/icons/whatsapp.png" alt="whatsapp" />
            </a>

          </div>
        </div>

        {/* Subscribe */}
        <div className="footer-col subscribe">
          <h3>Subscribe</h3>
          <p>Get updates about our latest services</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© 2026 HelpKar. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;