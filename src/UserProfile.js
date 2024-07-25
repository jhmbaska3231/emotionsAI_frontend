import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import './UserProfile.css';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

const UserProfile = () => {

    const [subscription, setSubscription] = useState(null);
    const navigate = useNavigate();

    const isMonthlyPlan = subscription?.subscriptionPlan === 'MONTHLY';
    const isYearlyPlan = subscription?.subscriptionPlan === 'YEARLY';

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    setBearerToken(accessToken.toString());

                    const userId = idToken.payload.sub;
                    const response = await axios.get(`/api/subscriptions/${userId}`);
                    console.log('API Response(fetchSubscription):', response.data); // remember to remove this
                    setSubscription(response.data);
                }
            } catch (error) {
                console.error('Error fetching subscription details:', error);
            }
        };

        fetchSubscription();
    }, []);

    const handlePlanChange = async (newPlan) => {
        try {
            const session = await fetchAuthSession();
            const { accessToken, idToken } = session.tokens ?? {};
            if (accessToken && idToken) {
                setBearerToken(accessToken.toString());
                
                const userId = idToken.payload.sub;
                await axios.post(`/api/subscriptions/${userId}/update-plan`, null, {
                    params: { newPlan }
                });

                const response = await axios.get(`/api/subscriptions/${userId}`);
                console.log('API Response(handlePlanChange):', response.data); // remember to remove this
                setSubscription(response.data);
            }
        } catch (error) {
            console.error('Error updating subscription plan:', error);
        }
    };

    console.log('Subscription Plan:', subscription?.subscriptionPlan); // remember to remove this
    console.log('isMonthlyPlan:', isMonthlyPlan); // remember to remove this
    console.log('isYearlyPlan:', isYearlyPlan); // remember to remove this

    const handleUnsubscribe = async () => {
        try {
            const session = await fetchAuthSession();
            const { accessToken, idToken } = session.tokens ?? {};
            if (accessToken && idToken) {
                setBearerToken(accessToken.toString());

                const userId = idToken.payload.sub;
                await axios.post(`/api/users/${userId}/unsubscribe`);

                // Redirect to another page or update UI
                navigate('/some-other-page');
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
        }
    };

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
                        <button className="unsubscribe-button" onClick={handleUnsubscribe}>Unsubscribe</button>
                    </div>
                    <div className="change-plan-section">
                        <span>Change plan to</span>
                        <button
                            className="plan-button"
                            disabled={isYearlyPlan}
                            onClick={() => handlePlanChange('YEARLY')}
                        >
                            Yearly
                        </button>
                        <button
                            className="plan-button"
                            disabled={isMonthlyPlan}
                            onClick={() => handlePlanChange('MONTHLY')}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

}

export default UserProfile;
