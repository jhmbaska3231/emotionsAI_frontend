import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserAttributes } from 'aws-amplify/auth';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './PaidNavbar.css'; // using same css as PaidNavbar
import brain_icon from './pictures/brain_icon.png';
import user_icon from './pictures/user_icon.png';

function FreeNavbar(props) {

    const [userAttributes, setUserAttributes] = useState({});

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        async function fetchAttributes() {
            try {
                const attributes = await fetchUserAttributes();
                setUserAttributes(attributes);
            } catch (error) {
                console.error('Error fetching user attributes:', error);
            }
        }

        fetchAttributes();
    }, []); // fetch user attributes once on component mount

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
                <Link to="/freeusertranscribetext" className="paid-navbar-logo">
                    <img src={brain_icon} alt="brain_icon" />
                    <span>EmotionsAI</span>
                </Link>
            </div>
            <div className="paid-navbar-right">
                <Link to="/freeusertranscribetext">Transcribe Text</Link>
                <Link to="/freeuserupgradepage">Upgrade</Link>
                <div>
                    <Button
                        id="user-profile-button"
                        aria-controls={open ? 'user-profile-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        style={{ color: 'white' }}
                    >
                        <img src={user_icon} alt="User Icon" className="user-icon" />
                        {userAttributes.name}
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
                        <MenuItem component={Link} to="/" onClick={handleLogout}> 
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </nav>
    );

}

export default FreeNavbar;
