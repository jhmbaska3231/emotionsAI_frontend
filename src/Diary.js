import React, { useState, useEffect } from 'react';
import PaidNavbar from './PaidNavbar';
import Footer from './Footer';
import './Diary.css';
import api from './api/axiosConfig';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBarChart, faBook } from '@fortawesome/free-solid-svg-icons';

const Diary = () => {
    const [activeTab, setActiveTab] = useState('DiaryLedger');
    const [diaryEntries, setDiaryEntries] = useState([]);

    useEffect(() => {
        // Fetch the diary entries when the component mounts
        api.get('/api/diaries/with-emotions/user/5') // need to code this dynamically to get user's id and append to the back
            .then(response => {
                setDiaryEntries(response.data);
            })
            .catch(error => {
                console.error('There was an error making the request!', error);
            });
    }, []);

    // Dynamically render the fetched diary entries
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
