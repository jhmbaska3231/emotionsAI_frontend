import React, { useState, useEffect } from 'react';
import './Diary.css';
import Footer from './Footer';

import api, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBarChart, faBook } from '@fortawesome/free-solid-svg-icons';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';

const Diary = () => {

    const [activeTab, setActiveTab] = useState('DiaryLedger');
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('');

    useEffect(() => {
        const fetchDiaryData = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    setBearerToken(accessToken.toString());

                    const userId = idToken.payload.sub;
                    const currentMonthIndex = new Date().getMonth() + 1;
                    setCurrentMonth(currentMonthIndex);

                    const response = await api.get(`/api/diaries/user/${userId}/month/${currentMonthIndex}`);
                    setDiaryEntries(response.data);
                    const data = processData(response.data);
                    setMonthlyData(data);
                } else {
                    console.error('ID token not found in session');
                }
            } catch (error) {
                console.error('Error getting user session:', error);
            }
        };

        fetchDiaryData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const getMonthName = (monthIndex) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthIndex - 1];
    };

    const processData = (entries) => {
        const emotionMap = {};
    
        // Aggregate the similar emotions across all diary entries
        entries.forEach(entry => {
            entry.targetEmotionsList.forEach(emotion => {
                if (emotionMap[emotion.emotion]) {
                    emotionMap[emotion.emotion] += emotion.emotionPercentage;
                } else {
                    emotionMap[emotion.emotion] = emotion.emotionPercentage;
                }
            });
        });
    
        // Calculate the total sum of aggregated percentages
        const totalPercentage = Object.values(emotionMap).reduce((sum, percentage) => sum + percentage, 0);
    
        // Normalize the aggregated values to ensure the total sum equals 100%
        return Object.keys(emotionMap).map(emotion => ({
            emotion,
            percentage: (emotionMap[emotion] / totalPercentage) * 100
        }));
    };

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
                                <p>{formatDate(entry.date)}</p>
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
            const maxEmotion = monthlyData.reduce((max, emotion) => emotion.percentage > max.percentage ? emotion : max, { emotion: '', percentage: 0 });
            const monthName = getMonthName(currentMonth);
            return (
                <div className="monthly-analysis-content">
                    <BarChart
                        width={1000}
                        height={600}
                        data={monthlyData}
                        layout="vertical"
                        margin={{ top: 20, right: 10, left: 80, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="emotion" />
                        <Tooltip />
                        <Bar dataKey="percentage" fill="#4F81BD">
                            <LabelList dataKey="percentage" position="right" formatter={(value) => `${value.toFixed(2)}%`} />
                        </Bar>
                    </BarChart>
                    <p className="summary">Your most felt emotion in the month of {monthName} is "{maxEmotion.emotion}" at {maxEmotion.percentage.toFixed(2)}%</p>
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
