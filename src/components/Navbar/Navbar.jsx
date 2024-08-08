import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBox,
  faShoppingCart,
  faSignInAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">eCommerce</h2>
      <input type="checkbox" id="nav-toggle" className="nav-toggle" />
      <label htmlFor="nav-toggle" className="nav-toggle-label">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <div className="links">
        <Link to="/">
          <FontAwesomeIcon icon={faHome} />
          <span className="spacing">Home</span>
        </Link>
        <Link to="/products">
          <FontAwesomeIcon icon={faBox} />
          <span className="spacing">Products</span>
        </Link>
        <Link to="/cart">
          <FontAwesomeIcon icon={faShoppingCart} />
          <span className="spacing">Cart</span>
          {cartCount > 0 && <span className="cart-count ">{cartCount}</span>}
        </Link>
        <Link to="/login">
          <FontAwesomeIcon icon={faSignInAlt} />
          <span className="spacing">Login</span>
        </Link>
        <Link to="/profile">
          <FontAwesomeIcon icon={faUser} /> <span>Profile</span>
        </Link>
        <Link to="/reviews">
          <FontAwesomeIcon icon={faUser} /> <span>Reviews</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
