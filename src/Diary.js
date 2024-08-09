import React, { useState, useEffect, useRef } from 'react';
import './Diary.css';
import Footer from './Footer';

import api, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarChart, faBook, faTh, faICursor  } from '@fortawesome/free-solid-svg-icons';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, LineChart, Line } from 'recharts';
import { HeatMapGrid } from 'react-grid-heatmap';

const holidays = {
    January: ["New Year's Day"],
    February: ["Chinese New Year"],
    March: ["Good Friday"],
    April: ["Hari Raya Puasa"],
    May: ["Labour Day", "Vesak Day"],
    June: ["Hari Raya Haji"],
    August: ["National Day"],
    October: ["Deepavali"],
    December: ["Christmas Day"]
};

const Diary = () => {

    const [activeTab, setActiveTab] = useState('DiaryLedger');
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [last6MonthsData, setLast6MonthsData] = useState([]);
    const [emotionCorrelationData, setEmotionCorrelationData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const entryRef = useRef(null);

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

                    const emotionCorrelationData = processEmotionCorrelationData(last6MonthsResponse.data);
                    setEmotionCorrelationData(emotionCorrelationData);
                } else {
                    console.error('ID token not found in session');
                }
            } catch (error) {
                console.error('Error getting user session:', error);
            }
        };

        fetchDiaryData();
    }, []);

    useEffect(() => {
        if (entryRef.current) {
            entryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [searchQuery]);

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
        const emotionMap = new Map();

        entries.forEach(entry => {
            entry.targetEmotionsList.forEach(emotion => {
                if (emotionMap.has(emotion.emotion)) {
                    emotionMap.set(emotion.emotion, emotionMap.get(emotion.emotion) + emotion.emotionPercentage);
                } else {
                    emotionMap.set(emotion.emotion, emotion.emotionPercentage);
                }
            });
        });
    
        const totalPercentage = Array.from(emotionMap.values()).reduce((sum, percentage) => sum + percentage, 0);

        const processedData = Array.from(emotionMap.entries()).map(([emotion, percentage]) => ({
            emotion,
            percentage: (percentage / totalPercentage) * 100
        })).sort((a, b) => b.percentage - a.percentage);

        return processedData;
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

    const processEmotionCorrelationData = (entries) => {
        const emotions = {};
        const allEmotionsSet = new Set();
    
        entries.forEach(entry => {
            entry.targetEmotionsList.forEach(emotion => {
                allEmotionsSet.add(emotion.emotion);
                if (!emotions[emotion.emotion]) {
                    emotions[emotion.emotion] = [];
                }
                emotions[emotion.emotion].push(emotion.emotionPercentage);
            });
        });
    
        const allEmotions = Array.from(allEmotionsSet);
        allEmotions.forEach(emotion => {
            if (!emotions[emotion]) {
                emotions[emotion] = [];
            }
        });
    
        const maxLength = Math.max(...Object.values(emotions).map(arr => arr.length));
    
        allEmotions.forEach(emotion => {
            if (emotions[emotion].length < maxLength) {
                const missingValuesCount = maxLength - emotions[emotion].length;
                emotions[emotion] = emotions[emotion].concat(Array(missingValuesCount).fill(0));
            }
        });
    
        const emotionKeys = Object.keys(emotions);
        const correlationMatrix = emotionKeys.map(rowEmotion => {
            return emotionKeys.map(colEmotion => {
                const rowEmotionData = emotions[rowEmotion];
                const colEmotionData = emotions[colEmotion];
                const correlation = calculateCorrelation(rowEmotionData, colEmotionData);
                return correlation;
            });
        });
    
        return { emotionKeys, correlationMatrix };
    };

    const calculateCorrelation = (x, y) => {
        const n = x.length;
        if (n === 0 || x.length !== y.length) {
            console.error('Invalid data for correlation calculation:', { x, y });
            return NaN;
        }
    
        const meanX = x.reduce((a, b) => a + b, 0) / n;
        const meanY = y.reduce((a, b) => a + b, 0) / n;
        const covariance = x.map((xi, i) => (xi - meanX) * (y[i] - meanY)).reduce((a, b) => a + b, 0) / n;
        const stdDevX = Math.sqrt(x.map(xi => (xi - meanX) ** 2).reduce((a, b) => a + b, 0) / n);
        const stdDevY = Math.sqrt(y.map(yi => (yi - meanY) ** 2).reduce((a, b) => a + b, 0) / n);
    
        if (stdDevX === 0 || stdDevY === 0) {
            console.warn('Standard deviation is zero, returning 0 for correlation:', { x, y });
            return 0;
        }
    
        const correlation = covariance / (stdDevX * stdDevY);
        if (isNaN(correlation)) {
            console.error('Correlation resulted in NaN:', { x, y, covariance, stdDevX, stdDevY });
        }
    
        return correlation;
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const highlightSearchQuery = (text) => {
        if (!searchQuery) return text;
        const escapedQuery = escapeRegExp(searchQuery);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.split(regex).map((part, index) =>
            part.toLowerCase() === searchQuery.toLowerCase() ? <mark key={index}>{part}</mark> : part
        );
    };

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortDiaryEntries = (entries) => {
        return entries.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    };

    const renderContent = () => {
        if (activeTab === 'DiaryLedger') {
            const sortedEntries = sortDiaryEntries(diaryEntries);
            return (
                <div className="diary-ledger-content">
                    <div className="tab-content">
                        <input
                            type="text"
                            placeholder="Search diary entries..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="diary-search-bar"
                        />
                        <button className="sort-button" onClick={toggleSortOrder}>
                            Sort by Date ({sortOrder === 'asc' ? 'Acending' : 'Decending'})
                        </button>
                    </div>
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
                        <div className="diary-ledger-column diary-explanation-column">
                            <h3>Explanation</h3>
                        </div>
                    </div>
                    {/* {diaryEntries */}
                    {sortedEntries
                        .filter(entry => entry.inputText.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(entry => (
                            <div className="diary-ledger-row" key={entry.diaryId}>
                                <div className="diary-ledger-column diary-date-column">
                                    <p>{formatDate(entry.date)}</p>
                                </div>
                                <div className="diary-ledger-column diary-diary-column">
                                    <p>{highlightSearchQuery(entry.inputText)}</p>
                                </div>
                                <div className="diary-ledger-column diary-emotion-column">
                                    <p className="diary-emotion-line">Target Emotion(s): {entry.targetEmotionsList.map(emotion => `${emotion.emotion} (${emotion.emotionPercentage}%)`).join(', ')}</p>
                                    <p className="diary-emotion-line">Emotional Intensity: {entry.emotionalIntensity}</p>
                                    <p className="diary-emotion-line">Overall Sentiment: {entry.overallSentiment}</p>
                                </div>
                                <div className="diary-ledger-column diary-explanation-column">
                                    <p className="diary-explanation-line">{entry.explanation}</p>
                                </div>
                            </div>
                        ))}
                </div>
            );
        } else if (activeTab === 'MonthlyAnalysis') {
            const maxEmotion = monthlyData.reduce((max, emotion) => emotion.percentage > max.percentage ? emotion : max, { emotion: '', percentage: 0 });
            const monthName = getMonthName(currentMonth);
            const baseHeight = 500; // base height in pixels
            const heightIncrement = 30; // additional height per record in pixels
            const dynamicHeight = baseHeight + (monthlyData.length * heightIncrement);
            return (
                <div className="diary-monthly-analysis-content diary-content-section">
                    <BarChart
                        width={70 * window.innerWidth / 100}
                        height={dynamicHeight}
                        data={monthlyData}
                        layout="vertical"
                        margin={{ top: 60, right: 80, left: 80, bottom: 20 }}
                        className="diary-bar-chart"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number" 
                            tick={{ fill: '#ffffff', fontSize: 16 }}
                            tickLine={{ stroke: '#ffffff', strokeWidth: 2 }}
                        />
                        <YAxis
                            type="category"
                            dataKey="emotion"
                            tick={{ fill: '#ffffff', fontSize: 14 }}
                            tickLine={{ stroke: '#ffffff', strokeWidth: 2 }}
                        />
                        <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                        <Bar dataKey="percentage" fill="#4F81BD">
                            <LabelList dataKey="percentage" position="right" formatter={(value) => `${value.toFixed(2)}%`} />
                        </Bar>
                    </BarChart>
                    <p className="diary-summary">Your most felt emotion in the month of {monthName} is "{maxEmotion.emotion}" at {maxEmotion.percentage.toFixed(2)}%</p>
                </div>
            );
        } else if (activeTab === 'BiannualAnalysis') {
            const emotionLines = last6MonthsData.length > 0 ? Object.keys(last6MonthsData[0]).filter(key => key !== 'month').map((emotion, index) => (
                <Line key={index} type="monotone" dataKey={emotion} stroke={`hsl(${index * 36}, 70%, 50%)`} strokeWidth={2} />
            )) : [];
            const renderCustomTick = (props) => {
                const { x, y, payload } = props;
                const month = payload.value;
                const holidayList = holidays[month] || ['No Holiday'];
                return (
                    <g transform={`translate(${x},${y + 10})`}>
                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#ffffff">
                            {month}
                        </text>
                        {holidayList.map((holiday, index) => (
                            <text key={index} x={0} y={20 + index * 20} dy={25} textAnchor="middle" fill="#ffffff" fontSize="12">
                                {holiday}
                            </text>
                        ))}
                    </g>
                );
            };
            return (
                <div className="biannualAnalysis-analysis-content diary-content-section">
                    <LineChart
                        width={70 * window.innerWidth / 100}
                        height={60 * window.innerHeight / 100}
                        data={last6MonthsData}
                        margin={{ top: 60, right: 80, left: 40, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="month" 
                            tick={renderCustomTick} 
                            interval={0}
                        />
                        <YAxis 
                            tick={{ fill: '#ffffff', fontSize: 16 }}
                            tickLine={{ stroke: '#ffffff', strokeWidth: 2 }}
                        />
                        <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                        {emotionLines}
                    </LineChart>
                    <p className="biannual-summary">This tracks your top 10 emotions from the last 6 months</p>
                </div>
            );
        } else if (activeTab === 'EmotionCorrelationAnalysis') {
            const { emotionKeys, correlationMatrix } = emotionCorrelationData;
            return (
                <div className="emotional-correlation-analysis-content diary-content-section">
                    <HeatMapGrid
                        data={correlationMatrix}
                        xLabels={emotionKeys}
                        yLabels={emotionKeys}
                        xLabelsPos="top"
                        yLabelsPos="left"
                        cellRender={(x, y, value) => <span>{value.toFixed(2)}</span>}
                        cellStyle={(_, __, value) => {
                            const ratio = Math.abs(value);
                            const color = `rgba(0, 128, 0, ${ratio})`;
                            
                            return {
                                background: color,
                                fontSize: "12px",
                                color: "#000",
                                border: "1px solid #ccc"
                            };
                        }}
                        xLabelsStyle={(index) => ({
                            transform: 'rotate(-90deg)',
                            transformOrigin: 'center',
                            whiteSpace: 'nowrap',
                            padding: '10px',
                            overflow: 'visible'
                        })}
                        yLabelsStyle={(index) => ({
                            padding: '0 5px',
                        })}
                        cellHeight="50px"
                        cellWidth="50px"
                        square
                    />
                    <p className="heatmap-description">
                        <strong>How to Interpret the Heatmap:</strong> The heatmap shows the correlation between different emotions based on diary entries over the last 6 months.
                        <br />
                        - Values closer to <strong>1</strong> indicate a high positive correlation, meaning that as one emotion increases, the other tends to increase as well.
                        <br />
                        - Values closer to <strong>-1</strong> indicate a high negative correlation, meaning that as one emotion increases, the other tends to decrease.
                        <br />
                        - Values around <strong>0</strong> indicate little to no correlation between the emotions.
                    </p>
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
                            <FontAwesomeIcon icon={faBook} className="diary-icon icon-box" />
                            Diary Ledger
                        </li>
                    </ul>
                    <h1>Utilities</h1>
                    <ul>
                        <li onClick={() => setActiveTab('MonthlyAnalysis')}>
                            <FontAwesomeIcon icon={faBarChart} className="diary-icon icon-box" />
                            Monthly Analysis
                        </li>
                        <li onClick={() => setActiveTab('BiannualAnalysis')}>
                            <FontAwesomeIcon icon={faICursor} className="diary-icon icon-box" />
                            Biannual Analysis
                        </li>
                        <li onClick={() => setActiveTab('EmotionCorrelationAnalysis')}>
                            <FontAwesomeIcon icon={faTh} className="diary-icon icon-box" />
                            Emotion Correlation Analysis
                        </li>
                    </ul>
                </div>
                <div className="diary-diary-content">
                    <div className="diary-ledger-box">
                        <h2>
                            {activeTab === 'DiaryLedger' ? 'Diary Ledger' : 
                            activeTab === 'MonthlyAnalysis' ? 'Monthly Analysis' : 
                            activeTab === 'BiannualAnalysis' ? 'Biannual Analysis' :
                            activeTab === 'EmotionCorrelationAnalysis' ? 'Emotion Correlation Analysis' :
                            null}
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
