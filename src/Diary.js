import React, { useState } from 'react';
import PaidNavbar from './PaidNavbar';
import Footer from './Footer';
import './Diary.css';

// Import FontAwesome components and icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBarChart, faBook } from '@fortawesome/free-solid-svg-icons';

const Diary = () => {
    const [activeTab, setActiveTab] = useState('DiaryLedger');

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
                    <div className="ledger-row">
                        <div className="ledger-column date-column">
                            <p>27/3/24</p>
                        </div>
                        <div className="ledger-column diary-column">
                            <p>No more empty promises. We demand justice, we demand respect. We won't back down until we get what's rightfully ours!</p>
                        </div>
                        <div className="ledger-column emotion-column">
                            <p>Target Emotion(s): Demand (40%), Justice (30%), Determination (30%)</p>
                            <p>Emotional Intensity: High</p>
                            <p>Overall Sentiment: Positive</p>
                        </div>
                    </div>
                    <div className="ledger-row">
                        <div className="ledger-column date-column">
                            <p>20/3/24</p>
                        </div>
                        <div className="ledger-column diary-column">
                            <p>She just missed the bus so now she has to wait 10 minutes extra!</p>
                        </div>
                        <div className="ledger-column emotion-column">
                            <p>Target Emotion(s): Frustration (60%), Disappointment (40%)</p>
                            <p>Emotional Intensity: Medium</p>
                            <p>Overall Sentiment: Negative</p>
                        </div>
                    </div>
                    <div className="ledger-row">
                        <div className="ledger-column date-column">
                            <p>3/3/24</p>
                        </div>
                        <div className="ledger-column diary-column">
                            <p>Every day feels like an uphill battle at work, and I'm starting to feel completely overwhelmed by the pressure</p>
                        </div>
                        <div className="ledger-column emotion-column">
                            <p>Target Emotion(s): Overwhelmed (60%), Pressure (40%)</p>
                            <p>Emotional Intensity: High</p>
                            <p>Overall Sentiment: Negative</p>
                        </div>
                    </div>
                    <div className="ledger-row">
                        <div className="ledger-column date-column">
                            <p>9/2/24</p>
                        </div>
                        <div className="ledger-column diary-column">
                            <p>Today, I received the news that I got the job offer I've been dreaming of for years! I'm over the moon with excitement and can't wait to start this new chapter in my life!</p>
                        </div>
                        <div className="ledger-column emotion-column">
                            <p>Target Emotion(s): Excitement (50%), Joy (30%), Anticipation (20%)</p>
                            <p>Emotional Intensity: High</p>
                            <p>Overall Sentiment: Positive</p>
                        </div>
                    </div>
                </div>
            );
        } else if (activeTab === 'MonthlyAnalysis') {
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
            <PaidNavbar />
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
