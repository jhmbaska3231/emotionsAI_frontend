import React from 'react';
import { Link } from 'react-router-dom';

import './PaidNavbar.css';
import logo from './pictures/Emotions_AI_Logo.png';
import userIcon from './pictures/usericon.png'; 

const PaidNavbar = () => {
    return (
        <nav className="paid-navbar">
            <div className="paid-navbar-left">
                <Link to="/" className="paid-navbar-logo">
                    <img src={logo} alt="EmotionsAI Logo" style={{ height: '40px' }} />
                    <span>EmotionsAI</span>
                </Link>
            </div>
            <div className="paid-navbar-right">
                <Link to="/transcribe">Transcribe Text</Link>
                <Link to="/transcribe-audio">Transcribe Audio</Link>
                <Link to="/diary">Diary</Link>
                <Link to="/userprofile">
                    <img src={userIcon} alt="User Icon" style={{ height: '20px', marginRight: '5px' }} />
                    User Profile
                </Link>
            </div>
        </nav>
    );
}

export default PaidNavbar;
