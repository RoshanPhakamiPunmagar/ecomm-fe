import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-2">Ecommerce</h5>
            <p className="text-muted">
              Your one-stop shop for the latest products. Fast delivery, secure
              payment, and best quality guaranteed.
            </p>

            {/* Social Icons */}
            <div className="d-flex mt-2">
              <a href="#" className="text-light me-3 hover-opacity">
                <FaFacebookF />
              </a>
              <a href="#" className="text-light me-3 hover-opacity">
                <FaTwitter />
              </a>
              <a href="#" className="text-light me-3 hover-opacity">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-2">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/"
                  className="text-light text-decoration-none hover-underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-light text-decoration-none hover-underline"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-light text-decoration-none hover-underline"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-light text-decoration-none hover-underline"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-light text-decoration-none hover-underline"
                >
                  Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold mb-2">Contact</h6>
            <p className="mb-1">Email: support@ecommerce.com</p>
            <p className="mb-1">Phone: +977-9800000000</p>
            <p className="mb-0">Location: Nepal</p>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Copyright */}
        <div className="text-center">
          <small className="text-muted">
            © {new Date().getFullYear()} Ecommerce. All rights reserved.
          </small>
        </div>
      </div>

      {/* CSS for hover effects */}
      <style>
        {`
          .hover-opacity:hover {
            opacity: 0.8;
            transition: 0.2s ease;
          }
          .hover-underline:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </footer>
  );
}

export default Footer;
