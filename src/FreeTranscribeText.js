import React, { useState, useEffect } from 'react';
import './FreeTranscribeText.css';
import Footer from './Footer';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

const FreeTranscribeText = () => {

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [isInputChanged, setIsInputChanged] = useState(false);
    const [transcribeCount, setTranscribeCount] = useState(0);
    const [hasReachedLimit, setHasReachedLimit] = useState(false);

    const TRANSCRIBE_LIMIT = 3; // Free user transcribe limit

    const wordCount = inputText.split(' ').filter(Boolean).length;
    const isInputEmptyOrWhitespace = inputText.trim().length === 0;

    useEffect(() => {
        const fetchUserIdAndToken = async () => {
            try {
                const session = await fetchAuthSession();
                const { accessToken, idToken } = session.tokens ?? {};
                if (accessToken && idToken) {
                    setBearerToken(accessToken.toString());
                    
                    const userId = idToken.payload.sub;
                    setUserId(userId);
                }
            } catch (error) {
                console.error('Error fetching auth session:', error);
            }
        };
        fetchUserIdAndToken();
    }, []);

    const handleTranscribe = async () => {
        if (transcribeCount >= TRANSCRIBE_LIMIT) {
            setHasReachedLimit(true);
            return;
        }

        setIsTranscribing(true);
        setError('');
        try {
            const response = await axios.post('/api/transcribe', inputText);
            setOutputText(response.data);
            setIsInputChanged(false);
            setTranscribeCount(prevCount => prevCount + 1);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsTranscribing(false);
        }
    };

    const parseTranscriptionOutput = (output) => {
        const emotionRegex = /Detected Emotion\(s\):\s*([\w\s%,\*\(\)]+(?:,\s*included in [\w\s]+)?)/;
        const intensityRegex = /Overall Emotional Intensity:\s*(\w+)/;
        const sentimentRegex = /Overall Sentiment:\s*([^(]+)\s*\(([^)]+)\)/;
        const explanationRegex = /Explanation:\s*(.*)/;

        const emotionsMatch = output.match(emotionRegex);
        const intensityMatch = output.match(intensityRegex);
        const sentimentMatch = output.match(sentimentRegex);
        const explanationMatch = output.match(explanationRegex);
        
        let targetEmotions = [];
        if (emotionsMatch && emotionsMatch[1]) {
            const emotionsString = emotionsMatch[1].trim();
            if (emotionsString && emotionsString !== 'None') {
                const emotionsArray = emotionsString.split(', ');

                targetEmotions = emotionsArray.map(emotionString => {
                    const [emotion, percentage] = emotionString.split(' (');
                    return {
                        emotion: emotion.trim(),
                        emotionPercentage: percentage ? parseFloat(percentage.replace('%)', '').trim()) : 0
                    };
                });
            }
        }

        const emotionalIntensity = intensityMatch ? intensityMatch[1].trim() : '';
        const overallSentiment = sentimentMatch ? sentimentMatch[1].trim() : '';
        const sentimentDetails = sentimentMatch ? sentimentMatch[2].trim() : '';
        const explanation = explanationMatch ? explanationMatch[1].trim() : '';

        return { emotionalIntensity, overallSentiment: `${overallSentiment} (${sentimentDetails})`, explanation, targetEmotions };
    };

    const handleSaveToDiary = async () => {
        setIsSaving(true);
        setError('');

        try {
            const { emotionalIntensity, overallSentiment, explanation, targetEmotions } = parseTranscriptionOutput(outputText);

            if (targetEmotions.length === 0 || targetEmotions.some(emotion => !emotion.emotion || emotion.emotion === 'None')) {
                alert('The detected emotion is none. Please try another input.');
                setIsSaving(false);
                return;
            }

            const currentDate = new Date().toISOString().split('T')[0];
            const diaryEntry = {
                date: currentDate,
                inputText,
                emotionalIntensity,
                overallSentiment,
                explanation,
                targetEmotionsList: targetEmotions,
                userId: userId
            };

            await axios.post('/api/diaries/with-emotions', diaryEntry);
            alert('Diary entry saved successfully');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClearInputAndOuput = () => {
        setInputText('');
        setOutputText('');
        setIsInputChanged(true);
    };

    return (
        <div className="ft-transcribeTextPage">
            <div className="ft-transcribeTextContent">
                <div className="ft-transcribeTextUsageLimit">Transcribe Limit: {transcribeCount}/{TRANSCRIBE_LIMIT}</div>
                <div className="ft-transcribeTextInputOutputContainer">
                    <div className="ft-transcribeTextInputContainer">
                        <label className="ft-label">Input</label>
                        <textarea 
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                setIsInputChanged(true);
                            }}
                            placeholder="Enter text..."
                            className="ft-textarea"
                        />
                        <div className="ft-button-container">
                            <div className={`ft-transcribeTextWordCount ${wordCount > 400 ? 'ft-wordCountExceeded' : ''}`}>
                                Words {wordCount}/400
                            </div>
                            <button className="ft-clearInputButton" onClick={handleClearInputAndOuput}>Clear all</button>
                        </div>
                    </div>
                    <button 
                        onClick={handleTranscribe}
                        className="ft-transcribeTextButton"
                        disabled={wordCount > 400 || isTranscribing || isSaving || isInputEmptyOrWhitespace || hasReachedLimit}
                    >
                        {isTranscribing ? 'Transcribing...' : hasReachedLimit ? 'Limit Reached' : 'Transcribe ➔'}
                    </button>
                    {error && <div className="ft-error">{error}</div>}
                    <div className="ft-transcribeTextOutputContainer">
                        <label className="ft-label">Output</label>
                        <textarea 
                            value={outputText}
                            readOnly
                            className="ft-textarea"
                        />
                        <button 
                            onClick={handleSaveToDiary}
                            className="ft-transcribeTextSaveDiaryButton"
                            disabled={isSaving || isTranscribing || isInputChanged}
                        >
                            {isSaving ? 'Saving...' : 'Save to Diary'}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

};

export default FreeTranscribeText;
