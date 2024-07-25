import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import './UserProfile.css';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

const UserProfile = () => {

    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    setBearerToken(accessToken.toString());

                    const userId = idToken.payload.sub;
                    const response = await axios.get(`/api/subscriptions/${userId}`);
                    console.log('API Response:', response.data); // remember to remove this
                    setSubscription(response.data);
                }
            } catch (error) {
                console.error('Error fetching subscription details:', error);
            }
        };

        fetchSubscription();
    }, []);

    return (
        <div className="user-profile-container">
            <div className="user-profile-main-content">
                <div className="user-profile-section">
                    <h1>Account Manager</h1>
                    <div className="subscription-details">
                        <div className="subscription-item">
                            <span>Subscription start date</span>
                            <span className="date">
                                {subscription ? new Date(subscription.startDate).toLocaleDateString() : 'Loading...'}
                            </span>
                        </div>
                        <div className="subscription-item">
                            <span>End date</span>
                            <span className="date">
                                {subscription ? new Date(subscription.endDate).toLocaleDateString() : 'Loading...'}
                            </span>
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
