import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';
import logo from './pictures/Emotions_AI_Logo.png'; 

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

export default Navbar;
