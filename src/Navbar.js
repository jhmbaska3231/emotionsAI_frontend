import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';
import brain_icon from './pictures/brain_icon.png'; 

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <img src={brain_icon} alt="brain_icon" style={{ height: '40px' }} />
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
