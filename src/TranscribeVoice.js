import React, { useState, useEffect } from 'react';
import './TranscribeVoice.css';
import Footer from './Footer';

import axios, { setBearerToken } from './api/axiosConfig';
import { fetchAuthSession } from 'aws-amplify/auth';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const TranscribeVoice = () => {

    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [isInputChanged, setIsInputChanged] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileInputKey, setFileInputKey] = useState(Date.now());

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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const handleAudioToText = async () => {
        setError('');
        setIsConverting(true);

        try {
            const formData = new FormData();
            formData.append('inputAudio', selectedFile);

            const response = await axios.post('/api/audiototext', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            setInputText(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsConverting(false);
        }
    };    

    const handleTranscribe = async () => {
        setIsTranscribing(true);
        setError('');

        try {
            const response = await axios.post('/api/transcribe', inputText);
            setOutputText(response.data);
            setIsInputChanged(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsTranscribing(false);
        }
    };

    const parseTranscriptionOutput = (output) => {
        const emotionRegex = /Detected Emotion\(s\): (.*)/;
        const intensityRegex = /Overall Emotional Intensity: (\w+)/;
        const sentimentRegex = /Overall Sentiment: (.*)/;
        const explanationRegex = /Explanation: (.*)/;

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

        const emotionalIntensity = intensityMatch ? intensityMatch[1] : '';
        const overallSentiment = sentimentMatch ? sentimentMatch[1] : '';
        const explanation = explanationMatch ? explanationMatch[1] : '';

        return { emotionalIntensity, overallSentiment, explanation, targetEmotions };
    };

    const handleSaveToDiary = async () => {
        setIsSaving(true);
        setError('');

        try {
            const { emotionalIntensity, overallSentiment, explanation, targetEmotions } = parseTranscriptionOutput(outputText);

            if (targetEmotions.length === 0 || targetEmotions.some(emotion => emotion.emotion === 'None' || !emotion.emotion)) {
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
        setSelectedFile(null);
        setFileName('');
        setFileInputKey(Date.now());
    };

    return (
        <div className="tv-transcribeVoicePage">
            <div className="tv-transcribeVoiceContent">
                <div className="tv-transcribeVoiceUsageLimit">Unlimited Transcribes</div>
                <div className="tv-transcribeVoiceInputOutputContainer">
                    <div className="tv-inputWrapper">
                        <div className="tv-transcribeVoiceInputContainer">
                            <label className="tv-label">Input</label>
                            <textarea 
                                className="tv-textarea"
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                    setIsInputChanged(true);
                                }}
                                placeholder="Enter text..."
                            />
                            <div className="tv-button-container">
                                <div className={`tv-transcribeVoiceWordCount ${wordCount > 400 ? 'tv-wordCountExceeded' : ''}`}>
                                    Words {wordCount}/400
                                </div>
                                <button 
                                    onClick={handleAudioToText}
                                    className="tv-convertButton"
                                    disabled={!selectedFile || isTranscribing || isSaving || isConverting}
                                >
                                    {isConverting ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <CircularProgress size={24} />
                                            Converting...
                                        </Box>
                                    ) : 'Convert Audio to Text'}
                                </button>
                                <button className="tv-clearInputButton" onClick={handleClearInputAndOuput}>Clear all</button>
                            </div>
                        </div>
                        <div className="tv-uploadContainer">
                            <span className="tv-uploadText">{fileName || 'MP3/MP4/WAV files - max 25MB'}</span>
                            <input
                                key={fileInputKey}
                                type="file"
                                accept=".mp3,.mp4,.wav"
                                onChange={handleFileChange}
                                id="file-upload"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-upload" className="tv-transcribeVoiceUploadButton">
                                Upload
                            </label>
                        </div>
                    </div>
                    <button 
                        onClick={handleTranscribe}
                        className="tv-transcribeVoiceTranscribeButton"
                        disabled={wordCount > 400 || isTranscribing || isSaving || isInputEmptyOrWhitespace || isConverting}
                    >
                        {isTranscribing ? 'Transcribing...' : 'Transcribe ➔'}
                    </button>
                    {error && <div className="tv-error">{error}</div>}
                    <div className="tv-transcribeVoiceOutputContainer">
                        <label className="tv-label">Output</label>
                        <textarea 
                            className="tv-textarea"
                            value={outputText}
                            readOnly
                        />
                        <button 
                            onClick={handleSaveToDiary}
                            className="tv-transcribeVoiceSaveDiaryButton"
                            disabled={isSaving || isTranscribing || isInputChanged || isConverting}
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

export default TranscribeVoice;
