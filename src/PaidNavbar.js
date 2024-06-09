import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './PaidNavbar.css';
import brain_icon from './pictures/brain_icon.png';
import user_icon from './pictures/user_icon.png';

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
        console.log('logging out now...');
        props.logOut();
    }

    return (
        <nav className="paid-navbar">
            <div className="paid-navbar-left">
                <Link to="/transcribetext" className="paid-navbar-logo">
                    <img src={brain_icon} alt="brain_icon" style={{ height: '40px' }} />
                    <span>EmotionsAI</span>
                </Link>
            </div>
            <div className="paid-navbar-right">
                <Link to="/transcribetext">Transcribe Text</Link>
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
                        <img src={user_icon} alt="User Icon" style={{ height: '20px', marginRight: '5px' }} />
                        Sally {/* {user.attributes.email} */}
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
