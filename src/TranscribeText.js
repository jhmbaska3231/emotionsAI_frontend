import React, { useState, useEffect } from 'react';
import './TranscribeText.css';
import Footer from './Footer';

import axios from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

const TranscribeText = () => {

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    const wordCount = inputText.split(' ').filter(Boolean).length;

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const session = await fetchAuthSession();
                const { idToken } = session.tokens ?? {};
                if (idToken) {
                    const userId = idToken.payload.sub;
                    setUserId(userId);
                }
            } catch (error) {
                console.error('Error fetching auth session:', error);
            }
        };

        fetchUserId();
    }, []);

    const handleTranscribe = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/transcribe', inputText);
            setOutputText(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const parseTranscriptionOutput = (output) => {
        const emotionRegex = /Target Emotion\(s\): (.*)/;
        const intensityRegex = /Emotional Intensity: (\w+)/;
        const sentimentRegex = /Overall Sentiment: (\w+)/;

        const emotionsMatch = output.match(emotionRegex);
        const intensityMatch = output.match(intensityRegex);
        const sentimentMatch = output.match(sentimentRegex);

        let targetEmotions = [];
        if (emotionsMatch && emotionsMatch[1]) {
            const emotionsString = emotionsMatch[1];
            const emotionsArray = emotionsString.split(', ');

            targetEmotions = emotionsArray.map(emotionString => {
                const [emotion, percentage] = emotionString.split(' (');
                return {
                    emotion: emotion.trim(),
                    emotionPercentage: parseFloat(percentage.replace('%)', '').trim())
                };
            });
        }

        const emotionalIntensity = intensityMatch ? intensityMatch[1] : '';
        const overallSentiment = sentimentMatch ? sentimentMatch[1] : '';

        return { emotionalIntensity, overallSentiment, targetEmotions };
    };

    const handleSaveToDiary = async () => {
        setIsLoading(true);
        setError('');

        try {
            const { emotionalIntensity, overallSentiment, targetEmotions } = parseTranscriptionOutput(outputText);
            const currentDate = new Date().toISOString().split('T')[0];
            const diaryEntry = {
                date: currentDate,
                inputText,
                emotionalIntensity,
                overallSentiment,
                targetEmotionsList: targetEmotions,
                userId: userId
            };

            await axios.post('/api/diaries/with-emotions', diaryEntry);
            alert('Diary entry saved successfully');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="transcribeTextPage">
            <div className="transcribeTextContent">
                <div className="transcribeTextUsageLimit">Unlimited Transcribes</div>
                <div className="transcribeTextInputOutputContainer">
                    <div className="transcribeTextInputContainer">
                        <label>Input</label>
                        <textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter text..."
                        />
                        <div className="transcribeTextWordCount">Words {wordCount}/400</div>
                    </div>
                    <button 
                        onClick={handleTranscribe}
                        className="transcribeTextButton"
                        disabled={wordCount > 400 || isLoading}
                    >
                        {isLoading ? 'Transcribing...' : 'Transcribe ➔'}
                    </button>
                    {error && <div className="error">{error}</div>}
                    <div className="transcribeTextOutputContainer">
                        <label>Output</label>
                        <textarea 
                            value={outputText}
                            readOnly
                        />
                        <button 
                            onClick={handleSaveToDiary}
                            className="transcribeTextSaveDiaryButton"
                        >
                            Save to Diary
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

};

export default TranscribeText;
