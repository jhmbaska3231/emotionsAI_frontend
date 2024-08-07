import React, { useState, useEffect } from 'react';
import './TranscribeText.css';
import Footer from './Footer';
import FAQ from './FaqButton';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

const TranscribeText = () => {

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [isInputChanged, setIsInputChanged] = useState(false);

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

    // const handleTranscribe = async () => {
    //     setIsTranscribing(true);
    //     setError('');
    //     try {
    //         const response = await axios.post('/api/transcribe', inputText);
    //         setOutputText(response.data);
    //         setIsInputChanged(false);
    //     } catch (error) {
    //         setError(error.message);
    //     } finally {
    //         setIsTranscribing(false);
    //     }
    // };

    const handleTranscribe = async () => {
        setIsTranscribing(true);
        setError('');
        try {
            const payload = {
                userId,
                inputText
            };
            const response = await axios.post('/api/transcribe', payload);
            setOutputText(response.data);
            setIsInputChanged(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsTranscribing(false);
        }
    };

    const parseTranscriptionOutput = (output) => {
        const emotionRegex = /Detected Emotion\(s\)?:\s*([\w\s%,\(\)]+)/;
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

        // remember to delete
        console.log('Emotional Intensity:', emotionalIntensity);
        console.log('Overall Sentiment:', `${overallSentiment} (${sentimentDetails})`);
        console.log('Explanation:', explanation);
        console.log('Target Emotions:', targetEmotions);

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
        <div className="tt-transcribeTextPage">
            <div className="tt-transcribeTextContent">
                <div className="tt-transcribeTextUsageLimit">Unlimited Transcribes</div>
                <div className="tt-transcribeTextInputOutputContainer">
                    <div className="tt-transcribeTextInputContainer">
                        <label className="tt-label">Input</label>
                        <textarea 
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value);
                                setIsInputChanged(true);
                            }}
                            placeholder="Enter text..."
                            className="tt-textarea"
                        />
                        <div className="tt-button-container">
                            <div className={`tt-transcribeTextWordCount ${wordCount > 400 ? 'tt-wordCountExceeded' : ''}`}>
                                Words {wordCount}/400
                            </div>
                            <button className="tt-clearInputButton" onClick={handleClearInputAndOuput}>Clear all</button>
                        </div>
                    </div>
                    <button 
                        onClick={handleTranscribe}
                        className="tt-transcribeTextButton"
                        disabled={wordCount > 400 || isTranscribing || isSaving || isInputEmptyOrWhitespace}
                    >
                        {isTranscribing ? 'Transcribing...' : 'Transcribe ➔'}
                    </button>
                    {error && <div className="tt-error">{error}</div>}
                    <div className="tt-transcribeTextOutputContainer">
                        <label className="tt-label">Output</label>
                        <textarea 
                            value={outputText}
                            readOnly
                            className="tt-textarea"
                        />
                        <button 
                            onClick={handleSaveToDiary}
                            className="tt-transcribeTextSaveDiaryButton"
                            disabled={isSaving || isTranscribing || isInputChanged}
                        >
                            {isSaving ? 'Saving...' : 'Save to Diary'}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
            <FAQ />
        </div>
    );

};

export default TranscribeText;
