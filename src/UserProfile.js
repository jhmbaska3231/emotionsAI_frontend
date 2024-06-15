import React from 'react';
import Footer from './Footer';
import './UserProfile.css';

const UserProfile = () => {
    return (
        <div className="user-profile-container">
            <div className="user-profile-main-content">
                <div className="user-profile-section">
                    <h1>Account Manager</h1>
                    <div className="subscription-details">
                        <div className="subscription-item">
                            <span>Subscription start date</span>
                            <span className="date">DD/MM/YYYY</span>
                        </div>
                        <div className="subscription-item">
                            <span>End date</span>
                            <span className="date">DD/MM/YYYY</span>
                        </div>
                        <button className="unsubscribe-button">Unsubscribe</button>
                    </div>
                    <div className="change-plan-section">
                        <span>Change plan to</span>
                        <button className="plan-button">Monthly</button>
                        <button className="plan-button">Yearly</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UserProfile;
