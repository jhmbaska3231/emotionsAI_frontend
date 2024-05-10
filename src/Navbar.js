// Importing React and Link component from react-router-dom
import React from 'react';
import { Link } from 'react-router-dom';

// Importing CSS for styling the navbar and logo image
import './Navbar.css';
import logo from './pictures/Emotions_AI_Logo.png'; // Ensure the logo path is correct

// Functional component for navigation bar
const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <img src={logo} alt="EmotionsAI Logo" style={{ height: '40px' }} />
                    <span>EmotionsAI</span>
                </Link>
            </div>
            <div className="navbar-right">
                <Link to="/product">Product</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    );
}

// Exporting Navbar component for use elsewhere in the application
export default Navbar;
