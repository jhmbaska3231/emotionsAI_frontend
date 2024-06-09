import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Authenticator } from '@aws-amplify/ui-react';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './PaidNavbar.css';
import logo from './pictures/Emotions_AI_Logo.png';
import userIcon from './pictures/usericon.png';

const PaidNavbar = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        props.logOut();
    }

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
                <Link to="/transcribevoice">Transcribe Voice</Link>
                <Link to="/diary">Diary</Link>
                <div>
                    <Button
                        id="user-profile-button"
                        aria-controls={open ? 'user-profile-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        style={{ color: 'white' }}
                    >
                        <img src={userIcon} alt="User Icon" style={{ height: '20px', marginRight: '5px' }} />
                        Sally
                    </Button>
                    <Menu
                        id="user-profile-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'user-profile-button',
                        }}
                    >
                        <MenuItem component={Link} to="/userprofile" onClick={handleClose}>
                            Manage User
                        </MenuItem>
                        <MenuItem component={Link} to="/" onClick={handleLogout}>
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </nav>
    );
}

export default PaidNavbar;
