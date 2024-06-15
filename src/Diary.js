import React, { useState, useEffect } from 'react';
import './Diary.css';
import Footer from './Footer';

import api, { setBearerToken } from './api/axiosConfig'; // Import setBearerToken function
import { fetchAuthSession } from 'aws-amplify/auth'; // Import fetchAuthSession from AWS Amplify

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBarChart, faBook } from '@fortawesome/free-solid-svg-icons';

const Diary = () => {

    const [activeTab, setActiveTab] = useState('DiaryLedger');
    const [diaryEntries, setDiaryEntries] = useState([]);
    
    useEffect(() => {
        fetchAuthSession()
            .then(session => {
                console.log('Session:', session); // Log the session object to check its structure
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    console.log('Access Token:', accessToken);
                    console.log('ID Token:', idToken);
                    
                    // Ensure accessToken.jwtToken exists and is not undefined
                    const jwtToken = accessToken && accessToken.jwtToken ? accessToken.jwtToken : undefined; 
                    console.log('JWT Token:', jwtToken);

                    if (jwtToken) {
                        setBearerToken(jwtToken); // Set the bearer token for Axios requests
                        const userId = idToken.payload.sub; // Assuming sub is the user ID
                        console.log('User ID:', userId);
                        const currentMonth = new Date().getMonth() + 1;
                        console.log('Current Month:', currentMonth);

                        api.get(`/api/diaries/user/${userId}/month/${currentMonth}`)
                            .then(response => {
                                setDiaryEntries(response.data);
                            })
                            .catch(error => {
                                console.error('There was an error making the request!', error);
                            });
                    } else {
                        console.error('JWT token is undefined');
                    }
                } else {
                    console.error('Access token or idToken not found in session');
                }
            })
            .catch(error => {
                console.error('Error getting user session:', error);
            });
    }, []);

    const renderContent = () => {
        if (activeTab === 'DiaryLedger') {
            return (
                <div className="ledger-content">
                    <div className="ledger-row header-row">
                        <div className="ledger-column date-column">
                            <h3>Date</h3>
                        </div>
                        <div className="ledger-column diary-column">
                            <h3>Diary</h3>
                        </div>
                        <div className="ledger-column emotion-column">
                            <h3>Emotion Analysis</h3>
                        </div>
                    </div>
                    {diaryEntries.map(entry => (
                        <div className="ledger-row" key={entry.diaryId}>
                            <div className="ledger-column date-column">
                                <p>{entry.date}</p>
                            </div>
                            <div className="ledger-column diary-column">
                                <p>{entry.inputText}</p>
                            </div>
                            <div className="ledger-column emotion-column">
                                <p>Target Emotion(s): {entry.targetEmotionsList.map(emotion => `${emotion.emotion} (${emotion.emotionPercentage}%)`).join(', ')}</p>
                                <p>Emotional Intensity: {entry.emotionalIntensity}</p>
                                <p>Overall Sentiment: {entry.overallSentiment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else if (activeTab === 'MonthlyAnalysis') {
            // Example content for Monthly Analysis tab
            return (
                <div className="monthly-analysis-content">
                    <div className="header">
                    </div>
                    <div className="emotion-bar">
                        <span>Anger</span>
                        <div className="bar" style={{ width: '45%' }}>45%</div>
                    </div>
                    <div className="emotion-bar">
                        <span>Guilt</span>
                        <div className="bar" style={{ width: '8%' }}>8%</div>
                    </div>
                    <div className="emotion-bar">
                        <span>Joy</span>
                        <div className="bar" style={{ width: '30%' }}>30%</div>
                    </div>
                    <div className="emotion-bar">
                        <span>Excitement</span>
                        <div className="bar" style={{ width: '12%' }}>12%</div>
                    </div>
                    <div className="emotion-bar">
                        <span>Loneliness</span>
                        <div className="bar" style={{ width: '5%' }}>5%</div>
                    </div>
                    <p className="summary">Your most felt emotion in the month of April is "Anger" at 45%</p>
                </div>
            );
        }
    };

    return (
        <div className="diary-container">
            <div className="main-content">
                <div className="sidebar">
                    <h1>Dashboard</h1>
                    <ul>
                        <li onClick={() => setActiveTab('Dashboard')}>
                            <FontAwesomeIcon icon={faList} className="icon" />
                            Dashboard
                        </li>
                    </ul>
                    <h1>Utilities</h1>
                    <ul>
                        <li onClick={() => setActiveTab('MonthlyAnalysis')}>
                            <FontAwesomeIcon icon={faBarChart} className="icon" />
                            Monthly Analysis
                        </li>
                        <li onClick={() => setActiveTab('DiaryLedger')}>
                            <FontAwesomeIcon icon={faBook} className="icon" />
                            Diary Ledger
                        </li>
                    </ul>
                </div>
                <div className="diary-content">
                    <div className="ledger-box">
                        <h2>{activeTab === 'DiaryLedger' ? 'Diary Ledger' : 'Monthly Analysis'}</h2>
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

}

export default Diary;
