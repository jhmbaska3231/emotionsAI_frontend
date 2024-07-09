import React, { useState, useEffect } from 'react';
import './Diary.css';
import Footer from './Footer';

import api, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBarChart, faBook } from '@fortawesome/free-solid-svg-icons';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, LineChart, Line } from 'recharts';

const Diary = () => {

    const [activeTab, setActiveTab] = useState('DiaryLedger');
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [last6MonthsData, setLast6MonthsData] = useState([]);
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
                    const data = processMonthlyData(response.data);
                    setMonthlyData(data);

                    const last6MonthsResponse = await api.get(`/api/diaries/user/${userId}/last6months/${currentMonthIndex}`);
                    const last6MonthsData = processLast6MonthsData(last6MonthsResponse.data);
                    setLast6MonthsData(last6MonthsData);
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

    const processMonthlyData = (entries) => {
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

    const processLast6MonthsData = (entries) => {
        const monthlyEmotionData = {};
        
        entries.forEach(entry => {
            const month = new Date(entry.date).getMonth() + 1;
            if (!monthlyEmotionData[month]) {
                monthlyEmotionData[month] = {};
            }
            entry.targetEmotionsList.forEach(emotion => {
                if (monthlyEmotionData[month][emotion.emotion]) {
                    monthlyEmotionData[month][emotion.emotion] += emotion.emotionPercentage;
                } else {
                    monthlyEmotionData[month][emotion.emotion] = emotion.emotionPercentage;
                }
            });
        });
    
        const aggregatedData = Object.keys(monthlyEmotionData).map(month => {
            const emotions = monthlyEmotionData[month];
            const totalPercentage = Object.values(emotions).reduce((sum, percentage) => sum + percentage, 0);
            const normalizedEmotions = Object.keys(emotions).reduce((acc, emotion) => {
                acc[emotion] = (emotions[emotion] / totalPercentage) * 100;
                return acc;
            }, {});
            return { month: getMonthName(month), ...normalizedEmotions };
        });
    
        const emotionTotals = {};
        aggregatedData.forEach(monthData => {
            Object.keys(monthData).forEach(key => {
                if (key !== 'month') {
                    if (emotionTotals[key]) {
                        emotionTotals[key] += monthData[key];
                    } else {
                        emotionTotals[key] = monthData[key];
                    }
                }
            });
        });
    
        const topEmotions = Object.keys(emotionTotals)
            .sort((a, b) => emotionTotals[b] - emotionTotals[a])
            .slice(0, 10);
    
        const filteredMonthlyData = aggregatedData.map(monthData => {
            const filteredEmotions = topEmotions.reduce((acc, emotion) => {
                acc[emotion] = monthData[emotion] !== undefined ? monthData[emotion] : 0;
                return acc;
            }, {});
            return { month: monthData.month, ...filteredEmotions };
        });
    
        return filteredMonthlyData;
    };
    

    const renderContent = () => {
        if (activeTab === 'DiaryLedger') {
            return (
                <div className="diary-ledger-content">
                    <div className="diary-ledger-row diary-header-row">
                        <div className="diary-ledger-column diary-date-column">
                            <h3>Date</h3>
                        </div>
                        <div className="diary-ledger-column diary-diary-column">
                            <h3>Diary</h3>
                        </div>
                        <div className="diary-ledger-column diary-emotion-column">
                            <h3>Emotion Analysis</h3>
                        </div>
                    </div>
                    {diaryEntries.map(entry => (
                        <div className="diary-ledger-row" key={entry.diaryId}>
                            <div className="diary-ledger-column diary-date-column">
                                <p>{formatDate(entry.date)}</p>
                            </div>
                            <div className="diary-ledger-column diary-diary-column">
                                <p>{entry.inputText}</p>
                            </div>
                            <div className="diary-ledger-column diary-emotion-column">
                                <p className="diary-emotion-line">Target Emotion(s): {entry.targetEmotionsList.map(emotion => `${emotion.emotion} (${emotion.emotionPercentage}%)`).join(', ')}</p>
                                <p className="diary-emotion-line">Emotional Intensity: {entry.emotionalIntensity}</p>
                                <p className="diary-emotion-line">Overall Sentiment: {entry.overallSentiment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else if (activeTab === 'MonthlyAnalysis') {
            const maxEmotion = monthlyData.reduce((max, emotion) => emotion.percentage > max.percentage ? emotion : max, { emotion: '', percentage: 0 });
            const monthName = getMonthName(currentMonth);
            return (
                <div className="diary-monthly-analysis-content">
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
                        <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                        <Bar dataKey="percentage" fill="#4F81BD">
                            <LabelList dataKey="percentage" position="right" formatter={(value) => `${value.toFixed(2)}%`} />
                        </Bar>
                    </BarChart>
                    <p className="diary-summary">Your most felt emotion in the month of {monthName} is "{maxEmotion.emotion}" at {maxEmotion.percentage.toFixed(2)}%</p>
                </div>
            );
        } else if (activeTab === 'Last6MonthsAnalysis') {
            const emotionLines = last6MonthsData.length > 0 ? Object.keys(last6MonthsData[0]).filter(key => key !== 'month').map((emotion, index) => (
                <Line key={index} type="monotone" dataKey={emotion} stroke={`hsl(${index * 36}, 70%, 50%)`} strokeWidth={2} />
            )) : [];
            return (
                <div className="last6MonthsAnalysis-analysis-content">
                    <LineChart
                        width={1000}
                        height={600}
                        data={last6MonthsData}
                        margin={{ top: 60, right: 20, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                        {emotionLines}
                    </LineChart>
                    <p className="summary">Last 6 Months Analysis of Your Top 10 Emotions</p>
                </div>
            );
        }
    };

    return (
        <div className="diary-container">
            <div className="diary-main-content">
                <div className="diary-sidebar">
                    <h1>Dashboard</h1>
                    <ul>
                        <li onClick={() => setActiveTab('DiaryLedger')}>
                            <FontAwesomeIcon icon={faBook} className="diary-icon" />
                            Diary Ledger
                        </li>
                    </ul>
                    <h1>Utilities</h1>
                    <ul>
                        <li onClick={() => setActiveTab('MonthlyAnalysis')}>
                            <FontAwesomeIcon icon={faBarChart} className="diary-icon" />
                            Monthly Analysis
                        </li>
                        <li onClick={() => setActiveTab('Last6MonthsAnalysis')}>
                            <FontAwesomeIcon icon={faList} className="diary-icon" />
                            Last 6 Months Analysis
                        </li>
                    </ul>
                </div>
                <div className="diary-diary-content">
                    <div className="diary-ledger-box">
                        <h2>
                            {activeTab === 'DiaryLedger' ? 'Diary Ledger' : 
                            activeTab === 'MonthlyAnalysis' ? 'Monthly Analysis' : 
                            'Last 6 Months Analysis'}
                        </h2>
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

}

export default Diary;
